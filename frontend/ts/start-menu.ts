import { clearBrowserCache, removeApps, setFont } from "./system.js";
import { updateUser } from "./API.js";
import { openAppWindow } from "./app-icon.js";

export async function disconnectUser()
{
	const userId = sessionStorage.getItem('wxp_user_id');
	if (!userId)
	{
		console.log('No user token found, skipping disconnect...');
		return;
	}
	if (userId)
	{
		console.log('Disconnecting user...');
		try {
			await updateUser(userId, { is_online: false });
			sessionStorage.removeItem('wxp_token');
			sessionStorage.removeItem('wxp_user_id');
		} catch (error) {
			console.error('Error updating user status:', error);
		}
		setFont(0, 0);
		removeApps();
	}
}

document.addEventListener('DOMContentLoaded', () => {


	var	startButton = document.getElementById('start-button') as HTMLElement;
	var	startMenu = document.getElementById('start-menu') as HTMLElement;
	let	loginScreen = document.getElementsByClassName("login-screen")[0] as HTMLElement;


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
	startButton.addEventListener('mouseenter', (e: MouseEvent) =>
	{
		isHovered = true;
		base.style.display = 'none';
		hover.style.display = 'block';
		held.style.display = 'none';
		startButton.addEventListener('mousedown', (e: MouseEvent) => {
			isHeld = true;
			held.style.display = 'block';
			hover.style.display = 'none';
		});
		startButton.addEventListener('mouseup', (e: MouseEvent) => {
			isHeld = false;
			hover.style.display = 'block';
			held.style.display = 'none';
		});
	});
	startButton.addEventListener('mouseleave', (e: MouseEvent) => {
		isHovered = false;
		base.style.display = 'block';
		hover.style.display = 'none';
		held.style.display = 'none';
	});
	startButton.addEventListener('click', (e: MouseEvent) => {
		if (startMenu.style.display === 'none')
			startMenu.style.display = 'block';
		else
			startMenu.style.display = 'none';
	});

	let menuItems = document.getElementsByClassName('menu-item');
	console.log(menuItems.length);
	for (let i = 0; i < menuItems.length; i++)
	{
		let menuItem = menuItems[i] as HTMLElement;
		menuItem.addEventListener('mouseenter', (e: MouseEvent) => {
			console.log('hover');
			menuItem.style.backgroundColor = 'rgba(69, 141, 255, 0.21)';
		});
		menuItem.addEventListener('mouseleave', (e: MouseEvent) => {
			menuItem.style.backgroundColor = 'transparent';
		});
		menuItem.addEventListener('click', (e: MouseEvent) => {
			startMenu.style.display = 'none';
		});
		
	}
	{
		let shutdownButton = document.getElementById('startmenu-shutdown-button') as HTMLElement;
		shutdownButton.addEventListener('click', (e: MouseEvent) => {
			alert('Warning: System shutting down\n(It just does nothing, because... you know, it\'s a web app)');
		});
	}
	{
		let	logoffButton = document.getElementById('log-off-button') as HTMLElement;
	
		logoffButton.addEventListener('click', async (e: MouseEvent) => {
			const confirmLogoff = confirm("Are you sure you want to log off? All unsaved work may be lost.");
			if (!confirmLogoff) {
				return;
			}
			await disconnectUser();
			await clearBrowserCache();
			location.reload();
			loginScreen.style.display = 'block';
		});
	}
	{
		let startMenuTop = document.getElementsByClassName('start-menu-top')[0] as HTMLElement;
		startMenuTop.style.height = '60px';
		startMenuTop.style.width = '100%';
		startMenuTop.style.borderRadius = '10px 10px 0px 0px';
		startMenuTop.addEventListener('mouseenter', (e: MouseEvent) => {
			startMenuTop.style.backgroundColor = 'rgba(69, 141, 255, 0.45)';
		});
		startMenuTop.addEventListener('mouseleave', (e: MouseEvent) => {
			startMenuTop.style.backgroundColor = 'transparent';
		});
		startMenuTop.addEventListener('click', (e: MouseEvent) => {
			startMenu.style.display = 'none';
			openAppWindow('', "settings-app-window");
			let settingBackButton = document.getElementById('settings-app-back-button') as HTMLElement;
			settingBackButton.click();
			let userAccountButton = document.getElementById('settings-app-User Account-category') as HTMLElement;
			userAccountButton.click();
		});
	}
	{
		let startMenuUsername = document.getElementById('start-menu-username') as HTMLElement;
		startMenuUsername.style.width = '300px';
		startMenuUsername.style.height = '25px';
		startMenuUsername.style.whiteSpace = 'nowrap';
		startMenuUsername.style.overflow = 'hidden';
		startMenuUsername.style.textOverflow = 'ellipsis';

	}
});