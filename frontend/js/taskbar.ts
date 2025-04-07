
import { openAppWindow } from './app-icon.js';
import { sendNotification } from './notification.js';

export let isAppOpen = false;
export function setIsAppOpen(value: boolean) {
	isAppOpen = value;
};


document.addEventListener('DOMContentLoaded', () => {

	let taskbar = document.getElementById('taskbar')as HTMLElement;
	let taskbarMiddle = taskbar.children[1] as HTMLElement;

	function createTaskbarIcon(Name:string) {
		let taskbarIcon = document.createElement('div');
		taskbarIcon.classList.add('taskbar-icons');
		taskbarIcon.appendChild(document.createElement('img'));
		taskbarIcon.children[0].classList.add('taskbar-icon-image');
		(taskbarIcon.children[0] as HTMLImageElement).src = `./img/${Name.replace('-app', '')}-icon.png`;
		taskbarMiddle.appendChild(taskbarIcon);
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
	
	let rightSide = document.createElement('div');
	rightSide.classList.add('taskbar-right-side');
	rightSide.style.position = 'absolute';
	rightSide.style.right = '0px';
	rightSide.style.width = '150px';
	rightSide.style.height = '100%';
	rightSide.style.border = '1px solid rgba(0, 0, 0, 0.58)';
	rightSide.style.borderLeft = '2px solid rgba(0, 0, 0, 0.82)';
	rightSide.style.borderRight = 'none';
	rightSide.style.background = 'linear-gradient(45deg, rgb(30, 170, 240) 0%, rgb(11, 151, 221) 35%, rgb(11, 151, 221) 65%, rgb(30, 170, 240) 100%)';
	taskbar.appendChild(rightSide);
	let taskbarClock = document.createElement('div');
	taskbarClock.classList.add('taskbar-clock');
	rightSide.appendChild(taskbarClock);
	taskbarClock.style.position = 'absolute';
	taskbarClock.style.right = '5%';
	taskbarClock.style.width = '40%';
	taskbarClock.style.height = '50px';
	taskbarClock.style.color = 'white';
	taskbarClock.style.fontSize = '15px';
	taskbarClock.style.textAlign = 'center';
	taskbarClock.style.lineHeight = '34px';
	taskbarClock.style.fontWeight = 'bold';
	taskbarClock.style.fontFamily = 'DotGothic16';
	taskbarClock.style.textShadow  = '1px 0.5px rgba(0, 0, 0, 0.3)'
	// taskbarClock.style.backgroundColor = 'rgba(88, 255, 88, 0.76)';
	
	taskbarClock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	setInterval(() => {
		taskbarClock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}, 1000);
	let accessibilityIcon = document.createElement('div');
	accessibilityIcon.id = 'accessibility-icon';
	rightSide.appendChild(accessibilityIcon);
	accessibilityIcon.style.position = 'absolute';
	accessibilityIcon.style.left = '0px';
	accessibilityIcon.style.width = '60%';
	accessibilityIcon.style.height = '100%';
	accessibilityIcon.style.display = 'flex';
	accessibilityIcon.style.flexDirection = 'row';
	accessibilityIcon.style.justifyContent = 'left';
	accessibilityIcon.style.alignItems = 'center';
	accessibilityIcon.style.gap = '0px';

	function createAccessibilityIcon(name: string, imgsrc: string): HTMLDivElement {
		let aIcon = document.createElement('img');
		accessibilityIcon.appendChild(aIcon);
		aIcon.src = imgsrc;
		aIcon.style.userSelect = 'none';
		aIcon.draggable = false;
		aIcon.id = name;
		aIcon.style.width = '20px';
		aIcon.style.height = 'auto';
		aIcon.style.position = 'relative';
		aIcon.style.margin = '0 2px';
		aIcon.style.left = '10px';
		aIcon.style.transition = 'transform 0.2s ease';
		aIcon.addEventListener('mouseenter', () => {
			aIcon.style.filter = 'brightness(1.5)';
		});
		aIcon.addEventListener('mouseleave', () => {
			aIcon.style.filter = 'brightness(1)';
		});
		return aIcon;
	};
	let warningIcon = createAccessibilityIcon('warning-icon', './img/Taskbar/taskbar-warning-icon.png');
	let clippyIcon = createAccessibilityIcon('clippy-icon', './img/Taskbar/clippy-icon.png');
	let soundIcon = createAccessibilityIcon('sound-icon', './img/Taskbar/sound-icon.png');
	warningIcon.addEventListener('click', () => {
		sendNotification('Warning', 'This is a warning message', './img/Taskbar/taskbar-warning-icon.png');
	});
});
