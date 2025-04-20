var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c, _d, _e;
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import { PongAI } from './pong-ai.js';
import { getUser } from "../ts/API.js";
let pongAIInstance = null;
const PI = Math.PI;
const maxBounceAngle = PI / 3;
//  paddle
const player1Color = new BABYLON.Color3(0, 1, 0); // Green
const player2Color = new BABYLON.Color3(0.5, 0, 0.5); // Purple
const player1Color4 = new BABYLON.Color4(player1Color.r, player1Color.g, player1Color.b, 1);
const player2Color4 = new BABYLON.Color4(player2Color.r, player2Color.g, player2Color.b, 1);
// Game state
let numHit = 0;
let speedIncrement = 0.02;
let ballSpeedReachedMax = false;
let isPaused = false;
let isPlaying = false;
let countdownComplete = false;
let gameIsFinished = false;
let isZooming = false;
let paddleSpeed = 0.15;
let resizePending = false;
// Field
const fieldThickness = 0.2;
const fieldSize = { width: 12, height: 12 };
const fieldHalf = fieldSize.width / 2;
// Tournament
let isTournament = 0; // 0 = no tournament, 1 = tournament
let isLastTournamentMatch = false;
let currentPlayer1 = "";
let currentPlayer2 = "";
let matchEndCallback = null;
// Score
let score1 = 0, score2 = 0;
let lastScorer = null;
// Ball
const MAX_BALL_SPEED = 0.2;
let ballSpeed = { x: 0, z: 0.1 };
const keysPrint = [
    { key: "A", side: "left", top: "25%", code: "KeyA" }, // Position for A
    { key: "D", side: "left", top: "40%", code: "KeyD" }, // Position for D
    { key: "←", side: "right", top: "25%", code: "ArrowLeft" }, // Position for ←
    { key: "→", side: "right", top: "40%", code: "ArrowRight" } // Position for →
];
const keyMap = new Map();
const codeToDetectedKey = {};
const canvas = document.getElementById('canvas');
if (!canvas)
    throw new Error("Canvas element not found");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// UI
