import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import '@babylonjs/loaders';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock } from '@babylonjs/gui';
import { PongAI } from './pong-ai.js';
import { throttle } from '../ts/utils.js'
import { match } from 'assert';

declare var confetti: any;
let pongAIInstance: PongAI | null = null;
const PI: number = Math.PI;
const maxBounceAngle: number = PI/3;

//  paddle
const player1Color: BABYLON.Color3 = new BABYLON.Color3(0, 1, 0); // Green
const player2Color: BABYLON.Color3 = new BABYLON.Color3(0.5, 0, 0.5); // Purple
const player1Color4: BABYLON.Color4 = new BABYLON.Color4(player1Color.r, player1Color.g, player1Color.b, 1);
const player2Color4: BABYLON.Color4 = new BABYLON.Color4(player2Color.r, player2Color.g, player2Color.b, 1);

// Game state
let numHit: number = 0;
let speedIncrement: number = 0.02;
let ballSpeedReachedMax: boolean = false;
let isPaused: boolean = false;
let isPlaying = false;
let countdownComplete = false;
let gameIsFinished = false;
let isZooming = false;
let paddleSpeed: number = 0.15;
let resizePending = false;

// Field
const fieldThickness: number = 0.5;
const fieldSize: { width: number, height: number } = { width: 12, height: 12 };
const fieldHalf = fieldSize.width / 2

// Tournament
let isTournament: number = 0; // 0 = no tournament, 1 = tournament
let isLastTournamentMatch = false;
let currentPlayer1 = "";
let currentPlayer2 = "";
let matchEndCallback: ((winner: string) => void) | null = null;

// Score
let score1: number = 0, score2: number = 0;
let lastScorer: 1 | 2 | null = null;

// Ball
const MAX_BALL_SPEED: number = 0.2;
let ballSpeed: {x: number, z: number} = { x: 0, z: 0.1 };

// Keys
interface KeyConfig {
	key: string;
	side: string;
	top: string;
	code: string;
}
const keysPrint: KeyConfig[] = [
	{ key: "A", side: "left", top: "25%", code: "KeyA" },  // Position for A
	{ key: "D", side: "left", top: "40%", code: "KeyD" },  // Position for D
	{ key: "←", side: "right", top: "25%", code: "ArrowLeft" }, // Position for ←
	{ key: "→", side: "right", top: "40%", code: "ArrowRight" }  // Position for →
];

interface KeyState {
	pressed: boolean;
	element: HTMLElement | null;
}
const keyMap = new Map<string, KeyState>();
const codeToDetectedKey: Record<string, string> = {};

const canvas = document.getElementById('canvas') as unknown as HTMLCanvasElement;
if (!canvas)
	throw new Error("Canvas element not found");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// UI
const pongGlobalContainer = document.getElementById("pong-global-container") as HTMLDivElement;
let overlay = document.getElementById("overlay") as HTMLDivElement;
let countdownContainer = document.getElementById("countdown-container") as HTMLDivElement;
let menu = document.getElementById("menu") as HTMLDivElement;
let goElement = document.getElementById("countdown-go") as HTMLSpanElement;
let countdownElement = document.getElementById("countdown") as HTMLSpanElement;

// Mode selection
const modeSelection = document.getElementById("mode-selection") as HTMLElement | null;
const tournamentButton = document.getElementById('tournamentButton') as HTMLElement | null;
const tournamentButtonContainer = document.getElementById('tournament-button-container') as HTMLElement | null;
const playerCountSelector = document.getElementById('player-count-selector') as HTMLElement | null;
const playerInputs = document.getElementById('player-inputs') as HTMLElement | null;
const continueButton = document.getElementById('continueTournament') as HTMLElement | null;
const backToMenuFromPlay = document.getElementById('back-to-menu-from-play') as HTMLElement | null;
const backToMenuFromTournament = document.getElementById('back-to-menu-from-tournament') as HTMLElement | null;
const backToPlayerSelectionFromStartTournament = document.getElementById('back-to-player-selection-from-start-tournament') as HTMLElement | null;

// Babylon
const engine: BABYLON.Engine = new BABYLON.Engine(canvas, true);
const scene: BABYLON.Scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

