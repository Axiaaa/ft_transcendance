var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
/**
 * API configuration
 */
var API_CONFIG = {
    baseUrl: '/api',
    // credentials: {
    // 	username: 'admin',
    // 	password: 'adminpassword'
    // }
};
/*
New version with environment variables
const API_CONFIG = {
    baseUrl: process.env.API_BASE_URL || 'https://localhost/api',
    credentials: {
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD
    }
};
*/
/**
 * Base fetch function with authentication
 * @param url - API endpoint
 * @param options - Fetch options
 * @returns Promise with response
 */
function apiFetch(url_1) {
    return __awaiter(this, arguments, void 0, function (url, options) {
        var headers, response;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = __assign({ 'Content-Type': 'application/json', 'Authorization': "Bearer ".concat(sessionStorage.getItem('wxp_token')) }, options.headers);
                    console.log('API Fetch:', "".concat(API_CONFIG.baseUrl).concat(url), options);
                    return [4 /*yield*/, fetch("".concat(API_CONFIG.baseUrl).concat(url), __assign(__assign({}, options), { headers: headers }))];
                case 1:
                    response = _a.sent();
                    // if (!response.ok) {
                    // 	const error = new Error(`HTTP error! status: ${response.status}`);
                    // 	(error as any).status = response.status;
                    // 	throw error;
                    // }
                    return [2 /*return*/, response];
            }
        });
    });
}
/**
 * Fetches all users from the API.
 *
 * Makes a GET request to the '/users' endpoint and returns the parsed JSON response.
 * If an error occurs during the request, it logs the error to the console,
 * attempts to send a notification if the sendNotification function is available,
 * and then re-throws the error.
 *
 * @async
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects
 * @throws {Error} Will throw any error that occurs during the API request
 */
export function getAllUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, apiFetch('/users')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error fetching users:', error_1);
                    errorMessage = error_1 instanceof Error ? error_1.message : String(error_1);
                    if (typeof sendNotification === 'function') {
                        sendNotification('API Error', "Failed to fetch users: ".concat(errorMessage), './img/Utils/API-icon.png');
                    }
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get user by ID
 * @param userId - User ID
 * @returns Promise with User object
 * @throws Will throw an error if the user is not found
 */
export function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error, error_2, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, apiFetch("/users/".concat(userId))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        error = new Error("HTTP error! status: ".concat(response.status));
                        error.status = response.status;
                        throw error;
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error fetching user by ID:', error_2);
                    errorMessage = error_2 instanceof Error ? error_2.message : String(error_2);
                    if (typeof sendNotification === 'function') {
                        sendNotification('API Error', "Failed to fetch user by ID: ".concat(errorMessage), './img/Utils/API-icon.png');
                    }
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get user by username and password
 * @param username - User's username
 * @param password - User's password
 * @returns Promise with User object
 */
