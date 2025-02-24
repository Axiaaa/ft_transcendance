
import { openAppWindow } from './app-icon.js';

export let isAppOpen = false;
export function setIsAppOpen(value: boolean) {
	isAppOpen = value;
};

document.addEventListener('DOMContentLoaded', () => {

	let taskbar = document.getElementsByClassName('taskbar-side')[0] as HTMLElement;

	function createTaskbarIcon(Name:string) {
		let taskbarIcon = document.createElement('div');
		taskbarIcon.classList.add('taskbar-icons');
		taskbarIcon.appendChild(document.createElement('img'));
		taskbarIcon.children[0].classList.add('taskbar-icon-image');
		(taskbarIcon.children[0] as HTMLImageElement).src = `./img/${Name.replace('-app', '')}-icon.png`;
		taskbar.appendChild(taskbarIcon);
		taskbarIcon.addEventListener('mouseenter', () => {
			taskbarIcon.style.backgroundColor = 'rgba(137, 163, 206, 0.49)';
		});
		taskbarIcon.addEventListener('mouseleave', () => {
			if (isAppOpen === false)
				taskbarIcon.style.backgroundColor = 'transparent';
		});
		taskbarIcon.addEventListener('click', () => {
			if (isAppOpen) {
				isAppOpen = false;
				let appWindow = document.getElementById(Name + '-window');
				if (appWindow)
					appWindow.style.display = 'none';
				taskbarIcon.style.backgroundColor = 'transparent';
			}
			else 
			{
				openAppWindow(Name);
				isAppOpen = true;
				taskbarIcon.style.backgroundColor = 'rgba(137, 163, 206, 0.49)';
			}
			
		});
		return taskbarIcon;
	}
	let pongApp = createTaskbarIcon('pong-app');
	let settingsApp = createTaskbarIcon('settings-app');
	
});
