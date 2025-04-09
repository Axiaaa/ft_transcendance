import { send } from "process";
import { sendNotification } from "./notification.js";
import { getCurrentUser, updateUser } from "./API.js";
import { getUser } from "./API.js";
import { createUser } from "./API.js";
import { create } from "domain";
import { get } from "http";

document.addEventListener('DOMContentLoaded', async () => {

	// window.addEventListener('beforeunload', (event) => {
	// 	event.preventDefault();
	// 	return 'Your data will be lost if you reload or leave this page. Are you sure ?';
	// });

	let sleepScreen = document.createElement('div');
	document.body.appendChild(sleepScreen);
	sleepScreen.id = 'sleep-screen';
	sleepScreen.style.position = 'absolute';
	sleepScreen.style.left = '0';
	sleepScreen.style.top = '0';
	sleepScreen.style.width = '100%';
	sleepScreen.style.height = '100%';
	sleepScreen.style.backgroundColor = 'rgb(0, 0, 0)';
	sleepScreen.style.zIndex = '1000';
	sleepScreen.style.justifyContent = 'center';
	sleepScreen.style.alignItems = 'center';
	sleepScreen.style.transition = 'opacity 1s ease-in, opacity 0.5s ease-out';

	// sleepScreen.style.opacity = '1';
	// sleepScreen.style.display = 'block';

	let sleepLogo = document.createElement('img');
	sleepScreen.appendChild(sleepLogo);
	sleepLogo.src = './img/Utils/windows-xp-logo.png';
	sleepLogo.style.width = '100px';
	sleepLogo.style.height = '100px';
	sleepLogo.style.position = 'absolute';
	sleepLogo.style.padding = '0 10px';
	
	function animateLogo(Logo: HTMLElement)
	{
		if (!Logo) return
		if (!sleepScreen) return
		if (sleepScreen.style.display === 'none' || sleepScreen.style.opacity === '0') return
		console.log("sleepcreen.display:", sleepScreen.style.display, "sleepcreen.opacity:", sleepScreen.style.opacity);
		let screenBorderTop = 0;
		let screenBorderBottom = sleepScreen.clientHeight - (Logo.clientHeight);
		let screenBorderLeft = 0;
		let screenBorderRight = sleepScreen.clientWidth - (Logo.clientWidth);
		console.log("Screen borders - Bottom:", screenBorderBottom, "Right:", screenBorderRight);
		console.log("Screen dimensions - Height:", sleepScreen.clientHeight, "Width:", sleepScreen.clientWidth);
		console.log("Logo dimensions - Height:", Logo.clientHeight, "Width:", Logo.clientWidth);
		let x = screenBorderLeft;
		let y = screenBorderTop;
		let dx = Math.round((Math.random() * 2 - 1) * 10) / 10;
		let dy = Math.round((Math.random() * 2 - 1) * 10) / 10;
		console.log("SleepScreen X/Y direction" + dx + "/" + dy);
		let speed = 5;
		let interval = 50;
		let animation = setInterval(() => {
			Logo.style.left = x + 'px';
			Logo.style.top = y + 'px';
			x += dx * speed;
			y += dy * speed;
			if (x > screenBorderRight || x < screenBorderLeft)
				dx *= -1;
			if (y > screenBorderBottom || y < screenBorderTop)
				dy *= -1;
		}, interval);
	}
	
	animateLogo(sleepLogo);


	let timeoutId: NodeJS.Timeout;
	const INACTIVE_TIMEOUT = 10000; // 10 seconds of inactivity

	function resetTimer() {
		// Clear any existing timeout
		clearTimeout(timeoutId);
		
		// Reset screen state immediately
		sleepScreen.style.opacity = '0';
		sleepScreen.style.display = 'none';
		sleepLogo.style.display = 'none';
		
		// Set new timeout
		timeoutId = setTimeout(async () => {
			try {
				console.log('User is inactive');
				sendNotification('Inactivity Alert', 'You have been inactive for 10 seconds. The system will sleep soon.', './img/Utils/sleep-icon.png');
				sleepScreen.style.display = 'block';
				await new Promise(resolve => setTimeout(resolve, 200));
				if (sleepScreen.style.display === 'none') return;
				console.log('Inactive Warning');
				sleepScreen.style.opacity = '0.5';
				await new Promise(resolve => setTimeout(resolve, 5000));
				if (sleepScreen.style.display === 'none') return;
				console.log('Inactive Blackout');
				sleepScreen.style.opacity = '1';
				sleepLogo.style.display = 'block';
			} catch (error) {
				console.error('Error in inactivity timer:', error);
			}
		}, INACTIVE_TIMEOUT);
	}

	// Reset timer on mouse movement
	document.addEventListener('mousemove', resetTimer);
	// Reset timer on mouse clicks
	document.addEventListener('mousedown', resetTimer);
	// Reset timer on key press
	document.addEventListener('keypress', resetTimer);
	// Reset timer on scroll
	document.addEventListener('scroll', resetTimer);

	// Start the initial timer
	resetTimer();

	// SANDBOX AREA
	{
		let CurrentUser = await getUser(1);
		if (!CurrentUser) {
			CurrentUser = await createUser({username: 'Guest', password: 'guest', email: 'guest@guest.com'});
		}
		let trashBinApp = document.getElementById('trash-bin-app') as HTMLElement;
		trashBinApp.addEventListener('dblclick', async (e: MouseEvent) => {
			try {
				
			let user1 = await getUser(1);
			if (user1) {
					sendNotification('User Data', `User ID: ${user1.id}, Username: ${user1.username}, Email: ${user1.email}`, './img/Utils/API-icon.png');
					console.log("User ID: " + user1.id + " Username: " + user1.username);
					console.log("User Data:", user1);
			}
			}
			catch (error) {
				console.error('Error fetching user:', error);
				const errorMessage = error instanceof Error ? error.message : String(error);
				if (typeof sendNotification === 'function') {
					sendNotification('Session Error', `Failed to get user: ${errorMessage}`, './img/Utils/API-icon.png');
				}
			}
		});
	}
});

function initHistoryAPI() {
	// Initial state
	const initialState = { page: 'desktop' };
	history.replaceState(initialState, '', '/');
	
	// Handle back/forward navigation
	window.addEventListener('popstate', (event) => {
		if (event.state) {
			//TEST;
		}
	});
	
	console.log('History API initialized');
}


initHistoryAPI();