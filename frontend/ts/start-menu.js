import { clearBrowserCache, setFont } from "./system.js";
import { updateUser } from "./API.js";
import { openAppWindow } from "./app-icon.js";
export function disconnectUser() {
    let userToken = sessionStorage.getItem('wxp_token');
    if (!userToken) {
        console.log('No user token found, skipping disconnect...');
        return;
    }
    if (userToken) {
        console.log('Disconnecting user...');
        updateUser(userToken, { is_online: false })
            .then(() => {
            sessionStorage.removeItem('wxp_token');
            sessionStorage.removeItem('wxp_user_id');
        })
            .catch((error) => {
            console.error('Error updating user status:', error);
        });
        setFont(0, 0);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    var startButton = document.getElementById('start-button');
    var startMenu = document.getElementById('start-menu');
    let loginScreen = document.getElementsByClassName("login-screen")[0];
    startMenu.style.display = 'none';
    let base = document.createElement('img');
    base.src = './img/Taskbar/start-button-1.png';
    base.height = 35;
    let hover = document.createElement('img');
    hover.src = './img/Taskbar/start-button-2.png';
    hover.height = 35;
    let held = document.createElement('img');
    held.src = './img/Taskbar/start-button-3.png';
    held.height = 35;
    let isHeld = false;
    let isHovered = false;
    startButton.appendChild(hover);
    hover.style.display = 'none';
    startButton.appendChild(held);
    held.style.display = 'none';
    startButton.appendChild(base);
    base.style.display = 'block';
    startButton.addEventListener('mouseenter', (e) => {
        isHovered = true;
        base.style.display = 'none';
        hover.style.display = 'block';
        held.style.display = 'none';
        startButton.addEventListener('mousedown', (e) => {
            isHeld = true;
            held.style.display = 'block';
            hover.style.display = 'none';
        });
        startButton.addEventListener('mouseup', (e) => {
            isHeld = false;
            hover.style.display = 'block';
            held.style.display = 'none';
        });
    });
    startButton.addEventListener('mouseleave', (e) => {
        isHovered = false;
        base.style.display = 'block';
        hover.style.display = 'none';
        held.style.display = 'none';
    });
    startButton.addEventListener('click', (e) => {
        if (startMenu.style.display === 'none')
            startMenu.style.display = 'block';
        else
            startMenu.style.display = 'none';
    });
    let menuItems = document.getElementsByClassName('menu-item');
    console.log(menuItems.length);
    for (let i = 0; i < menuItems.length; i++) {
        let menuItem = menuItems[i];
        menuItem.addEventListener('mouseenter', (e) => {
            console.log('hover');
            menuItem.style.backgroundColor = 'rgba(69, 141, 255, 0.21)';
        });
        menuItem.addEventListener('mouseleave', (e) => {
            menuItem.style.backgroundColor = 'transparent';
        });
        menuItem.addEventListener('click', (e) => {
            startMenu.style.display = 'none';
        });
    }
    {
        let shutdownButton = document.getElementById('startmenu-shutdown-button');
        shutdownButton.addEventListener('click', (e) => {
            alert('Warning: System shutting down\n(It just reloads the page, because... you know, it\'s a web app)');
            disconnectUser();
            clearBrowserCache();
            window.location.reload();
        });
    }
    {
        let logoffButton = document.getElementById('log-off-button');
        logoffButton.addEventListener('click', (e) => {
            disconnectUser();
            clearBrowserCache();
            loginScreen.style.display = 'block';
        });
    }
    {
        let startMenuTop = document.getElementsByClassName('start-menu-top')[0];
        startMenuTop.style.height = '60px';
        startMenuTop.style.width = '100%';
        startMenuTop.style.borderRadius = '10px 10px 0px 0px';
        startMenuTop.addEventListener('mouseenter', (e) => {
            startMenuTop.style.backgroundColor = 'rgba(69, 141, 255, 0.45)';
        });
        startMenuTop.addEventListener('mouseleave', (e) => {
            startMenuTop.style.backgroundColor = 'transparent';
        });
        startMenuTop.addEventListener('click', (e) => {
            startMenu.style.display = 'none';
            openAppWindow('', "settings-app-window");
            let settingBackButton = document.getElementById('settings-app-back-button');
            settingBackButton.click();
            let userAccountButton = document.getElementById('settings-app-User Account-category');
            userAccountButton.click();
        });
    }
    {
        let startMenuUsername = document.getElementById('start-menu-username');
        startMenuUsername.style.width = '300px';
        startMenuUsername.style.height = '25px';
        startMenuUsername.style.whiteSpace = 'nowrap';
        startMenuUsername.style.overflow = 'hidden';
        startMenuUsername.style.textOverflow = 'ellipsis';
    }
});
