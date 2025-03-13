export function openAppWindow(appName) {
    var appWindow = document.getElementById(appName + '-window');
    console.log('Open ' + appName + " = " + appWindow);
    appWindow.style.display = 'block';
}
;
function createApp(appname, content) {
    var App = document.createElement('div');
    App.classList.add('window');
    App.id = appname + '-app-window';
    App.style.display = 'none';
    App.style.minWidth = '400px';
    App.style.minHeight = '300px';
    App.style.width = '500px';
    App.style.height = '400px';
    var titleBar = document.createElement('div');
    titleBar.classList.add('title-bar');
    App.appendChild(titleBar);
    var titleBarText = document.createElement('div');
    titleBarText.classList.add('title-bar-text');
    titleBar.appendChild(titleBarText);
    var Name = appname.charAt(0).toUpperCase() + appname.slice(1);
    titleBarText.textContent = Name;
    var titleBarControls = document.createElement('div');
    titleBarControls.classList.add('title-bar-controls');
    titleBar.appendChild(titleBarControls);
    var minimizeButton = document.createElement('button');
    minimizeButton.ariaLabel = 'Minimize';
    titleBarControls.appendChild(minimizeButton);
    var maximizeButton = document.createElement('button');
    maximizeButton.ariaLabel = 'Maximize';
    titleBarControls.appendChild(maximizeButton);
    var closeButton = document.createElement('button');
    closeButton.ariaLabel = 'Close';
    closeButton.id = 'close-button';
    titleBarControls.appendChild(closeButton);
    var windowBody = document.createElement('div');
    windowBody.classList.add('window-body');
    App.appendChild(windowBody);
    if (content)
        windowBody.appendChild(content);
    document.body.appendChild(App);
    return App;
}
function disableImgDragging() {
    var images = document.getElementsByTagName("img");
    for (var i = 0; i < images.length; i++) {
        images[i].classList.add('no-drag');
        images[i].setAttribute('no-drag', 'on');
        images[i].setAttribute('draggable', 'false');
        images[i].addEventListener('dragstart', function (event) {
            event.preventDefault();
        }, false);
    }
}
document.addEventListener('DOMContentLoaded', function () {
    disableImgDragging();
    // Apps creation
    var pongApp = createApp('pong');
    console.log(pongApp.id + " " + pongApp.className);
    var pongCanvas = document.createElement('canvas');
    pongApp.children[1].appendChild(pongCanvas);
    pongCanvas.id = 'pong-game-canvas';
    var pongAppWindow = document.getElementById('pong-app-window');
    pongCanvas.style.width = 'calc(100% - 16px)';
    pongCanvas.style.height = 'calc(100% - 42px)';
    pongCanvas.style.boxSizing = 'border-box';
    pongCanvas.style.overflow = 'hidden';
    pongCanvas.style.position = 'absolute';
    pongCanvas.style.backgroundColor = 'black';
    console.log("App created: Id: " + pongApp.id + " Class: " + pongApp.className);
    var settingsApp = createApp('settings');
    console.log("App created: Id: " + settingsApp.id + " Class: " + settingsApp.className);
    var terminalApp = createApp('terminal');
    console.log("App created: Id: " + terminalApp.id + " Class: " + terminalApp.className);
    var ExplorerApp = createApp('explorer');
    console.log("App created: Id: " + ExplorerApp.id + " Class: " + ExplorerApp.className);
    var ExplorerContent = ExplorerApp.children[1];
    var ExplorerContentTemp = document.createElement('img');
    ExplorerContentTemp.src = 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3dtMmVmYnQycWcyYzY4dGFnejhnbTRwbzFiZXUybDJ4dDFvamh4OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4mXjpVNJAFlvi/giphy.gif';
    ExplorerContent.appendChild(ExplorerContentTemp);
    ExplorerContent.style.boxSizing = 'border-box';
    ExplorerContent.style.overflow = 'hidden';
    var desktop = document.getElementById('desktop');
    var windowsContainer = document.getElementById('windows-container');
    var gridSize = 90; // Taille de la grille
    // Obtient la position en grille d'un élément
    function getGridPos(element) {
        return {
            x: Math.round(element.offsetLeft / gridSize),
            y: Math.round(element.offsetTop / gridSize)
        };
    }
    document.querySelectorAll('.app-icon').forEach(function (appicon, index) {
        var isDragging = false;
        var offsetX, offsetY;
        appicon.style.left = '30px';
        appicon.style.top = "".concat(90 + index * 90, "px");
        appicon.addEventListener('mousedown', function (e) {
            isDragging = true;
            offsetX = e.clientX - appicon.offsetLeft;
            offsetY = e.clientY - appicon.offsetTop;
            appicon.style.zIndex = '1000';
        });
        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                appicon.style.left = "".concat(e.clientX - offsetX, "px");
                appicon.style.top = "".concat(e.clientY - offsetY, "px");
                if (appicon.offsetLeft < 30) {
                    appicon.style.left = '30px';
                }
                if (appicon.offsetTop < 30) {
                    appicon.style.top = '30px';
                }
                if (appicon.offsetLeft + appicon.offsetWidth > window.innerWidth - 30) {
                    appicon.style.left = "".concat(window.innerWidth - 30 - appicon.offsetWidth, "px");
                }
                if (appicon.offsetTop + appicon.offsetHeight > window.innerHeight - 30) {
                    appicon.style.top = "".concat(window.innerHeight - 30 - appicon.offsetHeight, "px");
                }
            }
        });
        document.addEventListener('mouseup', function () {
            if (isDragging) {
                // Ajustement à la grille
                var x = parseInt(appicon.style.left, 10);
                var y = parseInt(appicon.style.top, 10);
                var snappedX = Math.round(x / gridSize) * gridSize;
                var snappedY = Math.round(y / gridSize) * gridSize;
                // Ajustement pour maintenir une marge de 30px des bordures
                if (snappedX < 30) {
                    snappedX = 30;
                }
                if (snappedY < 30) {
                    snappedY = 30;
                }
                if (snappedX + appicon.offsetWidth > window.innerWidth - 30) {
                    snappedX = window.innerWidth - 30 - appicon.offsetWidth;
                }
                if (snappedY + appicon.offsetHeight > window.innerHeight - 30) {
                    snappedY = window.innerHeight - 30 - appicon.offsetHeight;
                }
                appicon.style.left = "".concat(snappedX, "px");
                appicon.style.top = "".concat(snappedY, "px");
                appicon.style.zIndex = 'initial';
            }
            isDragging = false;
        });
        // Double-clic pour ouvrir une fenêtre
        appicon.addEventListener('dblclick', function () {
            var appName = appicon.id;
            console.log(appName);
            if (appName) {
                openAppWindow(appName);
            }
        });
        appicon.addEventListener('mouseenter', function () {
            console.log('hover');
            appicon.style.backgroundColor = 'rgba(70, 119, 197, 0.54)';
        });
        appicon.addEventListener('mouseleave', function () {
            appicon.style.backgroundColor = 'transparent';
        });
    });
    // Création des fenêtres
    var startMenuApp = document.getElementsByClassName('menu-item');
    var _loop_1 = function (i) {
        var app = startMenuApp[i];
        app.addEventListener('click', function () {
            openAppWindow(app.id);
        });
    };
    for (var i = 0; i < startMenuApp.length; i++) {
        _loop_1(i);
    }
});
