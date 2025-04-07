"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var startButton = document.getElementById('start-button');
    var startMenu = document.getElementById('start-menu');
    var loginScreen = document.getElementsByClassName("login-screen")[0];
    var logoffButton = document.getElementById('log-off-button');
    logoffButton.addEventListener('click', function (e) {
        loginScreen.style.display = 'block';
    });
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
            window.location.reload();
        });
    }
});
