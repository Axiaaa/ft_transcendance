"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var categoryContainer = document.getElementById('settings-app-category-container');
    var appearanceCategory = document.getElementById('settings-app-appearance-container');
    // Appearance Settings
    var wallpaperSettings = document.getElementById('settings-app-Wallpaper-setting');
    var wallpaperSettingsContainer = document.createElement('div');
    wallpaperSettingsContainer.style.display = 'flex';
    wallpaperSettingsContainer.style.alignItems = 'center';
    wallpaperSettings.appendChild(wallpaperSettingsContainer);
    var wallpaperSettingsContent = document.createElement('img');
    wallpaperSettingsContainer.appendChild(wallpaperSettingsContent);
    wallpaperSettingsContent.src = './img/background.jpg'; // default wallpaper
    wallpaperSettingsContent.style.width = '100px';
    wallpaperSettingsContent.style.height = '60px';
    wallpaperSettingsContent.style.objectFit = 'cover';
    wallpaperSettingsContent.style.borderRadius = '5px';
    wallpaperSettingsContent.style.marginRight = '10px';
    var wallpaperInfo = document.createElement('div');
    wallpaperInfo.style.display = 'flex';
    wallpaperInfo.style.alignItems = 'center';
    wallpaperInfo.style.marginBottom = '10px';
    var currentWallpaperName = document.createElement('span');
    currentWallpaperName.textContent = 'background.jpg';
    currentWallpaperName.style.marginRight = '20px';
    var resolutionText = document.createElement('span');
    resolutionText.textContent = 'Recommended: 1920x1080';
    resolutionText.style.color = '#666';
    resolutionText.style.fontSize = '12px';
    var importButton = document.createElement('button');
    importButton.textContent = 'Change Wallpaper';
    importButton.style.marginLeft = 'auto';
    importButton.style.padding = '5px 10px';
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    importButton.onclick = function () { return fileInput.click(); };
    fileInput.onchange = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
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
