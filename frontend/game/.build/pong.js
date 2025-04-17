import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
// Create the canvas element and append it to the document html
let globalContainer = document.createElement('div');
globalContainer.id = 'global-container';
globalContainer.style.margin = '0';
globalContainer.style.padding = '0';
globalContainer.style.overflow = 'hidden';
globalContainer.style.backgroundColor = 'black';
globalContainer.style.position = 'absolute';
globalContainer.style.top = '0';
globalContainer.style.left = '0';
globalContainer.style.width = '100%';
globalContainer.style.height = '100%';
document.body.appendChild(globalContainer);
let canvas = document.createElement('canvas');
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.display = 'block';
canvas.id = 'canvas';
globalContainer.appendChild(canvas);
// Initialize the Babylon.js engine
const engine = new BABYLON.Engine(canvas, true);
// Create the scene
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 1); // Black
// Create a camera to control it
const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 8, 12), scene);
camera.setTarget(BABYLON.Vector3.Zero());
camera.fov = Math.PI / 2;
camera.minZ = 0.1;
camera.maxZ = 1000;
camera.inputs.clear(); // Disable camera controls with arrowLeft and arrowRight
// Function to update canvas and camera based on container size
const updateCanvasSize = () => {
    const containerWidth = globalContainer.clientWidth;
    const containerHeight = globalContainer.clientHeight;
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    // Adjust camera FOV based on aspect ratio
    const aspectRatio = containerWidth / containerHeight;
    camera.fov = Math.min(Math.PI / 2, Math.PI / 2 / aspectRatio);
    engine.resize();
};
// Initial size setup
updateCanvasSize();
// Add resize observer
const resizeObserver = new ResizeObserver(updateCanvasSize);
resizeObserver.observe(globalContainer);
// Add a hemispheric light
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 5, 5), scene);
light.intensity = 0.8;
// Post-processing effects
const pipeline = new BABYLON.DefaultRenderingPipeline("defaultPipeline", true, scene, [camera]);
// Enable bloom effect
pipeline.bloomEnabled = true;
pipeline.bloomThreshold = 0.8;
pipeline.bloomKernel = 64; // Controls blur radius of bloom
// Define players's color
const player1Color = new BABYLON.Color3(0, 1, 0); // Green
const player2Color = new BABYLON.Color3(0.5, 0, 0.5); // Purple
const player1Color4 = new BABYLON.Color4(player1Color.r, player1Color.g, player1Color.b, 1);
const player2Color4 = new BABYLON.Color4(player2Color.r, player2Color.g, player2Color.b, 1);
// Game Variables
let numHit = 0; // Number of time the ball has been hit (0 to 5)
let speedIncrement = 0.025; // Speed increase every 5 hits
let ballSpeedReachedMax = false; // Check if maxSpeed has been reached
let isPaused = false; // Pause the game after scoring
////////////////////////////// START //////////////////////////////
let countdownComplete = false;
let countdownElement = document.getElementById("countdown");
let goElement = document.getElementById("countdown-go");
let menu = document.getElementById("menu");
globalContainer.appendChild(menu);
let countdownContainer = document.getElementById("countdown-container");
globalContainer.appendChild(countdownContainer);
// Start the game after the countdown
function startGame() {
    countdownContainer.style.display = "none";
    isPaused = false; // Start the game
}
function startCountdown(callback) {
    menu.style.display = "none"; // Hide menu
    countdownContainer.style.display = "block"; // Print the countdown
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
            goElement.style.opacity = "1"; // Print GO!
            goElement.style.animation = "goFlash 2s ease-out forwards";
            setTimeout(() => {
                goElement.style.display = "none"; // Hide GO!
                countdownComplete = true;
                if (callback)
                    callback(); // Start the game adfter the countdown
            }, 2000);
        }
    }
    updateCountdown();
}
document.getElementById("playButton")?.addEventListener("click", function () {
    isPaused = true;
    startCountdown(startGame);
});
////////////////////////////// FIELD //////////////////////////////
// Field Properties
const fieldThickness = 0.2;
const fieldSize = { width: 12, height: 12 };
// Create the field as a box
const field = BABYLON.MeshBuilder.CreateBox("field", {
    width: fieldSize.width, height: fieldThickness, depth: fieldSize.height
}, scene);
// Assign a material to the field
const fieldMaterial = new BABYLON.StandardMaterial("fieldMaterial", scene);
fieldMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0); // Set a field color
field.material = fieldMaterial;
// Position the field slightly above the ground
field.position.y = fieldThickness / 2 + 0.5;
// Compute the field height (used for placing elements on top of it)
const fieldHeight = field.position.y + fieldThickness / 2;
// Create a grid of Circles over the field
const gridSize = 12;
const gridDivision = 12;
const cellSize = gridSize / gridDivision;
const circles = [];
// Function to create a circle mesh
function createCircle(x, z, radius = 0.3) {
    const circle = BABYLON.MeshBuilder.CreateDisc("circle", {
        radius: radius, tessellation: 64 // Higher = smoother circle
    }, scene);
    // Assign material
    const circleMaterial = new BABYLON.StandardMaterial("circleMaterial", scene);
    circleMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    circle.material = circleMaterial;
    // Position the circle
    circle.position.set(x, fieldHeight + 0.02, z);
    circle.rotation.x = Math.PI / 2; // Rotate to lie flat
    return circle;
}
// Generate the grid of circles
for (let x = -gridSize / 2 + cellSize / 2; x <= gridSize / 2; x += cellSize) {
    for (let z = -gridSize / 2 + cellSize / 2; z <= gridSize / 2; z += cellSize) {
        const circle = createCircle(x, z);
        circles.push(circle);
    }
}
// Function to highlight the field and pause the game
function highlightCircles(playerColor) {
    isPaused = true;
    // Change circles color only if the material is not null
    circles.forEach((circle) => {
        if (circle.material) {
            circle.material.diffuseColor = playerColor;
        }
    });
    // Reset color after 1 sec
    setTimeout(() => {
        circles.forEach((circle) => {
            if (circle.material) {
                circle.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
            }
        });
    }, 1000);
    // Listen for key press to resume the game
    window.addEventListener('keydown', handleKeyPress);
}
// Create neon field lines
const fieldLinePoints = [
    // Top edges
    new BABYLON.Vector3(-6, fieldHeight + 0.01, -6),
    new BABYLON.Vector3(6, fieldHeight + 0.01, -6),
    new BABYLON.Vector3(6, fieldHeight + 0.01, 6),
    new BABYLON.Vector3(-6, fieldHeight + 0.01, 6),
    new BABYLON.Vector3(-6, fieldHeight + 0.01, -6),
    // Bottom edges
    new BABYLON.Vector3(-6, fieldHeight - fieldThickness, -6),
    new BABYLON.Vector3(6, fieldHeight - fieldThickness, -6),
    new BABYLON.Vector3(6, fieldHeight - fieldThickness, 6),
    new BABYLON.Vector3(-6, fieldHeight - fieldThickness, 6),
    new BABYLON.Vector3(-6, fieldHeight - fieldThickness, -6),
    // Vertical connectors
    new BABYLON.Vector3(-6, fieldHeight + 0.01, -6),
    new BABYLON.Vector3(-6, fieldHeight - fieldThickness, -6),
    new BABYLON.Vector3(6, fieldHeight + 0.01, -6),
    new BABYLON.Vector3(6, fieldHeight - fieldThickness, -6),
    new BABYLON.Vector3(6, fieldHeight + 0.01, 6),
    new BABYLON.Vector3(6, fieldHeight - fieldThickness, 6),
    new BABYLON.Vector3(-6, fieldHeight + 0.01, 6),
    new BABYLON.Vector3(-6, fieldHeight - fieldThickness, 6),
    // Central line
    new BABYLON.Vector3(-6, fieldHeight + 0.01, 0),
    new BABYLON.Vector3(6, fieldHeight + 0.01, 0)
];
// Create the neon field lines
const fieldLines = BABYLON.MeshBuilder.CreateLines("fieldLines", {
    points: fieldLinePoints
}, scene);
// Apply material to make the line glow
const lineMaterial = new BABYLON.StandardMaterial("lineMaterial", scene);
lineMaterial.emissiveColor = new BABYLON.Color3(0, 1, 1); // Cyan glow
fieldLines.color = new BABYLON.Color3(0, 1, 1); // Set Neon Color
// Function to create a half circle for the field
function createHalfCircle(centerX, centerZ, radius, startAngle, endAngle) {
    const points = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
        const angle = startAngle + (endAngle - startAngle) * (i / segments);
        points.push(new BABYLON.Vector3(centerX + radius * Math.cos(angle), fieldHeight + 0.04, centerZ + radius * Math.sin(angle)));
    }
    return points;
}
// Create left and right half circles
const leftHalfCirclePoints = createHalfCircle(0, -6, 3, 0, Math.PI);
const rightHalfCirclePoints = createHalfCircle(0, 6, 3, Math.PI, 2 * Math.PI);
// Generate lines for half circles
const leftHalfCircle = BABYLON.MeshBuilder.CreateLines("leftHalfCircle", {
    points: leftHalfCirclePoints
}, scene);
const rightHalfCircle = BABYLON.MeshBuilder.CreateLines("rightHalfCircle", {
    points: rightHalfCirclePoints
}, scene);
// Apply neon material
leftHalfCircle.color = new BABYLON.Color3(0, 1, 1);
;
rightHalfCircle.color = new BABYLON.Color3(0, 1, 1);
;
////////////////////////////// PADDLE //////////////////////////////
const createCapsuleOutline = (radius, height, radialSegments, scene, color, thickness = 0.01) => {
    const lines = [];
    const segmentStep = Math.PI / radialSegments;
    // Generate normal lines
    const generateLines = (offsetX, offsetZ) => {
        const topHalf = [];
        const bottomHalf = [];
        for (let theta = 0; theta <= Math.PI; theta += segmentStep) {
            const x = radius * Math.cos(theta) + offsetX;
            const y = height / 2 + radius * Math.sin(theta);
            topHalf.push(new BABYLON.Vector3(x, y, offsetZ));
            const x2 = radius * Math.cos(Math.PI - theta) + offsetX;
            const y2 = -height / 2 - radius * Math.sin(Math.PI - theta);
            bottomHalf.push(new BABYLON.Vector3(x2, y2, offsetZ));
        }
        lines.push(topHalf, bottomHalf);
        lines.push([
            new BABYLON.Vector3(radius + offsetX, height / 2, offsetZ),
            new BABYLON.Vector3(radius + offsetX, -height / 2, offsetZ),
        ]);
        lines.push([
            new BABYLON.Vector3(-radius + offsetX, height / 2, offsetZ),
            new BABYLON.Vector3(-radius + offsetX, -height / 2, offsetZ),
        ]);
    };
    // Generate several shifted lines to create thickness
    generateLines(0, 0);
    generateLines(thickness, thickness);
    generateLines(-thickness, -thickness);
    generateLines(thickness, -thickness);
    generateLines(-thickness, thickness);
    // Create Line System
    const capsuleLines = BABYLON.MeshBuilder.CreateLineSystem("capsule", { lines }, scene);
    capsuleLines.color = color;
    return capsuleLines;
};
// Create Paddles
const radius = 0.25;
const height = 1.5;
const radialSegments = 64;
const paddle1 = createCapsuleOutline(radius, height, radialSegments, scene, player1Color);
const paddle2 = createCapsuleOutline(radius, height, radialSegments, scene, player2Color);
paddle1.rotation.z = Math.PI / 2;
paddle1.rotation.x = -Math.PI / 4;
paddle2.rotation.z = Math.PI / 2;
paddle2.rotation.x = -Math.PI / 4;
paddle1.position.set(0, fieldHeight + 0.2, 6.5);
paddle2.position.set(0, fieldHeight + 0.2, -6.5);
//////////////////////////////// BALL ////////////////////////////////
const ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 0.4, segments: 64 }, scene);
const ballMaterial = new BABYLON.StandardMaterial("ballMaterial", scene);
ballMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0); // Yellow
ballMaterial.emissiveColor = new BABYLON.Color3(1, 1, 0);
ball.material = ballMaterial;
ball.position = new BABYLON.Vector3(0, fieldHeight + 0.2, 0);
let ballSpeed = { x: 0, z: 0.05 };
let lastScorer = null;
const MAX_BALL_SPEED = 0.2;
//////////////////////////////// SCORE ////////////////////////////////
let score1 = 0, score2 = 0;
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
scoreElement.style.transition = 'transform 0.1s ease-out'; // Animation for changing score
globalContainer.appendChild(scoreElement);
scoreElement.style.animation = 'neonGlow 1.5s infinite alternate'; // Pulsating animation
const style = document.createElement('style');
style.textContent = `@keyframes neonGlow {
		0% { text-shadow: 0 0 2px #0ff,  0 0 4px #0ff,  0 0 6px #00f, 0 0 8px #00f; }
		100% { text-shadow: 0 0 3px #0ff, 0 0 5px #0ff, 0 0 7px #00f, 0 0 10px #00f; }
}`;
document.head.appendChild(style);
function updateScores() {
    scoreElement.textContent = `${score1} - ${score2}`;
    scoreElement.style.transform = 'translateX(-50%) scale(1.2)';
    setTimeout(() => {
        scoreElement.style.transform = 'translateX(-50%) scale(1)';
    }, 100);
}
updateScores();
const keysPrint = [
    { key: "Q", side: "left", top: "25%" }, // Position for Q
    { key: "D", side: "left", top: "40%" }, // Position for D
    { key: "←", side: "right", top: "25%" }, // Position for ←
    { key: "→", side: "right", top: "40%" } // Position for →
];
keysPrint.forEach(({ key, side, top }) => {
    const keyElement = document.createElement("div");
    keyElement.textContent = key;
    keyElement.classList.add("key-display", side);
    keyElement.style.position = 'absolute';
    keyElement.style.top = top;
    globalContainer.appendChild(keyElement);
});
// CSS style
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
// Visual effect when pressed
document.addEventListener("keydown", (event) => {
    const key = event.key;
    const keyElements = document.querySelectorAll(".key-display");
    keyElements.forEach((element) => {
        const htmlElement = element;
        if (htmlElement.textContent?.toUpperCase() === key.toUpperCase() ||
            (key === "ArrowLeft" && htmlElement.textContent === "←") ||
            (key === "ArrowRight" && htmlElement.textContent === "→")) {
            htmlElement.classList.add("key-pressed");
        }
    });
});
document.addEventListener("keyup", (event) => {
    const key = event.key;
    const keyElements = document.querySelectorAll(".key-display");
    keyElements.forEach((element) => {
        const htmlElement = element; // Cast to HTMLElement
        if (htmlElement.textContent?.toUpperCase() === key.toUpperCase() ||
            (key === "ArrowLeft" && htmlElement.textContent === "←") ||
            (key === "ArrowRight" && htmlElement.textContent === "→")) {
            htmlElement.classList.remove("key-pressed");
        }
    });
});
// Key pressed detection
const keys = { ArrowRight: false, ArrowLeft: false, KeyA: false, KeyD: false };
window.addEventListener('keydown', (e) => { if (keys.hasOwnProperty(e.code))
    keys[e.code] = true; });
