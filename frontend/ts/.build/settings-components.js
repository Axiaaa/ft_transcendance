import { sendNotification } from "./notification.js";
document.addEventListener('DOMContentLoaded', function () {
    var _a;
    var categoryContainer = document.getElementById('settings-app-category-container');
    var appearanceCategory = document.getElementById('settings-app-appearance-container');
    // Appearance Settings
    //		Wallpaper Settings
    {
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
        leftColumn.style.margin = '5px 0';
        wallpaperInfo.appendChild(leftColumn);
        var currentWallpaperTitle = document.createElement('span');
        leftColumn.appendChild(currentWallpaperTitle);
        currentWallpaperTitle.textContent = 'Current Wallpaper:';
        currentWallpaperTitle.style.fontSize = '12px';
        currentWallpaperTitle.style.marginBottom = '5px';
        currentWallpaperTitle.style.fontWeight = 'bold';
        var currentWallpaperName_1 = document.createElement('span');
        leftColumn.appendChild(currentWallpaperName_1);
        currentWallpaperName_1.id = 'current-wallpaper-name';
        currentWallpaperName_1.textContent = actualWallpaper;
        currentWallpaperTitle.style.fontSize = '11px';
        currentWallpaperName_1.style.overflow = 'hidden';
        currentWallpaperName_1.style.textOverflow = 'ellipsis';
        currentWallpaperName_1.style.whiteSpace = 'nowrap';
        currentWallpaperName_1.style.maxWidth = '110px';
        currentWallpaperName_1.style.maxHeight = '50px';
        var rightColumn = document.createElement('div');
        rightColumn.style.display = 'flex';
        rightColumn.style.flexDirection = 'column';
        rightColumn.style.marginLeft = 'calc(100% - 310px)';
        wallpaperInfo.appendChild(rightColumn);
        var importButton = document.createElement('button');
        rightColumn.appendChild(importButton);
        importButton.id = 'import-button';
        importButton.textContent = 'Change Wallpaper';
        importButton.style.padding = '5px 10px';
        importButton.style.marginBottom = '5px';
        var fileInput_1 = document.createElement('input');
        rightColumn.appendChild(fileInput_1);
        fileInput_1.id = 'file-input';
        fileInput_1.type = 'file';
        fileInput_1.accept = 'image/*';
        fileInput_1.style.display = 'none';
        importButton.onclick = function () { return fileInput_1.click(); };
        fileInput_1.onchange = function (e) {
            var _a;
            var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (file) {
                currentWallpaperName_1.textContent = file.name;
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
    }
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
    exampleText.style.left = 'calc(100% - 170px)';
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
    applyButton.style.left = 'calc(100% - 160px)';
    applyButton.style.position = 'absolute';
    applyButton.style.top = '35px';
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
    // User Account Settings
    var userAccountContainer = document.getElementById('settings-app-user-account-container');
    {
        var UserAccountAvatar = document.getElementById('settings-app-Avatar-setting');
        var avatarSettings = document.createElement('div');
        avatarSettings.id = 'avatar-settings-container';
        avatarSettings.style.display = 'flex';
        avatarSettings.style.alignItems = 'center';
        UserAccountAvatar.appendChild(avatarSettings);
        var avatarInfo = document.createElement('div');
        avatarInfo.id = 'avatar-info';
        avatarInfo.style.display = 'flex';
        avatarInfo.style.gap = '20px';
        var leftColumn = document.createElement('div');
        leftColumn.style.display = 'flex';
        leftColumn.style.flexDirection = 'column';
        avatarInfo.appendChild(leftColumn);
        var currentAvatarTitle = document.createElement('span');
        leftColumn.appendChild(currentAvatarTitle);
        currentAvatarTitle.textContent = 'Current Avatar:';
        currentAvatarTitle.style.fontSize = '12px';
        currentAvatarTitle.style.marginBottom = '5px';
        currentAvatarTitle.style.fontWeight = 'bold';
        var currentAvatarPreview_1 = document.createElement('img');
        leftColumn.appendChild(currentAvatarPreview_1);
        currentAvatarPreview_1.id = 'current-avatar-preview';
        currentAvatarPreview_1.src = './img/Login_Screen/demo-user-profile-icon.jpg';
        currentAvatarPreview_1.style.width = '55px';
        currentAvatarPreview_1.style.height = '55px';
        currentAvatarPreview_1.style.borderRadius = '10%';
        currentAvatarPreview_1.style.marginBottom = '10px';
        currentAvatarPreview_1.style.objectFit = 'cover';
        var currentAvatarName_1 = document.createElement('span');
        leftColumn.appendChild(currentAvatarName_1);
        currentAvatarName_1.id = 'current-avatar-name';
        currentAvatarName_1.textContent = 'default.jpg';
        currentAvatarName_1.style.fontSize = '11px';
        currentAvatarName_1.style.overflow = 'hidden';
        currentAvatarName_1.style.textOverflow = 'ellipsis';
        currentAvatarName_1.style.whiteSpace = 'nowrap';
        currentAvatarName_1.style.maxWidth = '110px';
        currentAvatarName_1.style.maxHeight = '50px';
        currentAvatarName_1.style.marginBottom = '10px';
        var rightColumn = document.createElement('div');
        rightColumn.style.display = 'flex';
        rightColumn.style.flexDirection = 'column';
        rightColumn.style.marginLeft = 'calc(100% - 270px)';
        rightColumn.style.transform = 'translateY(+25%)';
        avatarInfo.appendChild(rightColumn);
        var importButton = document.createElement('button');
        rightColumn.appendChild(importButton);
        importButton.id = 'avatar-import-button';
        importButton.textContent = 'Change Avatar';
        importButton.style.padding = '5px 10px';
        importButton.style.marginBottom = '5px';
        var fileInput_2 = document.createElement('input');
        rightColumn.appendChild(fileInput_2);
        fileInput_2.id = 'avatar-file-input';
        fileInput_2.type = 'file';
        fileInput_2.accept = 'image/*';
        fileInput_2.style.display = 'none';
        importButton.onclick = function () { return fileInput_2.click(); };
        fileInput_2.onchange = function (e) {
            var _a;
            var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (file) {
                currentAvatarName_1.textContent = file.name;
                currentAvatarPreview_1.src = URL.createObjectURL(file);
                sendNotification('Avatar Changed', "Avatar changed to ".concat(file.name), "./img/Utils/profile-icon.png");
            }
            else {
                sendNotification('Error', 'No file selected', "./img/Utils/error-icon.png");
            }
        };
        var resolutionText = document.createElement('span');
        rightColumn.appendChild(resolutionText);
        resolutionText.id = 'avatar-resolution-text';
        resolutionText.textContent = 'Recommended: 256x256';
        resolutionText.style.color = '#666';
        resolutionText.style.fontSize = '10px';
        resolutionText.style.padding = '5px';
        UserAccountAvatar.appendChild(avatarInfo);
    }
    var userAccountName = document.getElementById('settings-app-Account Name-setting');
    {
        var nameSettings = document.createElement('div');
        nameSettings.style.display = 'flex';
        nameSettings.style.alignItems = 'center';
        userAccountName.appendChild(nameSettings);
        var nameInfo = document.createElement('div');
        nameInfo.style.display = 'flex';
        nameInfo.style.gap = '20px';
        var leftColumn = document.createElement('div');
        leftColumn.style.display = 'flex';
        leftColumn.style.flexDirection = 'column';
        nameInfo.appendChild(leftColumn);
        var currentNameTitle = document.createElement('span');
        leftColumn.appendChild(currentNameTitle);
        currentNameTitle.textContent = 'New Username:';
        currentNameTitle.style.fontSize = '12px';
        currentNameTitle.style.marginBottom = '5px';
        currentNameTitle.style.fontWeight = 'bold';
        var nameInput_1 = document.createElement('input');
        leftColumn.appendChild(nameInput_1);
        nameInput_1.type = 'text';
        nameInput_1.pattern = '[A-Za-z0-9_]+';
        nameInput_1.title = 'Only letters, numbers and underscore allowed';
        nameInput_1.style.width = '150px';
        nameInput_1.style.marginBottom = '5px';
        var rightColumn = document.createElement('div');
        rightColumn.style.display = 'flex';
        rightColumn.style.flexDirection = 'column';
        rightColumn.style.marginLeft = 'calc(100% - 310px)';
        nameInfo.appendChild(rightColumn);
        var applyButton_1 = document.createElement('button');
        rightColumn.appendChild(applyButton_1);
        applyButton_1.textContent = 'Change Username';
        applyButton_1.style.padding = '5px 10px';
        applyButton_1.onclick = function () {
            if (!nameInput_1.value.match(/^[A-Za-z0-9_]+$/)) {
                sendNotification('Error', 'Invalid username format', "./img/Utils/error-icon.png");
                return;
            }
            if (confirm("Are you sure you want to change your username to \"".concat(nameInput_1.value, "\"?"))) {
                sendNotification('Username Changed', "Username changed to ".concat(nameInput_1.value), "./img/Utils/profile-icon.png");
                nameInput_1.value = '';
            }
        };
        var usernameText = document.createElement('span');
        rightColumn.appendChild(usernameText);
        usernameText.textContent = 'Only letters, numbers and underscores allowed';
        usernameText.style.color = '#666';
        usernameText.style.fontSize = '10px';
        usernameText.style.padding = '5px';
        userAccountName.appendChild(nameInfo);
    }
    var userAccountPassword = document.getElementById('settings-app-Password-setting');
    {
        var passwordSettings = document.createElement('div');
        passwordSettings.style.display = 'flex';
        passwordSettings.style.alignItems = 'center';
        userAccountPassword.appendChild(passwordSettings);
        var passwordInfo = document.createElement('div');
        passwordInfo.style.display = 'flex';
        passwordInfo.style.gap = '20px';
        var leftColumn = document.createElement('div');
        leftColumn.style.display = 'flex';
        leftColumn.style.flexDirection = 'column';
        passwordInfo.appendChild(leftColumn);
        var newPasswordTitle = document.createElement('span');
        leftColumn.appendChild(newPasswordTitle);
        newPasswordTitle.textContent = 'New Password:';
        newPasswordTitle.style.fontSize = '12px';
        newPasswordTitle.style.marginBottom = '5px';
        newPasswordTitle.style.fontWeight = 'bold';
        var passwordInput_1 = document.createElement('input');
        leftColumn.appendChild(passwordInput_1);
        passwordInput_1.type = 'password';
        passwordInput_1.style.width = '150px';
        passwordInput_1.style.marginBottom = '10px';
        var confirmPasswordTitle = document.createElement('span');
        leftColumn.appendChild(confirmPasswordTitle);
        confirmPasswordTitle.textContent = 'Confirm Password:';
        confirmPasswordTitle.style.fontSize = '12px';
        confirmPasswordTitle.style.marginBottom = '5px';
        confirmPasswordTitle.style.fontWeight = 'bold';
        var confirmPasswordInput_1 = document.createElement('input');
        leftColumn.appendChild(confirmPasswordInput_1);
        confirmPasswordInput_1.type = 'password';
        confirmPasswordInput_1.style.width = '150px';
        confirmPasswordInput_1.style.marginBottom = '5px';
        var rightColumn = document.createElement('div');
        rightColumn.style.display = 'flex';
        rightColumn.style.flexDirection = 'column';
        rightColumn.style.marginLeft = 'calc(100% - 310px)';
        passwordInfo.appendChild(rightColumn);
        var applyButton_2 = document.createElement('button');
        rightColumn.appendChild(applyButton_2);
        applyButton_2.textContent = 'Change Password';
        applyButton_2.style.padding = '5px 10px';
        applyButton_2.onclick = function () {
            if (passwordInput_1.value !== confirmPasswordInput_1.value) {
                sendNotification('Error', 'Passwords do not match', "./img/Utils/error-icon.png");
                return;
            }
            if (passwordInput_1.value.length < 8) {
                sendNotification('Error', 'Password must be at least 8 characters', "./img/Utils/error-icon.png");
                return;
            }
            if (!/[A-Z]/.test(passwordInput_1.value)) {
                sendNotification('Error', 'Password must contain at least 1 uppercase letter', "./img/Utils/error-icon.png");
                return;
            }
            if (!/[a-z]/.test(passwordInput_1.value)) {
                sendNotification('Error', 'Password must contain at least 1 lowercase letter', "./img/Utils/error-icon.png");
                return;
            }
            if (!/[0-9]/.test(passwordInput_1.value)) {
                sendNotification('Error', 'Password must contain at least 1 number', "./img/Utils/error-icon.png");
                return;
            }
            if (confirm('Are you sure you want to change your password?')) {
                sendNotification('Password Changed', 'Password successfully changed', "./img/Utils/profile-icon.png");
                passwordInput_1.value = '';
                confirmPasswordInput_1.value = '';
            }
        };
        var passwordText = document.createElement('span');
        rightColumn.appendChild(passwordText);
        passwordText.textContent = 'At least 8 characters, 1 uppercase, 1 lowercase, 1 number';
        passwordText.style.color = '#666';
        passwordText.style.fontSize = '10px';
        passwordText.style.padding = '5px';
        userAccountPassword.appendChild(passwordInfo);
    }
});
