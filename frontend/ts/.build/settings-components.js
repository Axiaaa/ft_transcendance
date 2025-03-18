import { sendNotification } from "./notification.js";
document.addEventListener('DOMContentLoaded', function () {
    var _a;
    var categoryContainer = document.getElementById('settings-app-category-container');
    var appearanceCategory = document.getElementById('settings-app-appearance-container');
    // Appearance Settings
    var wallpaperSettings = document.getElementById('settings-app-Wallpaper-setting');
    var documentBody = getComputedStyle(document.body);
    var actualWallpaper = ((_a = documentBody.getPropertyValue('background-image')
        .split('/')
        .pop()) === null || _a === void 0 ? void 0 : _a.replace(/['"]/g, '')) || 'default.jpg';
    var wallpaperSettingsContainer = document.createElement('div');
    wallpaperSettingsContainer.id = 'wallpaper-settings-container';
    wallpaperSettingsContainer.style.display = 'flex';
    wallpaperSettingsContainer.style.alignItems = 'center';
    wallpaperSettings.appendChild(wallpaperSettingsContainer);
    var wallpaperInfo = document.createElement('div');
    wallpaperInfo.id = 'wallpaper-info';
    wallpaperInfo.style.display = 'flex';
    wallpaperInfo.style.gap = '20px';
    // Left column
    var leftColumn = document.createElement('div');
    leftColumn.style.display = 'flex';
    leftColumn.style.flexDirection = 'column';
    wallpaperInfo.appendChild(leftColumn);
    var currentWallpaperTitle = document.createElement('span');
    leftColumn.appendChild(currentWallpaperTitle);
    currentWallpaperTitle.textContent = 'Current Wallpaper:';
    currentWallpaperTitle.style.marginBottom = '5px';
    currentWallpaperTitle.style.fontWeight = 'bold';
    var currentWallpaperName = document.createElement('span');
    leftColumn.appendChild(currentWallpaperName);
    currentWallpaperName.id = 'current-wallpaper-name';
    currentWallpaperName.textContent = actualWallpaper;
    currentWallpaperName.style.overflow = 'hidden';
    currentWallpaperName.style.textOverflow = 'ellipsis';
    currentWallpaperName.style.whiteSpace = 'nowrap';
    currentWallpaperName.style.maxWidth = '110px';
    currentWallpaperName.style.maxHeight = '50px';
    // Right column
    var rightColumn = document.createElement('div');
    rightColumn.style.display = 'flex';
    rightColumn.style.flexDirection = 'column';
    rightColumn.style.marginLeft = '20px';
    wallpaperInfo.appendChild(rightColumn);
    var importButton = document.createElement('button');
    rightColumn.appendChild(importButton);
    importButton.id = 'import-button';
    importButton.textContent = 'Change Wallpaper';
    importButton.style.padding = '5px 10px';
    importButton.style.marginBottom = '5px';
    var fileInput = document.createElement('input');
    rightColumn.appendChild(fileInput);
    fileInput.id = 'file-input';
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    importButton.onclick = function () { return fileInput.click(); };
    fileInput.onchange = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            currentWallpaperName.textContent = file.name;
            document.body.style.backgroundImage = "url(".concat(URL.createObjectURL(file), ")");
            sendNotification('Wallpaper Changed', "Wallpaper changed to ".concat(file.name), "./img/Settings_app/picture-icon.png");
        }
        else
            sendNotification('Error', 'No file selected', "./img/Utils/error-icon.png");
    };
    var resolutionText = document.createElement('span');
    rightColumn.appendChild(resolutionText);
    resolutionText.id = 'resolution-text';
    resolutionText.textContent = 'Recommended: 1920x1080';
    resolutionText.style.color = '#666';
    resolutionText.style.fontSize = '10px';
    resolutionText.style.padding = '5px';
    wallpaperSettings.appendChild(wallpaperInfo);
});