export function getUser(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error, error_3, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, apiFetch("/users/login?username=".concat(encodeURIComponent(username), "&password=").concat(encodeURIComponent(password)))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        error = new Error("HTTP error! status: ".concat(response.status));
                        error.status = response.status;
                        throw error;
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error fetching user:', error_3);
                    errorMessage = error_3 instanceof Error ? error_3.message : String(error_3);
                    if (typeof sendNotification === 'function') {
                        sendNotification('API Error', "Failed to fetch user data: ".concat(errorMessage), './img/Utils/API-icon.png');
                    }
                    throw error_3;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get current user from the session
 * @returns Promise with the current User object
 */
export function getCurrentUser(token) {
    return __awaiter(this, void 0, void 0, function () {
        var response, user, error_4, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (token === null) {
                        throw new Error('Token isn\'t valid, try to log in again');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, apiFetch("/users/".concat(token))];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    user = _a.sent();
                    console.log("Current User:", user);
                    if (user && typeof sendNotification === 'function') {
                        sendNotification('User Session', "Logged in as: ".concat(user.username), './img/Utils/API-icon.png');
                    }
                    return [2 /*return*/, user];
                case 4:
                    error_4 = _a.sent();
                    console.error('Error fetching current user:', error_4);
                    errorMessage = error_4 instanceof Error ? error_4.message : String(error_4);
                    if (typeof sendNotification === 'function') {
                        sendNotification('Session Error', "Failed to get current user: ".concat(errorMessage), './img/Utils/API-icon.png');
                    }
                    throw error_4;
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Create a new user
 * @param userData - User data containing username, email, password, etc.
 * @returns Promise with the created User
 * @example
 */
// Create a new user
export function createUser(userData) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error, error_5, conflictMessage, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, apiFetch('/users/login', {
                            method: 'POST',
                            body: JSON.stringify(userData)
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        error = new Error("HTTP error! status: ".concat(response.status));
                        error.status = response.status;
                        throw error;
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_5 = _a.sent();
                    console.error('Error creating user:', error_5);
                    // Handle conflict (user already exists)
                    if (error_5.status === 409) {
                        conflictMessage = "User already exists. Please try a different username or email.";
                        if (typeof sendNotification === 'function') {
                            sendNotification('User Creation Error', conflictMessage, './img/Utils/API-icon.png');
                        }
                        throw new Error(conflictMessage);
                    }
                    errorMessage = error_5 instanceof Error ? error_5.message : String(error_5);
                    if (typeof sendNotification === 'function') {
                        sendNotification('API Error', "Failed to create user: ".concat(errorMessage), './img/Utils/API-icon.png');
                    }
                    throw error_5;
                case 4: return [2 /*return*/];
            }
        });
    });
}
;
/**
 * Updates a user's information by sending a PUT request to the API.
 *
 * @param userId - The ID of the user to update
 * @param userData - Partial user data containing only the properties to be updated
 * @returns A Promise that resolves to the updated User object
 * @throws Will throw any errors that occur during the API request
 * @example
 * // Update a user's name
 * const updatedUser = await updateUser(123, { name: "John Doe" });
 */
export function updateUser(token, userData) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_6, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (token === null) {
                        throw new Error('Token isn\'t valid, try to log in again');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, apiFetch("/users/".concat(token), {
                            method: 'PATCH',
                            body: JSON.stringify(userData)
                        })];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    console.error('Error updating user:', error_6);
                    errorMessage = error_6 instanceof Error ? error_6.message : String(error_6);
                    if (typeof sendNotification === 'function') {
                        sendNotification('API Error', "Failed to update user: ".concat(errorMessage), './img/Utils/API-icon.png');
                    }
                    throw error_6;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Deletes a user by ID
 * @param userId - User ID to delete
 * @returns Promise with the deleted User object
 */
export function deleteUser(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_7, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, apiFetch("/users/".concat(userId), {
                            method: 'DELETE'
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_7 = _a.sent();
                    console.error('Error deleting user:', error_7);
                    errorMessage = error_7 instanceof Error ? error_7.message : String(error_7);
                    if (typeof sendNotification === 'function') {
                        sendNotification('API Error', "Failed to delete user: ".concat(errorMessage), './img/Utils/API-icon.png');
                    }
                    throw error_7;
                case 4: return [2 /*return*/];
            }
        });
    });
}
export function getUserByUsername(username) {
    return __awaiter(this, void 0, void 0, function () {
        var response, users, error_8, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, apiFetch("/users?username=".concat(encodeURIComponent(username)))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    users = _a.sent();
                    if (users.length > 0) {
                        return [2 /*return*/, users[0]];
                    }
                    else {
                        return [2 /*return*/, null];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    console.error('Error fetching user by username:', error_8);
                    errorMessage = error_8 instanceof Error ? error_8.message : String(error_8);
                    if (typeof sendNotification === 'function') {
                        sendNotification('API Error', "Failed to fetch user by username: ".concat(errorMessage), './img/Utils/API-icon.png');
                    }
                    throw error_8;
                case 4: return [2 /*return*/];
            }
        });
    });
}
export function loginUser(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var response, user, error_9, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, apiFetch('/login', {
                            method: 'POST',
                            body: JSON.stringify({ username: username, password: password })
                        })];
                case 1:
                    response = _a.sent();
                    if (!(response.status === 200)) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    user = _a.sent();
                    return [2 /*return*/, user];
                case 3: return [2 /*return*/, null];
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_9 = _a.sent();
                    console.error('Error logging in:', error_9);
                    errorMessage = error_9 instanceof Error ? error_9.message : String(error_9);
                    if (typeof sendNotification === 'function') {
                        sendNotification('Login Error', "Failed to log in: ".concat(errorMessage), './img/Utils/API-icon.png');
                    }
                    throw error_9;
                case 6: return [2 /*return*/];
            }
        });
    });
}
