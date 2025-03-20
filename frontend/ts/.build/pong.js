"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var pongWindow = document.getElementById('pong-app-window');
    if (pongWindow) {
        var pongAppCanvas = document.getElementById('pong-game-canvas');
        if (pongAppCanvas) {
            pongAppCanvas.remove();
        }
        var windowBody = pongWindow.children[1];
        var pongAppIframe = document.createElement('iframe');
        pongAppIframe.id = 'pong-game-iframe';
        pongAppIframe.src = 'game/index.html';
        pongAppIframe.width = '100%';
        pongAppIframe.height = '100%';
        pongAppIframe.style.border = 'none';
        windowBody.appendChild(pongAppIframe);
    }
});
