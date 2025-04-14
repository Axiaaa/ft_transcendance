import { getCurrentUser, updateUser } from "./API.js";
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

// SANDBOX AREA
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
				if (username && password) {
					try {
						const newUser = await createUser({ username, password });
						sessionStorage.setItem("wxp_token", newUser.token);
						sessionStorage.setItem("wxp_user_id", newUser.id != null ? newUser.id.toString() : "");
						goToDesktopPage();
					} catch (error) {
						console.error("Error creating user:", error);
						signUpUsername.value = "";
						signUpPassword.value = "";
						signUpConfirmPassword.value = "";
					}
				}
			}
		});
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
						const user = await getUser(username, password );
						sessionStorage.setItem("wxp_token", user.token);
						sessionStorage.setItem("wxp_user_id", user.id != null ? user.id.toString() : "");
						goToDesktopPage();
						} 
					catch (error) {
						console.error("Error signing in:", error);
						signInUsername.value = "";
						signInPassword.value = "";
					}
				}
			}
		});
	}
}