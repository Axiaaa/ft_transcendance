"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var pongWindow = document.getElementById('pong-app-window');
    if (pongWindow) {
        pongWindow.style.minWidth = '400px';
        pongWindow.style.minHeight = '400px';
        pongWindow.style.width = '500px';
        pongWindow.style.height = '400px';
        var pongAppCanvas = document.getElementById('pong-game-canvas');
        if (pongAppCanvas) {
            pongAppCanvas.remove();
        }
        var windowBody = pongWindow.children[1];
        windowBody.style.backgroundColor = 'black';
        var pongAppIframe = document.createElement('iframe');
        pongAppIframe.id = 'pong-game-iframe';
        pongAppIframe.src = 'game/index.html';
        pongAppIframe.width = '100%';
        pongAppIframe.height = '95%';
        pongAppIframe.style.height = '95%';
        pongAppIframe.style.width = '100%';
        pongAppIframe.style.border = 'none';
        windowBody.appendChild(pongAppIframe);
    }
});