// Camera
const camera: BABYLON.UniversalCamera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 8, 10), scene);
camera.setTarget(BABYLON.Vector3.Zero());
camera.minZ = 0.1;
camera.maxZ = 1000;
camera.inputs.clear();

// Babylon (options)
const light: BABYLON.HemisphericLight = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 5, 5), scene);
light.intensity = 0.8;
const pipeline: BABYLON.DefaultRenderingPipeline = new BABYLON.DefaultRenderingPipeline("defaultPipeline", true, scene, [camera]);
pipeline.bloomEnabled = true;
pipeline.bloomThreshold = 0.4;
pipeline.bloomKernel = 16;

// Create field
function createField(scene: BABYLON.Scene): BABYLON.Mesh {
	const field: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox("field", {
		width: fieldSize.width,
		height: fieldThickness,
		depth: fieldSize.height,
		updatable: false,
		sideOrientation: BABYLON.Mesh.FRONTSIDE
	}, scene);

	field.position.y = fieldThickness / 2 + 0.5;

	const fieldMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("fieldMaterial", scene);
	fieldMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	fieldMaterial.freeze();

	field.material = fieldMaterial;
	field.freezeWorldMatrix();

	return field;
}

const field: BABYLON.Mesh = createField(scene);
const fieldHeight: number = field.position.y + fieldThickness / 2;

// Create ball
function createBall(): BABYLON.Mesh {
	const ballMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("ballMaterial", scene);
	ballMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
	ballMaterial.emissiveColor = new BABYLON.Color3(1, 1, 0);
	ballMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	ballMaterial.freeze();

	const ball: BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("ball", {diameter: 0.4, segments: 8}, scene);
	ball.material = ballMaterial;
	ball.position = new BABYLON.Vector3(0, fieldHeight + 0.2, 0);

	return ball;
}

let ball = createBall();

// Create paddles
const createCapsuleOutline = (radius: number, height: number, radialSegments: number, scene: BABYLON.Scene, color: BABYLON.Color3, thickness: number = 0.01): BABYLON.LinesMesh => {
	const segmentStep = PI / radialSegments;
	const halfHeight = height / 2;

	const topHalf: BABYLON.Vector3[] = [];
	const bottomHalf: BABYLON.Vector3[] = [];

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
	const capsuleLines = BABYLON.MeshBuilder.CreateLineSystem("capsule", {lines, updatable: false}, scene);

	capsuleLines.color = color;
	return capsuleLines;
};

