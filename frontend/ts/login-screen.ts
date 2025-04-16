import { getCurrentUser, getUserAvatar, getUserBackground, updateUser } from "./API.js";
import { Cookies, getCookie, setCookie } from 'typescript-cookie'
import { getUser } from "./API.js";
import { createUser } from "./API.js";
import { initHistoryAPI } from "./system.js";
import { goToDesktopPage } from "./system.js";
import { goToFormsPage } from "./system.js";
import { goToLoginPage } from "./system.js";
import { sign } from "crypto";
import { Session } from "inspector/promises";

let	titleScreenBackground = document.createElement('div');
titleScreenBackground.id = 'title-screen-background';
document.body.appendChild(titleScreenBackground);
titleScreenBackground.style.width = '100%';
titleScreenBackground.style.height = '100%';
titleScreenBackground.style.position = 'absolute';
titleScreenBackground.style.zIndex = '9999';
titleScreenBackground.style.display = 'block';
titleScreenBackground.style.top = '0';
titleScreenBackground.style.left = '0';
titleScreenBackground.style.backgroundColor = 'black';
titleScreenBackground.style.overflow = 'hidden';
titleScreenBackground.style.transition = 'all 0.75s ease-in-out';

let	titleScreen = document.createElement('img');
titleScreen.id = 'title-screen';
titleScreenBackground.appendChild(titleScreen);
titleScreen.src = './img/Login_Screen/WindowsXPong_TitleScreen.gif';
titleScreen.style.width = '100%';
titleScreen.style.height = 'auto';
titleScreen.style.maxWidth = '1280px';
titleScreen.style.maxHeight = '720px';
titleScreen.style.margin = 'auto';
titleScreen.style.position = 'absolute';
titleScreen.style.zIndex = '9999';
titleScreen.style.display = 'block';
titleScreen.style.top = '50%';
titleScreen.style.transform = 'translateY(-50%)';
titleScreen.style.left = '50%';
titleScreen.style.transform = 'translate(-50%, -50%)';

titleScreen.addEventListener('click', () => {
	titleScreenBackground.style.opacity = '0';
	titleScreen.style.opacity = '0';
	setTimeout(() => {
		titleScreenBackground.style.display = 'none';
		titleScreenBackground.remove();
	}
	, 750);
});

setTimeout(() => {
	titleScreenBackground.style.opacity = '0';
	setTimeout(() => {
		titleScreenBackground.style.display = 'none';
		titleScreenBackground.remove();
	}
	, 750);
}, 4000);


initHistoryAPI();

