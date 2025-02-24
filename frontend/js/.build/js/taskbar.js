import { openAppWindow } from './app-icon.js';
export var isAppOpen = false;
export function setIsAppOpen(value) {
    isAppOpen = value;
}
;
document.addEventListener('DOMContentLoaded', function () {
    var taskbar = document.getElementsByClassName('taskbar-side')[0];
    function createTaskbarIcon(Name) {
        var taskbarIcon = document.createElement('div');
        taskbarIcon.classList.add('taskbar-icons');
        taskbarIcon.appendChild(document.createElement('img'));
        taskbarIcon.children[0].classList.add('taskbar-icon-image');
        taskbarIcon.children[0].src = "./img/".concat(Name.replace('-app', ''), "-icon.png");
        taskbar.appendChild(taskbarIcon);
        taskbarIcon.addEventListener('mouseenter', function () {
            taskbarIcon.style.backgroundColor = 'rgba(137, 164, 206, 0.73)';
        });
        taskbarIcon.addEventListener('mouseleave', function () {
            if (isAppOpen === false)
                taskbarIcon.style.backgroundColor = 'transparent';
        });
        taskbarIcon.addEventListener('click', function () {
            if (isAppOpen) {
                isAppOpen = false;
                var appWindow = document.getElementById(Name + '-window');
                if (appWindow)
                    appWindow.style.display = 'none';
                taskbarIcon.style.backgroundColor = 'transparent';
            }
            else {
                openAppWindow(Name);
                isAppOpen = true;
                taskbarIcon.style.backgroundColor = 'rgba(137, 163, 206, 0.49)';
            }
        });
        return taskbarIcon;
    }
    var pongApp = createTaskbarIcon('pong-app');
    var settingsApp = createTaskbarIcon('settings-app');
});
