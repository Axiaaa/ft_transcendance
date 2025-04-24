import { sendNotification } from "./notification.js";
import { getCurrentUser, getMatchDetails, getUserAvatar, getUserBackground, getUserMatchHistory, isAvatarUserExists, isBackgroundUserExists } from "./API.js";
import { disconnectUser } from "./start-menu.js";
import { initSocialApp, removeSocialApp } from "./social-app.js";


import { throttle } from "./utils.js";
import { initProfileApp } from "./profile-app.js";
import { send } from "process";

let userBackground = document.createElement('img');
userBackground.id = 'user-background';
userBackground.className = 'user-background';
document.body.appendChild(userBackground);
userBackground.src = './img/Desktop/linus-wallpaper.jpg';
userBackground.style.position = 'absolute';
userBackground.style.zIndex = '-1';
userBackground.style.width = '100%';
userBackground.style.height = '100%';
userBackground.style.objectFit = 'cover';
userBackground.style.objectPosition = 'center';
userBackground.style.top = '0';
userBackground.style.left = '0';
userBackground.style.display = 'block';

/**
 * Sets the background image on the body element
 * @param url The URL of the image to set as background
 */
export function setBodyBackgroundImage(url: string): void {
	document.body.style.backgroundImage = `url(${url})`;
}

export function setFont(inputSize: number, previousSize: number | 0) {
	console.log("Font size changed to: " + inputSize);
	let inputString = inputSize.toString();
	let applyButton = document.getElementById('font-size-apply-button') as HTMLButtonElement;
	if (applyButton.classList[0] && applyButton.classList[0].includes('font-size-applied-'))
		{
			previousSize = parseInt(applyButton.classList[0].replace('font-size-applied-', ''));
			applyButton.classList.remove('font-size-applied-' + previousSize);
		}
		applyButton.classList.add('font-size-applied-' + inputString);
		const allTextElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, div, button, input, label, a');
		allTextElements.forEach(element => {
			const currentSize = window.getComputedStyle(element).fontSize;
			const sizeNumber = parseInt(currentSize);
			if (!isNaN(sizeNumber)) {
				const newSize = sizeNumber + parseInt(inputString) - previousSize;
				(element as HTMLElement).style.fontSize = `${newSize}px`;
			}
		});
		if (parseInt(inputString) > 0)
			sendNotification('Font Size Changed', `Font size increased by ${inputString}px`, "./img/Utils/font-icon.png");
		else if (parseInt(inputString) < 0)
			sendNotification('Font Size Changed', `Font size decreased by ${inputString}px`, "./img/Utils/font-icon.png");
		else
			sendNotification('Font Size Changed', `Font size reset`, "./img/Utils/font-icon.png");
}

export async function clearBrowserCache() {
	try {
		// Clear cookies
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i];
			const eqPos = cookie.indexOf('=');
			const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
		}

		// Clear the browser cache using Cache API
		if (window.caches) {
			caches.keys().then(cacheNames => {
				cacheNames.forEach(cacheName => {
					caches.delete(cacheName);
				});
			});
		}

		// Clear session storage
		sessionStorage.clear();

		// Clear local storage
		localStorage.clear();

		// Clear IndexedDB
		if (window.indexedDB) {
			window.indexedDB.databases?.().then(dbs => {
				dbs.forEach(db => {
					if (db.name) indexedDB.deleteDatabase(db.name);
				});
			});
		}

		// Unregister service workers
		if (navigator.serviceWorker) {
			navigator.serviceWorker.getRegistrations().then(registrations => {
				for (const registration of registrations) {
					registration.unregister();
				}
			});
		}

		console.log('Browser cache cleared successfully');
	} catch (error) {
		console.error('Error clearing browser cache:', error);
	}
}

window.addEventListener('beforeunload', (event) => {
	const message = 'You will be disconnected if you reload or leave this page. Are you sure?';
	event.preventDefault();
	event.returnValue = message;
	return message;
});

window.addEventListener('unload', async () => {
	await disconnectUser();
	await clearBrowserCache();
});

