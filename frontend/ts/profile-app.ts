import { openAppWindow } from "./app-icon.js";

function openProfile(AppLauncher: string, profileTab?: string): void
{
	let AppId = 'profile-app-window';
	openAppWindow("", AppId);
	let appTaskbarIcon = document.getElementById('profile-app-taskbar-icon') as HTMLElement;
	if (appTaskbarIcon)
	{
		appTaskbarIcon.style.display = 'flex';
		appTaskbarIcon.style.backgroundColor = 'rgba(137, 163, 206, 0.49)';
	}
}

document.addEventListener('DOMContentLoaded', () => {

	let App = document.getElementById('profile-app-window') as HTMLElement;
	if (!App) return;
	let AppContent = App.children[1] as HTMLElement;
	if (!AppContent) return;
	let AppLauncherMain = document.getElementById('start-menu-profile-main') as HTMLElement;
	if (AppLauncherMain)
	{
		AppLauncherMain.addEventListener('click', () => {
			openProfile('start-menu-profile-main', 'main');
		});
	}
	let AppLauncherTournaments = document.getElementById('start-menu-profile-my-tournaments') as HTMLElement;
	if (AppLauncherTournaments)
	{
		AppLauncherTournaments.addEventListener('click', () => {
			openProfile('start-menu-profile-my-tournaments', 'tournaments');
		});
	}
	let AppLauncherStats = document.getElementById('start-menu-profile-my-stats') as HTMLElement;
	if (AppLauncherStats)
	{
		AppLauncherStats.addEventListener('click', () => {
			openProfile('start-menu-profile-my-stats', 'stats');
		});
	}


	// App Content
	let AppContentMain = document.createElement('div');
	AppContentMain.id = 'profile-app-content-main';
	AppContentMain.style.display = 'none';
	AppContent.appendChild(AppContentMain);``
});