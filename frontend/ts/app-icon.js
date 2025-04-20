import { setIsAppOpen } from "./taskbar.js";
export function openAppWindow(appName, rawName) {
    let appWindow = document.getElementById(appName + '-window');
    console.log('Searching ' + appName + " = " + appWindow);
    if (!appWindow) {
        console.log('App not found');
        if (rawName) {
            console.log('Testing Raw name: ' + rawName);
            appWindow = document.getElementById(rawName);
            if (!appWindow) {
                console.log('Raw name not found');
                return;
            }
            console.log('Raw name found');
        }
        else
            return;
    }
    ;
    console.log('App found, opening...');
    appWindow.style.display = 'block';
    appWindow.classList.add('opened-window');
    let appTaskbarIcon = document.getElementById(appName + '-taskbar-icon');
    if (appTaskbarIcon) {
        appTaskbarIcon.style.display = 'flex';
        appTaskbarIcon.style.backgroundColor = 'rgba(137, 163, 206, 0.49)';
        setIsAppOpen(true);
    }
}
;
function createApp(appname, content) {
    let App = document.createElement('div');
    App.classList.add('window');
    App.id = appname + '-app-window';
    App.style.display = 'none';
    App.style.minWidth = '400px';
    App.style.minHeight = '300px';
    App.style.width = '500px';
    App.style.height = '400px';
    App.style.left = '5%';
    App.style.top = '5%';
    let titleBar = document.createElement('div');
    titleBar.classList.add('title-bar');
    App.appendChild(titleBar);
    let titleBarText = document.createElement('div');
    titleBarText.classList.add('title-bar-text');
    titleBar.appendChild(titleBarText);
    let Name = appname.charAt(0).toUpperCase() + appname.slice(1);
    titleBarText.textContent = Name;
    let titleBarControls = document.createElement('div');
    titleBarControls.classList.add('title-bar-controls');
    titleBar.appendChild(titleBarControls);
    let minimizeButton = document.createElement('button');
    minimizeButton.ariaLabel = 'Minimize';
    titleBarControls.appendChild(minimizeButton);
    let maximizeButton = document.createElement('button');
    maximizeButton.ariaLabel = 'Maximize';
    titleBarControls.appendChild(maximizeButton);
    let closeButton = document.createElement('button');
    closeButton.ariaLabel = 'Close';
    closeButton.id = 'close-button';
    titleBarControls.appendChild(closeButton);
    let windowBody = document.createElement('div');
    windowBody.classList.add('window-body');
    App.appendChild(windowBody);
    windowBody.style.width = 'calc(100% - 6px)';
    windowBody.style.height = 'calc(100% - 27px)';
    windowBody.style.overflow = 'hidden';
    windowBody.style.margin = '0px 3px';
    if (content) {
        windowBody.appendChild(content);
        content.style.height = (parseInt(App.style.height) - 45.5) + 'px';
        content.style.width = (parseInt(App.style.width) - 22) + 'px';
    }
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
function renderWindowContent(App) {
    if (!App)
        return;
    requestAnimationFrame(() => {
        App.style.width = 'calc(100% - 6px)';
        App.style.boxSizing = 'border-box';
        App.style.height = 'calc(100% - 30px)';
        App.style.overflow = 'hidden';
    });
}
document.addEventListener('DOMContentLoaded', () => {
    disableImgDragging();
    // Apps creation
    let pongApp = createApp('pong');
    console.log(pongApp.id + " " + pongApp.className);
    let pongCanvas = document.createElement('canvas');
    pongApp.children[1].appendChild(pongCanvas);
    pongCanvas.id = 'pong-game-canvas';
    let pongAppWindow = document.getElementById('pong-app-window');
    renderWindowContent(pongCanvas);
    pongCanvas.style.position = 'absolute';
    pongCanvas.style.backgroundColor = 'black';
    console.log("App created: Id: " + pongApp.id + " Class: " + pongApp.className);
    let settingsApp = createApp('settings');
    renderWindowContent(settingsApp.children[1].children[0]);
    console.log("App created: Id: " + settingsApp.id + " Class: " + settingsApp.className);
    let terminalApp = createApp('terminal');
    renderWindowContent(terminalApp.children[1].children[0]);
    console.log("App created: Id: " + terminalApp.id + " Class: " + terminalApp.className);
    let ExplorerApp = createApp('internet explorer');
    let ExplorerContent = ExplorerApp.children[1];
    let ExplorerContentTemp = document.createElement('img');
    ExplorerContentTemp.src = './img/Desktop/internetExplorer.gif';
    ExplorerContent.appendChild(ExplorerContentTemp);
    ExplorerContentTemp.style.position = 'absolute';
    renderWindowContent(ExplorerApp.children[1].children[0]);
    console.log("App created: Id: " + ExplorerApp.id + " Class: " + ExplorerApp.className);
    let profileApp = createApp('profile');
    renderWindowContent(profileApp.children[1].children[0]);
    console.log("App created: Id: " + profileApp.id + " Class: " + profileApp.className);
    let socialApp = createApp('social');
    renderWindowContent(socialApp.children[1].children[0]);
    console.log("App created: Id: " + socialApp.id + " Class: " + socialApp.className);
    const desktop = document.getElementById('desktop');
    const windowsContainer = document.getElementById('windows-container');
    // App icon grid size
    const gridSize = 90;
    function getGridPos(element) {
        return {
            x: Math.round(element.offsetLeft / gridSize),
            y: Math.round(element.offsetTop / gridSize)
        };
    }
    document.querySelectorAll('.app-icon').forEach((appicon, index) => {
        let isDragging = false;
        let offsetX, offsetY;
        appicon.style.left = '30px';
        appicon.style.top = `${90 + index * 90}px`;
        appicon.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - appicon.offsetLeft;
            offsetY = e.clientY - appicon.offsetTop;
            appicon.style.zIndex = '1000';
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                appicon.style.left = `${e.clientX - offsetX}px`;
                appicon.style.top = `${e.clientY - offsetY}px`;
                if (appicon.offsetLeft < 30) {
                    appicon.style.left = '30px';
                }
                if (appicon.offsetTop < 30) {
                    appicon.style.top = '30px';
                }
                if (appicon.offsetLeft + appicon.offsetWidth > window.innerWidth - 30) {
                    appicon.style.left = `${window.innerWidth - 30 - appicon.offsetWidth}px`;
                }
                if (appicon.offsetTop + appicon.offsetHeight > window.innerHeight - 30) {
                    appicon.style.top = `${window.innerHeight - 30 - appicon.offsetHeight}px`;
                }
            }
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                // Ajustement à la grille
                let x = parseInt(appicon.style.left, 10);
                let y = parseInt(appicon.style.top, 10);
                let snappedX = Math.round(x / gridSize) * gridSize;
                let snappedY = Math.round(y / gridSize) * gridSize;
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
                appicon.style.left = `${snappedX}px`;
                appicon.style.top = `${snappedY}px`;
                appicon.style.zIndex = 'initial';
            }
            isDragging = false;
        });
        // Double-clic pour ouvrir une fenêtre
        appicon.addEventListener('dblclick', () => {
            const appName = appicon.id;
            console.log(appName);
            if (appName) {
                openAppWindow(appName);
            }
        });
        appicon.addEventListener('mouseenter', () => {
            appicon.style.backgroundColor = 'rgba(70, 119, 197, 0.54)';
        });
        appicon.addEventListener('mouseleave', () => {
            appicon.style.backgroundColor = 'transparent';
        });
    });
    // Création des fenêtres
    let startMenuApp = document.getElementsByClassName('menu-item');
    for (let i = 0; i < startMenuApp.length; i++) {
        let app = startMenuApp[i];
        app.addEventListener('click', () => {
            openAppWindow(app.id);
        });
    }
});
