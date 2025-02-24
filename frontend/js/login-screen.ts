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

	let profile = document.getElementsByClassName("login-screen-right-profile-box")[0] as HTMLElement;

	let isClicked = false;
	let isHovered = false;
	profile.addEventListener('mousedown', () => {
		isClicked = true;
		if (isHovered)
			profile.style.backgroundColor = 'rgba(41, 74, 127, 0.75)';
		else
			profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
		
		loginScreen.style.display = 'none';
		profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
		profile.style.backgroundColor = 'transparent';
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
	}
	);
});