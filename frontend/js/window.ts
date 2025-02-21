
document.addEventListener('DOMContentLoaded', () => {
	

	let Windows = document.getElementsByClassName('window');
	for (let i = 0; i < Windows.length; i++) {

		let isDragging: boolean = false;
		let windowElement = Windows[i] as HTMLElement;
		let windowHeader = Windows[i].children[0] as HTMLElement;

		let closeButton = windowElement.children[0].children[1].children[2] as HTMLElement;
		closeButton.addEventListener('click', () => {
			console.log('close');
			if (windowElement.style.display === 'none')
				windowElement.style.display = 'block';
			else
				windowElement.style.display = 'none';
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
		resizeHandle.style.backgroundColor = 'black';
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
	}

});