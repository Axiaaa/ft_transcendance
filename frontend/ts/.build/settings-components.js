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
        currentWallpaperName_1.style.fontSize = '11px';
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
    // System Settings
    function createInformationElement(Name, Container) {
        var Element = document.createElement('div');
        Element.id = Name.toLowerCase().replace(' ', '-') + "-info";
        Container.appendChild(Element);
        Element.style.position = 'relative';
        Element.style.width = 'calc(100% - 20px)';
        Element.style.padding = '10px';
        Element.style.border = '1px solid #ddd';
        Element.style.borderRadius = '5px';
        Element.style.backgroundColor = '#f9f9f9';
        Element.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.1)';
        Element.style.display = 'flex';
        Element.style.flexDirection = 'column';
        Element.style.gap = '5px';
        Element.style.margin = '10px';
        var ElementTitle = document.createElement('span');
        Element.appendChild(ElementTitle);
        ElementTitle.textContent = Name;
        ElementTitle.style.fontSize = '12px';
        ElementTitle.style.fontWeight = 'bold';
        ElementTitle.style.margin = '5px';
        ElementTitle.style.marginBottom = '0';
        ElementTitle.style.textShadow = '0 0 5px rgba(0, 0, 0, 0.1)';
        var ElementSubTitleBar = document.createElement('hr');
        Element.appendChild(ElementSubTitleBar);
        ElementSubTitleBar.style.width = '100%';
        ElementSubTitleBar.style.margin = '5px';
        ElementSubTitleBar.style.marginTop = '0';
        ElementSubTitleBar.style.marginBottom = '10px';
        ElementSubTitleBar.style.border = '0';
        ElementSubTitleBar.style.borderTop = '1px solid #ddd';
        ElementSubTitleBar.style.borderBottom = '1px solid #fff';
        ElementSubTitleBar.style.height = '1px';
        ElementSubTitleBar.style.backgroundColor = 'rgba(0, 0, 0, 0.39)';
        ElementSubTitleBar.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.1)';
        return Element;
    }
    function createFormatedSpan(Container) {
        var Span = document.createElement('span');
        Container.appendChild(Span);
        Span.style.overflow = 'hidden';
        Span.style.textOverflow = 'ellipsis';
        Span.style.whiteSpace = 'nowrap';
        Span.style.maxWidth = 'calc(100% - 20px)';
        Span.style.maxHeight = '50px';
        Span.style.fontSize = '11px';
        Span.style.margin = '10px';
        Span.style.marginTop = '0';
        Span.style.marginBottom = '0';
        return Span;
    }
    var systemSettingsContainer = document.getElementById('settings-app-system-settings-container');
    {
        // System Informations
        var systemInformationsBox = document.getElementById('settings-app-System Information-setting');
        {
            var systemInformationsContainer = document.createElement('div');
            systemInformationsBox.appendChild(systemInformationsContainer);
            systemInformationsContainer.id = 'system-informations-container';
            systemInformationsContainer.style.display = 'flex';
            systemInformationsContainer.style.flexDirection = 'column';
            systemInformationsContainer.style.alignItems = 'center';
            var sysInfo1 = createInformationElement('System Name', systemInformationsContainer);
            var sysInfo2 = createInformationElement('System Version', systemInformationsContainer);
            var sysInfo3 = createInformationElement('Creators', systemInformationsContainer);
            var sysInfo4 = createInformationElement('Creation Date', systemInformationsContainer);
            var sysInfo5 = createInformationElement('Last Update', systemInformationsContainer);
            var sysInfo6 = createInformationElement('Github Repository', systemInformationsContainer);
            var sysInfo7 = createInformationElement('License', systemInformationsContainer);
            var systemName = createFormatedSpan(sysInfo1);
            systemName.textContent = "Windows XPong (Transcendance Edition)";
            var systemVersion = createFormatedSpan(sysInfo2);
            systemVersion.textContent = "Beta 0.7";
            var creators = createFormatedSpan(sysInfo3);
            creators.textContent = "Jcuzin; Lcamerly; Mcourbon; Aammirat; Yallo";
            var creationDate = createFormatedSpan(sysInfo4);
            creationDate.textContent = "2025-01-12";
            var lastUpdate_1 = createFormatedSpan(sysInfo5);
            var lastUpdateText_1 = "";
            fetch('https://api.github.com/repos/Axiaaa/ft_transcendance/commits/main')
                .then(function (response) { return response.json(); })
                .then(function (data) {
                lastUpdateText_1 = data.commit.author.date.split('T')[0];
                console.log('Last commit date:', lastUpdateText_1);
                lastUpdate_1.textContent = lastUpdateText_1;
            })
                .catch(function (error) {
                console.error('Error fetching last commit date:', error);
                lastUpdateText_1 = "2025-01-12"; // Fallback date if fetch fails
                lastUpdate_1.textContent = lastUpdateText_1;
            });
            var githubRepoURL = document.createElement('a');
            githubRepoURL.href = 'https://github.com/Axiaaa/ft_transcendance';
            githubRepoURL.textContent = 'Open on Github';
            githubRepoURL.target = '_blank'; // Add this line to open in new tab
            githubRepoURL.style.color = '#007bff';
            githubRepoURL.style.textDecoration = 'none';
            var githubRepo = createFormatedSpan(sysInfo6);
            githubRepo.appendChild(githubRepoURL);
            var license_1 = createFormatedSpan(sysInfo7);
            var licensePromise = fetch('https://api.github.com/repos/Axiaaa/ft_transcendance/license')
                .then(function (response) { return response.json(); })
                .then(function (data) {
                var _a;
                return ((_a = data.license) === null || _a === void 0 ? void 0 : _a.name) || 'License information not available';
            })
                .catch(function (error) {
                console.error('Error fetching license:', error);
                return 'License information not available';
            });
            licensePromise.then(function (licenseText) { return license_1.textContent = licenseText; });
            sysInfo1.appendChild(systemName);
            sysInfo2.appendChild(systemVersion);
            sysInfo3.appendChild(creators);
            sysInfo4.appendChild(creationDate);
            sysInfo5.appendChild(lastUpdate_1);
            sysInfo6.appendChild(githubRepo);
            sysInfo7.appendChild(license_1);
        }
        var systemUpdatesBox = document.getElementById('settings-app-System Update-setting');
        {
            var systemUpdatesContainer = document.createElement('div');
            systemUpdatesBox.appendChild(systemUpdatesContainer);
            systemUpdatesContainer.id = 'system-updates-container';
            systemUpdatesContainer.style.display = 'flex';
            systemUpdatesContainer.style.flexDirection = 'column';
            systemUpdatesContainer.style.alignItems = 'center';
            var updateInfo1 = createInformationElement('Current Version', systemUpdatesContainer);
            var updateInfo2 = createInformationElement('Latest Version Status', systemUpdatesContainer);
            var currentVersion_1 = createFormatedSpan(updateInfo1);
            var currentVersionText = fetch('https://api.github.com/repos/Axiaaa/ft_transcendance/releases/latest')
                .then(function (response) { return response.json(); })
                .then(function (data) {
                var version = data.tag_name;
                if (version.startsWith('0.')) {
                    version = 'Beta ' + version;
                }
                currentVersion_1.textContent = version;
                return version;
            })
                .catch(function (error) {
                console.error('Error fetching current version:', error);
                var fallbackVersion = 'Beta 0.7';
                currentVersion_1.textContent = fallbackVersion;
                return fallbackVersion;
            });
            var latestVersionStatus_1 = createFormatedSpan(updateInfo2);
            var latestVersionStatusText_1 = "";
            var latestVersionStatusCheckButton_1 = document.createElement('button');
            updateInfo2.appendChild(latestVersionStatusCheckButton_1);
            latestVersionStatusCheckButton_1.onclick = function () {
                latestVersionStatusCheckButton_1.textContent = 'Checking...';
                latestVersionStatusCheckButton_1.disabled = true;
                fetch('https://api.github.com/repos/Axiaaa/ft_transcendance/releases/latest')
                    .then(function (response) { return response.json(); })
                    .then(function (data) {
                    latestVersionStatusText_1 = data.tag_name;
                    console.log('Latest version:', latestVersionStatusText_1);
                    latestVersionStatus_1.textContent = latestVersionStatusText_1;
                    if (!latestVersionStatusText_1 || latestVersionStatusText_1.includes('API rate limit exceeded')) {
                        sendNotification('Error', 'Failed to check version', "./img/Utils/error-icon.png");
                    }
                    else if (latestVersionStatusText_1 === currentVersion_1.textContent) {
                        sendNotification('System Update', 'System is up to date', "./img/Utils/update-icon.png");
                    }
                    else {
                        sendNotification('System Update', 'New version available', "./img/Utils/update-icon.png");
                    }
                    latestVersionStatusCheckButton_1.textContent = 'Check for Updates';
                })
                    .catch(function (error) {
                    console.error('Error fetching latest version:', error);
                    latestVersionStatusText_1 = "Beta 0.7"; // Fallback version if fetch fails
                    latestVersionStatus_1.textContent = latestVersionStatusText_1;
                    sendNotification('Error', 'Failed to check for updates', "./img/Utils/error-icon.png");
                    latestVersionStatusCheckButton_1.textContent = 'Check for Updates';
                });
                setTimeout(function () { return latestVersionStatusCheckButton_1.disabled = false; }, 3000);
            };
            latestVersionStatusCheckButton_1.textContent = 'Check for Updates';
            latestVersionStatusCheckButton_1.style.padding = '5px 10px';
            latestVersionStatusCheckButton_1.style.margin = '10px';
            latestVersionStatusCheckButton_1.style.marginTop = '0';
            latestVersionStatusCheckButton_1.style.marginBottom = '0';
            updateInfo1.appendChild(currentVersion_1);
            updateInfo2.appendChild(latestVersionStatus_1);
        }
        var systemRestoreBox = document.getElementById('settings-app-System Restore-setting');
        {
            var systemRestoreContainer = document.createElement('div');
            systemRestoreBox.appendChild(systemRestoreContainer);
            systemRestoreContainer.id = 'system-restore-container';
            systemRestoreContainer.style.display = 'flex';
            systemRestoreContainer.style.flexDirection = 'column';
            systemRestoreContainer.style.alignItems = 'center';
            var restoreInfo1 = createInformationElement('Restore System', systemRestoreContainer);
            var restoreSystemButton_1 = document.createElement('button');
            restoreInfo1.appendChild(restoreSystemButton_1);
            restoreSystemButton_1.textContent = 'Restore System';
            restoreSystemButton_1.style.padding = '5px 10px';
            restoreSystemButton_1.style.margin = '10px';
            restoreSystemButton_1.style.marginTop = '0';
            restoreSystemButton_1.style.marginBottom = '0';
            restoreSystemButton_1.onclick = function () {
                restoreSystemButton_1.disabled = true;
                restoreSystemButton_1.textContent = 'Restoring...';
                if (confirm('Are you sure you want to restore the system ?')) {
                    sendNotification('System Restore', 'System restored to default settings', "./img/Utils/restore-icon.png");
                }
                setTimeout(function () {
                    restoreSystemButton_1.disabled = false;
                    restoreSystemButton_1.textContent = 'Restore System';
                }, 3000);
            };
        }
    }
});