window.addEventListener('keyup', (e) => { if (keys.hasOwnProperty(e.code))
    keys[e.code] = false; });
// Paddle movement
let paddleSpeed = 0.1;
const MAX_PADDLE_SPEED = 0.15;
function movePaddles() {
    if (keys.KeyA && paddle1.position.x < 5)
        paddle1.position.x += paddleSpeed;
    if (keys.KeyD && paddle1.position.x > -5)
        paddle1.position.x -= paddleSpeed;
    if (keys.ArrowLeft && paddle2.position.x < 5)
        paddle2.position.x += paddleSpeed;
    if (keys.ArrowRight && paddle2.position.x > -5)
        paddle2.position.x -= paddleSpeed;
}
////////////////////////////// GOAL EFFECT //////////////////////////////
function highlightGoalEffect(position, color, scene) {
    const cubeCount = 100;
    const cubes = [];
    for (let i = 0; i < cubeCount; i++) {
        // Create a cube
        const cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 0.3 }, scene);
        cube.position = position.clone(); // Every cube are at the same place
        // Create material and apply color
        const material = new BABYLON.StandardMaterial("cubeMaterial", scene);
        material.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b);
        material.emissiveColor = new BABYLON.Color3(color.r, color.g, color.b);
        material.alpha = 1;
        cube.material = material;
        // Random speed in all directions
        const velocity = new BABYLON.Vector3((Math.random() - 0.5) * 3, // X
        (Math.random() - 0.5) * 3, // Y
        (Math.random() - 0.5) * 3 // Z
        );
        cubes.push({ cube, velocity });
    }
    // Cube Animation
    const update = () => {
        for (const obj of cubes) {
            obj.cube.position.addInPlace(obj.velocity.scale(0.1)); // Progressive moving
            obj.velocity.scaleInPlace(0.95); // Progressive slow
            const material = obj.cube.material; // Récupère le matériau
            if (material.alpha > 0) {
                material.alpha -= 0.02; // Decrease alpha for transparency
            }
        }
    };
    // Animation every 16ms for 60fps
    const interval = setInterval(update, 16);
    // Delete cubes after 1sec
    setTimeout(() => {
        clearInterval(interval); // Stop the calling of update()
        for (const obj of cubes) {
            obj.cube.dispose();
        }
    }, 1000);
}
////////////////////////////// ZOOM //////////////////////////////
let isZooming = false;
function zoomOutEffect(callback) {
    if (isZooming)
        return; // Avoid multiple zooms
    isZooming = true;
    const targetPositionZ = 12; // Move the camera
    const zoomSpeed = 0.01;
    function zoomOutAnimation(scene) {
        if (camera.position.z < targetPositionZ) {
            camera.position.z += zoomSpeed; // Closer
            camera.position.y += zoomSpeed * 0.5; // Zoom up
        }
        else {
            camera.position.z = targetPositionZ; // Stop the zoom
            scene.onBeforeRenderObservable.removeCallback(zoomOutAnimation); // Stop animation
            isZooming = false;
            if (callback)
                callback(); // Call reset after zoom
        }
    }
    scene.onBeforeRenderObservable.add(zoomOutAnimation);
}
//////////////////////////////// RESET ////////////////////////////////
function reset() {
    paddle1.position.set(0, fieldHeight + 0.2, 6.5);
    paddle2.position.set(0, fieldHeight + 0.2, -6.5);
    ball.position.set(0, fieldHeight + 0.2, 0);
    isZooming = false;
    camera.position.set(0, 6.5, 9);
    paddleSpeed = 0.1;
    numHit = 0;
    if (lastScorer === 1) {
        ballSpeed = { x: 0, z: -0.05 };
    }
    else if (lastScorer === 2) {
        ballSpeed = { x: 0, z: 0.05 };
    }
}
//////////////////////////////// ENDGAME & RESTART ////////////////////////////////
let gameIsFinished = false;
function endGame() {
    gameIsFinished = true;
    document.removeEventListener("keydown", handleKeyPress);
    // Stop loop ?
    setTimeout(() => {
        const restartButton = document.createElement("button-endgame");
        restartButton.textContent = "Restart Game";
        restartButton.onclick = restartGame;
        document.body.appendChild(restartButton);
    }, 1000);
}
function handleKeyPress(event) {
    if (event.code == 'Space' || event.code == 'Enter') {
        if (gameIsFinished)
            return; // If the game is finished we stop the ball
        isPaused = false; // If the game is not finished, we relaunch the ball
        window.removeEventListener('keydown', handleKeyPress);
    }
}
function restartGame() {
    gameIsFinished = false;
    score1 = 0;
    score2 = 0;
    isPaused = true;
    reset();
    document.removeEventListener("keydown", handleKeyPress);
    document.addEventListener("keydown", handleKeyPress);
    const restartButton = document.querySelector("button-endgame");
    if (restartButton)
        restartButton.remove();
}
//////////////////////////////// COLLISION ////////////////////////////////
function checkCollision() {
    // Paddle1 (green)
    if (ball.position.z > 6 && ball.position.z < 7 && Math.abs(ball.position.x - paddle1.position.x) < 1.5) {
        const offset = ball.position.x - paddle1.position.x; // Distance from paddle center
        const maxBounceAngle = Math.PI / 3; // Max 60°
        const bounceAngle = (offset / 1.5) * maxBounceAngle; // Scale angle based on offset
        const speed = Math.sqrt(ballSpeed.x ** 2 + ballSpeed.z ** 2); // Preserve speed
        ballSpeed.x = speed * Math.sin(bounceAngle);
        ballSpeed.z = -Math.abs(speed * Math.cos(bounceAngle)); // Ensure ball moves upward
        numHit++;
    }
    // Paddle2 (purple)
    if (ball.position.z < -6 && ball.position.z > -7 && Math.abs(ball.position.x - paddle2.position.x) < 1.5) {
        const offset = ball.position.x - paddle2.position.x; // Distance from paddle center
        const maxBounceAngle = Math.PI / 3; // Max 45°
        const bounceAngle = (offset / 1.5) * maxBounceAngle; // Scale angle based on offset
        const speed = Math.sqrt(ballSpeed.x ** 2 + ballSpeed.z ** 2); // Preserve speed
        ballSpeed.x = speed * Math.sin(bounceAngle);
        ballSpeed.z = Math.abs(speed * Math.cos(bounceAngle)); // Ensure ball moves downward
        numHit++;
    }
    // Increase speed every 5 hits
    if (numHit >= 5) {
        ballSpeed.x += Math.sign(ballSpeed.x) * speedIncrement; // Horizontaly
        ballSpeed.z += Math.sign(ballSpeed.z) * speedIncrement; // Verticaly
        ballSpeed.x = Math.min(Math.abs(ballSpeed.x), MAX_BALL_SPEED) * Math.sign(ballSpeed.x);
        ballSpeed.z = Math.min(Math.abs(ballSpeed.z), MAX_BALL_SPEED) * Math.sign(ballSpeed.z);
        if (Math.abs(ballSpeed.x) === MAX_BALL_SPEED && !ballSpeedReachedMax) {
            ballSpeedReachedMax = true;
        }
        paddleSpeed = Math.min(paddleSpeed + speedIncrement, MAX_PADDLE_SPEED);
        numHit = 0;
    }
    // Walls collision
    if (ball.position.x < -6 || ball.position.x > 6) {
        ballSpeed.x *= -1;
    }
    // Score
    if (ball.position.z > 6.5) {
        score2++;
        lastScorer = 2;
        highlightCircles(player2Color);
        highlightGoalEffect(new BABYLON.Vector3(ball.position.x, ball.position.y, ball.position.z), player2Color4, scene);
        reset();
        updateScores();
    }
    if (ball.position.z < -6.5) {
        score1++;
        lastScorer = 1;
        highlightCircles(player1Color);
        highlightGoalEffect(new BABYLON.Vector3(ball.position.x, ball.position.y, ball.position.z), player1Color4, scene);
        reset();
        updateScores();
    }
    if (score1 > 9 || score2 > 9) {
        zoomOutEffect();
        endGame();
    }
}
////////////////////////////// LOOP //////////////////////////////
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
// Handle window resizing
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    engine.resize();
});
