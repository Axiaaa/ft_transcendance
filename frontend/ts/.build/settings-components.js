import { sendNotification } from "./notification.js";
document.addEventListener('DOMContentLoaded', function () {
    var _a;
    var categoryContainer = document.getElementById('settings-app-category-container');
    var appearanceCategory = document.getElementById('settings-app-appearance-container');
    // Appearance Settings
    //		Wallpaper Settings
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
    var leftColumn = document.createElement('div');
    leftColumn.style.display = 'flex';
    leftColumn.style.flexDirection = 'column';
    wallpaperInfo.appendChild(leftColumn);
    var currentWallpaperTitle = document.createElement('span');
    leftColumn.appendChild(currentWallpaperTitle);
    currentWallpaperTitle.textContent = 'Current Wallpaper:';
    currentWallpaperTitle.style.fontSize = '12px';
    currentWallpaperTitle.style.marginBottom = '5px';
    currentWallpaperTitle.style.fontWeight = 'bold';
    var currentWallpaperName = document.createElement('span');
    leftColumn.appendChild(currentWallpaperName);
    currentWallpaperName.id = 'current-wallpaper-name';
    currentWallpaperName.textContent = actualWallpaper;
    currentWallpaperTitle.style.fontSize = '11px';
    currentWallpaperName.style.overflow = 'hidden';
    currentWallpaperName.style.textOverflow = 'ellipsis';
    currentWallpaperName.style.whiteSpace = 'nowrap';
    currentWallpaperName.style.maxWidth = '110px';
    currentWallpaperName.style.maxHeight = '50px';
    var rightColumn = document.createElement('div');
    rightColumn.style.display = 'flex';
    rightColumn.style.flexDirection = 'column';
    rightColumn.style.marginLeft = 'calc(100% - 270px)';
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
    //		Font Size Settings
    var fontSizeSettings = document.getElementById('settings-app-Font Size-setting');
    var fontSizeSettingsContainer = document.createElement('div');
    fontSizeSettings.appendChild(fontSizeSettingsContainer);
    fontSizeSettingsContainer.id = 'font-size-settings-container';
    fontSizeSettingsContainer.style.display = 'flex';
    fontSizeSettingsContainer.style.alignItems = 'center';
    var fontSizeValue = document.body.style.fontSize;
    var fontSizeValueNumber = parseInt(fontSizeValue.replace('px', ''));
    var fontSizeInfo = document.createElement('div');
    fontSizeSettingsContainer.appendChild(fontSizeInfo);
    fontSizeInfo.id = 'font-size-info';
    fontSizeInfo.style.display = 'flex';
    fontSizeInfo.style.margin = '10px';
    var exampleText = document.createElement('span');
    fontSizeInfo.appendChild(exampleText);
    exampleText.style.position = 'absolute';
    exampleText.style.right = '35px';
    exampleText.style.top = '5px';
    exampleText.style.fontSize = "15px";
    exampleText.style.maxHeight = '50px';
    exampleText.style.overflow = 'hidden';
    exampleText.style.maxWidth = '110px';
    exampleText.style.textOverflow = 'ellipsis';
    exampleText.style.whiteSpace = 'nowrap';
    exampleText.textContent = "12px";
    var fontSizeSlider = document.createElement('div');
    fontSizeInfo.appendChild(fontSizeSlider);
    fontSizeSlider.id = 'font-size-slider';
    fontSizeSlider.classList.add('field-row');
    fontSizeSlider.style.width = '100%';
    var minSize = document.createElement('label');
    fontSizeSlider.appendChild(minSize);
    minSize.htmlFor = 'range26';
    minSize.textContent = '-5px';
    var range = document.createElement('input');
    fontSizeSlider.appendChild(range);
    range.id = 'range26';
    range.type = 'range';
    range.min = '-5';
    range.max = '5';
    range.value = '0';
    range.addEventListener('input', function () {
        var newSize = 15 + parseInt(range.value);
        exampleText.style.fontSize = "".concat(newSize, "px");
        exampleText.textContent = "".concat(newSize, "px");
    });
    var maxSize = document.createElement('label');
    fontSizeSlider.appendChild(maxSize);
    maxSize.htmlFor = 'range27';
    maxSize.textContent = '+5px';
    var applyButton = document.createElement('button');
    fontSizeInfo.appendChild(applyButton);
    applyButton.id = 'font-size-apply-button';
    applyButton.textContent = 'Apply';
    applyButton.style.padding = '5px 5px';
    applyButton.style.marginLeft = '10px';
    var previousSize = 0;
    applyButton.addEventListener('click', function () {
        if (applyButton.classList[0] && applyButton.classList[0].includes('font-size-applied-')) {
            previousSize = parseInt(applyButton.classList[0].replace('font-size-applied-', ''));
            applyButton.classList.remove('font-size-applied-' + previousSize);
        }
        applyButton.classList.add('font-size-applied-' + range.value);
        var allTextElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, div, button, input, label, a');
        allTextElements.forEach(function (element) {
            var currentSize = window.getComputedStyle(element).fontSize;
            var sizeNumber = parseInt(currentSize);
            if (!isNaN(sizeNumber)) {
                var newSize = sizeNumber + parseInt(range.value) - previousSize;
                element.style.fontSize = "".concat(newSize, "px");
            }
        });
        if (parseInt(range.value) > 0)
            sendNotification('Font Size Changed', "Font size increased by ".concat(range.value, "px"), "./img/Utils/font-icon.png");
        else if (parseInt(range.value) < 0)
            sendNotification('Font Size Changed', "Font size decreased by ".concat(range.value, "px"), "./img/Utils/font-icon.png");
        else
            sendNotification('Font Size Changed', "Font size reset", "./img/Utils/font-icon.png");
    });
});
