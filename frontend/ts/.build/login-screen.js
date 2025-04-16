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
import { getUserAvatar, getUserBackground } from "./API.js";
import { getUser } from "./API.js";
import { createUser } from "./API.js";
import { initHistoryAPI } from "./system.js";
import { goToDesktopPage } from "./system.js";
import { goToLoginPage } from "./system.js";
var titleScreenBackground = document.createElement('div');
titleScreenBackground.id = 'title-screen-background';
document.body.appendChild(titleScreenBackground);
titleScreenBackground.style.width = '100%';
titleScreenBackground.style.height = '100%';
titleScreenBackground.style.position = 'absolute';
titleScreenBackground.style.zIndex = '9999';
titleScreenBackground.style.display = 'block';
titleScreenBackground.style.top = '0';
titleScreenBackground.style.left = '0';
titleScreenBackground.style.backgroundColor = 'black';
titleScreenBackground.style.overflow = 'hidden';
titleScreenBackground.style.transition = 'all 0.75s ease-in-out';
var titleScreen = document.createElement('img');
titleScreen.id = 'title-screen';
titleScreenBackground.appendChild(titleScreen);
titleScreen.src = './img/Login_Screen/WindowsXPong_TitleScreen.gif';
titleScreen.style.width = '100%';
titleScreen.style.height = 'auto';
titleScreen.style.maxWidth = '1280px';
titleScreen.style.maxHeight = '720px';
titleScreen.style.margin = 'auto';
titleScreen.style.position = 'absolute';
titleScreen.style.zIndex = '9999';
titleScreen.style.display = 'block';
titleScreen.style.top = '50%';
titleScreen.style.transform = 'translateY(-50%)';
titleScreen.style.left = '50%';
titleScreen.style.transform = 'translate(-50%, -50%)';
titleScreen.addEventListener('click', function () {
    titleScreenBackground.style.opacity = '0';
    titleScreen.style.opacity = '0';
    setTimeout(function () {
        titleScreenBackground.style.display = 'none';
        titleScreenBackground.remove();
    }, 750);
});
setTimeout(function () {
    titleScreenBackground.style.opacity = '0';
    setTimeout(function () {
        titleScreenBackground.style.display = 'none';
        titleScreenBackground.remove();
    }, 750);
}, 4000);
initHistoryAPI();
document.addEventListener('DOMContentLoaded', function () {
    var loginScreen = document.getElementsByClassName("login-screen")[0];
    // Visual Effect Addons
    var loginScreenMiddleBar = document.createElement('div');
    loginScreenMiddleBar.className = 'login-screen-middle-bar';
    var style = document.createElement('style');
    style.textContent = "\n\t\t\t.login-screen-middle-bar {\n\t\t\t\tposition: absolute;\n\t\t\t\tbackground: linear-gradient(180deg, transparent 0%, rgb(187, 187, 187) 50%, transparent 100%);\n\t\t\t\twidth: 2px;\n\t\t\t\theight: 80%;\n\t\t\t\tz-index: 1000;\n\t\t\t\tleft: 50%;\n\t\t\t\ttop: 10%;\n\t\t\t}\n\t\t";
    document.head.appendChild(style);
    var loginScreenTopBar = document.createElement('div');
    loginScreenTopBar.className = 'login-screen-top-bar';
    var topBarStyle = document.createElement('style');
    topBarStyle.textContent = "\n\t\t\t.login-screen-top-bar {\n\t\t\t\tposition: absolute;\n\t\t\t\tbackground: linear-gradient(90deg, transparent 0%, rgb(231, 231, 231) 50%, transparent 100%);\n\t\t\t\theight: 4px;\n\t\t\t\twidth: 80%;\n\t\t\t\tz-index: 1000;\n\t\t\t\tleft: 5%;\n\t\t\t\ttop: 10%;\n\t\t\t}\n\t\t";
    document.head.appendChild(topBarStyle);
    loginScreen.appendChild(loginScreenTopBar);
    loginScreen.appendChild(loginScreenMiddleBar);
    // DEFAULTS DISPLAY SETTINGS
    loginScreen.style.display = 'block';
    var profiles = document.getElementsByClassName("login-screen-right-profile-box");
    var NewProfile = document.getElementById("new-profile");
    var _loop_1 = function (i) {
        var profile = profiles[i];
        var isClicked = false;
        var isHovered = false;
        profile.addEventListener('mousedown', function () {
            isClicked = true;
            if (isHovered)
                profile.style.backgroundColor = 'rgba(41, 74, 127, 0.75)';
            else
                profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
            profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
            profile.style.backgroundColor = 'transparent';
        });
        profile.addEventListener('click', function () {
            if (profile.id !== 'new-profile')
                loginScreen.style.display = 'none';
        });
        profile.addEventListener('mouseup', function () {
            isClicked = false;
            if (isHovered)
                profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
            else
                profile.style.backgroundColor = 'transparent';
        });
        profile.addEventListener('mouseenter', function () {
            isHovered = true;
            if (isClicked)
                profile.style.backgroundColor = 'rgba(41, 74, 127, 0.75)';
            else
                profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
        });
        profile.addEventListener('mouseleave', function () {
            isHovered = false;
            profile.style.backgroundColor = 'transparent';
        });
    };
    for (var i = 0; i < profiles.length; i++) {
        _loop_1(i);
    }
    var form = document.getElementsByClassName("login-screen-formulary")[0];
    form.style.display = 'none';
    var backbutton = document.createElement('img');
    backbutton.id = 'login-screen-back-button';
    backbutton.className = 'go-to-login';
    backbutton.src = './img/Utils/back-icon.png';
    backbutton.style.width = '35px';
    backbutton.style.height = '35px';
    backbutton.style.position = 'absolute';
    backbutton.style.left = '5%';
    backbutton.style.top = 'calc(50% - 100px)';
    backbutton.style.bottom = '10px';
    backbutton.style.cursor = 'pointer';
    backbutton.style.overflow = 'hidden';
    form.appendChild(backbutton);
    backbutton.addEventListener('click', function () {
        var existingErrorBox = document.querySelector('.error-box');
        if (existingErrorBox) {
            existingErrorBox.remove();
        }
        goToLoginPage();
        form.style.display = 'none';
        for (var i = 0; i < profiles.length; i++) {
            profiles[i].style.display = 'block';
        }
    });
    backbutton.addEventListener('mouseenter', function () {
        backbutton.style.filter = 'brightness(1.2)';
    });
    backbutton.addEventListener('mouseleave', function () {
        backbutton.style.filter = 'brightness(1)';
    });
    NewProfile.addEventListener('click', function () {
        for (var i = 0; i < profiles.length; i++) {
            profiles[i].style.display = 'none';
        }
        form.style.display = 'block';
    });
});
export function updateUserImages(fileAvatar, fileWallpaper) {
    return __awaiter(this, void 0, void 0, function () {
        var userID, avatarURL, wallpaperURL, userAvatars, i, userWallpapers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userID = Number(sessionStorage.getItem("wxp_user_id"));
                    if (userID == null)
                        return [2 /*return*/];
                    avatarURL = null;
                    wallpaperURL = null;
                    if (!fileAvatar) return [3 /*break*/, 1];
                    avatarURL = URL.createObjectURL(fileAvatar);
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, getUserAvatar(userID)];
                case 2:
                    avatarURL = _a.sent();
                    _a.label = 3;
                case 3:
                    userAvatars = document.getElementsByClassName("avatar-preview");
                    console.log("userAvatars: " + userAvatars.length + " | " + "avatarURL" + avatarURL);
                    if (avatarURL == null || avatarURL == undefined)
                        avatarURL = "./img/Start_Menu/demo-user-profile-icon.jpg";
                    for (i = 0; i < userAvatars.length; i++) {
                        console.log(userAvatars[i] + " now = " + avatarURL);
                        userAvatars[i].src = avatarURL;
                    }
                    if (!fileWallpaper) return [3 /*break*/, 4];
                    wallpaperURL = URL.createObjectURL(fileWallpaper);
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, getUserBackground(userID)];
                case 5:
                    wallpaperURL = _a.sent();
                    _a.label = 6;
                case 6:
                    if (wallpaperURL == null || wallpaperURL == undefined)
                        wallpaperURL = "./img/Desktop/linus-wallpaper.jpg";
                    userWallpapers = document.getElementsByClassName("user-background");
                    console.log("userWallpapers: " + userWallpapers.length + " | " + "wallpaperURL" + wallpaperURL);
                    userWallpapers[0].src = wallpaperURL;
                    return [2 /*return*/];
            }
        });
    });
}
;
// SANDBOX AREA
export function showError(message) {
    return __awaiter(this, void 0, void 0, function () {
        var errorBox, existingErrorBox;
        return __generator(this, function (_a) {
            errorBox = document.createElement('div');
            errorBox.className = 'error-box';
            errorBox.textContent = message;
            errorBox.style.position = 'fixed';
            errorBox.style.top = '10px';
            errorBox.style.left = '50%';
            errorBox.style.transform = 'translateX(-50%)';
            errorBox.style.backgroundColor = 'red';
            errorBox.style.color = 'white';
            errorBox.style.padding = '10px 20px';
            errorBox.style.borderRadius = '5px';
            errorBox.style.zIndex = '1000';
            errorBox.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            errorBox.style.fontSize = '14px';
            errorBox.style.fontWeight = 'bold';
            existingErrorBox = document.querySelector('.error-box');
            if (existingErrorBox) {
                existingErrorBox.remove();
            }
            document.body.appendChild(errorBox);
            return [2 /*return*/];
        });
    });
}
{
    var signUpForm = document.getElementById("sign-up-form");
    var signUpButton = document.getElementById("sign-up-button");
    var signUpUsername_1 = document.getElementById("sign-up-username");
    var signUpConfirmPassword_1 = document.getElementById("sign-up-confirm-password");
    var signUpPassword_1 = document.getElementById("sign-up-password");
    if (signUpButton) {
        signUpButton.addEventListener("click", function (event) { return __awaiter(void 0, void 0, void 0, function () {
            var username, password, confirmPassword, existingErrorBox, newUser, error_1, existingErrorBox, existingErrorBox, existingErrorBox, existingErrorBox, existingErrorBox, existingErrorBox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        if (!(signUpUsername_1 && signUpPassword_1)) return [3 /*break*/, 14];
                        username = signUpUsername_1.value;
                        password = signUpPassword_1.value;
                        confirmPassword = signUpConfirmPassword_1.value;
                        if (!(username && password)) return [3 /*break*/, 14];
                        if (!(password == confirmPassword)) return [3 /*break*/, 13];
                        if (!(password.length >= 8)) return [3 /*break*/, 11];
                        if (!/[A-Z]/.test(password)) return [3 /*break*/, 9];
                        if (!/[a-z]/.test(password)) return [3 /*break*/, 7];
                        if (!/[0-9]/.test(password)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        existingErrorBox = document.querySelector('.error-box');
                        if (existingErrorBox) {
                            existingErrorBox.remove();
                        }
                        return [4 /*yield*/, createUser({ username: username, password: password })];
                    case 2:
                        newUser = _a.sent();
                        sessionStorage.setItem("wxp_token", newUser.token);
                        sessionStorage.setItem("wxp_user_id", newUser.id != null ? newUser.id.toString() : "");
                        goToDesktopPage();
                        signUpUsername_1.value = "";
                        signUpPassword_1.value = "";
                        signUpConfirmPassword_1.value = "";
                        updateUserImages();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        existingErrorBox = document.querySelector('.error-box');
                        if (existingErrorBox) {
                            existingErrorBox.remove();
                        }
                        showError("User already exists.");
                        signUpUsername_1.value = "";
                        signUpPassword_1.value = "";
                        signUpConfirmPassword_1.value = "";
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        existingErrorBox = document.querySelector('.error-box');
                        if (existingErrorBox) {
                            existingErrorBox.remove();
                        }
                        showError("Password must contain at least one number.");
                        signUpUsername_1.value = "";
                        signUpPassword_1.value = "";
                        signUpConfirmPassword_1.value = "";
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        existingErrorBox = document.querySelector('.error-box');
                        if (existingErrorBox) {
                            existingErrorBox.remove();
                        }
                        showError("Password must contain at least one lowercase letter.");
                        signUpUsername_1.value = "";
                        signUpPassword_1.value = "";
                        signUpConfirmPassword_1.value = "";
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        existingErrorBox = document.querySelector('.error-box');
                        if (existingErrorBox) {
                            existingErrorBox.remove();
                        }
                        showError("Password must contain at least one uppercase letter.");
                        signUpUsername_1.value = "";
                        signUpPassword_1.value = "";
                        signUpConfirmPassword_1.value = "";
                        _a.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        existingErrorBox = document.querySelector('.error-box');
                        if (existingErrorBox) {
                            existingErrorBox.remove();
                        }
                        showError("Password must be at least 8 characters long.");
                        signUpUsername_1.value = "";
                        signUpPassword_1.value = "";
                        signUpConfirmPassword_1.value = "";
                        _a.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        existingErrorBox = document.querySelector('.error-box');
                        if (existingErrorBox) {
                            existingErrorBox.remove();
                        }
                        showError("Passwords do not match.");
                        signUpUsername_1.value = "";
                        signUpPassword_1.value = "";
                        signUpConfirmPassword_1.value = "";
                        _a.label = 14;
                    case 14: return [2 /*return*/];
                }
            });
        }); });
    }
    var signInForm = document.getElementById("sign-in-form");
    var signInButton = document.getElementById("sign-in-button");
    var signInUsername_1 = document.getElementById("sign-in-username");
    var signInPassword_1 = document.getElementById("sign-in-password");
    if (signInButton) {
        signInButton.addEventListener("click", function (event) { return __awaiter(void 0, void 0, void 0, function () {
            var username, password, existingErrorBox, user, error_2, existingErrorBox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        if (!(signInUsername_1 && signInPassword_1)) return [3 /*break*/, 4];
                        username = signInUsername_1.value;
                        password = signInPassword_1.value;
                        if (!(username && password)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        existingErrorBox = document.querySelector('.error-box');
                        if (existingErrorBox) {
                            existingErrorBox.remove();
                        }
                        return [4 /*yield*/, getUser(username, password)];
                    case 2:
                        user = _a.sent();
                        sessionStorage.setItem("wxp_token", user.token);
                        sessionStorage.setItem("wxp_user_id", user.id != null ? user.id.toString() : "");
                        goToDesktopPage();
                        signInUsername_1.value = "";
                        signInPassword_1.value = "";
                        updateUserImages();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        existingErrorBox = document.querySelector('.error-box');
                        if (existingErrorBox) {
                            existingErrorBox.remove();
                        }
                        showError("Username or password is incorrect.");
                        signInUsername_1.value = "";
                        signInPassword_1.value = "";
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    }
}
