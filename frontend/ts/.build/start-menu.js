import { updateUser } from "./API.js";
import { openAppWindow } from "./app-icon.js";
export function disconnectUser() {
    var userToken = sessionStorage.getItem('wxp_token');
    if (!userToken) {
        console.log('No user token found, skipping disconnect...');
        return;
    }
    if (userToken) {
        console.log('Disconnecting user...');
        updateUser(userToken, { is_online: false })
            .then(function () {
            sessionStorage.removeItem('wxp_token');
            sessionStorage.removeItem('wxp_user_id');
        })
            .catch(function (error) {
            console.error('Error updating user status:', error);
        });
    }
}
document.addEventListener('DOMContentLoaded', function () {
    var startButton = document.getElementById('start-button');
    var startMenu = document.getElementById('start-menu');
    var loginScreen = document.getElementsByClassName("login-screen")[0];
    startMenu.style.display = 'none';
    var base = document.createElement('img');
    base.src = './img/Taskbar/start-button-1.png';
    base.height = 35;
    var hover = document.createElement('img');
    hover.src = './img/Taskbar/start-button-2.png';
    hover.height = 35;
    var held = document.createElement('img');
    held.src = './img/Taskbar/start-button-3.png';
    held.height = 35;
    var isHeld = false;
    var isHovered = false;
    startButton.appendChild(hover);
    hover.style.display = 'none';
    startButton.appendChild(held);
    held.style.display = 'none';
    startButton.appendChild(base);
    base.style.display = 'block';
    startButton.addEventListener('mouseenter', function (e) {
        isHovered = true;
        base.style.display = 'none';
        hover.style.display = 'block';
        held.style.display = 'none';
        startButton.addEventListener('mousedown', function (e) {
            isHeld = true;
            held.style.display = 'block';
            hover.style.display = 'none';
        });
        startButton.addEventListener('mouseup', function (e) {
            isHeld = false;
            hover.style.display = 'block';
            held.style.display = 'none';
        });
    });
    startButton.addEventListener('mouseleave', function (e) {
        isHovered = false;
        base.style.display = 'block';
        hover.style.display = 'none';
        held.style.display = 'none';
    });
    startButton.addEventListener('click', function (e) {
        if (startMenu.style.display === 'none')
            startMenu.style.display = 'block';
        else
            startMenu.style.display = 'none';
    });
    var menuItems = document.getElementsByClassName('menu-item');
    console.log(menuItems.length);
    var _loop_1 = function (i) {
        var menuItem = menuItems[i];
        menuItem.addEventListener('mouseenter', function (e) {
            console.log('hover');
            menuItem.style.backgroundColor = 'rgba(69, 141, 255, 0.21)';
        });
        menuItem.addEventListener('mouseleave', function (e) {
            menuItem.style.backgroundColor = 'transparent';
        });
        menuItem.addEventListener('click', function (e) {
            startMenu.style.display = 'none';
        });
    };
    for (var i = 0; i < menuItems.length; i++) {
        _loop_1(i);
    }
    {
        var shutdownButton = document.getElementById('startmenu-shutdown-button');
        shutdownButton.addEventListener('click', function (e) {
            alert('Warning: System shutting down\n(It just reloads the page, because... you know, it\'s a web app)');
            disconnectUser();
            window.location.reload();
        });
    }
    {
        var logoffButton = document.getElementById('log-off-button');
        logoffButton.addEventListener('click', function (e) {
            disconnectUser();
            loginScreen.style.display = 'block';
        });
    }
    {
        var startMenuTop_1 = document.getElementsByClassName('start-menu-top')[0];
        startMenuTop_1.style.height = '60px';
        startMenuTop_1.style.width = '100%';
        startMenuTop_1.addEventListener('mouseenter', function (e) {
            startMenuTop_1.style.backgroundColor = 'rgba(69, 141, 255, 0.31)';
        });
        startMenuTop_1.addEventListener('mouseleave', function (e) {
            startMenuTop_1.style.backgroundColor = 'transparent';
        });
        startMenuTop_1.addEventListener('click', function (e) {
            startMenu.style.display = 'none';
            openAppWindow('', "settings-app-window");
            var settingBackButton = document.getElementById('settings-app-back-button');
            settingBackButton.click();
            var userAccountButton = document.getElementById('settings-app-User Account-category');
            userAccountButton.click();
        });
    }
});
