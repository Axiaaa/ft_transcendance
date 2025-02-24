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

	NewProfile.addEventListener('click', () => {
		for (let i = 0; i < profiles.length; i++) {
			profiles[i].style.display = 'none';
		}
		form.style.display = 'block';
	});
	
});