import { openAppWindow } from "./app-icon.js";
function openProfile(AppLauncher, profileTab) {
    var AppId = 'profile-app-window';
    openAppWindow("", AppId);
    var appTaskbarIcon = document.getElementById('profile-app-taskbar-icon');
    if (appTaskbarIcon) {
        appTaskbarIcon.style.display = 'flex';
        appTaskbarIcon.style.backgroundColor = 'rgba(137, 163, 206, 0.49)';
    }
}
document.addEventListener('DOMContentLoaded', function () {
    var App = document.getElementById('profile-app-window');
    if (!App)
        return;
    var AppContent = App.children[1];
    if (!AppContent)
        return;
    var AppLauncherMain = document.getElementById('start-menu-profile-main');
    if (AppLauncherMain) {
        AppLauncherMain.addEventListener('click', function () {
            openProfile('start-menu-profile-main', 'main');
        });
    }
    var AppLauncherTournaments = document.getElementById('start-menu-profile-my-tournaments');
    if (AppLauncherTournaments) {
        AppLauncherTournaments.addEventListener('click', function () {
            openProfile('start-menu-profile-my-tournaments', 'tournaments');
        });
    }
    var AppLauncherStats = document.getElementById('start-menu-profile-my-stats');
    if (AppLauncherStats) {
        AppLauncherStats.addEventListener('click', function () {
            openProfile('start-menu-profile-my-stats', 'stats');
        });
    }
    // App Content
    var AppContentMain = document.createElement('div');
    AppContentMain.id = 'profile-app-content-main';
    AppContentMain.style.display = 'none';
    AppContent.appendChild(AppContentMain);
    "";
});
