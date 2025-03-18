import { sendNotification } from "./notification.js";


document.addEventListener('DOMContentLoaded', () => {


	let categoryContainer = document.getElementById('settings-app-category-container') as HTMLElement;

	let appearanceCategory = document.getElementById('settings-app-appearance-container') as HTMLElement;
	
	
	// Appearance Settings
	
	let wallpaperSettings = document.getElementById('settings-app-Wallpaper-setting') as HTMLElement;

	const documentBody = getComputedStyle(document.body);
	let actualWallpaper = documentBody.getPropertyValue('background-image')
		.split('/')
		.pop()
		?.replace(/['"]/g, '') || 'default.jpg';

	let wallpaperSettingsContainer = document.createElement('div');
	wallpaperSettingsContainer.id = 'wallpaper-settings-container';
	wallpaperSettingsContainer.style.display = 'flex';
	wallpaperSettingsContainer.style.alignItems = 'center';
	
	wallpaperSettings.appendChild(wallpaperSettingsContainer);
	let wallpaperInfo = document.createElement('div');
	wallpaperInfo.id = 'wallpaper-info';
	wallpaperInfo.style.display = 'flex';
	wallpaperInfo.style.gap = '20px';

	// Left column
	let leftColumn = document.createElement('div');
	leftColumn.style.display = 'flex';
	leftColumn.style.flexDirection = 'column';
	wallpaperInfo.appendChild(leftColumn);

	let currentWallpaperTitle = document.createElement('span');
	leftColumn.appendChild(currentWallpaperTitle);
	currentWallpaperTitle.textContent = 'Current Wallpaper:';
	currentWallpaperTitle.style.marginBottom = '5px';
	currentWallpaperTitle.style.fontWeight = 'bold';

	let currentWallpaperName = document.createElement('span');
	leftColumn.appendChild(currentWallpaperName);
	currentWallpaperName.id = 'current-wallpaper-name';
	currentWallpaperName.textContent = actualWallpaper;
	currentWallpaperName.style.overflow = 'hidden';
	currentWallpaperName.style.textOverflow = 'ellipsis';
	currentWallpaperName.style.whiteSpace = 'nowrap';
	currentWallpaperName.style.maxWidth = '110px';
	currentWallpaperName.style.maxHeight = '50px';

	// Right column
	let rightColumn = document.createElement('div');
	rightColumn.style.display = 'flex';
	rightColumn.style.flexDirection = 'column';
	rightColumn.style.marginLeft = '20px';
	wallpaperInfo.appendChild(rightColumn);

	let importButton = document.createElement('button');
	rightColumn.appendChild(importButton);
	importButton.id = 'import-button';
	importButton.textContent = 'Change Wallpaper';
	importButton.style.padding = '5px 10px';
	importButton.style.marginBottom = '5px';

	let fileInput = document.createElement('input');
	rightColumn.appendChild(fileInput);
	fileInput.id = 'file-input';
	fileInput.type = 'file';
	fileInput.accept = 'image/*';
	fileInput.style.display = 'none';

	importButton.onclick = () => fileInput.click();

	fileInput.onchange = (e) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) {
			currentWallpaperName.textContent = file.name;
			document.body.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
			sendNotification('Wallpaper Changed', `Wallpaper changed to ${file.name}`, "./img/Settings_app/picture-icon.png");
		}
		else
			sendNotification('Error', 'No file selected', "./img/Utils/error-icon.png");
	};

	let resolutionText = document.createElement('span');
	rightColumn.appendChild(resolutionText);
	resolutionText.id = 'resolution-text';
	resolutionText.textContent = 'Recommended: 1920x1080';
	resolutionText.style.color = '#666';
	resolutionText.style.fontSize = '10px';
	resolutionText.style.padding = '5px';


	wallpaperSettings.appendChild(wallpaperInfo);

});