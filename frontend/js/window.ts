

function resetWindows(windowElement: HTMLElement) {
		windowElement.style.display = 'none';
		windowElement.style.width = '500px';
		windowElement.style.height = '400px';
		windowElement.style.left = '0px';
		windowElement.style.top = '0px';
		windowElement.style.zIndex = "24";
}

function maximize(windowElement: HTMLElement, isMaximised: boolean) {
	console.log('maximise');
	if (isMaximised) {
		windowElement.style.width = '500px';
		windowElement.style.height = '400px';
		windowElement.style.left = '0px';
		windowElement.style.top = '0px';
		isMaximised = false;
	}
	else {
		windowElement.style.width = `${window.innerWidth}px`;
		windowElement.style.height = `${window.innerHeight}px`;
		windowElement.style.left = '0px';
		windowElement.style.top = '0px';
		isMaximised = true;
	}
};

function minimize(windowElement: HTMLElement, isMinimised: boolean) {
	console.log('minimise');
	if (isMinimised) {
		windowElement.style.display = 'block';
		isMinimised = false;
	}
	else {
		windowElement.style.display = 'none';
		isMinimised = true;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	
	let Windows = document.getElementsByClassName('window');
	console.log('Found ' + Windows.length + ' windows:');
	Array.from(Windows).forEach((window, index) => {
		console.log(`Window ${index} details:`, window);
	});
	for (let i = 0; i < Windows.length; i++) {

		let isDragging: boolean = false;
		let windowElement = Windows[i] as HTMLElement;
		let windowHeader = Windows[i].children[0] as HTMLElement;
		try {
			console.log(`Traitement de la fenêtre ${i}`);
			console.log('Window ' + i + ': ' + windowElement.id);
			console.log(`Fenêtre ${i} traitée avec succès`);
		} catch (error) {
			console.error(`Erreur sur la fenêtre ${i}:`, error);
		}
		let closeButton = windowElement.children[0].children[1].children[2] as HTMLElement;
		closeButton.addEventListener('click', () => {
			console.log('close');
			resetWindows(windowElement);
		});

		let maximiseButton = windowElement.children[0].children[1].children[1] as HTMLElement;
		let isMaximised = false;

		
		maximiseButton.addEventListener('click', () => {
			maximize(windowElement, isMaximised);
		});

		let minimiseButton = windowElement.children[0].children[1].children[0] as HTMLElement;
		let isMinimised = false;
		minimiseButton.addEventListener('click', () => {
			minimize(windowElement, isMinimised);
		});

		windowElement.style.display = 'none';
		windowElement.style.zIndex = "24";

		let offsetX: number, offsetY: number;

		windowHeader.addEventListener('mousedown', (e: MouseEvent) => {
			isDragging = true;
			offsetX = e.clientX - windowElement.offsetLeft;
			offsetY = e.clientY - windowElement.offsetTop;
		});

		windowElement.addEventListener('mousedown', (e: MouseEvent) => {
			const allWindows = document.getElementsByClassName('window');
			for (let j = 0; j < allWindows.length; j++) {
				(allWindows[j] as HTMLElement).style.zIndex = "24";
			}
			windowElement.style.zIndex = "25";
		});

		document.addEventListener('mousemove', (e: MouseEvent) => {
			if (isDragging) {
				windowElement.style.left = `${e.clientX - offsetX}px`;
				windowElement.style.top = `${e.clientY - offsetY}px`;
				if (windowElement.offsetLeft < 0) {
					windowElement.style.left = '0px';
				}
				if (windowElement.offsetTop < 0) {
					windowElement.style.top = '0px';
				}
				if (windowElement.offsetLeft + windowElement.offsetWidth > window.innerWidth) {
					windowElement.style.left = `${window.innerWidth - windowElement.offsetWidth}px`;
				}
				if (windowElement.offsetTop + windowElement.offsetHeight > window.innerHeight) {
					windowElement.style.top = `${window.innerHeight - windowElement.offsetHeight}px`;
				}
			}
		});
		document.addEventListener('mouseup', () => {
			isDragging = false;
		});

		let isResizing = false;
		let resizeHandle = document.createElement('div');
		resizeHandle.style.position = 'absolute';
		resizeHandle.style.width = '10px';
		resizeHandle.style.height = '10px';
		resizeHandle.style.right = '0px';
		resizeHandle.style.bottom = '0px';
		resizeHandle.style.backgroundColor = 'white';
		resizeHandle.style.zIndex = '0';
		windowElement.appendChild(resizeHandle);
		resizeHandle.addEventListener('mouseenter', (e: MouseEvent) => {
			document.body.style.cursor = 'nwse-resize';
		});
		resizeHandle.addEventListener('mouseleave', (e: MouseEvent) => {
			document.body.style.cursor = 'default';
		});
		resizeHandle.addEventListener('mousedown', () => {
			isResizing = true;
		});
		document.addEventListener('mousemove', (e: MouseEvent) => {
			if (isResizing) {
				const newWidth = e.clientX - windowElement.offsetLeft + 5;
				const newHeight = e.clientY - windowElement.offsetTop + 5;
				const minWidth = 300;
				const minHeight = 200;
				
				windowElement.style.width = `${Math.max(newWidth, minWidth)}px`;
				windowElement.style.height = `${Math.max(newHeight, minHeight)}px`;

				if (windowElement.offsetLeft + windowElement.offsetWidth > window.innerWidth)
					windowElement.style.width = `${window.innerWidth - windowElement.offsetLeft}px`;
				if (windowElement.offsetTop + windowElement.offsetHeight > window.innerHeight)
					windowElement.style.height = `${window.innerHeight - windowElement.offsetTop}px`;
			}
		});
		resizeHandle.addEventListener('mouseup', () => {
			isResizing = false;
		});
		let windowsContent = windowElement.children[1].children[0] as HTMLElement;
		if (windowsContent) {
			windowsContent.style.overflow = 'auto';
			windowsContent.style.height = 'calc(100% - 1px)';
			windowsContent.style.width = 'calc(100% - 1px)';
		}
	}

});