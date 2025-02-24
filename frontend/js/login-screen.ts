document.addEventListener('DOMContentLoaded', () => {
	
	let loginScreen = document.getElementsByClassName("login-screen")[0] as HTMLElement;
	loginScreen.style.display = 'none';

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