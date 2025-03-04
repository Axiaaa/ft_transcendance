

export function openAppWindow(appName: string): void {
	let appWindow = document.getElementById(appName + '-window') as HTMLElement;
	console.log('Open ' + appName + " = " + appWindow);
	appWindow.style.display = 'block';
};


function createApp(appname: string, content?: HTMLElement): HTMLDivElement {
	let App = document.createElement('div');
	App.classList.add('window');
	App.id = appname + '-app-window';
	App.style.display = 'none';
	App.style.width = '500px';
	App.style.height = '400px';
	App.appendChild(document.createElement('div'));
	App.children[0].classList.add('title-bar');
	App.children[0].appendChild(document.createElement('div'));
	App.children[0].children[0].classList.add('title-bar-text');
	let Name = appname.charAt(0).toUpperCase() + appname.slice(1);
	App.children[0].children[0].textContent = Name;
	App.children[0].appendChild(document.createElement('div'));
	App.children[0].children[1].classList.add('title-bar-controls');
	App.children[0].children[1].appendChild(document.createElement('button'));
	App.children[0].children[1].children[0].ariaLabel = 'Minimize';
	App.children[0].children[1].appendChild(document.createElement('button'));
	App.children[0].children[1].children[1].ariaLabel = 'Maximize';
	App.children[0].children[1].appendChild(document.createElement('button'));
	App.children[0].children[1].children[2].ariaLabel = 'Close';
	App.children[0].children[1].children[2].id = 'close-button';
	App.appendChild(document.createElement('div'));
	App.children[1].classList.add('window-body');
	if (content)
		App.children[1].appendChild(content);
	document.body.appendChild(App);
	return App;
}

document.addEventListener('DOMContentLoaded', () => {

	function disableImgDragging() {
		var images = document.getElementsByTagName("img");
		for(var i = 0 ; i < images.length ; i++) {
		images[i].classList.add('no-drag');
		images[i].setAttribute('no-drag', 'on');
		images[i].setAttribute('draggable', 'false');
		images[i].addEventListener('dragstart', function( event ) {
			event.preventDefault();
		}, false);
		}
	}
	disableImgDragging();

	const desktop = document.getElementById('desktop') as HTMLElement;
	const windowsContainer = document.getElementById('windows-container') as HTMLElement;

	const gridSize: number = 90; // Taille de la grille

	// Obtient la position en grille d'un élément
	function getGridPos(element: HTMLElement): { x: number, y: number } {
		return {
		x: Math.round(element.offsetLeft / gridSize),
		y: Math.round(element.offsetTop / gridSize)
		};
	}

	document.querySelectorAll<HTMLDivElement>('.app-icon').forEach((appicon, index) => {
		let isDragging: boolean = false;
		let offsetX: number, offsetY: number;

		appicon.style.left = '30px';
		appicon.style.top = `${90 + index * 90}px`;

		appicon.addEventListener('mousedown', (e: MouseEvent) => {
			isDragging = true;
			offsetX = e.clientX - appicon.offsetLeft;
			offsetY = e.clientY - appicon.offsetTop;
			appicon.style.zIndex = '1000';
		});

		document.addEventListener('mousemove', (e: MouseEvent) => {
			if (isDragging) {
				appicon.style.left = `${e.clientX - offsetX}px`;
				appicon.style.top = `${e.clientY - offsetY}px`;
				if (appicon.offsetLeft < 30) {
					appicon.style.left = '30px';
				}
				if (appicon.offsetTop < 30) {
					appicon.style.top = '30px';
				}
				if (appicon.offsetLeft + appicon.offsetWidth > window.innerWidth - 30) {
					appicon.style.left = `${window.innerWidth - 30 - appicon.offsetWidth}px`;
				}
				if (appicon.offsetTop + appicon.offsetHeight > window.innerHeight - 30) {
					appicon.style.top = `${window.innerHeight - 30 - appicon.offsetHeight}px`;
				}
			}
		});

		document.addEventListener('mouseup', () => {
			if (isDragging) {
				// Ajustement à la grille
				let x: number = parseInt(appicon.style.left, 10);
				let y: number = parseInt(appicon.style.top, 10);
				let snappedX: number = Math.round(x / gridSize) * gridSize;
				let snappedY: number = Math.round(y / gridSize) * gridSize;

				// Ajustement pour maintenir une marge de 30px des bordures
				if (snappedX < 30) {
					snappedX = 30;
				}
				if (snappedY < 30) {
					snappedY = 30;
				}
				if (snappedX + appicon.offsetWidth > window.innerWidth - 30) {
					snappedX = window.innerWidth - 30 - appicon.offsetWidth;
				}
				if (snappedY + appicon.offsetHeight > window.innerHeight - 30) {
					snappedY = window.innerHeight - 30 - appicon.offsetHeight;
				}
				appicon.style.left = `${snappedX}px`;
				appicon.style.top = `${snappedY}px`;
				appicon.style.zIndex = 'initial';
			}
			isDragging = false;
		});

		// Double-clic pour ouvrir une fenêtre
		appicon.addEventListener('dblclick', () => {
			const appName: string | null = appicon.id;
			console.log(appName);
			if (appName) {
				openAppWindow(appName);
			}
		});

		appicon.addEventListener('mouseenter', () => {
			console.log('hover');
			appicon.style.backgroundColor = 'rgba(70, 119, 197, 0.54)';
		});
		appicon.addEventListener('mouseleave', () => {
			appicon.style.backgroundColor = 'transparent';
		});
	});

	// Apps

	let settingsApp = createApp('settings');
	settingsApp.children[1].appendChild(document.createElement('img'));
	(settingsApp.children[1].children[0] as HTMLImageElement).src = './img/settings-app-content.jpeg';

	let pongApp = createApp('pong');
	pongApp.children[1].appendChild(document.createElement('canvas'));
	(pongApp.children[1].children[0] as HTMLCanvasElement).id = 'pong-game-canvas';
	(pongApp.children[1].children[0] as HTMLCanvasElement).width = parseInt(pongApp.style.width);
	(pongApp.children[1].children[0] as HTMLCanvasElement).height = parseInt(pongApp.style.height) - 30;
	// (pongApp.children[1].children[0] as HTMLElement).style.backgroundColor = 'black';
	// pongApp.children[1].appendChild(document.createElement('img'));
	// (pongApp.children[1].children[0] as HTMLImageElement).src = './img/pong_loop.gif';
	// (pongApp.children[1].children[0] as HTMLImageElement).height = 362;


	let startMenuApp = document.getElementsByClassName('menu-item') as HTMLCollectionOf<HTMLDivElement>;
	for (let i = 0; i < startMenuApp.length; i++) {
		let app = startMenuApp[i];
		app.addEventListener('click', () => {
			openAppWindow(app.id);
		});
	}

});
