document.addEventListener('DOMContentLoaded', () => {


	let categoryContainer = document.getElementById('settings-app-category-container') as HTMLElement;

	let appearanceCategory = document.getElementById('settings-app-appearance-container') as HTMLElement;
	
	
	// Appearance Settings
	
	let wallpaperSettings = document.getElementById('settings-app-Wallpaper-setting') as HTMLElement;

	let wallpaperSettingsContainer = document.createElement('div');
	wallpaperSettingsContainer.style.display = 'flex';
	wallpaperSettingsContainer.style.alignItems = 'center';
	
	wallpaperSettings.appendChild(wallpaperSettingsContainer);
	
	let wallpaperSettingsContent = document.createElement('img');
	wallpaperSettingsContainer.appendChild(wallpaperSettingsContent);
	wallpaperSettingsContent.src = './img/background.jpg';  // default wallpaper
	wallpaperSettingsContent.style.width = '100px';
	wallpaperSettingsContent.style.height = '60px';
	wallpaperSettingsContent.style.objectFit = 'cover';
	wallpaperSettingsContent.style.borderRadius = '5px';
	wallpaperSettingsContent.style.marginRight = '10px';

	let wallpaperInfo = document.createElement('div');
	wallpaperInfo.style.display = 'flex';
	wallpaperInfo.style.alignItems = 'center';
	wallpaperInfo.style.marginBottom = '10px';

	let currentWallpaperName = document.createElement('span');
	currentWallpaperName.textContent = 'background.jpg';
	currentWallpaperName.style.marginRight = '20px';

	let resolutionText = document.createElement('span');
	resolutionText.textContent = 'Recommended: 1920x1080';
	resolutionText.style.color = '#666';
	resolutionText.style.fontSize = '12px';

	let importButton = document.createElement('button');
	importButton.textContent = 'Change Wallpaper';
	importButton.style.marginLeft = 'auto';
	importButton.style.padding = '5px 10px';

	let fileInput = document.createElement('input');
	fileInput.type = 'file';
	fileInput.accept = 'image/*';
	fileInput.style.display = 'none';

	importButton.onclick = () => fileInput.click();

	fileInput.onchange = (e) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) {
			currentWallpaperName.textContent = file.name;
			wallpaperSettingsContent.src = URL.createObjectURL(file);
		}
	};

	wallpaperInfo.appendChild(wallpaperSettingsContent);
	wallpaperInfo.appendChild(currentWallpaperName);
	wallpaperInfo.appendChild(resolutionText);
	wallpaperInfo.appendChild(importButton);
	wallpaperInfo.appendChild(fileInput);

	wallpaperSettings.appendChild(wallpaperInfo);

});