document.addEventListener('DOMContentLoaded', async () => {


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
		let dx = (Math.floor(Math.random() * 9) + 1) / 10;
		if (Math.random() < 0.5) dx = -dx;

		let dy = (Math.floor(Math.random() * 9) + 1) / 10;
		if (Math.random() < 0.5) dy = -dy;
		console.log("SleepScreen X/Y direction" + dx + "/" + dy);
		let speed = Math.max(5, Math.sqrt(sleepScreen.clientWidth**2 + sleepScreen.clientHeight**2) * 0.007);
		console.log("Animation speed:", speed);
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
	const INACTIVE_TIMEOUT = 30000; // 30 seconds of inactivity

	function resetTimer() {
		clearTimeout(timeoutId);

		sleepScreen.style.opacity = '0';
		sleepScreen.style.display = 'none';
		sleepLogo.style.display = 'none';

		timeoutId = setTimeout(async () => {
			try {
				console.log('User is inactive');
				sendNotification('Inactivity Alert', 'You have been inactive for 30 seconds. The system will sleep soon.', './img/Utils/sleep-icon.png');
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
	document.addEventListener('mousemove', throttle(resetTimer));
	// Reset timer on mouse clicks
	document.addEventListener('click', resetTimer);
	// Reset timer on key press
	document.addEventListener('keypress', resetTimer);
	// Reset timer on scroll
	document.addEventListener('scroll', resetTimer);

	let pongAppwindows = document.getElementById('pong-app-window') as HTMLElement;
	let pongTimerInterval: NodeJS.Timeout | null = null;

	function handleTimerState() {
		if (pongTimerInterval) {
			clearInterval(pongTimerInterval);
			pongTimerInterval = null;
		}

		if (pongAppwindows.classList.contains('opened-window')) {
			resetTimer();
			pongTimerInterval = setInterval(() => {
				resetTimer();
				console.log('Timer reset - Pong window is open');
			}, 5000);
			console.log('Periodic timer reset activated - Pong window is open');
		} else {
			resetTimer();
			console.log('Timer activated - Pong window is closed');
		}
	}

	handleTimerState();

	const pongWindowObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
				console.log('Pong window class changed');
				handleTimerState();
			}
		});
	});
	pongWindowObserver.observe(pongAppwindows, { attributes: true });

	{
		let trashBinApp = document.getElementById('trash-bin-app') as HTMLElement;
		trashBinApp.addEventListener('dblclick', async (e: MouseEvent) => {
			sendNotification('Avast', 'La base virale VPS a ete mise a jour', './img/Utils/avast-icon.png');
		});
	}
});

export function initHistoryAPI() {

	const loginState = { page: 1 };
	history.pushState(loginState, '', '/login');
	history.replaceState(loginState, '', '/login');

	window.addEventListener('popstate', (event) => {
		if (event.state) {
			switch (event.state.page) {
				case 1:
					goToLoginPage(false);
					console.log('Navigated to login page');
					break;
				case 2:
					goToFormsPage(false);
					console.log('Navigated to forms page');
					break;
				case 3:
					goToDesktopPage(false);
					console.log('Navigated to desktop page');
					break;
				default:
					console.log('Unknown page');
			}
		}
	});
	goToPage();
	console.log('History API initialized');
}

function goToPage()
{
	{
		let goToLogin = document.getElementsByClassName('go-to-login') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < goToLogin.length; i++) {

			const gotologin = goToLogin[i];
			gotologin.addEventListener('click', () => {
				goToLoginPage(true);
			});
		}
	}
	{
		let goToForms = document.getElementsByClassName('go-to-forms') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < goToForms.length; i++) {
			const gotologin = goToForms[i];
			gotologin.addEventListener('click', () => {
				goToFormsPage(true);
			});
		}
	}
	{
		let goToDesktop = document.getElementsByClassName('go-to-desktop') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < goToDesktop.length; i++) {
			const gotologin = goToDesktop[i];
			gotologin.addEventListener('click', () => {
				goToDesktopPage(true);
			});
		}
	}
}

export function goToLoginPage(pushState: boolean = true)
{
	const loginState = { page: 1 };
	const loginScreen = document.getElementsByClassName('login-screen')[0] as HTMLElement;
	const forms = document.getElementsByClassName('login-screen-formulary')[0] as HTMLElement;
	const loginScreenBackButton = document.getElementById('login-screen-back-button') as HTMLButtonElement;
	if (pushState)
	{
		history.pushState(loginState, '', '/login');
	}
	history.replaceState(loginState, '', '/login');
	if (loginScreen)
		loginScreen.style.display = 'block';
	if (loginScreenBackButton)
		loginScreenBackButton.click();
	if (forms)
		forms.style.display = 'none';
	console.log('Navigated to login page');
}

export function goToDesktopPage(pushState: boolean = true)
{
	const desktopState = { page: 3 };
	const loginScreen = document.getElementsByClassName('login-screen')[0] as HTMLElement;
	const forms = document.getElementsByClassName('login-screen-formulary')[0] as HTMLElement;

	if (pushState)
	{
		history.pushState(desktopState, '', '/desktop');
	}
	history.replaceState(desktopState, '', '/desktop');
	if (loginScreen)
		loginScreen.style.display = 'none';
	if (forms)
		forms.style.display = 'none';
	console.log('Navigated to desktop page');
}

export function goToFormsPage(pushState: boolean = true)
{
	const formsState = { page: 2 };
	const loginScreen = document.getElementsByClassName('login-screen')[0] as HTMLElement;
	const forms = document.getElementsByClassName('login-screen-formulary')[0] as HTMLElement;

	if (pushState)
	{
		history.pushState(formsState, '', '/forms');
	}
	history.replaceState(formsState, '', '/forms');
	if (loginScreen)
		loginScreen.style.display = 'block';
	if (forms)
		forms.style.display = 'block';
	console.log('Navigated to forms page');
}

