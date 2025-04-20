import { resetUserImages } from "./login-screen.js";
import { sendNotification } from "./notification.js";


// API.ts - Client for API interactions

/**
 * User interface representing a user entity from the API
 */
interface User {
    id?: number;
    email: string;  
    password: string;
    username: string;
    is_online: boolean;
    created_at: Date;
    last_login: Date;
    history: Array<number>;
    win_nbr: number;
    loss_nbr: number; 
    avatar: string;
    background: string;
    friend_list: Array<number>;
    pending_friend_list: Array<number>;
    font_size: number;
	token: string;
}

/**
 * API configuration
 */
const API_CONFIG = {
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
async function apiFetch(url: string, options: RequestInit = {}, useJsonContentType = true, nojson?: boolean): Promise<Response> {
	// const credentials = btoa(`${API_CONFIG.credentials.username}:${API_CONFIG.credentials.password}`);
	
	let headers: HeadersInit = {
		'Authorization': `Bearer ${sessionStorage.getItem('wxp_token')}`,
		...options.headers
	};

	// Only add Content-Type if specified (useful to exclude when using FormData)
	if (useJsonContentType) {
		headers = {
			...headers,
			'Content-Type': 'application/json'
		};
	}
	
	console.log('API Fetch:', `${API_CONFIG.baseUrl}${url}`, options);
	console.log('Headers:', headers);
	console.log('Body:', options.body);
	const response = await fetch(`${API_CONFIG.baseUrl}${url}`, {
		...options,
		headers
	});
	
	// if (!response.ok) {
	// 	const error = new Error(`HTTP error! status: ${response.status}`);
	// 	(error as any).status = response.status;
	// 	throw error;
	// }
	
	return response;
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
export async function getAllUsers(): Promise<User[]> {
	try {
		const response = await apiFetch('/users');
		return await response.json();
	} catch (error) {
		console.error('Error fetching users:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
			sendNotification('API Error', `Failed to fetch users: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

/**
 * Get user by ID
 * @param userId - User ID
 * @returns Promise with User object
 * @throws Will throw an error if the user is not found
 */
export async function getUserById(userId: number): Promise<User> {
	try {
		const response = await apiFetch(`/users/${userId}`);
		if (!response.ok) {
			const error = new Error(`HTTP error! status: ${response.status}`);
			(error as any).status = response.status;
			throw error;
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching user by ID:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
			sendNotification('API Error', `Failed to fetch user by ID: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}


/**
 * Get user by username and password
 * @param username - User's username
 * @param password - User's password
 * @returns Promise with User object
 */
export async function getUser(username: string, password: string): Promise<User> {
	try {
		const response = await apiFetch(`/users/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
		if (!response.ok) {
			const error = new Error(`HTTP error! status: ${response.status}`);
			(error as any).status = response.status;
			throw error;
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching user:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
			sendNotification('API Error', `Failed to fetch user data: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;	
	}
}

/**
 * Get current user from the session
 * @returns Promise with the current User object
 */
export async function getCurrentUser(token : string | null): Promise<User> {
	if (token === null) {
		throw new Error('Token isn\'t valid, try to log in again');
	}
	try {
		// This endpoint should be adjusted based on your actual API
		const response = await apiFetch(`/users/${token}`);
		
		const user = await response.json();
		console.log("Current User:", user);
		
		if (user && typeof sendNotification === 'function') {
			sendNotification('User Session', `Logged in as: ${user.username}`, './img/Utils/API-icon.png');
		}
		
		return user;
	} catch (error) {
		console.error('Error fetching current user:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
			sendNotification('Session Error', `Failed to get current user: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

/**
 * Create a new user
 * @param userData - User data containing username, email, password, etc.
 * @returns Promise with the created User
 * @example
 */
// Create a new user
export async function createUser(userData: Partial<User>): Promise<User> {
	try {
		const response = await apiFetch('/users/login', {
			method: 'POST',
			body: JSON.stringify(userData)
		});
		
		if (!response.ok) {
			const error = new Error(`HTTP error! status: ${response.status}`);
			(error as any).status = response.status;
			throw error;
		}

		return await response.json();

	} catch (error) {
		console.error('Error creating user:', error);
		// Handle conflict (user already exists)
		if ((error as any).status === 409) {
			const conflictMessage = "User already exists. Please try a different username or email.";
			if (typeof sendNotification === 'function') {
				sendNotification('User Creation Error', conflictMessage, './img/Utils/API-icon.png');
			}
			throw new Error(conflictMessage);
		}
		
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
			sendNotification('API Error', `Failed to create user: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
};



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
export async function updateUser(token: string | null, userData: Partial<User>) {
	if (token === null) {
		throw new Error('Token isn\'t valid, try to log in again');
	}
	try {
		const response = await apiFetch(`/users/${token}`, {
			method: 'PATCH',
			body: JSON.stringify(userData)
		});
		
	} catch (error) {
		console.error('Error updating user:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function')   {
			sendNotification('API Error', `Failed to update user: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

/**
 * Deletes a user by ID
 * @param userId - User ID to delete
 * @returns Promise with the deleted User object
 */
export async function deleteUser(userId: number): Promise<User> {
	try {
		const response = await apiFetch(`/users/${userId}`, {
			method: 'DELETE'
		});
		sendNotification('User Deleted', `User with ID ${userId} deleted successfully`, './img/Utils/API-icon.png');
		return await response.json();
	} catch (error) {
		console.error('Error deleting user:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
			sendNotification('API Error', `Failed to delete user: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

export async function getUserByUsername(username: string): Promise<User | null> {
	try {
		const response = await apiFetch(`/users?username=${encodeURIComponent(username)}`);
		const users: User[] = await response.json();
		
		if (users.length > 0) {
			return users[0];
		} else {
			return null;
		}
	} catch (error) {
		console.error('Error fetching user by username:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
			sendNotification('API Error', `Failed to fetch user by username: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

export async function loginUser(username: string, password: string): Promise<User | null> {
	try {
		const response = await apiFetch('/login', {
			method: 'POST',
			body: JSON.stringify({ username, password })
		});
		
		if (response.status === 200) {
			const user = await response.json();
			return user;
		} else {
			return null;
		}
	} catch (error) {
		console.error('Error logging in:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
			sendNotification('Login Error', `Failed to log in: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

export async function uploadFile(userId: number, file: File, fileType: string): Promise<Response | null> {
	if (file.size > 5 * 1024 * 1024) { // 5MB limit
		sendNotification('Error file upload', 'File size exceeds 5MB limit', "./img/Utils/error-icon.png");
		return null;
	}
	console.log("File size: " + ((file.size) / 1024 / 1024).toFixed(2) + "MB");
	console.log("File type: " + file.type);
	const formData = new FormData();
	formData.append('file', file);
	// formData.append('metadata', JSON.stringify({ userId, fileType }));
	try {
		const response = await apiFetch(`/user_images/${fileType}/${userId}`, {
			method: 'POST',
			body: formData,
		}, false);
		
		if (response.ok) {
			const result = await response.json();
			console.log('File uploaded successfully:', result);
			sendNotification('File Uploaded', `File uploaded successfully: ${result.message}`, "./img/Utils/API-icon.png");
			return response;
		} else {
			const error = await response.json();
			console.error('Error Reponse not OK -> uploading file:', error);
			sendNotification('Error', `Error uploading file: ${error.message || 'Unknown error'}`, "./img/Utils/error-icon.png");
		}
	} catch (error) {
		console.error('Error Catched -> uploading file:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		sendNotification('Error', `Error uploading file: ${errorMessage}`, "./img/Utils/error-icon.png");
	}
	
	return null;
}

export async function deleteUserAvatar(userId: number): Promise<void> {
	try {
		console.log(`Attempting to delete avatar for user ${userId}`);
		
		const response = await apiFetch(`/user_images/avatar/${userId}`, {
			method: 'DELETE'
		}, false, true);
		
		if (response.ok) {
			const result = await response.json();
			console.log('Avatar deleted successfully');
			sendNotification('Avatar Deleted', `Avatar deleted successfully: ${result.message}`, "./img/Utils/API-icon.png");
			resetUserImages();
			return;
		}
		else {
			const error = await response.json();
			console.error('Error deleting avatar:', error);
			sendNotification('Error', `Error deleting avatar: ${error.message || 'Unknown error'}`, "./img/Utils/error-icon.png");
		}
		
	}
	catch (error) {
		throw error;
	}
}

export async function isAvatarUserExists(userId: number): Promise<boolean> {
	try {
		const response = await apiFetch(`/user_images/avatar/${userId}`, {
			method: 'GET'
		});
		return response.ok;
	} catch (error) {
		console.error('Error checking avatar existence:', error);
		return false;
	}
}

export async function isBackgroundUserExists(userId: number): Promise<boolean> {
	try {
		const response = await apiFetch(`/user_images/wallpaper/${userId}`, {
			method: 'GET'
		});
		return response.ok;
	} catch (error) {
		console.error('Error checking background existence:', error);
		return false;
	}
}

export async function deleteUserBackground(userId: number): Promise<void> {
	try {
		console.log(`Attempting to delete background for user ${userId}`);
		const response = await apiFetch(`/user_images/wallpaper/${userId}`, {
			method: 'DELETE'
		}, false, true);
		if (response.ok) {
			const result = await response.json();
			console.log('Background deleted successfully');
			sendNotification('Background Deleted', `Background deleted successfully: ${result.message}`, "./img/Utils/API-icon.png");
			resetUserImages();
			return;
		}
		else {
			const error = await response.json();
			console.error('Error deleting background:', error);
			sendNotification('Error', `Error deleting background: ${error.message || 'Unknown error'}`, "./img/Utils/error-icon.png");
		}
	}
	catch (error) {
		console.error('Error deleting background:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		sendNotification('Error', `Error deleting background: ${errorMessage}`, "./img/Utils/error-icon.png");
	}
}

export async function getUserAvatar(userId: number): Promise<string> {
	try {
		const response = await apiFetch(`/user_images/avatar/${userId}`, {
			method: 'GET'
		});
		console.log("Get user " + userId + " avatar");
		console.log("Response: ", response);
		if (!response.ok) {
			throw new Error(`Failed to fetch avatar: ${response.status}`);
		}
		const filePath = await response.text();
		return filePath;
	} catch (error) {
		console.error('Error fetching user avatar:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
			sendNotification('API Error', `Failed to fetch avatar: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

export async function getUserBackground(userId: number): Promise<string> {
	try {
		const response = await apiFetch(`/user_images/wallpaper/${userId}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch background: ${response.status}`);
		}
		const filePath = await response.text();
		return filePath;
	} catch (error) {
		console.error('Error fetching user background:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
			sendNotification('API Error', `Failed to fetch background: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}


/*
#### Friend List Functions
These functions handle friend list operations such as getting friends, sending requests, accepting/declining requests, and removing friends.
*/

/**
 * Gets the friend list of a user
 * @param token - The token of the user
 * @returns Promise with an array of user IDs representing friends
 */
export async function getUserFriends(token: string): Promise<number[]> {
	try {
		const response = await apiFetch(`/users/${token}/friends`);
		
		if (!response.ok) {
		if (response.status === 404) {
			// Empty friend list or user not found
			return [];
		}
		throw new Error(`HTTP error! Status: ${response.status}`);
		}
		
		const friendIds = await response.json();
		return friendIds;
	} catch (error) {
		console.error('Error fetching user friends:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
		sendNotification('API Error', `Failed to fetch friends: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

/**
 * Gets a specific friend by their ID
 * @param token - The token of the user
 * @param friendId - The ID of the friend to retrieve
 * @returns Promise with the User object of the friend
 * @throws Error if the specified ID is not in the user's friend list
 */
export async function getFriendFromID(token: string, friendId: number): Promise<User> {
	try {
		// First, check if the ID is in the user's friend list
		const friendIds = await getUserFriends(token);
		
		if (!friendIds.includes(friendId)) {
			throw new Error(`User ID ${friendId} is not in your friend list`);
		}
		
		// Then get the user details for that ID
		const response = await apiFetch(`/users/${friendId}`);
		
		if (!response.ok) {
			throw new Error(`Failed to fetch friend: ${response.status}`);
		}
		
		return await response.json();
	} catch (error) {
		console.error('Error fetching friend by ID:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
			sendNotification('API Error', `Failed to fetch friend: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

/**
 * Gets the pending friend requests of a user
 * @param token - The token of the user
 * @returns Promise with an array of user IDs representing pending friend requests
 */
export async function getPendingFriendRequests(token: string): Promise<number[]> {
	try {
		const response = await apiFetch(`/users/${token}/pending_friends`);
		
		if (!response.ok) {
		if (response.status === 404) {
			// Empty pending list or user not found
			return [];
		}
		throw new Error(`HTTP error! Status: ${response.status}`);
		}
		
		const pendingIds = await response.json();
		return pendingIds;
	} catch (error) {
		console.error('Error fetching pending friend requests:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
		sendNotification('API Error', `Failed to fetch pending requests: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

/**
 * Gets detailed information about all pending friend requests
 * @param token - The token of the user
 * @returns Promise with an array of User objects representing pending friend requests
 */
export async function getPendingFriendRequestsDetails(token: string): Promise<User[]> {
	try {
		// First get the list of pending friend IDs
		const pendingIds = await getPendingFriendRequests(token);
		
		if (pendingIds.length === 0) {
		return [];
		}
		
		// Then fetch details for each pending friend
		const pendingDetailsPromises = pendingIds.map(async (id) => {
		const response = await apiFetch(`/users/${id}`);
		if (!response.ok) {
			console.warn(`Could not fetch details for pending friend ID ${id}`);
			return null;
		}
		return await response.json();
		});
		
		const pendingDetails = await Promise.all(pendingDetailsPromises);
		return pendingDetails.filter((friend): friend is User => friend !== null);
	} catch (error) {
		console.error('Error fetching pending friend details:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
		sendNotification('API Error', `Failed to fetch pending friend details: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

/**
 * Sends a friend request to another user
 * @param token - The token of the sender
 * @param targetUsername - The username of the user to send the request to
 * @returns Promise indicating success
 */
export async function sendFriendRequest(token: string, targetUsername: string): Promise<void> {
	try {
		const response = await apiFetch(`/users/${token}/pending_friends`, {
		method: 'POST',
		body: JSON.stringify({ friend_username: targetUsername })
		});
		
		if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
		}
		
		if (typeof sendNotification === 'function') {
		sendNotification('Friend Request', `Friend request sent to ${targetUsername}`, './img/Utils/friend-icon.png');
		}
	} catch (error) {
		console.error('Error sending friend request:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
		sendNotification('API Error', `Failed to send friend request: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

/**
 * Accepts a friend request from another user
 * @param token - The token of the accepting user
 * @param senderUsername - The username of the user who sent the request
 * @returns Promise indicating success
 */
export async function acceptFriendRequest(token: string, senderUsername: string): Promise<void> {
	try {
		// First, remove from pending list
		const deleteResponse = await apiFetch(`/users/${token}/pending_friends/${senderUsername}`, {
		method: 'DELETE'
		});
		
		if (!deleteResponse.ok) {
		const errorData = await deleteResponse.json();
		throw new Error(errorData.error || `HTTP error! Status: ${deleteResponse.status}`);
		}
		
		// Then add to friend list
		const addResponse = await apiFetch(`/users/${token}/friends`, {
		method: 'POST',
		body: JSON.stringify({ friend_username: senderUsername })
		});
		
		if (!addResponse.ok) {
		const errorData = await addResponse.json();
		throw new Error(errorData.error || `HTTP error! Status: ${addResponse.status}`);
		}
		
		if (typeof sendNotification === 'function') {
		sendNotification('Friend Request', `You are now friends with ${senderUsername}`, './img/Utils/friend-icon.png');
		}
	} catch (error) {
		console.error('Error accepting friend request:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
		sendNotification('API Error', `Failed to accept friend request: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

/**
 * Declines a friend request from another user
 * @param token - The token of the declining user
 * @param senderUsername - The username of the user who sent the request
 * @returns Promise indicating success
 */
export async function declineFriendRequest(token: string, senderUsername: string): Promise<void> {
	try {
		// Simply remove from pending list
		const response = await apiFetch(`/users/${token}/pending_friends/${senderUsername}`, {
		method: 'DELETE'
		});
		
		if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
		}
		
		if (typeof sendNotification === 'function') {
		sendNotification('Friend Request', `Friend request from ${senderUsername} declined`, './img/Utils/friend-icon.png');
		}
	} catch (error) {
		console.error('Error declining friend request:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
		sendNotification('API Error', `Failed to decline friend request: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

/**
 * Removes a friend from the user's friend list
 * @param token - The token of the user
 * @param friendUsername - The username of the friend to remove
 * @returns Promise indicating success
 */
export async function removeFriend(token: string, friendUsername: string): Promise<void> {
	try {
		const response = await apiFetch(`/users/${token}/friends/${friendUsername}`, {
		method: 'DELETE'
		});
		
		if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
		}
		
		if (typeof sendNotification === 'function') {
		sendNotification('Friend Removed', `${friendUsername} has been removed from your friends`, './img/Utils/friend-icon.png');
		}
	} catch (error) {
		console.error('Error removing friend:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
		sendNotification('API Error', `Failed to remove friend: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

/**
 * Gets detailed information about all friends
 * @param token - The token of the user
 * @returns Promise with an array of User objects representing friends
 */
export async function getUserFriendsDetails(token: string): Promise<User[]> {
	try {
		// First get the list of friend IDs
		const friendIds = await getUserFriends(token);
		
		if (friendIds.length === 0) {
		return [];
		}
		
		// Then fetch details for each friend
		const friendDetailsPromises = friendIds.map(async (id) => {
		const response = await apiFetch(`/users/${id}`);
		if (!response.ok) {
			console.warn(`Could not fetch details for friend ID ${id}`);
			return null;
		}
		return await response.json();
		});
		
		const friendDetails = await Promise.all(friendDetailsPromises);
		return friendDetails.filter((friend): friend is User => friend !== null);
	} catch (error) {
		console.error('Error fetching friend details:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (typeof sendNotification === 'function') {
		sendNotification('API Error', `Failed to fetch friend details: ${errorMessage}`, './img/Utils/API-icon.png');
		}
		throw error;
	}
}

/**
 * Checks if a user is in the friend list
 * @param token - The token of the user
 * @param usernameToCheck - The username to check
 * @returns Promise with a boolean indicating if the user is a friend
 */
export async function isUserFriend(token: string, usernameToCheck: string): Promise<boolean> {
	try {
		const friends = await getUserFriendsDetails(token);
		return friends.some((friend: User) => friend.username === usernameToCheck);
	} catch (error) {
		console.error('Error checking if user is friend:', error);
		return false;
	}
}

/**
 * Checks if a user has a pending friend request
 * @param token - The token of the user
 * @param usernameToCheck - The username to check
 * @returns Promise with a boolean indicating if the user has a pending request
 */
export async function hasPendingFriendRequest(token: string, usernameToCheck: string): Promise<boolean> {
	try {
		const pendingFriends = await getPendingFriendRequestsDetails(token);
		return pendingFriends.some(friend => friend.username === usernameToCheck);
	} catch (error) {
		console.error('Error checking if user has pending request:', error);
		return false;
	}
}

/**
 * Gets the friendship status with another user
 * @param token - The token of the user
 * @param otherUsername - The username of the other user
 * @returns Promise with the friendship status
 */
export async function getFriendshipStatus(token: string, otherUsername: string): Promise<'friend' | 'pending' | 'none'> {
	try {
		if (await isUserFriend(token, otherUsername)) {
		return 'friend';
		}
		
		if (await hasPendingFriendRequest(token, otherUsername)) {
		return 'pending';
		}
		
		return 'none';
	} catch (error) {
		console.error('Error getting friendship status:', error);
		return 'none';
	}
}