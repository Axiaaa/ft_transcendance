document.addEventListener('DOMContentLoaded', () => {

	let pongWindow = document.getElementById('pong-app-window');
	if (pongWindow) {
		let pongAppCanvas = document.getElementById('pong-game-canvas');
		if (pongAppCanvas) {
			pongAppCanvas.remove();
		}
		let windowBody = pongWindow.children[1] as HTMLElement;
		let pongAppIframe = document.createElement('iframe');
		pongAppIframe.id = 'pong-game-iframe';
		pongAppIframe.src = 'game/index.html';
		pongAppIframe.width = '100%';
		pongAppIframe.height = '100%';
		pongAppIframe.style.border = 'none';
		windowBody.appendChild(pongAppIframe);
	}
});