export async function updateUserImages(fileAvatar?: File, fileWallpaper?: File) {
	const userID = Number(sessionStorage.getItem("wxp_user_id"));
	if (userID == null)
		return;
	let avatarURL = "./img/Start_Menu/demo-user-profile-icon.jpg";
	let wallpaperURL = "./img/Desktop/linus-wallpaper.jpg";
	if (fileAvatar)
		avatarURL = URL.createObjectURL(fileAvatar);
	else
	{
		try {
			if (await isAvatarUserExists(userID))
				avatarURL = await getUserAvatar(userID);
			else
				avatarURL = "./img/Start_Menu/demo-user-profile-icon.jpg";
		}
		catch (error) {
			console.error("Error fetching avatar:", error);
			avatarURL = "./img/Start_Menu/demo-user-profile-icon.jpg";
		}
	}
	let userAvatars = document.getElementsByClassName("avatar-preview") as HTMLCollectionOf<HTMLImageElement>;
	if (avatarURL == null)
		avatarURL = "./img/Start_Menu/demo-user-profile-icon.jpg";
	console.log("userAvatars: " + userAvatars.length + " | " + "avatarURL" + avatarURL);

	for (let i = 0; i < userAvatars.length; i++) {
		console.log(userAvatars[i] + " now = " + avatarURL);
		userAvatars[i].src = avatarURL;
	}
	if (fileWallpaper)
		wallpaperURL = URL.createObjectURL(fileWallpaper);
	else
	{
		try {
			if (await isBackgroundUserExists(userID))
				wallpaperURL = await getUserBackground(userID);
			else
				wallpaperURL = "./img/Desktop/linus-wallpaper.jpg";
		}
		catch (error) {
			console.error("Error fetching wallpaper:", error);
			wallpaperURL = "./img/Desktop/linus-wallpaper.jpg";
		}
	}

	let userWallpapers = document.getElementsByClassName("user-background") as HTMLCollectionOf<HTMLImageElement>;
	console.log("userWallpapers: " + userWallpapers.length + " | " + "wallpaperURL" + wallpaperURL);
	userWallpapers[0].src = wallpaperURL;

	const addCacheBuster = (url: string): string => {
		const cacheBuster = `?t=${Date.now()}`;
		if (url.startsWith('blob:')) return url;

		if (url.includes('?')) {
			return `${url}&_=${Date.now()}`;
		}
		return `${url}${cacheBuster}`;
	};

	for (let i = 0; i < userAvatars.length; i++) {
		userAvatars[i].src = addCacheBuster(avatarURL);

		const currentSrc = userAvatars[i].src;
		userAvatars[i].src = "";
		setTimeout(() => { userAvatars[i].src = currentSrc; }, 10);
	}

	for (let i = 0; i < userWallpapers.length; i++) {
		userWallpapers[i].src = addCacheBuster(wallpaperURL);

		const currentSrc = userWallpapers[i].src;
		userWallpapers[i].src = "";
		setTimeout(() => { userWallpapers[i].src = currentSrc; }, 10);
	}
};

export async function resetUserImages()
{
	const userID = Number(sessionStorage.getItem("wxp_user_id"));
	if (userID == null)
		return;
	let avatarURL = "./img/Start_Menu/demo-user-profile-icon.jpg";
	let wallpaperURL = "./img/Desktop/linus-wallpaper.jpg";
	let userAvatars = document.getElementsByClassName("avatar-preview") as HTMLCollectionOf<HTMLImageElement>;
	for (let i = 0; i < userAvatars.length; i++) {
		userAvatars[i].src = avatarURL;
	}
	let userWallpapers = document.getElementsByClassName("user-background") as HTMLCollectionOf<HTMLImageElement>;
	userWallpapers[0].src = wallpaperURL;

	const addCacheBuster = (url: string): string => {
		const cacheBuster = `?t=${Date.now()}`;
		if (url.startsWith('blob:')) return url;

		if (url.includes('?')) {
			return `${url}&_=${Date.now()}`;
		}
		return `${url}${cacheBuster}`;
	}

	for (let i = 0; i < userAvatars.length; i++) {
		userAvatars[i].src = addCacheBuster(avatarURL);

		const currentSrc = userAvatars[i].src;
		userAvatars[i].src = "";
		setTimeout(() => { userAvatars[i].src = currentSrc; }, 10);
	}
	for (let i = 0; i < userWallpapers.length; i++) {
		userWallpapers[i].src = addCacheBuster(wallpaperURL);

		const currentSrc = userWallpapers[i].src;
		userWallpapers[i].src = "";
		setTimeout(() => { userWallpapers[i].src = currentSrc; }, 10);
	}
}

export async function updateAllUserNames()
{
	let currentUser = await getCurrentUser(sessionStorage.getItem("wxp_user_id"));
	if (currentUser == null)
		return;
	let userName = currentUser.username;
	let userNames = document.getElementsByClassName("user-name-text") as HTMLCollectionOf<HTMLSpanElement>;
	for (let i = 0; i < userNames.length; i++) {
		userNames[i].innerText = userName;
	}
}

export async function initApps()
{
	console.log("Initializing all apps...");
	await initSocialApp();
	await initProfileApp();
}

export async function removeApps()
{
	await removeSocialApp();
	console.log("Removing all apps...");
}
