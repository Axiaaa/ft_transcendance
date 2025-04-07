
document.addEventListener('DOMContentLoaded', () => {


	var	startButton = document.getElementById('start-button') as HTMLElement;
	var		startMenu = document.getElementById('start-menu') as HTMLElement;
	let loginScreen = document.getElementsByClassName("login-screen")[0] as HTMLElement;
	let logoffButton = document.getElementById('log-off-button') as HTMLElement;
	
	logoffButton.addEventListener('click', (e: MouseEvent) => {
		loginScreen.style.display = 'block';
	});

	startMenu.style.display = 'none';
	let base = document.createElement('img');
		base.src = './img/start-button-1.png';
		base.height = 35;
	let hover = document.createElement('img');
		hover.src = './img/start-button-2.png';
		hover.height = 35;
	let held = document.createElement('img');
		held.src = './img/start-button-3.png';
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
});