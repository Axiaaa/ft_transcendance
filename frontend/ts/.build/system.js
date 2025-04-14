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
import { getUser } from "./API.js";
import { createUser } from "./API.js";
document.addEventListener('DOMContentLoaded', function () { return __awaiter(void 0, void 0, void 0, function () {
    function animateLogo(Logo) {
        if (!Logo)
            return;
        if (!sleepScreen)
            return;
        if (sleepScreen.style.display === 'none' || sleepScreen.style.opacity === '0')
            return;
        console.log("sleepcreen.display:", sleepScreen.style.display, "sleepcreen.opacity:", sleepScreen.style.opacity);
        var screenBorderTop = 0;
        var screenBorderBottom = sleepScreen.clientHeight - (Logo.clientHeight);
        var screenBorderLeft = 0;
        var screenBorderRight = sleepScreen.clientWidth - (Logo.clientWidth);
        console.log("Screen borders - Bottom:", screenBorderBottom, "Right:", screenBorderRight);
        console.log("Screen dimensions - Height:", sleepScreen.clientHeight, "Width:", sleepScreen.clientWidth);
        console.log("Logo dimensions - Height:", Logo.clientHeight, "Width:", Logo.clientWidth);
        var x = screenBorderLeft;
        var y = screenBorderTop;
        var dx = (Math.floor(Math.random() * 9) + 1) / 10;
        if (Math.random() < 0.5)
            dx = -dx;
        var dy = (Math.floor(Math.random() * 9) + 1) / 10;
        if (Math.random() < 0.5)
            dy = -dy;
        console.log("SleepScreen X/Y direction" + dx + "/" + dy);
        var speed = Math.max(5, Math.sqrt(Math.pow(sleepScreen.clientWidth, 2) + Math.pow(sleepScreen.clientHeight, 2)) * 0.007);
        console.log("Animation speed:", speed);
        var interval = 50;
        var animation = setInterval(function () {
            Logo.style.left = x + 'px';
            Logo.style.top = y + 'px';
            x += dx * speed;
            y += dy * speed;
            if (x > screenBorderRight || x < screenBorderLeft)
                dx *= -1;
            if (y > screenBorderBottom || y < screenBorderTop)
                dy *= -1;
        }, interval);
    }
    function resetTimer() {
        var _this = this;
        // Clear any existing timeout
        clearTimeout(timeoutId);
        // Reset screen state immediately
        sleepScreen.style.opacity = '0';
        sleepScreen.style.display = 'none';
        sleepLogo.style.display = 'none';
        // Set new timeout
        timeoutId = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log('User is inactive');
                        sendNotification('Inactivity Alert', 'You have been inactive for 20 seconds. The system will sleep soon.', './img/Utils/sleep-icon.png');
                        sleepScreen.style.display = 'block';
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 200); })];
                    case 1:
                        _a.sent();
                        if (sleepScreen.style.display === 'none')
                            return [2 /*return*/];
                        console.log('Inactive Warning');
                        sleepScreen.style.opacity = '0.5';
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                    case 2:
                        _a.sent();
                        if (sleepScreen.style.display === 'none')
                            return [2 /*return*/];
                        console.log('Inactive Blackout');
                        sleepScreen.style.opacity = '1';
                        sleepLogo.style.display = 'block';
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error in inactivity timer:', error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); }, INACTIVE_TIMEOUT);
    }
    var sleepScreen, sleepLogo, timeoutId, INACTIVE_TIMEOUT, CurrentUser, error_1, errorMessage, trashBinApp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sleepScreen = document.createElement('div');
                document.body.appendChild(sleepScreen);
                sleepScreen.id = 'sleep-screen';
                sleepScreen.style.position = 'absolute';
                sleepScreen.style.left = '0';
                sleepScreen.style.top = '0';
                sleepScreen.style.width = '100%';
                sleepScreen.style.height = '100%';
                sleepScreen.style.backgroundColor = 'rgb(0, 0, 0)';
                sleepScreen.style.zIndex = '1000';
                sleepScreen.style.justifyContent = 'center';
                sleepScreen.style.alignItems = 'center';
                sleepScreen.style.transition = 'opacity 1s ease-in, opacity 0.5s ease-out';
                sleepLogo = document.createElement('img');
                sleepScreen.appendChild(sleepLogo);
                sleepLogo.src = './img/Utils/windows-xp-logo.png';
                sleepLogo.style.width = '100px';
                sleepLogo.style.height = '100px';
                sleepLogo.style.position = 'absolute';
                sleepLogo.style.padding = '0 10px';
                animateLogo(sleepLogo);
                INACTIVE_TIMEOUT = 20000;
                // Reset timer on mouse movement
                document.addEventListener('mousemove', resetTimer);
                // Reset timer on mouse clicks
                document.addEventListener('click', resetTimer);
                // Reset timer on key press
                document.addEventListener('keypress', resetTimer);
                // Reset timer on scroll
                document.addEventListener('scroll', resetTimer);
                // Start the initial timer
                resetTimer();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, getUser(1)];
            case 2:
                CurrentUser = _a.sent();
                if (!!CurrentUser) return [3 /*break*/, 4];
                return [4 /*yield*/, createUser({ username: 'Guest', password: 'guest', email: 'guest@guest.com' })];
            case 3:
                CurrentUser = _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                console.error('Error fetching or creating user:', error_1);
                errorMessage = error_1 instanceof Error ? error_1.message : String(error_1);
                sendNotification('User Error', "Failed to get or create User: ".concat(errorMessage), './img/Utils/API-icon.png');
                return [3 /*break*/, 6];
            case 6:
                trashBinApp = document.getElementById('trash-bin-app');
                trashBinApp.addEventListener('dblclick', function (e) { return __awaiter(void 0, void 0, void 0, function () {
                    var user1, error_3, errorMessage;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, getUser(1)];
                            case 1:
                                user1 = _a.sent();
                                if (user1) {
                                    sendNotification('User Data', "User ID: ".concat(user1.id, ", Username: ").concat(user1.username, ", Email: ").concat(user1.email), './img/Utils/API-icon.png');
                                    console.log("User ID: " + user1.id + " Username: " + user1.username);
                                    console.log("User Data:", user1);
                                }
                                return [3 /*break*/, 3];
                            case 2:
                                error_3 = _a.sent();
                                console.error('Error fetching user:', error_3);
                                errorMessage = error_3 instanceof Error ? error_3.message : String(error_3);
                                if (typeof sendNotification === 'function') {
                                    sendNotification('Session Error', "Failed to get user: ".concat(errorMessage), './img/Utils/API-icon.png');
                                }
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
export function initHistoryAPI() {
    // Initial state
    var loginState = { page: 1 };
    history.pushState(loginState, '', '/login');
    history.replaceState(loginState, '', '/login');
    // Handle back/forward navigation
    window.addEventListener('popstate', function (event) {
        if (event.state) {
            switch (event.state.page) {
                case 1:
                    goToLoginPage(false);
                    console.log('Navigated to login page');
                    break;
                case 2:
                    goToFormsPage(false);
                    console.log('Navigated to forms page');
                    break;
                case 3:
                    goToDesktopPage(false);
                    console.log('Navigated to desktop page');
                    break;
                default:
                    console.log('Unknown page');
            }
        }
    });
    goToPage();
    console.log('History API initialized');
}
function goToPage() {
    {
        var goToLogin = document.getElementsByClassName('go-to-login');
        for (var i = 0; i < goToLogin.length; i++) {
            var gotologin = goToLogin[i];
            gotologin.addEventListener('click', function () {
                goToLoginPage(true);
            });
        }
    }
    {
        var goToForms = document.getElementsByClassName('go-to-forms');
        for (var i = 0; i < goToForms.length; i++) {
            var gotologin = goToForms[i];
            gotologin.addEventListener('click', function () {
                goToFormsPage(true);
            });
        }
    }
    {
        var goToDesktop = document.getElementsByClassName('go-to-desktop');
        for (var i = 0; i < goToDesktop.length; i++) {
            var gotologin = goToDesktop[i];
            gotologin.addEventListener('click', function () {
                goToDesktopPage(true);
            });
        }
    }
}
export function goToLoginPage(pushState) {
    if (pushState === void 0) { pushState = true; }
    var loginState = { page: 1 };
    var loginScreen = document.getElementsByClassName('login-screen')[0];
    var forms = document.getElementsByClassName('login-screen-formulary')[0];
    var loginScreenBackButton = document.getElementById('login-screen-back-button');
    if (pushState) {
        history.pushState(loginState, '', '/login');
    }
    history.replaceState(loginState, '', '/login');
    if (loginScreen)
        loginScreen.style.display = 'block';
    if (loginScreenBackButton)
        loginScreenBackButton.click();
    if (forms)
        forms.style.display = 'none';
    console.log('Navigated to login page');
}
export function goToDesktopPage(pushState) {
    if (pushState === void 0) { pushState = true; }
    var desktopState = { page: 3 };
    var loginScreen = document.getElementsByClassName('login-screen')[0];
    var forms = document.getElementsByClassName('login-screen-formulary')[0];
    if (pushState) {
        history.pushState(desktopState, '', '/desktop');
    }
    history.replaceState(desktopState, '', '/desktop');
    if (loginScreen)
        loginScreen.style.display = 'none';
    if (forms)
        forms.style.display = 'none';
    console.log('Navigated to desktop page');
}
export function goToFormsPage(pushState) {
    if (pushState === void 0) { pushState = true; }
    var formsState = { page: 2 };
    var loginScreen = document.getElementsByClassName('login-screen')[0];
    var forms = document.getElementsByClassName('login-screen-formulary')[0];
    if (pushState) {
        history.pushState(formsState, '', '/forms');
    }
    history.replaceState(formsState, '', '/forms');
    if (loginScreen)
        loginScreen.style.display = 'block';
    if (forms)
        forms.style.display = 'block';
    console.log('Navigated to forms page');
}
