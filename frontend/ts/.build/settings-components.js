var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { sendNotification } from "./notification.js";
import { getUserAvatar, uploadFile } from "./API.js";
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
                uploadFile(1, file, 'wallpaper')
                    .then(function (response) {
                    sendNotification('Wallpaper Changed', "Wallpaper changed to ".concat(file.name), "./img/Settings_app/picture-icon.png");
                }).catch(function (error) {
                    console.error('Error uploading wallpaper:', error);
                    sendNotification('Error', 'Failed to upload wallpaper', "./img/Utils/error-icon.png");
                });
                document.body.style.backgroundImage = "url(".concat(URL.createObjectURL(file), ")");
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
        fileInput_2.onchange = function (e) { return __awaiter(void 0, void 0, void 0, function () {
            var file, newAvatar;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
                        if (!file) return [3 /*break*/, 3];
                        return [4 /*yield*/, uploadFile(1, file, 'avatar')];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, getUserAvatar(1)];
                    case 2:
                        newAvatar = _b.sent();
                        if (newAvatar) {
                            console.log("New avatar URL: ", newAvatar);
                            currentAvatarPreview_1.src = newAvatar;
                            currentAvatarName_1.textContent = newAvatar.split('/').pop() || 'default.jpg';
                        }
                        // currentAvatarName.textContent = file.name;
                        // currentAvatarPreview.src = URL.createObjectURL(file);
                        sendNotification('Avatar Changed', "Avatar changed to ".concat(newAvatar), "./img/Utils/profile-icon.png");
                        return [3 /*break*/, 4];
                    case 3:
                        sendNotification('Error', 'No file selected', "./img/Utils/error-icon.png");
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
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
            currentVersion_1.textContent = "Beta 0.7";
            var systemCategoryButton = document.getElementById('settings-app-System-category');
            systemCategoryButton.onclick = function () {
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
            };
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
            restoreSystemButton_1.id = 'restore-system-button';
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
    var regionCategory = document.getElementById('settings-app-region-category-container');
    {
        var regionSettings = document.getElementById('settings-app-Region-setting');
        {
            var regionContainer = document.createElement('div');
            regionSettings.appendChild(regionContainer);
            regionContainer.id = 'region-settings-container';
            regionContainer.style.display = 'flex';
            regionContainer.style.flexDirection = 'column';
            regionContainer.style.alignItems = 'center';
            // Create information element for region settings
            var regionInfo = createInformationElement('Region Settings', regionContainer);
            // Current region selection
            var regionSelectContainer = document.createElement('div');
            regionInfo.appendChild(regionSelectContainer);
            regionSelectContainer.style.display = 'flex';
            regionSelectContainer.style.alignItems = 'center';
            regionSelectContainer.style.marginBottom = '10px';
            var regionLabel = document.createElement('span');
            regionSelectContainer.appendChild(regionLabel);
            regionLabel.textContent = 'Current Region:';
            regionLabel.style.fontSize = '12px';
            regionLabel.style.marginRight = '10px';
            var regionSelect_1 = document.createElement('select');
            regionSelectContainer.appendChild(regionSelect_1);
            regionSelect_1.disabled = true;
            regionSelect_1.style.width = '150px';
            // Add some common regions
            var regions = [
                "United States", "European Union", "United Kingdom",
                "Canada", "Australia", "Japan", "China", "Brazil",
                "India", "Russia", "South Korea", "France"
            ];
            regions.forEach(function (region) {
                var option = document.createElement('option');
                option.value = region.toLowerCase().replace(/\s+/g, '-');
                option.textContent = region;
                if (region === "European Union") {
                    option.selected = true;
                }
                regionSelect_1.appendChild(option);
            });
            // Add unavailable message
            var unavailableMessage = document.createElement('div');
            regionInfo.appendChild(unavailableMessage);
            unavailableMessage.style.backgroundColor = '#FFFFC1';
            unavailableMessage.style.border = '1px solid #DEDB87';
            unavailableMessage.style.padding = '10px';
            unavailableMessage.style.margin = '10px 0';
            unavailableMessage.style.borderRadius = '5px';
            unavailableMessage.style.position = 'relative';
            var warningIcon = document.createElement('div');
            unavailableMessage.appendChild(warningIcon);
            warningIcon.innerHTML = '&#9888;'; // Warning triangle symbol
            warningIcon.style.position = 'absolute';
            warningIcon.style.left = '10px';
            warningIcon.style.top = '50%';
            warningIcon.style.transform = 'translateY(-50%)';
            warningIcon.style.fontSize = '16px';
            warningIcon.style.color = '#E5AD00';
            var messageText = document.createElement('p');
            unavailableMessage.appendChild(messageText);
            messageText.textContent = 'Region settings are not available in this version. This feature will be implemented in a future update.';
            messageText.style.margin = '0 0 0 25px';
            messageText.style.fontSize = '11px';
            messageText.style.color = '#555';
            // Add "Coming Soon" label
            var comingSoonLabel = document.createElement('div');
            regionInfo.appendChild(comingSoonLabel);
            comingSoonLabel.textContent = 'Coming Soon in Windows XPong Update';
            comingSoonLabel.style.color = '#003399';
            comingSoonLabel.style.fontSize = '11px';
            comingSoonLabel.style.fontStyle = 'italic';
            comingSoonLabel.style.fontWeight = 'bold';
            comingSoonLabel.style.textAlign = 'center';
            comingSoonLabel.style.marginTop = '5px';
        }
        var languageSettings = document.getElementById('settings-app-Language-setting');
        {
            var languageContainer = document.createElement('div');
            languageSettings.appendChild(languageContainer);
            languageContainer.id = 'language-settings-container';
            languageContainer.style.display = 'flex';
            languageContainer.style.flexDirection = 'column';
            languageContainer.style.alignItems = 'center';
            // Create information element for language settings
            var languageInfo = createInformationElement('Language Settings', languageContainer);
            // Current language selection
            var languageSelectContainer = document.createElement('div');
            languageInfo.appendChild(languageSelectContainer);
            languageSelectContainer.style.display = 'flex';
            languageSelectContainer.style.alignItems = 'center';
            languageSelectContainer.style.marginBottom = '10px';
            var languageLabel = document.createElement('span');
            languageSelectContainer.appendChild(languageLabel);
            languageLabel.textContent = 'Current Language:';
            languageLabel.style.fontSize = '12px';
            languageLabel.style.marginRight = '10px';
            var languageSelect_1 = document.createElement('select');
            languageSelectContainer.appendChild(languageSelect_1);
            languageSelect_1.disabled = true;
            languageSelect_1.style.width = '150px';
            // Add common languages
            var languages = [
                "English (US)", "English (UK)", "French", "German",
                "Spanish", "Italian", "Portuguese", "Dutch",
                "Russian", "Chinese (Simplified)", "Japanese", "Korean"
            ];
            languages.forEach(function (language) {
                var option = document.createElement('option');
                option.value = language.toLowerCase().replace(/[\s()]+/g, '-');
                option.textContent = language;
                if (language === "English (US)") {
                    option.selected = true;
                }
                languageSelect_1.appendChild(option);
            });
            // Add unavailable message
            var unavailableMessage = document.createElement('div');
            languageInfo.appendChild(unavailableMessage);
            unavailableMessage.style.backgroundColor = '#FFFFC1';
            unavailableMessage.style.border = '1px solid #DEDB87';
            unavailableMessage.style.padding = '10px';
            unavailableMessage.style.margin = '10px 0';
            unavailableMessage.style.borderRadius = '5px';
            unavailableMessage.style.position = 'relative';
            var warningIcon = document.createElement('div');
            unavailableMessage.appendChild(warningIcon);
            warningIcon.innerHTML = '&#9888;'; // Warning triangle symbol
            warningIcon.style.position = 'absolute';
            warningIcon.style.left = '10px';
            warningIcon.style.top = '50%';
            warningIcon.style.transform = 'translateY(-50%)';
            warningIcon.style.fontSize = '16px';
            warningIcon.style.color = '#E5AD00';
            var messageText = document.createElement('p');
            unavailableMessage.appendChild(messageText);
            messageText.textContent = 'Language settings are not available in this version. This feature will be implemented in a future update.';
            messageText.style.margin = '0 0 0 25px';
            messageText.style.fontSize = '11px';
            messageText.style.color = '#555';
            // Add "Coming Soon" label
            var comingSoonLabel = document.createElement('div');
            languageInfo.appendChild(comingSoonLabel);
            comingSoonLabel.textContent = 'Coming Soon in Windows XPong Update';
            comingSoonLabel.style.color = '#003399';
            comingSoonLabel.style.fontSize = '11px';
            comingSoonLabel.style.fontStyle = 'italic';
            comingSoonLabel.style.fontWeight = 'bold';
            comingSoonLabel.style.textAlign = 'center';
            comingSoonLabel.style.marginTop = '5px';
        }
        var timezoneSettings = document.getElementById('settings-app-Time Zone-setting');
        {
            var timezoneContainer = document.createElement('div');
            timezoneSettings.appendChild(timezoneContainer);
            timezoneContainer.id = 'timezone-settings-container';
            timezoneContainer.style.display = 'flex';
            timezoneContainer.style.flexDirection = 'column';
            timezoneContainer.style.alignItems = 'center';
            // Create information element for timezone settings
            var timezoneInfo = createInformationElement('Timezone Settings', timezoneContainer);
            // Current timezone selection
            var timezoneSelectContainer = document.createElement('div');
            timezoneInfo.appendChild(timezoneSelectContainer);
            timezoneSelectContainer.style.display = 'flex';
            timezoneSelectContainer.style.alignItems = 'center';
            timezoneSelectContainer.style.marginBottom = '10px';
            var timezoneLabel = document.createElement('span');
            timezoneSelectContainer.appendChild(timezoneLabel);
            timezoneLabel.textContent = 'Current Timezone:';
            timezoneLabel.style.fontSize = '12px';
            timezoneLabel.style.marginRight = '10px';
            var timezoneSelect_1 = document.createElement('select');
            timezoneSelectContainer.appendChild(timezoneSelect_1);
            timezoneSelect_1.disabled = true;
            timezoneSelect_1.style.width = '150px';
            // Add common timezones
            var timezones = [
                "(GMT-12:00) International Date Line West",
                "(GMT-11:00) Midway Island, Samoa",
                "(GMT-10:00) Hawaii",
                "(GMT-09:00) Alaska",
                "(GMT-08:00) Pacific Time (US & Canada)",
                "(GMT-07:00) Mountain Time (US & Canada)",
                "(GMT-06:00) Central Time (US & Canada)",
                "(GMT-05:00) Eastern Time (US & Canada)",
                "(GMT-04:00) Atlantic Time (Canada)",
                "(GMT-03:00) Brasilia, Buenos Aires",
                "(GMT-02:00) Mid-Atlantic",
                "(GMT-01:00) Azores, Cape Verde Is.",
                "(GMT+00:00) Greenwich Mean Time, Dublin, London",
                "(GMT+01:00) Amsterdam, Berlin, Paris, Rome",
                "(GMT+02:00) Athens, Cairo, Istanbul",
                "(GMT+03:00) Moscow, St. Petersburg",
                "(GMT+04:00) Abu Dhabi, Dubai",
                "(GMT+05:00) Islamabad, Karachi",
                "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
                "(GMT+06:00) Dhaka",
                "(GMT+07:00) Bangkok, Hanoi, Jakarta",
                "(GMT+08:00) Beijing, Hong Kong, Singapore",
                "(GMT+09:00) Tokyo, Seoul",
                "(GMT+10:00) Brisbane, Melbourne, Sydney",
                "(GMT+11:00) Magadan, Solomon Is.",
                "(GMT+12:00) Auckland, Wellington"
            ];
            timezones.forEach(function (timezone) {
                var option = document.createElement('option');
                option.value = timezone.toLowerCase().replace(/[\s()&:,\.]+/g, '-');
                option.textContent = timezone;
                if (timezone === "(GMT+01:00) Amsterdam, Berlin, Paris, Rome") {
                    option.selected = true; // Default to European timezone
                }
                timezoneSelect_1.appendChild(option);
            });
            // Add current time display
            var currentTimeContainer = document.createElement('div');
            timezoneInfo.appendChild(currentTimeContainer);
            currentTimeContainer.style.display = 'flex';
            currentTimeContainer.style.alignItems = 'center';
            currentTimeContainer.style.marginBottom = '10px';
            var currentTimeLabel = document.createElement('span');
            currentTimeContainer.appendChild(currentTimeLabel);
            currentTimeLabel.textContent = 'Current Time:';
            currentTimeLabel.style.fontSize = '12px';
            currentTimeLabel.style.marginRight = '10px';
            var currentTimeDisplay_1 = document.createElement('span');
            currentTimeContainer.appendChild(currentTimeDisplay_1);
            currentTimeDisplay_1.textContent = new Date().toLocaleTimeString();
            currentTimeDisplay_1.style.fontSize = '12px';
            currentTimeDisplay_1.style.fontWeight = 'bold';
            // Update time every second
            setInterval(function () {
                currentTimeDisplay_1.textContent = new Date().toLocaleTimeString();
            }, 1000);
            // Add unavailable message
            var unavailableMessage = document.createElement('div');
            timezoneInfo.appendChild(unavailableMessage);
            unavailableMessage.style.backgroundColor = '#FFFFC1';
            unavailableMessage.style.border = '1px solid #DEDB87';
            unavailableMessage.style.padding = '10px';
            unavailableMessage.style.margin = '10px 0';
            unavailableMessage.style.borderRadius = '5px';
            unavailableMessage.style.position = 'relative';
            var warningIcon = document.createElement('div');
            unavailableMessage.appendChild(warningIcon);
            warningIcon.innerHTML = '&#9888;'; // Warning triangle symbol
            warningIcon.style.position = 'absolute';
            warningIcon.style.left = '10px';
            warningIcon.style.top = '50%';
            warningIcon.style.transform = 'translateY(-50%)';
            warningIcon.style.fontSize = '16px';
            warningIcon.style.color = '#E5AD00';
            var messageText = document.createElement('p');
            unavailableMessage.appendChild(messageText);
            messageText.textContent = 'Timezone settings are not available in this version. This feature will be implemented in a future update.';
            messageText.style.margin = '0 0 0 25px';
            messageText.style.fontSize = '11px';
            messageText.style.color = '#555';
            // Add "Coming Soon" label
            var comingSoonLabel = document.createElement('div');
            timezoneInfo.appendChild(comingSoonLabel);
            comingSoonLabel.textContent = 'Coming Soon in Windows XPong Update';
            comingSoonLabel.style.color = '#003399';
            comingSoonLabel.style.fontSize = '11px';
            comingSoonLabel.style.fontStyle = 'italic';
            comingSoonLabel.style.fontWeight = 'bold';
            comingSoonLabel.style.textAlign = 'center';
            comingSoonLabel.style.marginTop = '5px';
        }
    }
    var accessibilityCategory = document.getElementById('settings-app-accessibility-category-container');
    {
        var wipMessage = document.getElementById('settings-app-Work in progress-setting');
        if (wipMessage) {
            var accessibilityContainer = document.createElement('div');
            wipMessage.appendChild(accessibilityContainer);
            accessibilityContainer.id = 'accessibility-settings-container';
            accessibilityContainer.style.display = 'flex';
            accessibilityContainer.style.flexDirection = 'column';
            accessibilityContainer.style.alignItems = 'center';
            accessibilityContainer.style.padding = '10px';
            // Create information element for accessibility message
            var accessibilityInfo = createInformationElement('Accessibility Settings', accessibilityContainer);
            // Add feature description
            var featureDescription = document.createElement('p');
            accessibilityInfo.appendChild(featureDescription);
            featureDescription.textContent = 'This section will contain settings for screen readers, high contrast themes, keyboard navigation, and other accessibility features.';
            featureDescription.style.fontSize = '11px';
            featureDescription.style.margin = '5px 0 15px 0';
            // Add unavailable message box
            var unavailableMessage = document.createElement('div');
            accessibilityInfo.appendChild(unavailableMessage);
            unavailableMessage.style.backgroundColor = '#FFFFC1';
            unavailableMessage.style.border = '1px solid #DEDB87';
            unavailableMessage.style.padding = '10px';
            unavailableMessage.style.margin = '10px 0';
            unavailableMessage.style.borderRadius = '5px';
            unavailableMessage.style.position = 'relative';
            var warningIcon = document.createElement('div');
            unavailableMessage.appendChild(warningIcon);
            warningIcon.innerHTML = '&#9888;'; // Warning triangle symbol
            warningIcon.style.position = 'absolute';
            warningIcon.style.left = '10px';
            warningIcon.style.top = '50%';
            warningIcon.style.transform = 'translateY(-50%)';
            warningIcon.style.fontSize = '16px';
            warningIcon.style.color = '#E5AD00';
            var messageText = document.createElement('p');
            unavailableMessage.appendChild(messageText);
            messageText.textContent = 'Accessibility settings are not available in this version. These features will be implemented in a future update of Windows XPong.';
            messageText.style.margin = '0 0 0 25px';
            messageText.style.fontSize = '11px';
            messageText.style.color = '#555';
            // Windows XP-style "Coming Soon" label
            var comingSoonLabel = document.createElement('div');
            accessibilityInfo.appendChild(comingSoonLabel);
            comingSoonLabel.textContent = 'Coming Soon in Windows XPong Update';
            comingSoonLabel.style.color = '#003399';
            comingSoonLabel.style.fontSize = '11px';
            comingSoonLabel.style.fontStyle = 'italic';
            comingSoonLabel.style.fontWeight = 'bold';
            comingSoonLabel.style.textAlign = 'center';
            comingSoonLabel.style.marginTop = '10px';
            comingSoonLabel.style.padding = '5px';
            comingSoonLabel.style.backgroundImage = 'linear-gradient(to bottom, #E5EFFF, #C4DDFF)';
            comingSoonLabel.style.border = '1px solid #B1CCEF';
            comingSoonLabel.style.borderRadius = '3px';
            comingSoonLabel.style.width = '80%';
        }
    }
    var privacyCategory = document.getElementById('settings-app-privacy-category-container');
    {
        var privacyPolicySettings = document.getElementById('settings-app-Privacy Policy-setting');
        {
            var privacyContainer = document.createElement('div');
            privacyPolicySettings.appendChild(privacyContainer);
            privacyContainer.id = 'privacy-policy-container';
            privacyContainer.style.display = 'flex';
            privacyContainer.style.flexDirection = 'column';
            privacyContainer.style.alignItems = 'center';
            // Main privacy policy information
            var policyInfo = createInformationElement('Privacy Policy', privacyContainer);
            // Create a styled div for the policy text that resembles a Windows XP text area
            var policyTextArea = document.createElement('div');
            policyInfo.appendChild(policyTextArea);
            policyTextArea.style.backgroundColor = '#FFFFFF';
            policyTextArea.style.border = '1px solid #7A9BC8';
            policyTextArea.style.padding = '10px';
            policyTextArea.style.margin = '5px 0';
            policyTextArea.style.borderRadius = '3px';
            policyTextArea.style.height = '200px';
            policyTextArea.style.overflowY = 'auto';
            policyTextArea.style.fontSize = '11px';
            policyTextArea.style.color = '#333333';
            policyTextArea.style.lineHeight = '1.4';
            // Privacy policy content with Windows XP style formatting
            policyTextArea.innerHTML = "\n\t\t\t\t<div style=\"font-weight:bold; color:#003399; margin-bottom:10px; font-size:12px;\">Windows XPong Privacy Commitment</div>\n\t\t\t\t\n\t\t\t\t<p>At Windows XPong, we are committed to protecting your privacy and ensuring your personal data remains secure. Unlike many online services, our platform operates with minimal data collection and adheres to strict privacy principles.</p>\n\t\t\t\t\n\t\t\t\t<p>We believe your gaming experience should be free from unwanted distractions. That's why we <span style=\"font-weight:bold;\">do not employ any targeted advertising</span> on our platform. Your activity within Windows XPong is never tracked for marketing purposes, and we do not build user profiles for advertisers.</p>\n\t\t\t\t\n\t\t\t\t<p>Furthermore, we've designed Windows XPong to be accessible with minimal personal information. Most features and functions of our platform are available without requiring you to provide sensitive personal details. We only collect information that is necessary to provide you with our services.</p>\n\t\t\t\t\n\t\t\t\t<div style=\"font-weight:bold; color:#003399; margin:10px 0; font-size:12px;\">Your Data Rights (GDPR Compliance)</div>\n\t\t\t\t\n\t\t\t\t<p>Windows XPong fully complies with the European General Data Protection Regulation (GDPR). This means you have the right to:</p>\n\t\t\t\t\n\t\t\t\t<ul style=\"margin-left:20px; margin-top:5px;\">\n\t\t\t\t\t<li>Access your personal data that we may hold</li>\n\t\t\t\t\t<li>Request the correction of inaccurate information</li>\n\t\t\t\t\t<li>Request the deletion of your personal data</li>\n\t\t\t\t\t<li>Object to the processing of your data</li>\n\t\t\t\t\t<li>Request the transfer of your data (data portability)</li>\n\t\t\t\t</ul>\n\t\t\t\t\n\t\t\t\t<p>As stated in Article 5 of the GDPR, personal data shall be: \"collected for specified, explicit and legitimate purposes and not further processed in a manner that is incompatible with those purposes.\"</p>\n\t\t\t\t\n\t\t\t\t<p>For more information about your rights under the GDPR, you can visit the <a href=\"https://gdpr-info.eu/\" style=\"color:#0066CC; text-decoration:underline;\">official GDPR portal</a> or the <a href=\"https://ec.europa.eu/info/law/law-topic/data-protection_en\" style=\"color:#0066CC; text-decoration:underline;\">European Commission's data protection website</a>.</p>\n\t\t\t\t\n\t\t\t\t<div style=\"font-weight:bold; color:#003399; margin:10px 0; font-size:12px;\">Cookies and Local Storage</div>\n\t\t\t\t\n\t\t\t\t<p>Windows XPong uses only essential cookies and local storage that are necessary for the platform to function properly. We do not use any tracking cookies for marketing or analytics purposes that could compromise your privacy.</p>\n\t\t\t\t\n\t\t\t\t<div style=\"font-weight:bold; color:#003399; margin:10px 0; font-size:12px;\">Contact Information</div>\n\t\t\t\t\n\t\t\t\t<p>If you have any questions or concerns about our privacy practices, please don't hesitate to contact our data protection team at <a href=\"mailto:privacy@windowsxpong.example\" style=\"color:#0066CC; text-decoration:underline;\">privacy@windowsxpong.example</a>.</p>\n\t\t\t\t\n\t\t\t\t<div style=\"background-color:#F2F5FB; border:1px solid #D1E0F0; padding:10px; margin-top:10px; border-radius:3px;\">\n\t\t\t\t\t<p style=\"margin:0; font-style:italic;\">\"The protection of natural persons in relation to the processing of personal data is a fundamental right.\" \u2014 Recital 1, GDPR</p>\n\t\t\t\t</div>\n\t\t\t";
            // GDPR information element
            var gdprInfo = createInformationElement('GDPR Compliance', privacyContainer);
            // Create GDPR information with Windows XP style
            var gdprContent = document.createElement('div');
            gdprInfo.appendChild(gdprContent);
            gdprContent.style.padding = '5px';
            var gdprText = document.createElement('p');
            gdprContent.appendChild(gdprText);
            gdprText.innerHTML = "Windows XPong complies with the General Data Protection Regulation (GDPR), which protects EU citizens' data privacy. We implement appropriate technical and organizational measures to ensure data security.";
            gdprText.style.fontSize = '11px';
            gdprText.style.margin = '5px 0';
            // Add Windows XP themed GDPR shield icon
            var gdprShield = document.createElement('div');
            gdprContent.appendChild(gdprShield);
            gdprShield.style.display = 'flex';
            gdprShield.style.alignItems = 'center';
            gdprShield.style.justifyContent = 'center';
            gdprShield.style.margin = '10px 0';
            var shieldIcon = document.createElement('img');
            gdprShield.appendChild(shieldIcon);
            shieldIcon.src = './img/Settings_app/privacy-icon.png';
            shieldIcon.alt = 'GDPR Protection Shield';
            shieldIcon.style.width = '32px';
            shieldIcon.style.height = '32px';
            shieldIcon.style.marginRight = '10px';
            var shieldText = document.createElement('span');
            gdprShield.appendChild(shieldText);
            shieldText.textContent = 'Your data is protected under GDPR guidelines';
            shieldText.style.fontSize = '11px';
            shieldText.style.fontWeight = 'bold';
            shieldText.style.color = '#003399';
            // Add GDPR related links
            var gdprLinks_1 = document.createElement('div');
            gdprContent.appendChild(gdprLinks_1);
            gdprLinks_1.style.marginTop = '10px';
            var linksTitle = document.createElement('span');
            gdprLinks_1.appendChild(linksTitle);
            linksTitle.textContent = 'Learn more about data protection:';
            linksTitle.style.display = 'block';
            linksTitle.style.fontSize = '11px';
            linksTitle.style.marginBottom = '5px';
            // Create Windows XP style links
            var createXpLink = function (text, url) {
                var link = document.createElement('a');
                gdprLinks_1.appendChild(link);
                link.href = url;
                link.textContent = text;
                link.target = '_blank';
                link.style.display = 'block';
                link.style.fontSize = '11px';
                link.style.color = '#0066CC';
                link.style.textDecoration = 'none';
                link.style.padding = '2px 0 2px 20px';
                link.style.backgroundImage = 'url("./img/Utils/link-icon.png")';
                link.style.backgroundRepeat = 'no-repeat';
                link.style.backgroundPosition = 'left center';
                link.style.backgroundSize = '16px 16px';
                link.onmouseover = function () {
                    link.style.textDecoration = 'underline';
                };
                link.onmouseout = function () {
                    link.style.textDecoration = 'none';
                };
                return link;
            };
            createXpLink('Official EU GDPR Portal', 'https://gdpr-info.eu/');
            createXpLink('European Commission - Data Protection', 'https://ec.europa.eu/info/law/law-topic/data-protection_en');
            createXpLink('Your GDPR Rights Explained', 'https://gdpr.eu/rights-data-subjects/');
            // Data collection information
            var dataInfo = createInformationElement('Data Collection', privacyContainer);
            var dataContent_1 = document.createElement('div');
            dataInfo.appendChild(dataContent_1);
            dataContent_1.style.padding = '5px';
            // Create Windows XP themed toggle switches for data collection options
            var createToggleOption = function (optionText, defaultChecked) {
                var optionContainer = document.createElement('div');
                dataContent_1.appendChild(optionContainer);
                optionContainer.style.display = 'flex';
                optionContainer.style.alignItems = 'center';
                optionContainer.style.margin = '5px 0';
                var checkbox = document.createElement('input');
                optionContainer.appendChild(checkbox);
                checkbox.type = 'checkbox';
                checkbox.checked = defaultChecked;
                checkbox.style.marginRight = '10px';
                var label = document.createElement('span');
                optionContainer.appendChild(label);
                label.textContent = optionText;
                label.style.fontSize = '11px';
                return optionContainer;
            };
            var dataIntro = document.createElement('p');
            dataContent_1.appendChild(dataIntro);
            dataIntro.textContent = 'Control what data Windows XPong collects. Most features work without any data collection.';
            dataIntro.style.fontSize = '11px';
            dataIntro.style.margin = '5px 0 10px 0';
            // Add Windows XP themed toggle options
            createToggleOption('Allow essential cookies for basic functionality', true);
            createToggleOption('Participate in anonymous usage statistics', false);
            createToggleOption('Save game preferences locally', true);
            createToggleOption('Remember login session', true);
            var dataNote = document.createElement('p');
            dataContent_1.appendChild(dataNote);
            dataNote.innerHTML = '<strong>Note:</strong> Changes to privacy settings may require a system restart to take effect.';
            dataNote.style.fontSize = '10px';
            dataNote.style.fontStyle = 'italic';
            dataNote.style.margin = '10px 0 5px 0';
            dataNote.style.color = '#666666';
            // Add Windows XP themed "Apply Changes" button
            var applyButton_3 = document.createElement('button');
            dataContent_1.appendChild(applyButton_3);
            applyButton_3.textContent = 'Apply Changes';
            applyButton_3.style.marginTop = '10px';
            applyButton_3.style.padding = '3px 10px';
            applyButton_3.onclick = function () {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                // Collect privacy settings from checkboxes
                var privacySettings = {
                    essentialCookies: (_b = (_a = document.querySelector('input[type="checkbox"]:nth-of-type(1)')) === null || _a === void 0 ? void 0 : _a.checked) !== null && _b !== void 0 ? _b : true,
                    usageStatistics: (_d = (_c = document.querySelector('input[type="checkbox"]:nth-of-type(2)')) === null || _c === void 0 ? void 0 : _c.checked) !== null && _d !== void 0 ? _d : false,
                    saveGamePreferences: (_f = (_e = document.querySelector('input[type="checkbox"]:nth-of-type(3)')) === null || _e === void 0 ? void 0 : _e.checked) !== null && _f !== void 0 ? _f : true,
                    rememberLogin: (_h = (_g = document.querySelector('input[type="checkbox"]:nth-of-type(4)')) === null || _g === void 0 ? void 0 : _g.checked) !== null && _h !== void 0 ? _h : true
                };
                // Temporary notification until API is integrated
                sendNotification('Privacy Settings', 'Your privacy settings have been updated', "./img/Settings_app/privacy-icon.png");
                // For development testing only - log the settings that would be sent
                console.log('Privacy settings to be sent to API:', privacySettings);
            };
        }
    }
});