const createPaddles = (scene: BABYLON.Scene, fieldHeight: number) => {
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
function createHalfCircle(centerX: number, centerZ: number, radius: number, startAngle: number, endAngle: number): BABYLON.Vector3[] {
	const points: BABYLON.Vector3[] = [];
	const segments = 16;

	for (let i = 0; i <= segments; i++) {
		const angle = startAngle + (endAngle - startAngle) * (i / segments);
		points.push(new BABYLON.Vector3(
			centerX + radius * Math.cos(angle),
			fieldHeight + 0.04,
			centerZ + radius * Math.sin(angle)
		));
	}
	return points;
}

function createFieldLines(scene: BABYLON.Scene): {
	fieldLines: BABYLON.LinesMesh,
	leftHalfCircle: BABYLON.LinesMesh,
	rightHalfCircle: BABYLON.LinesMesh
} {
	const fieldLinePoints: BABYLON.Vector3[] = [
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

	const fieldLines = BABYLON.MeshBuilder.CreateLines("fieldLines", {points: fieldLinePoints, updatable: false}, scene) as BABYLON.LinesMesh;
	const leftHalfCircle = BABYLON.MeshBuilder.CreateLines("leftHalfCircle", {points: leftHalfCirclePoints, updatable: false}, scene) as BABYLON.LinesMesh;
	const rightHalfCircle = BABYLON.MeshBuilder.CreateLines("rightHalfCircle", {points: rightHalfCirclePoints, updatable: false}, scene) as BABYLON.LinesMesh;

	fieldLines.freezeWorldMatrix();
	leftHalfCircle.freezeWorldMatrix();
	rightHalfCircle.freezeWorldMatrix();

	const neonColor = new BABYLON.Color3(0, 1, 1);
	const lines = [fieldLines, leftHalfCircle, rightHalfCircle];
	lines.forEach(line => {
		line.color = neonColor;
		line.freezeWorldMatrix();
	});

	return {fieldLines, leftHalfCircle, rightHalfCircle}
}

const {fieldLines, leftHalfCircle, rightHalfCircle} = createFieldLines(scene);

// Create circles for scoring effects
function createCircle(radius: number = 0.3): BABYLON.Mesh {
	const circleTemplate: BABYLON.Mesh = BABYLON.MeshBuilder.CreateDisc("circle", {radius: radius, tessellation: 16, updatable: false}, scene);
	const circleMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("circleMaterial", scene);

	circleMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	circleMaterial.freeze();
	circleTemplate.material = circleMaterial;
	circleTemplate.rotation.x = PI / 2;
	circleTemplate.isVisible = false;

	return circleTemplate;
}

function createCircleGrid(): BABYLON.InstancedMesh[] {
	const circles: BABYLON.InstancedMesh[] = [];
	const gridSize: number = 10;
	const gridDivision: number = 10;
	const cellSize: number = gridSize / gridDivision;
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

let circles: BABYLON.InstancedMesh[] = createCircleGrid();

// Score
const scoreElement: HTMLDivElement = document.createElement('div');
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
	const style: HTMLStyleElement = document.createElement('style');
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

function updateScores(): void {
	scoreElement.textContent = `${score1} - ${score2}`;
	scoreElement.style.transform = 'translateX(-50%) scale(1.2)';
	setTimeout(() => {
		scoreElement.style.transform = 'translateX(-50%) scale(1)';
	}, 100);
}


// Key display style
const styleKeys: HTMLStyleElement = document.createElement("style");
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
function setCirclesColor(color: BABYLON.Color3): void {
	if (circles[0].sourceMesh && circles[0].sourceMesh.material)
		(circles[0].sourceMesh.material as BABYLON.StandardMaterial).diffuseColor = color;
}

function highlightCircles(playerColor: BABYLON.Color3): void {
	isPaused = true;
	setCirclesColor(playerColor);
	setTimeout(() => {
		setCirclesColor(new BABYLON.Color3(0, 0, 0));
	}, 1000);
}

function createGoalEffect(color: BABYLON.Color4, scene: BABYLON.Scene): BABYLON.ParticleSystem {
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
	particleSystem.gravity = new BABYLON.Vector3(0, -0.5, 0);
	particleSystem.targetStopDuration = 1.0;
	particleSystem.disposeOnStop = true;

	return particleSystem;
}

const paddle1ParticleEffect = createGoalEffect(player1Color4, scene);
const paddle2ParticleEffect = createGoalEffect(player2Color4, scene);

function highlightGoalEffect(particleSystem: BABYLON.ParticleSystem, position: BABYLON.Vector3) {
	particleSystem.emitter = position.clone();
	let clone = particleSystem.clone(particleSystem.name, particleSystem.emitter);
	clone.start()
	setTimeout(() => clone.stop(), 1000);
}

// Resizing
const updateCanvasSize = throttle(() => {
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
		engine.resize(true);

		const scaleFactor = Math.min(containerWidth / 1280, containerHeight / 720);
		document.documentElement.style.setProperty("--scale-factor", scaleFactor.toString());

		updateScoreSize();
		updateKeySize();

		resizePending = false;
	});
});

const updateKeySize = () => {
	const scaleFactor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale-factor"));
	document.querySelectorAll(".key-display").forEach((key) => {
		const element = key as HTMLElement;
		element.style.width = `${50 * scaleFactor}px`;
		element.style.height = `${50 * scaleFactor}px`;
		element.style.fontSize = `${24 * scaleFactor}px`;
		element.style.borderRadius = `${8 * scaleFactor}px`;
	});
};

// Camera effects
function zoomOutEffect(callback?: () => void): void {
	if (isZooming)
		return;
	isZooming = true;
	const targetPositionZ = 12;
	const zoomSpeed = 0.01;

	function zoomOutAnimation(scene: BABYLON.Scene): void {
		if (camera.position.z < targetPositionZ) {
			camera.position.z += zoomSpeed;
			camera.position.y += zoomSpeed * 0.5;
		} else {
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
function handleKeyDown(event: KeyboardEvent) {
	const code = event.code;

	if (event.repeat)
		return;

	if (keyMap.has(code))
	{
		const KeyState = keyMap.get(code)!;
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

function handleKeyUp(event: KeyboardEvent) {
	const code = event.code;

	if (keyMap.has(code)) {
		const KeyState = keyMap.get(code)!;
		KeyState.pressed = false;

		if (KeyState.element)
			KeyState.element.classList.remove('key-pressed');
	}
}

const layoutDetectionHandler = (e: KeyboardEvent) => {
	if (e.code === "KeyA") {
		codeToDetectedKey[e.code] = e.key.toUpperCase();

		keysPrint.forEach((keyConf) => {
			if (keyConf.key === "A")
				keyConf.key = codeToDetectedKey["KeyA"];
		});

		const elements = document.querySelectorAll(".key-display");
		elements.forEach((el) => {
			const htmlEl = el as HTMLElement;
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
		const keyElement: HTMLDivElement = document.createElement("div");
		keyElement.textContent = key;
		keyElement.classList.add("key-display", side);
		keyElement.style.position = 'absolute';
		keyElement.style.top = top;
		keyElement.dataset.key = code
		document.body.appendChild(keyElement);
		if (keyMap.has(code))
			keyMap.get(code)!.element = keyElement;
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
function simulatKeyPress(action: number): void {
	if (keyMap.get("ArrowLeft")?.element)
		keyMap.get("ArrowLeft")!.element!.classList.remove("key-pressed");
	if (keyMap.get("ArrowRight")?.element)
		keyMap.get("ArrowRight")!.element!.classList.remove("key-pressed");
	if (action === 0 && keyMap.get("ArrowLeft")?.element && paddle2.position.x < 5)
	{
		paddle2.position.x += paddleSpeed;
		keyMap.get("ArrowLeft")!.element!.classList.add("key-pressed");
	}
	else if (action === 1 && keyMap.get("ArrowRight")?.element && paddle2.position.x > -5)
	{
		paddle2.position.x -= paddleSpeed;
		keyMap.get("ArrowRight")!.element!.classList.add("key-pressed");
	}
}


// Paddle movement
function movePaddles(): void {
	if (pongAIInstance)
	{
		const action = pongAIInstance.getAction(ball, ballSpeed, paddle2, paddleSpeed, paddle1.position.x);
		simulatKeyPress(action);
	}
	else
	{
		if (keyMap.get("ArrowLeft")?.pressed && paddle2.position.x < 5)
			paddle2.position.x += paddleSpeed;
		if (keyMap.get("ArrowRight")?.pressed && paddle2.position.x > -5)
			paddle2.position.x -= paddleSpeed;
	}
	if (keyMap.get("KeyA")?.pressed && paddle1.position.x < 5)
		paddle1.position.x += paddleSpeed;
	if (keyMap.get("KeyD")?.pressed && paddle1.position.x > -5)
		paddle1.position.x -= paddleSpeed;
}

// Collision wall/paddle --> scoring
function checkCollision(): void {
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
		highlightGoalEffect(paddle1ParticleEffect, new BABYLON.Vector3(ball.position.x, ball.position.y, ball.position.z));
		score = true;
	}
	if (ball.position.z < -6.5) {
		score1++;
		lastScorer = 1;
		highlightCircles(player1Color);
		highlightGoalEffect(paddle2ParticleEffect, new BABYLON.Vector3(ball.position.x, ball.position.y, ball.position.z));
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
let enterButton: HTMLElement | null = null;
let spaceButton: HTMLElement | null = null;
let spaceAndEnterIsPrint = false;

function createButton(text: string, className: string): void {
	const button = document.createElement('div');
	button.classList.add('key-display', className);
	button.textContent = text;
	document.body.appendChild(button);
	if (className === 'key-enter') {
		enterButton = button;
	} else if (className === 'key-space') {
		spaceButton = button;
	}
	button.style.position = 'absolute';
	button.style.top = '20%';
	if (className === 'key-enter') {
		button.style.left = '40%';
	} else if (className === 'key-space') {
		button.style.right = '40%';
	}
}

function hideButtons(): void {
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
function reset(): void {
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

function restartGame(callback?: () => void) {
	gameIsFinished = false;
	score1 = 0;
	score2 = 0;
	lastScorer = null;
	isPaused = true;
	const winnerText = document.querySelector("#winner") as HTMLElement;
	if(winnerText) winnerText.style.display = "none";
	const restartButton = document.querySelector("button-endgame");
	if (restartButton) restartButton.remove();
	reset();
	updateScores();

	startCountdown(() => {
		if (callback)
			callback();
	});
}

function endGame(): void {
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
			winnerTournamentText!.style.display = "block";
			const winnerName = score1 > 9 ? currentPlayer1 : currentPlayer2;
			const winnerColor = score1 > 9 ? player1Color.toHexString() : player2Color.toHexString();
			winnerTournamentText!.style.textShadow = `0 0 5px ${winnerColor}, 0 0 10px ${winnerColor}, 0 0 20px ${winnerColor}`;
			const message = `WINNER IS ${winnerName}`;
			const words = message.split(" ");
			winnerTournamentText!.textContent = "";

			words.forEach((word, index) => {
				setTimeout(() => {
					const h1 = document.createElement("h1");
					h1.textContent = word;
					h1.classList.add("custom-winner-h1");
					winnerTournamentText!.appendChild(h1);
					winnerTournamentText!.appendChild(document.createElement("br"));

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
			} else {
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
	} else {
		pauseMenu.style.display = "none";
		countdownContainer.style.display = "none";
		overlay.style.display = "none";
	}
}

function startGame(): void {
	countdownContainer.style.display = "none";
	isPaused = false;
	isPlaying = true;
	scoreElement.style.display = "block";
	overlay.style.display = "none";
}

function startCountdown(callback: () => void): void {
	menu.style.display = "none";
	countdownContainer.style.display = "block";
	countdownElement.style.opacity = "1";
	goElement.style.opacity = "0";
	let count = 3;
	countdownElement.textContent = count.toString();

	function updateCountdown(): void {
		if (count > 0) {
			countdownElement.textContent = count.toString();
			count--;
			setTimeout(updateCountdown, 1000);
		} else {
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
function color3ToCSS(color: BABYLON.Color3): string {
	const r = Math.round(color.r * 255);
	const g = Math.round(color.g * 255);
	const b = Math.round(color.b * 255);
	return `rgb(${r}, ${g}, ${b})`;
}

function onMatchEnd(callback: (winner: string) => void): void {
	matchEndCallback = callback;
}

function showMatchInfo(player1: string, player2: string) {
	const matchInfo = document.getElementById("match-info");
	if (!matchInfo) return;

	const cssColor1 = color3ToCSS(player1Color);
	const cssColor2 = color3ToCSS(player2Color);

	matchInfo.innerHTML = `
		<span style="color: ${cssColor1}; text-shadow: 0 0 5px ${cssColor1}; font-weight: bold;">${player1}</span>
		<span style="color: white; text-shadow: 0 0 5px white; font-size: 24px;"> vs </span>
		<span style="color: ${cssColor2}; margin-left: 5px; text-shadow: 0 0 5px ${cssColor2}; font-weight: bold;">${player2}</span>
	`;
	matchInfo.style.display = "block";
}

function showTournament(players: string[]) {
	const shuffled = players.sort(() => Math.random() - 0.5);
	const rounds: string[][] = [];
	for (let i = 0; i < shuffled.length; i += 2) {
		rounds.push([shuffled[i], shuffled[i + 1]]);
	}
	playerInputs!.style.display = 'none';
	continueButton!.style.display = 'none';
	playerCountSelector!.style.display = 'none';
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
			backToPlayerSelectionFromStartTournament!.style.display = 'none';
			startTournamentGame(rounds);
		});

		matchList.appendChild(startButton);
		matchList.style.display = 'block';
		backToPlayerSelectionFromStartTournament!.style.display = 'block';
		backToPlayerSelectionFromStartTournament!.onclick = () => {
			matchList!.style.display = 'none';
			backToPlayerSelectionFromStartTournament!.style.display = 'none';
			playerInputs!.style.display = 'flex';
			playerCountSelector!.style.display = 'flex';
			backToMenuFromTournament!.style.display = 'flex';
			continueButton!.style.display = 'block';
		};
	}
}

function startTournamentGame(rounds: string[][]) {
	let currentMatchIndex = 0;
	const winners: string[] = [];
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
			onMatchEnd((winner: string) => {
				winners.push(winner);
				currentMatchIndex++;
				playNextMatch();
			});
		});
	}
	playNextMatch();
}

function pairWinners(players: string[]): string[][] {
	const shuffled = players.sort(() => Math.random() - 0.5);
	const rounds: string[][] = [];
	for (let i = 0; i < shuffled.length; i += 2) {
		rounds.push([shuffled[i], shuffled[i + 1]]);
	}
	return rounds;
}

document.addEventListener('DOMContentLoaded', function() {
	if (tournamentButton && menu && tournamentButtonContainer && playerCountSelector && playerInputs && continueButton) {
		tournamentButton.addEventListener('click', function () {
			menu.style.display = 'none';
			tournamentButtonContainer.style.display = 'flex';
			backToMenuFromTournament!.style.display = 'flex';
		});

		backToMenuFromTournament?.addEventListener("click", () => {
			menu.style.display = "block";
			tournamentButtonContainer.style.display = "none";
			backToMenuFromTournament!.style.display = "none";
			playerInputs.innerHTML = "";
			continueButton.style.display = "none";
		});

		playerCountSelector.addEventListener('click', function (e) {
			const target = e.target as HTMLElement;
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
			backToMenuFromTournament!.style.display = 'none';
			const allInputs = playerInputs.querySelectorAll('input');
			const playerNames: string[] = Array.from(allInputs).map(input => input.value.trim());

			if (playerNames.length === 4 || playerNames.length === 8) {
				showTournament(playerNames);
			}
		});
	}
});

// Pause menu / event handlers
document.getElementById("home-button")!.addEventListener("click", () => {
	document.getElementById("home-confirmation")!.style.display = "flex"; // Display confirmation
});

document.getElementById("confirm-yes")!.addEventListener("click", () => {
	location.reload();
});

document.getElementById("confirm-no")!.addEventListener("click", () => {
	document.getElementById("home-confirmation")!.style.display = "none"; // Just hide the confirmation
});

document.getElementById("resume-button")!.addEventListener("click", () => {
	pauseMenu.style.display = "none";
	countdownContainer.style.display = "none";
	overlay.style.display = "none";
	if (spaceAndEnterIsPrint) return;
	isPaused = false;
});

document.getElementById("playButton")?.addEventListener("click", () => {
	menu.style.display = "none";
	document.getElementById("mode-selection-container")!.style.display = "flex";
	document.getElementById("back-to-menu-from-play")!.style.display = "flex";
});

backToMenuFromPlay?.addEventListener("click", () => {
	menu.style.display = "block";
	document.getElementById("mode-selection-container")!.style.display = "none";
	backToMenuFromPlay!.style.display = "none";
});

document.getElementById("aiMode")?.addEventListener("click", () => {
	backToMenuFromPlay!.style.display = "none";
	modeSelection!.style.display = "none";
	pongAIInstance = new PongAI();
	isPaused = true;
	startCountdown(() => {
		startGame();
	});
});

document.getElementById("humanMode")?.addEventListener("click", () => {
	backToMenuFromPlay!.style.display = "none";
	modeSelection!.style.display = "none";
	isPaused = true;
	startCountdown(startGame);
});

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	engine.resize();
});

// FPS display
const fpsDisplay = document.createElement('div');
fpsDisplay.style.position = 'absolute';
fpsDisplay.style.top = '10px';
fpsDisplay.style.left = '10px';
fpsDisplay.style.color = '#0ff';
fpsDisplay.style.fontFamily = '"Orbitron", sans-serif';
fpsDisplay.style.zIndex = '1000';
document.body.appendChild(fpsDisplay);
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