const pongGlobalContainer = document.getElementById("pong-global-container");
let overlay = document.getElementById("overlay");
let countdownContainer = document.getElementById("countdown-container");
let menu = document.getElementById("menu");
let goElement = document.getElementById("countdown-go");
let countdownElement = document.getElementById("countdown");
// Mode selection
const modeSelection = document.getElementById("mode-selection");
const tournamentButton = document.getElementById('tournamentButton');
const tournamentButtonContainer = document.getElementById('tournament-button-container');
const playerCountSelector = document.getElementById('player-count-selector');
const playerInputs = document.getElementById('player-inputs');
const continueButton = document.getElementById('continueTournament');
// Babylon
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
// Camera
const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 8, 10), scene);
camera.setTarget(BABYLON.Vector3.Zero());
camera.minZ = 0.1;
camera.maxZ = 1000;
camera.inputs.clear();
// Babylon (options)
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 5, 5), scene);
light.intensity = 0.8;
const pipeline = new BABYLON.DefaultRenderingPipeline("defaultPipeline", true, scene, [camera]);
pipeline.bloomEnabled = true;
pipeline.bloomThreshold = 0.8;
pipeline.bloomKernel = 32;
// Create field
function createField(scene) {
    const field = BABYLON.MeshBuilder.CreateBox("field", {
        width: fieldSize.width,
        height: fieldThickness,
        depth: fieldSize.height,
        updatable: false,
        sideOrientation: BABYLON.Mesh.FRONTSIDE
    }, scene);
    field.position.y = fieldThickness / 2 + 0.5;
    const fieldMaterial = new BABYLON.StandardMaterial("fieldMaterial", scene);
    fieldMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    fieldMaterial.freeze();
    field.material = fieldMaterial;
    field.freezeWorldMatrix();
    return field;
}
const field = createField(scene);
const fieldHeight = field.position.y + fieldThickness / 2;
// Create ball
function createBall() {
    const ballMaterial = new BABYLON.StandardMaterial("ballMaterial", scene);
    ballMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
    ballMaterial.emissiveColor = new BABYLON.Color3(1, 1, 0);
    ballMaterial.freeze();
    const ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 0.4, segments: 8 }, scene);
    ball.material = ballMaterial;
    ball.position = new BABYLON.Vector3(0, fieldHeight + 0.2, 0);
    return ball;
}
let ball = createBall();
// Create paddles
const createCapsuleOutline = (radius, height, radialSegments, scene, color, thickness = 0.01) => {
    const segmentStep = PI / radialSegments;
    const halfHeight = height / 2;
    const topHalf = [];
    const bottomHalf = [];
    for (let i = 0; i <= radialSegments; i++) {
        const theta = i * segmentStep;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        topHalf[i] = new BABYLON.Vector3(radius * cosTheta, halfHeight + radius * sinTheta, 0);
        bottomHalf[i] = new BABYLON.Vector3(radius * Math.cos(PI - theta), -halfHeight - radius * Math.sin(PI - theta), 0);
    }
    const verticalLines = [
        [new BABYLON.Vector3(radius, halfHeight, 0), new BABYLON.Vector3(radius, -halfHeight, 0)],
        [new BABYLON.Vector3(-radius, halfHeight, 0), new BABYLON.Vector3(-radius, -halfHeight, 0)]
    ];
    const lines = [topHalf, bottomHalf, ...verticalLines];
    const capsuleLines = BABYLON.MeshBuilder.CreateLineSystem("capsule", { lines, updatable: false }, scene);
    capsuleLines.color = color;
    return capsuleLines;
};
const createPaddles = (scene, fieldHeight) => {
    const radius = 0.25;
    const height = 1.5;
    const radialSegments = 12;
    const paddle1 = createCapsuleOutline(radius, height, radialSegments, scene, player1Color);
    const paddle2 = createCapsuleOutline(radius, height, radialSegments, scene, player2Color);
    const paddleRotationZ = PI / 2;
    const paddleRotationX = -PI / 4;
    paddle1.rotation.z = paddleRotationZ;
    paddle1.rotation.x = paddleRotationX;
    paddle2.rotation.z = paddleRotationZ;
    paddle2.rotation.x = paddleRotationX;
    paddle1.position.set(0, fieldHeight + 0.2, 6.5);
    paddle2.position.set(0, fieldHeight + 0.2, -6.5);
    return { paddle1, paddle2 };
};
let { paddle1, paddle2 } = createPaddles(scene, fieldHeight);
// Create field lines
function createHalfCircle(centerX, centerZ, radius, startAngle, endAngle) {
    const points = [];
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
        const angle = startAngle + (endAngle - startAngle) * (i / segments);
        points.push(new BABYLON.Vector3(centerX + radius * Math.cos(angle), fieldHeight + 0.04, centerZ + radius * Math.sin(angle)));
    }
    return points;
}
function createFieldLines(scene) {
    const fieldLinePoints = [
        // Top edges
        new BABYLON.Vector3(-fieldHalf, fieldHeight + 0.01, -fieldHalf),
        new BABYLON.Vector3(fieldHalf, fieldHeight + 0.01, -fieldHalf),
        new BABYLON.Vector3(fieldHalf, fieldHeight + 0.01, fieldHalf),
        new BABYLON.Vector3(-fieldHalf, fieldHeight + 0.01, fieldHalf),
        new BABYLON.Vector3(-fieldHalf, fieldHeight + 0.01, -fieldHalf),
        // Bottom edges
        new BABYLON.Vector3(-fieldHalf, fieldHeight - fieldThickness, -fieldHalf),
        new BABYLON.Vector3(fieldHalf, fieldHeight - fieldThickness, -fieldHalf),
        new BABYLON.Vector3(fieldHalf, fieldHeight - fieldThickness, fieldHalf),
        new BABYLON.Vector3(-fieldHalf, fieldHeight - fieldThickness, fieldHalf),
        new BABYLON.Vector3(-fieldHalf, fieldHeight - fieldThickness, -fieldHalf),
        // Vertical connectors
        new BABYLON.Vector3(-fieldHalf, fieldHeight + 0.01, -fieldHalf),
        new BABYLON.Vector3(-fieldHalf, fieldHeight - fieldThickness, -fieldHalf),
        new BABYLON.Vector3(fieldHalf, fieldHeight + 0.01, -fieldHalf),
        new BABYLON.Vector3(fieldHalf, fieldHeight - fieldThickness, -fieldHalf),
        new BABYLON.Vector3(fieldHalf, fieldHeight + 0.01, fieldHalf),
        new BABYLON.Vector3(fieldHalf, fieldHeight - fieldThickness, fieldHalf),
        new BABYLON.Vector3(-fieldHalf, fieldHeight + 0.01, fieldHalf),
        new BABYLON.Vector3(-fieldHalf, fieldHeight - fieldThickness, fieldHalf),
        // Central line
        new BABYLON.Vector3(-fieldHalf, fieldHeight + 0.01, 0),
        new BABYLON.Vector3(fieldHalf, fieldHeight + 0.01, 0)
    ];
    const leftHalfCirclePoints = createHalfCircle(0, -6, 3, 0, PI);
    const rightHalfCirclePoints = createHalfCircle(0, 6, 3, PI, 2 * PI);
    const fieldLines = BABYLON.MeshBuilder.CreateLines("fieldLines", { points: fieldLinePoints, updatable: false }, scene);
    const leftHalfCircle = BABYLON.MeshBuilder.CreateLines("leftHalfCircle", { points: leftHalfCirclePoints, updatable: false }, scene);
    const rightHalfCircle = BABYLON.MeshBuilder.CreateLines("rightHalfCircle", { points: rightHalfCirclePoints, updatable: false }, scene);
    const neonColor = new BABYLON.Color3(0, 1, 1);
    const lines = [fieldLines, leftHalfCircle, rightHalfCircle];
    lines.forEach(line => {
        line.color = neonColor;
        line.freezeWorldMatrix();
    });
    return { fieldLines, leftHalfCircle, rightHalfCircle };
}
const { fieldLines, leftHalfCircle, rightHalfCircle } = createFieldLines(scene);
// Create circles for scoring effects
function createCircle(radius = 0.3) {
    const circleTemplate = BABYLON.MeshBuilder.CreateDisc("circle", { radius: radius, tessellation: 16, updatable: false }, scene);
    const circleMaterial = new BABYLON.StandardMaterial("circleMaterial", scene);
    circleMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    circleMaterial.freeze();
    circleTemplate.material = circleMaterial;
    circleTemplate.rotation.x = PI / 2;
    circleTemplate.isVisible = false;
    return circleTemplate;
}
function createCircleGrid() {
    const circles = [];
    const gridSize = 10;
    const gridDivision = 10;
    const cellSize = gridSize / gridDivision;
    const circleTemplate = createCircle();
    for (let x = -gridSize / 2 + cellSize / 2; x <= gridSize / 2; x += cellSize) {
        for (let z = -gridSize / 2 + cellSize / 2; z <= gridSize / 2; z += cellSize) {
            const instance = circleTemplate.createInstance("circle_instance");
            instance.position.set(x, fieldHeight + 0.02, z);
            instance.freezeWorldMatrix();
            circles.push(instance);
        }
    }
    return circles;
}
let circles = createCircleGrid();
// Score
const scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.top = '20px';
scoreElement.style.left = '50%';
scoreElement.style.transform = 'translateX(-50%)';
scoreElement.style.fontSize = '48px';
scoreElement.style.fontFamily = '"Orbitron", sans-serif';
scoreElement.style.letterSpacing = '4px';
scoreElement.style.color = '#0ff';
scoreElement.style.textShadow = '0 0 3px #0ff, 0 0 5px #0ff, 0 0 8px #00f, 0 0 12px #00f';
scoreElement.style.display = 'none';
scoreElement.style.transition = 'transform 0.1s ease-out';
scoreElement.style.animation = 'neonGlow 1.5s infinite alternate';
document.body.appendChild(scoreElement);
if (!document.getElementById('neon-style')) {
    const style = document.createElement('style');
    style.id = 'neon-style';
    style.textContent = `@keyframes neonGlow {
		0% { text-shadow: 0 0 2px #0ff,  0 0 4px #0ff,  0 0 6px #00f, 0 0 8px #00f; }
		100% { text-shadow: 0 0 3px #0ff, 0 0 5px #0ff, 0 0 7px #00f, 0 0 10px #00f; }
	}`;
    document.head.appendChild(style);
}
const updateScoreSize = () => {
    const scaleFactor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale-factor"));
    scoreElement.style.fontSize = `${48 * scaleFactor}px`;
    scoreElement.style.top = `${20 * scaleFactor}px`;
    scoreElement.style.letterSpacing = `${4 * scaleFactor}px`;
};
function updateScores() {
    scoreElement.textContent = `${score1} - ${score2}`;
    scoreElement.style.transform = 'translateX(-50%) scale(1.2)';
    setTimeout(() => {
        scoreElement.style.transform = 'translateX(-50%) scale(1)';
    }, 100);
}
// FPS display
const fpsDisplay = document.createElement('div');
fpsDisplay.style.position = 'absolute';
fpsDisplay.style.top = '10px';
fpsDisplay.style.left = '10px';
fpsDisplay.style.color = '#0ff';
fpsDisplay.style.fontFamily = '"Orbitron", sans-serif';
fpsDisplay.style.zIndex = '1000';
document.body.appendChild(fpsDisplay);
// Key display style
const styleKeys = document.createElement("style");
styleKeys.textContent = `
	.key-display {
		width: 50px;
		height: 50px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.2);
		color: white;
		opacity: 0.5;
		font-size: 24px;
		font-family: 'Orbitron', sans-serif;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid rgba(255, 255, 255, 0.4);
		box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
		transition: transform 0.1s ease-out, background 0.1s ease-out;
	}

	.left { left: 20px; }
	.right { right: 20px; }

	.key-pressed {
		transform: scale(1.1);
		background: rgba(255, 255, 255, 0.2);
		border: 2px solid rgba(255, 255, 255, 0.6);
		box-shadow: 0 0 5px rgba(255, 255, 255, 0.6), 0 0 10px rgba(255, 255, 255, 0.6);
	}
`;
document.head.appendChild(styleKeys);
// Pause menu
const pauseMenu = document.createElement("div");
pauseMenu.id = "pause-menu";
pauseMenu.innerHTML = `
	<div class="pause-content">
		<h2>PAUSE</h2>
		<button id="resume-button">Resume</button>
		<button id="home-button">Home</button>
		<div id="home-confirmation">
			<h2>Are you sure ?</h2>
			<div class="button-container">
				<button id="confirm-yes">Yes</button>
				<button id="confirm-no">No</button>
			</div>
		</div>
	</div>`;
