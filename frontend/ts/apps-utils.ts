import { sendNotification } from "./notification.js";



function resetEasterEgg(CurrentContent: HTMLElement, InternetExplorerWindow: HTMLElement, InternetExplorerWindowBody: HTMLElement, EasterEgg: HTMLIFrameElement, windowTitle: HTMLElement)
{
	CurrentContent.style.display = 'block';
	CurrentContent.style.opacity = '1';
	InternetExplorerWindowBody.removeChild(EasterEgg);
	setTimeout(() => {
		CurrentContent.style.transition = '';
	}, 100);
	if (InternetExplorerWindow)
	{
		InternetExplorerWindow.style.minWidth = '400px';
		InternetExplorerWindow.style.minHeight = '400px';
		InternetExplorerWindow.style.maxWidth = '100%';
		InternetExplorerWindow.style.maxHeight = '100%';
		InternetExplorerWindow.style.width = '800px';
		InternetExplorerWindow.style.height = '600px';
		setTimeout(() => {
			InternetExplorerWindow.style.transition = '';
		}, 100);
	}
	if (windowTitle) {
		windowTitle.innerText = 'Internet Explorer';
		setTimeout(() => {
			windowTitle.style.transition = '';
		}, 100);
	}
}



document.addEventListener('DOMContentLoaded', () => {

	let InternetExplorerWindow = document.getElementById('internet explorer-app-window');
	if (InternetExplorerWindow)
	{
		let InternetExplorerWindowBody = InternetExplorerWindow.children[1] as HTMLElement;
		let CurrentContent = InternetExplorerWindowBody.children[0] as HTMLElement;
		CurrentContent.draggable = false;
		let closeButton = InternetExplorerWindow.children[0].children[1].children[2] as HTMLElement;
		let minimizeButton = InternetExplorerWindow.children[0].children[1].children[0] as HTMLElement;
		let windowTitle = InternetExplorerWindow.children[0].children[0] as HTMLElement;
		


		let EasterEgg = document.createElement('iframe');
		EasterEgg.id = 'easter-egg';
		EasterEgg.src = 'https://alula.github.io/SpaceCadetPinball/';
		EasterEgg.width = '100%';
		EasterEgg.height = '100%';
		EasterEgg.style.border = 'none';
		
		let clickCount = 0;
		let lastClickTime = 0;
		CurrentContent.addEventListener('dblclick', () => {
			let currentTime = new Date().getTime();
			if (currentTime - lastClickTime < 500)
				clickCount++;
			else
				clickCount = 0;
			lastClickTime = currentTime;
			if (clickCount >= 3)
			{
				InternetExplorerWindow.style.transition = 'width 1s ease, height 1s ease, min-width 1s ease, min-height 1s ease, max-width 1s ease, max-height 1s ease';
				CurrentContent.style.transition = 'opacity 1s ease-out';
				windowTitle.style.transition = 'color 1s ease';
				setTimeout(() => {
					CurrentContent.style.opacity = '0';
				}, 100);
				setTimeout(() => {
					CurrentContent.style.display = 'none';
				}, 1100);
				InternetExplorerWindowBody.appendChild(EasterEgg);
				windowTitle.innerText = 'Space Cadet Pinball';
				InternetExplorerWindow.style.minWidth = '625px';
				InternetExplorerWindow.style.minHeight = '510px';
				InternetExplorerWindow.style.maxWidth = '625px';
				InternetExplorerWindow.style.maxHeight = '510px';
				InternetExplorerWindow.style.width = '625px';
				InternetExplorerWindow.style.height = '510px';
				sendNotification('Easter Egg activated', 'Enjoy a game of Space Cadet Pinball ! Credit: https://alula.github.io/SpaceCadetPinball/', 'img/Utils/pinball-icon.png');
			}
		});

		closeButton.addEventListener('click', () => {
			console.log('close AAAAAAAAAAAA');
			resetEasterEgg(CurrentContent, InternetExplorerWindow, InternetExplorerWindowBody, EasterEgg, windowTitle);
		});
		minimizeButton.addEventListener('click', () => {
			resetEasterEgg(CurrentContent, InternetExplorerWindow, InternetExplorerWindowBody, EasterEgg, windowTitle);
		});

	}
});