document.addEventListener('DOMContentLoaded', () => {
	
	let loginScreen = document.getElementsByClassName("login-screen")[0] as HTMLElement;
	// Visual Effect Addons
		let loginScreenMiddleBar = document.createElement('div');
		loginScreenMiddleBar.className = 'login-screen-middle-bar';
		const style = document.createElement('style');
		style.textContent = `
			.login-screen-middle-bar {
				position: absolute;
				background: linear-gradient(180deg, transparent 0%, rgb(187, 187, 187) 50%, transparent 100%);
				width: 2px;
				height: 80%;
				z-index: 1000;
				left: 50%;
				top: 10%;
			}
		`;
		document.head.appendChild(style);
	
		let loginScreenTopBar = document.createElement('div');
		loginScreenTopBar.className = 'login-screen-top-bar';
		const topBarStyle = document.createElement('style');
		topBarStyle.textContent = `
			.login-screen-top-bar {
				position: absolute;
				background: linear-gradient(90deg, transparent 0%, rgb(231, 231, 231) 50%, transparent 100%);
				height: 4px;
				width: 80%;
				z-index: 1000;
				left: 5%;
				top: 10%;
			}
		`;
		document.head.appendChild(topBarStyle);

	loginScreen.appendChild(loginScreenTopBar);
	loginScreen.appendChild(loginScreenMiddleBar);


	// DEFAULTS DISPLAY SETTINGS
	loginScreen.style.display = 'block';

	let profiles = document.getElementsByClassName("login-screen-right-profile-box") as HTMLCollectionOf<HTMLElement>;
	let NewProfile = document.getElementById("new-profile") as HTMLElement;
	
	for (let i = 0; i < profiles.length; i++) {
		let profile = profiles[i];
		let isClicked = false;
		let isHovered = false;
		profile.addEventListener('mousedown', () => {
			isClicked = true;
			if (isHovered)
				profile.style.backgroundColor = 'rgba(41, 74, 127, 0.75)';
			else
				profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
			profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
			profile.style.backgroundColor = 'transparent';
		});
		profile.addEventListener('click', () => {
			if (profile.id !== 'new-profile')
				loginScreen.style.display = 'none';
		});
		profile.addEventListener('mouseup', () => {
			isClicked = false;
			if (isHovered)
				profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
			else
				profile.style.backgroundColor = 'transparent';
		});
		profile.addEventListener('mouseenter', () => {
			isHovered = true;
			if (isClicked)
				profile.style.backgroundColor = 'rgba(41, 74, 127, 0.75)';
			else
				profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
		});
		profile.addEventListener('mouseleave', () => {
			isHovered = false;
			profile.style.backgroundColor = 'transparent';
		});
	}

	let form = document.getElementsByClassName("login-screen-formulary")[0] as HTMLFormElement;
	form.style.display = 'none';

	let backbutton = document.createElement('img');
	backbutton.id = 'login-screen-back-button';
	backbutton.className = 'go-to-login';
	backbutton.src = './img/Utils/back-icon.png';
	backbutton.style.width = '35px';
	backbutton.style.height = '35px';
	backbutton.style.position = 'absolute';
	backbutton.style.left = '5%';
	backbutton.style.top = 'calc(50% - 100px)';
	backbutton.style.bottom = '10px';
	backbutton.style.cursor = 'pointer';
	backbutton.style.overflow = 'hidden';
	form.appendChild(backbutton);

	backbutton.addEventListener('click', () => {
		const existingErrorBox = document.querySelector('.error-box');
		if (existingErrorBox) {
			existingErrorBox.remove();
		}
		goToLoginPage();
		form.style.display = 'none';
		for (let i = 0; i < profiles.length; i++) {
			profiles[i].style.display = 'block';
		}
	});

	backbutton.addEventListener('mouseenter', () => {
		backbutton.style.filter = 'brightness(1.2)';
	});
	backbutton.addEventListener('mouseleave', () => {
		backbutton.style.filter = 'brightness(1)';
	});

	NewProfile.addEventListener('click', () => {
		for (let i = 0; i < profiles.length; i++) {
			profiles[i].style.display = 'none';
		}
		form.style.display = 'block';
	});
	

});

export async function updateUserImages(fileAvatar?: File, fileWallpaper?: File) {
	const userID = Number(sessionStorage.getItem("wxp_user_id"));
	if (userID == null)
		return;
	let avatarURL = null;
	let wallpaperURL = null;
	if (fileAvatar)
		avatarURL = URL.createObjectURL(fileAvatar);
	else
		 avatarURL = await getUserAvatar(userID);
	let userAvatars = document.getElementsByClassName("avatar-preview") as HTMLCollectionOf<HTMLImageElement>;
	
	console.log("userAvatars: " + userAvatars.length + " | " + "avatarURL" + avatarURL);
	if (avatarURL == null || avatarURL == undefined)
		avatarURL = "./img/Start_Menu/demo-user-profile-icon.jpg";
	for (let i = 0; i < userAvatars.length; i++) {
		console.log(userAvatars[i] + " now = " + avatarURL);
		userAvatars[i].src = avatarURL;
	}
	if (fileWallpaper)
		wallpaperURL = URL.createObjectURL(fileWallpaper);
	else
		wallpaperURL = await getUserBackground(userID);
	if (wallpaperURL == null || wallpaperURL == undefined)
		wallpaperURL = "./img/Desktop/linus-wallpaper.jpg";
	let userWallpapers = document.getElementsByClassName("user-background") as HTMLCollectionOf<HTMLImageElement>;
	console.log("userWallpapers: " + userWallpapers.length + " | " + "wallpaperURL" + wallpaperURL);
	userWallpapers[0].src = wallpaperURL;
};

// SANDBOX AREA

export async function showError(message: string) {
	const errorBox = document.createElement('div');
	errorBox.className = 'error-box';
	errorBox.textContent = message;
	errorBox.style.position = 'fixed';
	errorBox.style.top = '10px';
	errorBox.style.left = '50%';
	errorBox.style.transform = 'translateX(-50%)';
	errorBox.style.backgroundColor = 'red';
	errorBox.style.color = 'white';
	errorBox.style.padding = '10px 20px';
	errorBox.style.borderRadius = '5px';
	errorBox.style.zIndex = '1000';
	errorBox.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
	errorBox.style.fontSize = '14px';
	errorBox.style.fontWeight = 'bold';

	const existingErrorBox = document.querySelector('.error-box');
	if (existingErrorBox) {
		existingErrorBox.remove();
	}

	document.body.appendChild(errorBox);
}

