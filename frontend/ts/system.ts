import { send } from "process";
import { sendNotification } from "./notification.js";
import { getCurrentUser, getUserAvatar, getUserBackground, getUserById, isAvatarUserExists, isBackgroundUserExists } from "./API.js";
import { getUser } from "./API.js";
import { createUser } from "./API.js";
import { create } from "domain";
import { get } from "http";
import { disconnectUser } from "./start-menu.js";



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

document.addEventListener('DOMContentLoaded', async () => {

	window.addEventListener('beforeunload', (event) => {
		event.preventDefault();
		disconnectUser();
		return 'You will be disconnected if you reload or leave this page. Are you sure ?';
	});

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
	const INACTIVE_TIMEOUT = 30000; // 10 seconds of inactivity

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
	document.addEventListener('mousemove', resetTimer);
	// Reset timer on mouse clicks
	document.addEventListener('click', resetTimer);
	// Reset timer on key press
	document.addEventListener('keypress', resetTimer);
	// Reset timer on scroll
	document.addEventListener('scroll', resetTimer);

	// Start the initial timer
	resetTimer();

	// SANDBOX AREA
	{
		// let CurrentUser = await getUserById(1);
		// if (!CurrentUser) {
		// 	CurrentUser = await createUser({username: 'Guest', password: 'guest', email: 'guest@guest.com'});
		// }
		let trashBinApp = document.getElementById('trash-bin-app') as HTMLElement;
		trashBinApp.addEventListener('dblclick', async (e: MouseEvent) => {
			try {
				
			const currentUserToken = sessionStorage.getItem('wxp_token');
			let currentUser = await getCurrentUser(currentUserToken);
			if (currentUser) {
					sendNotification('User Data', `User ID: ${currentUser.id}, Username: ${currentUser.username}, Email: ${currentUser.email}`, './img/Utils/API-icon.png');
					console.log("User ID: " + currentUser.id + " Username: " + currentUser.username);
					console.log("User Data:", currentUser);
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

export function initHistoryAPI() {
	// Initial state
	const loginState = { page: 1 };
	history.pushState(loginState, '', '/login');
	history.replaceState(loginState, '', '/login');
	
	// Handle back/forward navigation
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
}
