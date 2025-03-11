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
    App.style.width = '500px';
    App.style.height = '400px';
    App.appendChild(document.createElement('div'));
    App.children[0].classList.add('title-bar');
    App.children[0].appendChild(document.createElement('div'));
    App.children[0].children[0].classList.add('title-bar-text');
    var Name = appname.charAt(0).toUpperCase() + appname.slice(1);
    App.children[0].children[0].textContent = Name;
    App.children[0].appendChild(document.createElement('div'));
    App.children[0].children[1].classList.add('title-bar-controls');
    App.children[0].children[1].appendChild(document.createElement('button'));
    App.children[0].children[1].children[0].ariaLabel = 'Minimize';
    App.children[0].children[1].appendChild(document.createElement('button'));
    App.children[0].children[1].children[1].ariaLabel = 'Maximize';
    App.children[0].children[1].appendChild(document.createElement('button'));
    App.children[0].children[1].children[2].ariaLabel = 'Close';
    App.children[0].children[1].children[2].id = 'close-button';
    App.appendChild(document.createElement('div'));
    App.children[1].classList.add('window-body');
    if (content)
        App.children[1].appendChild(content);
    document.body.appendChild(App);
    return App;
}
document.addEventListener('DOMContentLoaded', function () {
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
    disableImgDragging();
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
    // Apps
    var settingsApp = createApp('settings');
    // settingsApp.children[1].appendChild(document.createElement('img'));
    // (settingsApp.children[1].children[0] as HTMLImageElement).src = './img/settings-app-content.jpeg';
    var pongApp = createApp('pong');
    pongApp.children[1].appendChild(document.createElement('canvas'));
    var pongCanvas = pongApp.children[1].children[0];
    pongCanvas.id = 'pong-game-canvas';
    var pongAppWindow = document.getElementById('pong-app-window');
    pongCanvas.width = parseInt(pongAppWindow.style.width);
    pongCanvas.height = parseInt(pongAppWindow.style.height);
    pongCanvas.style.backgroundColor = 'black';
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