{
	let signUpForm = document.getElementById("sign-up-form") as HTMLFormElement;
	let signUpButton = document.getElementById("sign-up-button") as HTMLButtonElement;
	let signUpUsername = document.getElementById("sign-up-username") as HTMLInputElement;
	let signUpConfirmPassword = document.getElementById("sign-up-confirm-password") as HTMLInputElement;
	let signUpPassword = document.getElementById("sign-up-password") as HTMLInputElement;
	if (signUpButton) {
		signUpButton.addEventListener("click", async (event) => {
			event.preventDefault();
			if (signUpUsername && signUpPassword) {
				const username = signUpUsername.value;
				const password = signUpPassword.value;
				const confirmPassword = signUpConfirmPassword.value;

				if (username && password) {
					if (password == confirmPassword)
					{
						if (password.length >= 8)
						{
							if (/[A-Z]/.test(password))
							{
								if (/[a-z]/.test(password))
								{
									if (/[0-9]/.test(password))
									{
										try
										{
											const existingErrorBox = document.querySelector('.error-box');
											if (existingErrorBox) {
												existingErrorBox.remove();
											}
											const newUser = await createUser({ username, password });
											sessionStorage.setItem("wxp_token", newUser.token);
											sessionStorage.setItem("wxp_user_id", newUser.id != null ? newUser.id.toString() : "");
											goToDesktopPage();
											signUpUsername.value = "";
											signUpPassword.value = "";
											signUpConfirmPassword.value = "";
											updateUserImages();
										}
										catch (error)
										{
											const existingErrorBox = document.querySelector('.error-box');
											if (existingErrorBox) {
												existingErrorBox.remove();
											}
											showError("User already exists.");
											signUpUsername.value = "";
											signUpPassword.value = "";
											signUpConfirmPassword.value = "";
										}
									}
									else {
										const existingErrorBox = document.querySelector('.error-box');
										if (existingErrorBox) {
											existingErrorBox.remove();
										}
										showError("Password must contain at least one number.");
										signUpUsername.value = "";
										signUpPassword.value = "";
										signUpConfirmPassword.value = "";
									}
								}
								else {
									const existingErrorBox = document.querySelector('.error-box');
									if (existingErrorBox) {
										existingErrorBox.remove();
									}
									showError("Password must contain at least one lowercase letter.");
									signUpUsername.value = "";
									signUpPassword.value = "";
									signUpConfirmPassword.value = "";
								}
							}
							else{
								const existingErrorBox = document.querySelector('.error-box');
								if (existingErrorBox) {
									existingErrorBox.remove();
								}
								showError("Password must contain at least one uppercase letter.");
								signUpUsername.value = "";
								signUpPassword.value = "";
								signUpConfirmPassword.value = "";
							}
						}
						else{
							const existingErrorBox = document.querySelector('.error-box');
							if (existingErrorBox) {
								existingErrorBox.remove();
							}
							showError("Password must be at least 8 characters long.");
							signUpUsername.value = "";
							signUpPassword.value = "";
							signUpConfirmPassword.value = "";
							}
					}
					else{
						const existingErrorBox = document.querySelector('.error-box');
						if (existingErrorBox) {
							existingErrorBox.remove();
						}
						showError("Passwords do not match.");
						signUpUsername.value = "";
						signUpPassword.value = "";
						signUpConfirmPassword.value = "";
					}	
		}}});
	}


	let signInForm = document.getElementById("sign-in-form") as HTMLFormElement;
	let signInButton = document.getElementById("sign-in-button") as HTMLButtonElement;
	let signInUsername = document.getElementById("sign-in-username") as HTMLInputElement;
	let signInPassword = document.getElementById("sign-in-password") as HTMLInputElement;
	if (signInButton) {
		signInButton.addEventListener("click", async (event) => {
			event.preventDefault();
			if (signInUsername && signInPassword) {
				const username = signInUsername.value;
				const password = signInPassword.value;
				if (username && password) {
					try {
						const existingErrorBox = document.querySelector('.error-box');
							if (existingErrorBox) {
								existingErrorBox.remove();
							}
						const user = await getUser(username, password );
						sessionStorage.setItem("wxp_token", user.token);
						sessionStorage.setItem("wxp_user_id", user.id != null ? user.id.toString() : "");
						goToDesktopPage();
						signInUsername.value = "";
						signInPassword.value = "";
						updateUserImages();
						} 
					catch (error) {
						const existingErrorBox = document.querySelector('.error-box');
							if (existingErrorBox) {
								existingErrorBox.remove();
							}
							showError("Username or password is incorrect.");
						signInUsername.value = "";
						signInPassword.value = "";
					}
				}
			}
		});
	}
}