document.body.appendChild(pauseMenu);
// Circle effects
function setCirclesColor(color) {
    if (circles[0].sourceMesh && circles[0].sourceMesh.material)
        circles[0].sourceMesh.material.diffuseColor = color;
}
function highlightCircles(playerColor) {
    isPaused = true;
    setCirclesColor(playerColor);
    setTimeout(() => {
        setCirclesColor(new BABYLON.Color3(0, 0, 0));
    }, 1000);
}
// Particle effect for goal
function highlightGoalEffect(position, color, scene) {
    const particleSystem = new BABYLON.ParticleSystem("goalEffect", 300, scene);
    particleSystem.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/flare.png", scene);
    const boxEmitter = new BABYLON.BoxParticleEmitter();
    boxEmitter.direction1 = new BABYLON.Vector3(-1, -1, -1);
    boxEmitter.direction2 = new BABYLON.Vector3(1, 1, 1);
    boxEmitter.minEmitBox = new BABYLON.Vector3(-1, -1, -1);
    boxEmitter.maxEmitBox = new BABYLON.Vector3(1, 1, 1);
    particleSystem.particleEmitterType = boxEmitter;
    particleSystem.minSize = 0.2;
    particleSystem.maxSize = 0.4;
    particleSystem.minLifeTime = 0.5;
    particleSystem.maxLifeTime = 1.0;
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.01;
    particleSystem.emitRate = 0;
    particleSystem.manualEmitCount = 500;
    particleSystem.color1 = new BABYLON.Color4(color.r, color.g, color.b, 1);
    particleSystem.color2 = new BABYLON.Color4(color.r, color.g, color.b, 1);
    particleSystem.colorDead = new BABYLON.Color4(color.r, color.g, color.b, 0.5);
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    particleSystem.emitter = position.clone();
    particleSystem.gravity = new BABYLON.Vector3(0, -0.5, 0);
    particleSystem.targetStopDuration = 1.0;
    particleSystem.disposeOnStop = true;
    particleSystem.start();
}
// Resizing
const updateCanvasSize = () => {
    if (resizePending)
        return;
    resizePending = true;
    requestAnimationFrame(() => {
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        const aspectRatio = containerWidth / containerHeight;
        const BASE_FOV = BABYLON.Tools.ToRadians(150);
        camera.fov = Math.min(BASE_FOV, BASE_FOV / aspectRatio);
        engine.resize();
        const scaleFactor = Math.min(containerWidth / 1280, containerHeight / 720);
        document.documentElement.style.setProperty("--scale-factor", scaleFactor.toString());
        updateScoreSize();
        updateKeySize();
        resizePending = false;
    });
};
const updateKeySize = () => {
    const scaleFactor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale-factor"));
    document.querySelectorAll(".key-display").forEach((key) => {
        const element = key;
        element.style.width = `${50 * scaleFactor}px`;
        element.style.height = `${50 * scaleFactor}px`;
        element.style.fontSize = `${24 * scaleFactor}px`;
        element.style.borderRadius = `${8 * scaleFactor}px`;
    });
};
// Camera effects
function zoomOutEffect(callback) {
    if (isZooming)
        return;
    isZooming = true;
    const targetPositionZ = 12;
    const zoomSpeed = 0.01;
    function zoomOutAnimation(scene) {
        if (camera.position.z < targetPositionZ) {
            camera.position.z += zoomSpeed;
            camera.position.y += zoomSpeed * 0.5;
        }
        else {
            camera.position.z = targetPositionZ;
            scene.onBeforeRenderObservable.removeCallback(zoomOutAnimation);
            isZooming = false;
            if (callback)
                callback();
        }
    }
    scene.onBeforeRenderObservable.add(zoomOutAnimation);
}
// Keyboard controls
function handleKeyDown(event) {
    const code = event.code;
    if (event.repeat)
        return;
    if (keyMap.has(code)) {
        const KeyState = keyMap.get(code);
        KeyState.pressed = true;
        if (KeyState.element)
            KeyState.element.classList.add('key-pressed');
        if (code === 'Space' || code === 'Enter') {
            if (gameIsFinished)
                return;
            hideButtons();
            isPaused = false;
        }
        if (code === "Escape")
            if (isPlaying)
                togglePause();
    }
}
function handleKeyUp(event) {
    const code = event.code;
    if (keyMap.has(code)) {
        const KeyState = keyMap.get(code);
        KeyState.pressed = false;
        if (KeyState.element)
            KeyState.element.classList.remove('key-pressed');
    }
}
const layoutDetectionHandler = (e) => {
    if (e.code === "KeyA") {
        codeToDetectedKey[e.code] = e.key.toUpperCase();
        keysPrint.forEach((keyConf) => {
            if (keyConf.key === "A")
                keyConf.key = codeToDetectedKey["KeyA"];
        });
        const elements = document.querySelectorAll(".key-display");
        elements.forEach((el) => {
            const htmlEl = el;
            if (htmlEl.textContent === "A")
                htmlEl.textContent = codeToDetectedKey["KeyA"];
        });
        window.removeEventListener("keydown", layoutDetectionHandler);
    }
};
function initKeyControls() {
    const gameKeys = ["KeyA", "KeyD", "ArrowLeft", "ArrowRight", "Escape", "Space", "Enter"];
    gameKeys.forEach(code => {
        keyMap.set(code, {
            pressed: false,
            element: null
        });
    });
    keysPrint.forEach(({ key, side, top, code }) => {
        const keyElement = document.createElement("div");
        keyElement.textContent = key;
        keyElement.classList.add("key-display", side);
        keyElement.style.position = 'absolute';
        keyElement.style.top = top;
        keyElement.dataset.key = code;
        document.body.appendChild(keyElement);
        if (keyMap.has(code))
            keyMap.get(code).element = keyElement;
    });
    window.addEventListener("keydown", layoutDetectionHandler);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener("blur", () => {
        if (!isPlaying || gameIsFinished)
            return;
        if (!isPaused)
            togglePause();
    });
}
// Ai highlight keys
function simulatKeyPress(action) {
    var _a, _b, _c, _d;
    if ((_a = keyMap.get("ArrowLeft")) === null || _a === void 0 ? void 0 : _a.element)
        keyMap.get("ArrowLeft").element.classList.remove("key-pressed");
    if ((_b = keyMap.get("ArrowRight")) === null || _b === void 0 ? void 0 : _b.element)
        keyMap.get("ArrowRight").element.classList.remove("key-pressed");
    if (action === 0 && ((_c = keyMap.get("ArrowLeft")) === null || _c === void 0 ? void 0 : _c.element)) {
        keyMap.get("ArrowLeft").pressed = true;
        keyMap.get("ArrowLeft").element.classList.add("key-pressed");
    }
    else if (action === 1 && ((_d = keyMap.get("ArrowRight")) === null || _d === void 0 ? void 0 : _d.element)) {
        keyMap.get("ArrowRight").pressed = true;
        keyMap.get("ArrowRight").element.classList.add("key-pressed");
    }
}
// Paddle movement
function movePaddles() {
    var _a, _b, _c, _d;
    if (pongAIInstance) {
        const action = pongAIInstance.getAction(ball, ballSpeed, paddle2, paddleSpeed, paddle1.position.x);
        simulatKeyPress(action);
    }
    if (((_a = keyMap.get("ArrowLeft")) === null || _a === void 0 ? void 0 : _a.pressed) && paddle2.position.x < 5)
        paddle2.position.x += paddleSpeed;
    if (((_b = keyMap.get("ArrowRight")) === null || _b === void 0 ? void 0 : _b.pressed) && paddle2.position.x > -5)
        paddle2.position.x -= paddleSpeed;
    if (((_c = keyMap.get("KeyA")) === null || _c === void 0 ? void 0 : _c.pressed) && paddle1.position.x < 5)
        paddle1.position.x += paddleSpeed;
    if (((_d = keyMap.get("KeyD")) === null || _d === void 0 ? void 0 : _d.pressed) && paddle1.position.x > -5)
        paddle1.position.x -= paddleSpeed;
}
// Collision wall/paddle --> scoring
function checkCollision() {
    // Paddle1 (green)
    if (ballSpeed.z > 0 && ball.position.z > 6 && ball.position.z < 7) {
        if (Math.abs(ball.position.x - paddle1.position.x) < 1.5) {
            const offset = ball.position.x - paddle1.position.x;
            const bounceAngle = (offset / 1.5) * maxBounceAngle;
            const speed = Math.sqrt(ballSpeed.x ** 2 + ballSpeed.z ** 2);
            ballSpeed.x = speed * Math.sin(bounceAngle);
            ballSpeed.z = -Math.abs(speed * Math.cos(bounceAngle));
            numHit++;
        }
    }
    // Paddle2 (purple)
    if (ballSpeed.z < 0 && ball.position.z < -6 && ball.position.z > -7) {
        if (Math.abs(ball.position.x - paddle2.position.x) < 1.5) {
            const offset = ball.position.x - paddle2.position.x;
            const bounceAngle = (offset / 1.5) * maxBounceAngle;
            const speed = Math.sqrt(ballSpeed.x ** 2 + ballSpeed.z ** 2);
            ballSpeed.x = speed * Math.sin(bounceAngle);
            ballSpeed.z = Math.abs(speed * Math.cos(bounceAngle));
            numHit++;
        }
    }
    // Increase speed every 2 hits
    if (!ballSpeedReachedMax && numHit >= 2) {
        const signX = Math.sign(ballSpeed.x);
        const signZ = Math.sign(ballSpeed.z);
        ballSpeed.x += signX * speedIncrement;
        ballSpeed.z += signZ * speedIncrement;
        const absSpeedX = Math.abs(ballSpeed.x);
        const absSpeedZ = Math.abs(ballSpeed.z);
        if (absSpeedZ > MAX_BALL_SPEED)
            ballSpeed.z = MAX_BALL_SPEED * signZ;
        if (absSpeedX > MAX_BALL_SPEED) {
            ballSpeed.x = MAX_BALL_SPEED * signX;
            ballSpeedReachedMax = true;
        }
        numHit = 0;
    }
    // Walls collision
    if (ball.position.x < -6 || ball.position.x > 6)
        ballSpeed.x = -ballSpeed.x;
    // Score
    let score = false;
    if (ball.position.z > 6.5) {
        score2++;
        lastScorer = 2;
        highlightCircles(player2Color);
        highlightGoalEffect(new BABYLON.Vector3(ball.position.x, ball.position.y, ball.position.z), player2Color4, scene);
        score = true;
    }
    if (ball.position.z < -6.5) {
        score1++;
        lastScorer = 1;
        highlightCircles(player1Color);
        highlightGoalEffect(new BABYLON.Vector3(ball.position.x, ball.position.y, ball.position.z), player1Color4, scene);
        score = true;
    }
    if (score) {
        updateScores();
        reset();
        if (score1 > 9 || score2 > 9) {
            zoomOutEffect();
            endGame();
        }
    }
}
// Game state management
let enterButton = null;
let spaceButton = null;
let spaceAndEnterIsPrint = false;
function createButton(text, className) {
    const button = document.createElement('div');
    button.classList.add('key-display', className);
    button.textContent = text;
    document.body.appendChild(button);
    if (className === 'key-enter') {
        enterButton = button;
    }
    else if (className === 'key-space') {
        spaceButton = button;
    }
    button.style.position = 'absolute';
    button.style.top = '20%';
    if (className === 'key-enter') {
        button.style.left = '40%';
    }
    else if (className === 'key-space') {
        button.style.right = '40%';
    }
}
function hideButtons() {
    spaceAndEnterIsPrint = false;
    if (enterButton) {
        enterButton.remove();
        enterButton = null;
    }
    if (spaceButton) {
        spaceButton.remove();
        spaceButton = null;
    }
}
// Game Control
function reset() {
    paddle1.position.set(0, fieldHeight + 0.2, 6.5);
    paddle2.position.set(0, fieldHeight + 0.2, -6.5);
    ball.position.set(0, fieldHeight + 0.2, 0);
    isZooming = false;
    camera.position.set(0, 8, 10);
    paddleSpeed = 0.2;
    numHit = 0;
    ballSpeedReachedMax = false;
    if (lastScorer === 1)
        ballSpeed = { x: 0, z: -0.1 };
    else if (lastScorer === 2)
        ballSpeed = { x: 0, z: 0.1 };
    if (score1 === 0 && score2 === 0)
        return;
    if (score1 !== 10 && score2 !== 10) {
        createButton('Enter', 'key-enter');
        createButton('Space', 'key-space');
        spaceAndEnterIsPrint = true;
    }
}
function restartGame(callback) {
    gameIsFinished = false;
    score1 = 0;
    score2 = 0;
    lastScorer = null;
    isPaused = true;
    const winnerText = document.querySelector("#winner");
    if (winnerText)
        winnerText.style.display = "none";
    const restartButton = document.querySelector("button-endgame");
    if (restartButton)
        restartButton.remove();
    reset();
    updateScores();
    startCountdown(() => {
        if (callback)
            callback();
    });
}
function endGame() {
    gameIsFinished = true;
    isPlaying = false;
    document.removeEventListener("keydown", handleKeyDown);
    const winnerText = document.getElementById("winner");
    const isFinal = isTournament === 1 && isLastTournamentMatch;
    if (winnerText && !isFinal) {
        winnerText.style.display = "block";
        const winnerColor = score1 > 9 ? player1Color.toHexString() : player2Color.toHexString();
        winnerText.style.color = "white";
        winnerText.style.textShadow = `0 0 5px ${winnerColor}, 0 0 10px ${winnerColor}, 0 0 20px ${winnerColor}`;
    }
    countdownContainer.style.display = "block";
    overlay.style.display = "block";
    setTimeout(() => {
        if (isFinal) {
            const winnerTournamentText = document.getElementById("winnerTournamentText");
            winnerTournamentText.style.display = "block";
            const winnerName = score1 > 9 ? currentPlayer1 : currentPlayer2;
            const winnerColor = score1 > 9 ? player1Color.toHexString() : player2Color.toHexString();
            winnerTournamentText.style.textShadow = `0 0 5px ${winnerColor}, 0 0 10px ${winnerColor}, 0 0 20px ${winnerColor}`;
            const message = `WINNER IS ${winnerName}`;
            const words = message.split(" ");
            winnerTournamentText.textContent = "";
            words.forEach((word, index) => {
                setTimeout(() => {
                    const h1 = document.createElement("h1");
                    h1.textContent = word;
                    h1.classList.add("custom-winner-h1");
                    winnerTournamentText.appendChild(h1);
                    winnerTournamentText.appendChild(document.createElement("br"));
                    if (index === words.length - 1) {
                        confetti({
                            particleCount: 200,
                            spread: 70,
                            origin: { x: 0.5, y: 0.5 },
                            colors: ['#ff0', '#0f0', '#00f', '#f00', '#ff00ff'],
                        });
                    }
                }, 500 * index);
            });
            const totalDelay = 1000 * (words.length + 1);
            setTimeout(() => {
                const restartButton = document.createElement("button-endgame");
                restartButton.textContent = "Home";
                restartButton.onmouseover = () => {
                    restartButton.style.backgroundColor = "rgb(0, 255, 255)";
                    restartButton.style.color = "white";
                };
                restartButton.onmouseout = () => {
                    restartButton.style.backgroundColor = "transparent";
                    restartButton.style.color = "#00ffff";
                };
                restartButton.onclick = () => location.reload();
                document.body.appendChild(restartButton);
            }, totalDelay);
        }
        if (!(isTournament === 1 && isFinal)) {
            const restartButton = document.createElement("button-endgame");
            if (isTournament === 1 && !isFinal) {
                restartButton.textContent = "Next Match";
                restartButton.onclick = () => {
                    const winnerName = score1 > 9 ? currentPlayer1 : currentPlayer2;
                    if (matchEndCallback) {
                        matchEndCallback(winnerName);
                        matchEndCallback = null;
                    }
                    restartGame(() => {
                        startGame();
                    });
                };
            }
            else {
                restartButton.textContent = "Restart";
                restartButton.onclick = () => restartGame(() => startGame());
            }
            document.body.appendChild(restartButton);
        }
    }, 2500);
}
function togglePause() {
    isPaused = true;
    if (isPaused) {
        pauseMenu.style.display = "block";
        countdownContainer.style.display = "block";
        overlay.style.display = "block";
    }
    else {
        pauseMenu.style.display = "none";
        countdownContainer.style.display = "none";
        overlay.style.display = "none";
    }
}
function startGame() {
    countdownContainer.style.display = "none";
    isPaused = false;
    isPlaying = true;
    scoreElement.style.display = "block";
    overlay.style.display = "none";
}
function startCountdown(callback) {
    menu.style.display = "none";
    countdownContainer.style.display = "block";
    countdownElement.style.opacity = "1";
    goElement.style.opacity = "0";
    let count = 3;
    countdownElement.textContent = count.toString();
    function updateCountdown() {
        if (count > 0) {
            countdownElement.textContent = count.toString();
            count--;
            setTimeout(updateCountdown, 1000);
        }
        else {
            countdownElement.style.opacity = "0";
            goElement.style.display = "block";
            goElement.style.opacity = "1";
            goElement.style.animation = "goFlash 2s ease-out forwards";
            setTimeout(() => {
                goElement.style.display = "none";
                countdownComplete = true;
                if (callback)
                    callback();
            }, 2000);
        }
    }
    updateCountdown();
}
// Tournament
function color3ToCSS(color) {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return `rgb(${r}, ${g}, ${b})`;
}
function onMatchEnd(callback) {
    matchEndCallback = callback;
}
function showMatchInfo(player1, player2) {
    const matchInfo = document.getElementById("match-info");
    if (!matchInfo)
        return;
    const cssColor1 = color3ToCSS(player1Color);
    const cssColor2 = color3ToCSS(player2Color);
    matchInfo.innerHTML = `
		<span style="color: ${cssColor1}; text-shadow: 0 0 5px ${cssColor1}; font-weight: bold;">${player1}</span>
		<span style="color: white; text-shadow: 0 0 5px white; font-size: 24px;"> vs </span>
		<span style="color: ${cssColor2}; margin-left: 5px; text-shadow: 0 0 5px ${cssColor2}; font-weight: bold;">${player2}</span>
	`;
    matchInfo.style.display = "block";
}
function showTournament(players) {
    const shuffled = players.sort(() => Math.random() - 0.5);
    const rounds = [];
    for (let i = 0; i < shuffled.length; i += 2) {
        rounds.push([shuffled[i], shuffled[i + 1]]);
    }
    playerInputs.style.display = 'none';
    continueButton.style.display = 'none';
    playerCountSelector.style.display = 'none';
    const matchList = document.getElementById('match-list');
    if (matchList) {
        matchList.innerHTML = '<h2>Upcoming Game :</h2>';
        const list = document.createElement('ul');
        list.style.listStyle = 'none';
        list.style.padding = '0';
        rounds.forEach(([p1, p2], index) => {
            const item = document.createElement('li');
            item.textContent = `Match ${index + 1} : ${p1} vs ${p2}`;
            item.style.marginBottom = '8px';
            list.appendChild(item);
        });
        matchList.appendChild(list);
        const startButton = document.createElement('button');
        startButton.id = 'start-tournament-button';
        startButton.textContent = 'Start Tournament';
        startButton.style.marginTop = '20px';
        startButton.style.padding = '10px 20px';
        startButton.style.fontSize = '16px';
        startButton.addEventListener('click', () => {
            matchList.style.display = 'none';
            startTournamentGame(rounds);
        });
        matchList.appendChild(startButton);
        matchList.style.display = 'block';
    }
}
function startTournamentGame(rounds) {
    let currentMatchIndex = 0;
    const winners = [];
    isLastTournamentMatch = rounds.length === 1;
    function playNextMatch() {
        if (currentMatchIndex >= rounds.length) {
            startTournamentGame(pairWinners(winners));
            return;
        }
        const [player1, player2] = rounds[currentMatchIndex];
        currentPlayer1 = player1;
        currentPlayer2 = player2;
        showMatchInfo(player1, player2);
        startCountdown(() => {
            isTournament = 1;
            startGame();
            onMatchEnd((winner) => {
                winners.push(winner);
                currentMatchIndex++;
                playNextMatch();
            });
        });
    }
    playNextMatch();
}
function pairWinners(players) {
    const shuffled = players.sort(() => Math.random() - 0.5);
    const rounds = [];
    for (let i = 0; i < shuffled.length; i += 2) {
        rounds.push([shuffled[i], shuffled[i + 1]]);
    }
    return rounds;
}
document.addEventListener('DOMContentLoaded', function () {
    if (tournamentButton && menu && tournamentButtonContainer && playerCountSelector && playerInputs && continueButton) {
        tournamentButton.addEventListener('click', function () {
            menu.style.display = 'none';
            tournamentButtonContainer.style.display = 'flex';
        });
        playerCountSelector.addEventListener('click', function (e) {
            const target = e.target;
            const count = parseInt(target.dataset.count || "");
            continueButton.style.display = 'none';
            if (count === 4 || count === 8) {
                playerInputs.innerHTML = "";
                const columns = count === 4 ? 1 : 2;
                const inputsPerColumn = 4;
                for (let c = 0; c < columns; c++) {
                    const columnDiv = document.createElement("div");
                    columnDiv.classList.add("input-column");
                    for (let i = 0; i < inputsPerColumn; i++) {
                        const index = c * inputsPerColumn + i + 1;
                        const input = document.createElement("input");
                        input.type = "text";
                        input.placeholder = `Challenger ${index}`;
                        columnDiv.appendChild(input);
                    }
                    playerInputs.appendChild(columnDiv);
                }
                const allInputs = playerInputs.querySelectorAll('input');
                allInputs.forEach(input => {
                    input.addEventListener('input', () => {
                        const allFilled = Array.from(allInputs).every(input => input.value.trim() !== ''); // Transform into array, check if all inputs are filled
                        continueButton.style.display = allFilled ? 'block' : 'none';
                    });
                });
            }
        });
        continueButton.addEventListener('click', () => {
            const allInputs = playerInputs.querySelectorAll('input');
            const playerNames = Array.from(allInputs).map(input => input.value.trim());
            if (playerNames.length === 4 || playerNames.length === 8) {
                showTournament(playerNames);
            }
        });
    }
});
// Pause menu / event handlers
document.getElementById("home-button").addEventListener("click", () => {
    document.getElementById("home-confirmation").style.display = "flex"; // Display confirmation
});
document.getElementById("confirm-yes").addEventListener("click", () => {
    location.reload();
});
document.getElementById("confirm-no").addEventListener("click", () => {
    document.getElementById("home-confirmation").style.display = "none"; // Just hide the confirmation
});
document.getElementById("resume-button").addEventListener("click", () => {
    pauseMenu.style.display = "none";
    countdownContainer.style.display = "none";
    overlay.style.display = "none";
    if (spaceAndEnterIsPrint)
        return;
    isPaused = false;
});
(_a = document.getElementById("playButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    menu.style.display = "none";
    document.getElementById("mode-selection-container").style.display = "flex";
});
export function showError(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const errorBox = document.createElement('div');
        errorBox.className = 'error-box';
        errorBox.textContent = message;
        errorBox.style.position = 'absolute';
        errorBox.style.bottom = '20px';
        errorBox.style.left = '50%';
        errorBox.style.transform = 'translateX(-50%)';
        errorBox.style.padding = '10px';
        errorBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        errorBox.style.color = '#0ff';
        errorBox.style.fontFamily = '"Orbitron", sans-serif';
        errorBox.style.fontSize = '14px';
        errorBox.style.textAlign = 'center';
        errorBox.style.border = '1px solid #0ff';
        errorBox.style.borderRadius = '4px';
        errorBox.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
        errorBox.style.opacity = '0';
        errorBox.style.transition = 'opacity 0.5s ease-in-out';
        // Remove any existing error box
        const existingErrorBox = document.querySelector('.error-box');
        if (existingErrorBox) {
            existingErrorBox.remove();
        }
        // Append the error box to the body
        document.body.appendChild(errorBox);
        // Fade in the error box
        setTimeout(() => {
            errorBox.style.opacity = '1';
        }, 0);
        // Fade out and remove the error box after 5 seconds
        setTimeout(() => {
            errorBox.style.opacity = '0';
            setTimeout(() => {
                errorBox.remove();
            }, 500);
        }, 5000);
    });
}
const rankedSelectionContainer = document.createElement("div");
rankedSelectionContainer.id = "ranked-selection-container";
rankedSelectionContainer.style.display = "none";
rankedSelectionContainer.style.position = "absolute";
rankedSelectionContainer.style.top = "50%";
rankedSelectionContainer.style.left = "50%";
rankedSelectionContainer.style.transform = "translate(-50%, -50%)";
rankedSelectionContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
rankedSelectionContainer.style.padding = "20px";
rankedSelectionContainer.style.borderRadius = "8px";
rankedSelectionContainer.style.boxShadow = "0 0 10px rgba(0, 255, 255, 0.5)";
rankedSelectionContainer.style.color = "#0ff";
rankedSelectionContainer.style.fontFamily = '"Orbitron", sans-serif';
const rankedform = document.createElement("form");
rankedform.style.display = "flex";
rankedform.style.flexDirection = "column";
rankedform.style.gap = "10px";
const loginLabel = document.createElement("label");
loginLabel.textContent = "Login:";
loginLabel.style.fontSize = "16px";
const loginInput = document.createElement("input");
loginInput.type = "text";
loginInput.placeholder = "Enter your login";
loginInput.style.padding = "10px";
loginInput.style.borderRadius = "4px";
loginInput.style.border = "1px solid #0ff";
loginInput.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
loginInput.style.color = "#0ff";
const passwordLabel = document.createElement("label");
passwordLabel.textContent = "Password:";
passwordLabel.style.fontSize = "16px";
const passwordInput = document.createElement("input");
passwordInput.type = "password";
passwordInput.placeholder = "Enter your password";
passwordInput.style.padding = "10px";
passwordInput.style.borderRadius = "4px";
passwordInput.style.border = "1px solid #0ff";
passwordInput.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
passwordInput.style.color = "#0ff";
const signInButton = document.createElement("button");
signInButton.type = "submit";
signInButton.textContent = "Sign In";
signInButton.style.padding = "10px";
signInButton.style.borderRadius = "4px";
signInButton.style.border = "none";
signInButton.style.backgroundColor = "#0ff";
signInButton.style.color = "#000";
signInButton.style.fontWeight = "bold";
signInButton.style.cursor = "pointer";
const backButton = document.createElement("button");
backButton.textContent = "Menu";
backButton.style.padding = "10px";
backButton.style.borderRadius = "4px";
backButton.style.border = "none";
backButton.style.backgroundColor = "#0ff";
backButton.style.color = "#000";
backButton.style.fontWeight = "bold";
backButton.style.cursor = "pointer";
backButton.style.marginTop = "10px";
rankedform.appendChild(backButton);
backButton.addEventListener("click", () => {
    rankedSelectionContainer.style.display = "none";
    menu.style.display = "block";
    const existingErrorBox = document.querySelector('.error-box');
    if (existingErrorBox) {
        existingErrorBox.remove();
    }
});
rankedform.appendChild(loginLabel);
rankedform.appendChild(loginInput);
rankedform.appendChild(passwordLabel);
rankedform.appendChild(passwordInput);
rankedform.appendChild(signInButton);
rankedSelectionContainer.appendChild(rankedform);
document.body.appendChild(rankedSelectionContainer);
//the inception bug is in there
(_b = document.getElementById("rankedSelectionContainer")) === null || _b === void 0 ? void 0 : _b.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (event.submitter !== signInButton) {
        return;
    }
    event.preventDefault();
    if (loginInput && passwordInput) {
        const username = loginInput.value;
        const password = passwordInput.value;
        if (username && password) {
            try {
                const existingErrorBox = document.querySelector('.error-box');
                if (existingErrorBox) {
                    existingErrorBox.remove();
                }
                const user = yield getUser(username, password);
                if (user.id === Number(sessionStorage.getItem("wxp_user_id"))) {
                    showError("User already logged in.");
                    loginInput.value = "";
                    passwordInput.value = "";
                    return;
                }
                sessionStorage.setItem("wxp_token", user.token);
                sessionStorage.setItem("wxp_user_id", user.id != null ? user.id.toString() : "");
                loginInput.value = "";
                passwordInput.value = "";
                startCountdown(startGame);
                rankedSelectionContainer.style.display = "none";
                menu.style.display = "none";
            }
            catch (error) {
                const existingErrorBox = document.querySelector('.error-box');
                if (existingErrorBox) {
                    existingErrorBox.remove();
                }
                showError("Username or password is incorrect.");
                loginInput.value = "";
                passwordInput.value = "";
            }
        }
        else {
            const existingErrorBox = document.querySelector('.error-box');
            if (existingErrorBox) {
                existingErrorBox.remove();
            }
            showError("User already logged in.");
            loginInput.value = "";
            passwordInput.value = "";
        }
    }
}));
(_c = document.getElementById("rankedButton")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
    menu.style.display = "none";
    document.getElementById("ranked-selection-container").style.display = "flex";
});
(_d = document.getElementById("aiMode")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
    modeSelection.style.display = "none";
    pongAIInstance = new PongAI();
    isPaused = true;
    startCountdown(() => {
        startGame();
    });
});
(_e = document.getElementById("humanMode")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => {
    modeSelection.style.display = "none";
    isPaused = true;
    startCountdown(startGame);
});
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    engine.resize();
});
let frameCount = 0;
let lastTime = performance.now();
let fps = 0;
function measureFPS() {
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = now;
        fpsDisplay.textContent = `FPS: ${fps}`;
    }
    requestAnimationFrame(measureFPS);
}
measureFPS();
initKeyControls();
updateCanvasSize();
const resizeObserver = new ResizeObserver(updateCanvasSize);
resizeObserver.observe(pongGlobalContainer);
updateScores();
// Render loop
engine.runRenderLoop(() => {
    if (!isPaused && countdownComplete) {
        movePaddles();
        ball.position.x += ballSpeed.x;
        ball.position.z += ballSpeed.z;
        checkCollision();
    }
    scene.render();
});
