import { get } from "http";
import { openAppWindow } from "./app-icon.js";
import { acceptFriendRequest, declineFriendRequest, getAllUsers, getPendingFriendRequests, getPendingFriendRequestsDetails, getUserById, getUserFriends, getUserFriendsDetails, removeFriend, sendFriendRequest } from "./API.js";
import { disconnectUser } from "./start-menu.js";
import { clearBrowserCache, goToDesktopPage, goToLoginPage } from "./system.js";



/**
 * Fetches and formats pending friend requests for the current user.
 * 
 * This function retrieves pending friend request details using the provided user token,
 * and transforms them into a format suitable for UI display with user information.
 * 
 * @param userToken - The authentication token of the current user
 * @returns A promise that resolves to an array of formatted friend requests with id, username, avatar, and time
 * @throws Will catch errors internally and return an empty array
 */
export async function fetchFormattedPendingRequests(userToken: string): Promise<{ id: string, username: string, avatar: string, is_online: boolean }[]> {
	try {
		const pendingRequestsDetails = await getPendingFriendRequestsDetails(userToken);
		
		if (!pendingRequestsDetails) {
			return [];
		}
		
		
		const formattedRequests = pendingRequestsDetails.map(user => ({
			id: user.id?.toString() || 'unknown',
			username: user.username,
			avatar: user.avatar || "./img/Start_Menu/demo-user-profile-icon.jpg", 
			is_online: user.is_online 
		}));
		
		return formattedRequests;
	} catch (error) {
		if (error instanceof SyntaxError && error.message.includes('JSON.parse')) {
			console.log('No pending friend requests (204 No Content response)');
			return [];
		}
		
		console.error('Failed to fetch and format pending friend requests:', error);
		return [];
	}
}

/**
 * Fetches and formats the friends list for the current user.
 * 
 * This function retrieves the friends list using the provided user token,
 * and transforms it into a format suitable for UI display with user information.
 * 
 * @param userToken - The authentication token of the current user
 * @returns A promise that resolves to an array of formatted friends with id, username, avatar, and status
 * @throws Will catch errors internally and return an empty array
 */
export async function fetchFormattedFriends(userToken: string): Promise<{ id: string, username: string, avatar: string, is_online: boolean }[]> {
	try {
		const friendsDetails = await getUserFriendsDetails(userToken);
		
		if (!friendsDetails) {
			return [];
		}
		
		const formattedFriends = friendsDetails.map(user => ({
			id: user.id?.toString() || 'unknown',
			username: user.username,
			avatar: user.avatar || "./img/Start_Menu/demo-user-profile-icon.jpg", 
			is_online: user.is_online 
		}));
		
		return formattedFriends;
	} catch (error) {
		if (error instanceof SyntaxError && error.message.includes('JSON.parse')) {
			console.log('User has no friends (204 No Content response)');
			return [];
		}
		
		console.error('Failed to fetch and format friends list:', error);
		return [];
	}
}

function createTab(Name: string, Container: HTMLElement): HTMLElement
{
	let tab = document.createElement('div');
	Container.appendChild(tab);
	tab.classList.add('social-app-tab');
	tab.id = 'social-app-' + Name + '-tab';
	tab.style.width = '50px';
	tab.style.height = 'calc(100% - 4px)';
	tab.style.transform = 'translateY(2px)';
	tab.style.borderTopLeftRadius = '8px';
	tab.style.borderTopRightRadius = '8px';
	tab.style.border = '1px solid rgb(72, 72, 72)';
	tab.style.margin = '0px 3px';
	tab.style.backgroundColor = '#d3d2b3';
	tab.style.display = 'flex';
	tab.style.justifyContent = 'center';
	tab.style.alignItems = 'center';
	tab.style.cursor = 'pointer';

	tab.addEventListener('mouseenter', () => {
		tab.style.backgroundColor = '#e0dfc0';
	});
	tab.addEventListener('mouseleave', () => {
		if (tab.classList.contains('active-tab'))
			tab.style.backgroundColor = '#c0bfa0';
		else
			tab.style.backgroundColor = '#d3d2b3';
	});
	tab.addEventListener('mousedown', () => {
		tab.style.backgroundColor = '#c0bfa0';
	});
	tab.addEventListener('mouseup', () => {
		tab.style.backgroundColor = '#e0dfc0';
	});

	let title = document.createElement('h3');
	tab.appendChild(title);
	title.textContent = Name;
	title.style.color = 'black';
	title.style.fontSize = '11px';
	title.style.fontWeight = 'bold';
	title.style.margin = '0px';
	title.style.padding = '0px';
	title.style.textAlign = 'center';

	return tab;
}


function createCategorieContainer(Name: string, Container: HTMLElement): HTMLElement
{
	let categorie = document.createElement('div');
	Container.appendChild(categorie);
	categorie.id = "social-app-" +  Name + '-categorie';
	categorie.classList.add('social-app-categorie');
	categorie.style.width = 'calc(100% - 1px)';
	categorie.style.height = 'calc(100% - 1px)';
	categorie.style.overflow = 'hidden';
	categorie.style.margin = '0px 3px';
	categorie.style.display = 'flex';
	categorie.style.flexDirection = 'column';
	categorie.style.justifyContent = 'left';
	categorie.style.alignItems = 'center';
	categorie.style.display = 'none';
	return categorie;
}

function setActiveTab(Tab: HTMLElement): void
{
	let tabsContainer = document.getElementById('social-app-tabs-container') as HTMLElement;
	if (!tabsContainer) return;
	let tabs = tabsContainer.children;
	for (let i = 0; i < tabs.length; i++)
	{
		let tab = tabs[i] as HTMLElement;
		if (tab.classList.contains('active-tab'))
		{
			tab.classList.remove('active-tab');
			tab.style.backgroundColor = '#d3d2b3';
		}
	}
	Tab.classList.add('active-tab');
}

function setActiveContent(Content: HTMLElement)
{
	let contentContainer = document.getElementById('social-app-content-container') as HTMLElement;
	if (!contentContainer) return;
	let contents = contentContainer.children;
	for (let i = 0; i < contents.length; i++)
	{
		let content = contents[i] as HTMLElement;
		if (content.style.display === 'flex')
			content.style.display = 'none';
	}
	Content.style.display = 'flex';
}

function createNotification(notification: { type: string, user: string, time: string, avatar?: string }): HTMLElement {
	let notificationsList = document.getElementById('notifications-list') as HTMLElement;
	let notificationItem = document.createElement('div');
	notificationsList.appendChild(notificationItem);
	notificationItem.style.padding = '5px';
	notificationItem.style.borderBottom = '1px solid #e0e0e0';
	notificationItem.style.fontSize = '11px';
	notificationItem.style.display = 'flex';
	notificationItem.style.alignItems = 'center';
	
	let avatarContainer = document.createElement('div');
	notificationItem.appendChild(avatarContainer);
	avatarContainer.style.width = '20px';
	avatarContainer.style.height = '20px';
	avatarContainer.style.marginRight = '5px';
	avatarContainer.style.borderRadius = '3px';
	avatarContainer.style.border = '1px solid #c0c0c0';
	avatarContainer.style.overflow = 'hidden';
	
	if (notification.type === 'friend_request' && notification.avatar) {
		let avatarImg = document.createElement('img');
		avatarContainer.appendChild(avatarImg);
		avatarImg.src = notification.avatar || "./img/Start_Menu/demo-user-profile-icon.jpg"; // Default color if no avatar
		avatarImg.style.width = '100%';
		avatarImg.style.height = '100%';
		avatarImg.style.objectFit = 'cover';
	} else {
		avatarContainer.style.backgroundColor = notification.type === 'friend_request' ? '#ffcc00' : '#66cc99';
	}
	
	let contentContainer = document.createElement('div');
	notificationItem.appendChild(contentContainer);
	contentContainer.style.flex = '1';
	
	let text = document.createElement('div');
	contentContainer.appendChild(text);
	contentContainer.style.maxWidth = 'calc(100% - 60px)';
	text.style.overflow = 'hidden';
	text.style.textOverflow = 'ellipsis';
	text.style.whiteSpace = 'nowrap';
	text.style.fontSize = '10px';
	text.textContent = notification.type === 'friend_request' 
		? `${notification.user} sent you a friend request` 
		: `${notification.user} updated their profile`;
	
	let timeSpan = document.createElement('div');
	contentContainer.appendChild(timeSpan);
	timeSpan.textContent = notification.time;
	timeSpan.style.color = '#888888';
	timeSpan.style.fontSize = '9px';

	if (notification.type === 'friend_request') {
		let goToRequestsBtn = document.createElement('div');
		notificationItem.appendChild(goToRequestsBtn);
		goToRequestsBtn.textContent = 'View';
		goToRequestsBtn.style.width = '30px';
		goToRequestsBtn.style.height = '16px';
		goToRequestsBtn.style.lineHeight = '16px';
		goToRequestsBtn.style.fontSize = '9px';
		goToRequestsBtn.style.marginLeft = '5px';
		goToRequestsBtn.style.border = '1px solid #a0a0a0';
		goToRequestsBtn.style.borderRadius = '2px';
		goToRequestsBtn.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
		goToRequestsBtn.style.cursor = 'pointer';
		goToRequestsBtn.style.textAlign = 'center';
		goToRequestsBtn.style.userSelect = 'none';
		goToRequestsBtn.style.marginLeft = 'auto';

		goToRequestsBtn.addEventListener('mouseenter', () => {
			goToRequestsBtn.style.backgroundImage = 'linear-gradient(#f5f5f5, #e5e5e5)';
		});

		goToRequestsBtn.addEventListener('mouseleave', () => {
			goToRequestsBtn.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
		});

		goToRequestsBtn.addEventListener('click', () => {
			const requestsTab = document.getElementById('social-app-Requests-tab');
			if (requestsTab) {
				requestsTab.click();
			}
		});
	}

	return notificationItem;
}

function createFriendElement(friend: { name: string, avatar: string, status: string }): HTMLElement {
	
	let recentFriendsList = document.getElementById('recent-friends-list') as HTMLElement;
	let friendItem = document.createElement('div');
	recentFriendsList.appendChild(friendItem);
	friendItem.style.padding = '5px';
	friendItem.style.borderBottom = '1px solid #e0e0e0';
	friendItem.style.display = 'flex';
	friendItem.style.alignItems = 'center';
	friendItem.style.cursor = 'pointer';
	
	friendItem.addEventListener('mouseenter', () => {
		friendItem.style.backgroundColor = '#f0f0f0';
	});
	
	friendItem.addEventListener('mouseleave', () => {
		friendItem.style.backgroundColor = 'transparent';
	});
	
	let avatar = document.createElement('div');
	friendItem.appendChild(avatar);
	avatar.style.width = '24px';
	avatar.style.height = '24px';
	avatar.style.backgroundColor = friend.avatar;
	avatar.style.borderRadius = '3px';
	avatar.style.marginRight = '8px';
	avatar.style.border = '1px solid #c0c0c0';
	
	let infoContainer = document.createElement('div');
	friendItem.appendChild(infoContainer);
	infoContainer.style.flex = '1';
	
	let nameSpan = document.createElement('div');
	infoContainer.appendChild(nameSpan);
	nameSpan.textContent = friend.name;
	nameSpan.style.fontSize = '11px';
	nameSpan.style.fontWeight = 'bold';
	
	let statusSpan = document.createElement('div');
	infoContainer.appendChild(statusSpan);
	statusSpan.textContent = friend.status === 'online' ? 'Online' : 'Offline';
	statusSpan.style.fontSize = '9px';
	statusSpan.style.color = friend.status === 'online' ? '#008800' : '#888888';
	
	let actionsContainer = document.createElement('div');
	friendItem.appendChild(actionsContainer);

	return friendItem;
}

export async function removeSocialApp()
{
	let appContainer = document.getElementById('social-app-global-container') as HTMLElement;
	if (appContainer)
	{
		appContainer.remove();
	}
}

export async function initSocialApp()
{

let userToken = sessionStorage.getItem("wxp_token");
let userId = Number(sessionStorage.getItem("wxp_user_id"));
if (!userToken || isNaN(userId))
{
	console.log("Can't find user token or ID, aborting Social App initialization");
	clearBrowserCache();
	goToLoginPage();
}

	let Appwindow = document.getElementById('social-app-window') as HTMLElement;
	if (!Appwindow) return;
	let AppBody = Appwindow.children[1] as HTMLElement;
	if (!AppBody) return;

	Appwindow.style.minWidth = '220px';
	Appwindow.style.maxWidth = '220px';
	Appwindow.style.minHeight = '400px';

	let globalContainer = document.createElement('div');
	AppBody.appendChild(globalContainer);
	globalContainer.id = 'social-app-global-container';
	globalContainer.style.width = 'calc(100% - 6px)';
	globalContainer.style.height = 'calc(100% - 29px)';
	globalContainer.style.position = 'absolute';
	globalContainer.style.display = 'flex';
	globalContainer.style.flexDirection = 'column';
	globalContainer.style.justifyContent = 'left';
	globalContainer.style.alignItems = 'center';
	globalContainer.style.backgroundColor = '#f5f3dc';
	{
		let header = document.createElement('div');
		globalContainer.appendChild(header);
		header.id = 'social-app-header';
		header.style.width = '100%';
		header.style.height = '30px';
		header.style.backgroundColor = 'rgb(243, 243, 234)';
		header.style.borderBottom = '2px solid rgb(113, 113, 113)';
		header.style.display = 'flex';
		header.style.justifyContent = 'center';
		header.style.alignItems = 'center';
		{
			let tabsContainer = document.createElement('div');
			header.appendChild(tabsContainer);
			tabsContainer.id = 'social-app-tabs-container';
			tabsContainer.style.width = 'calc(100% - 6px)';
			tabsContainer.style.height = '100%';
			tabsContainer.style.display = 'flex';
			tabsContainer.style.flexDirection = 'row';
			tabsContainer.style.justifyContent = 'left';
			tabsContainer.style.alignItems = 'center';
			tabsContainer.style.margin = '0px 3px';
			{
				let tab1 = createTab('Home', tabsContainer);
				let tab2 = createTab('Profile', tabsContainer);
				let tab3 = createTab('Friends', tabsContainer);
				let tab4 = createTab('Requests', tabsContainer);
			}

		}
		let contentContainer = document.createElement('div');
		globalContainer.appendChild(contentContainer);
		contentContainer.id = 'social-app-content-container';
		contentContainer.style.width = 'calc(100% - 6px)';
		contentContainer.style.height = 'calc(100% - 30px)';
		contentContainer.style.overflow = 'hidden';
		contentContainer.style.margin = '0px 3px';
		contentContainer.style.display = 'flex';
		contentContainer.style.flexDirection = 'column';
		contentContainer.style.justifyContent = 'left';
		contentContainer.style.alignItems = 'center';
		{
			let homeContent = createCategorieContainer('home', contentContainer);
			{
				let notificationsContainer = document.createElement('div');
				homeContent.appendChild(notificationsContainer);
				notificationsContainer.id = 'social-app-notifications-container';
				notificationsContainer.style.width = 'calc(100% - 10px)';
				notificationsContainer.style.margin = '5px';
				notificationsContainer.style.padding = '5px';
				notificationsContainer.style.backgroundColor = '#ffffff';
				notificationsContainer.style.border = '1px solid #a0a0a0';
				notificationsContainer.style.borderRadius = '3px';
				notificationsContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.15)';

				let notificationsTitle = document.createElement('div');
				notificationsContainer.appendChild(notificationsTitle);
				notificationsTitle.style.width = 'calc(100% - 4px)';
				notificationsTitle.style.padding = '3px 0';
				notificationsTitle.style.backgroundImage = 'linear-gradient(#e8e8e8, #d8d8d8)';
				notificationsTitle.style.borderBottom = '1px solid #c0c0c0';
				notificationsTitle.style.fontSize = '11px';
				notificationsTitle.style.fontWeight = 'bold';
				notificationsTitle.style.color = '#003399';
				notificationsTitle.textContent = 'Notifications';
				notificationsTitle.style.paddingLeft = '5px';

				let notificationsList = document.createElement('div');
				notificationsContainer.appendChild(notificationsList);
				notificationsList.id = 'notifications-list';
				notificationsList.style.width = '100%';
				notificationsList.style.maxHeight = '100px';
				notificationsList.style.overflowY = 'auto';

				const fetchNotifications = async () => {
					try {
						const notificationsList = document.getElementById('notifications-list');
						if (notificationsList) {
							notificationsList.innerHTML = '';
						}
						
						const userToken = sessionStorage.getItem("wxp_token");
						if (!userToken) {
							console.error("User token not found");
							return;
						}
						
						const pendingRequests = await fetchFormattedPendingRequests(userToken);
						
						if (pendingRequests.length === 0) {
							const emptyMessage = document.createElement('div');
							notificationsList?.appendChild(emptyMessage);
							emptyMessage.textContent = 'No new notifications';
							emptyMessage.style.padding = '10px';
							emptyMessage.style.textAlign = 'center';
							emptyMessage.style.color = '#888888';
							emptyMessage.style.fontSize = '11px';
							emptyMessage.style.fontStyle = 'italic';
							return;
						}
						
						pendingRequests.forEach(request => {
							const notification = {
								type: 'friend_request',
								user: request.username,
								time: 'New request',
								avatar: request.avatar
							};
							
							createNotification(notification);
						});
					} catch (error) {
						console.error('Error fetching notifications:', error);
					}
				}

				fetchNotifications();

				let recentFriendsContainer = document.createElement('div');
				homeContent.appendChild(recentFriendsContainer);
				recentFriendsContainer.id = 'social-app-recent-friends-container';
				recentFriendsContainer.style.width = 'calc(100% - 10px)';
				recentFriendsContainer.style.margin = '5px';
				recentFriendsContainer.style.marginTop = '10px';
				recentFriendsContainer.style.padding = '5px';
				recentFriendsContainer.style.backgroundColor = '#ffffff';
				recentFriendsContainer.style.border = '1px solid #a0a0a0';
				recentFriendsContainer.style.borderRadius = '3px';
				recentFriendsContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.15)';

				let recentFriendsTitle = document.createElement('div');
				recentFriendsContainer.appendChild(recentFriendsTitle);
				recentFriendsTitle.style.width = 'calc(100% - 4px)';
				recentFriendsTitle.style.padding = '3px 0';
				recentFriendsTitle.style.backgroundImage = 'linear-gradient(#e8e8e8, #d8d8d8)';
				recentFriendsTitle.style.borderBottom = '1px solid #c0c0c0';
				recentFriendsTitle.style.fontSize = '11px';
				recentFriendsTitle.style.fontWeight = 'bold';
				recentFriendsTitle.style.color = '#003399';
				recentFriendsTitle.textContent = 'Recent Friends';
				recentFriendsTitle.style.paddingLeft = '5px';

				let recentFriendsList = document.createElement('div');
				recentFriendsContainer.appendChild(recentFriendsList);
				recentFriendsList.id = 'recent-friends-list';
				recentFriendsList.style.width = '100%';
				recentFriendsList.style.maxHeight = '150px';
				recentFriendsList.style.overflowY = 'auto';

				const fetchRecentFriends = async () => {
					try {

						const userToken = sessionStorage.getItem("wxp_token");
						if (!userToken) {
							console.error("User token not found");
							return;
						}

						const recentFriendsList = document.getElementById('recent-friends-list');
						if (recentFriendsList) {
							recentFriendsList.innerHTML = '';
						}
	
						const friends = await fetchFormattedFriends(userToken);
						
						if (friends.length === 0) {
							const emptyMessage = document.createElement('div');
							recentFriendsList?.appendChild(emptyMessage);
							emptyMessage.textContent = 'No friends yet. Add some friends!';
							emptyMessage.style.padding = '10px';
							emptyMessage.style.textAlign = 'center';
							emptyMessage.style.color = '#888888';
							emptyMessage.style.fontSize = '11px';
							emptyMessage.style.fontStyle = 'italic';
							return;
						}
						
						const recentFriends = friends.slice(0, 3);
						
						recentFriends.forEach(friend => {

							let friendItem = document.createElement('div');
							recentFriendsList?.appendChild(friendItem);
							friendItem.style.padding = '5px';
							friendItem.style.borderBottom = '1px solid #e0e0e0';
							friendItem.style.display = 'flex';
							friendItem.style.alignItems = 'center';
							
							let avatarContainer = document.createElement('div');
							friendItem.appendChild(avatarContainer);
							avatarContainer.style.width = '20px';
							avatarContainer.style.height = '20px';
							avatarContainer.style.marginRight = '5px';
							avatarContainer.style.borderRadius = '3px';
							avatarContainer.style.border = '1px solid #c0c0c0';
							avatarContainer.style.overflow = 'hidden';
							avatarContainer.style.display = 'flex';
							avatarContainer.style.justifyContent = 'center';
							avatarContainer.style.alignItems = 'center';

							let avatarImage = document.createElement('img');
							avatarContainer.appendChild(avatarImage);
							avatarImage.src = friend.avatar || "./img/Start_Menu/demo-user-profile-icon.jpg";
							avatarImage.style.width = '100%';
							avatarImage.style.height = '100%';
							avatarImage.style.objectFit = 'cover';
							
							let contentContainer = document.createElement('div');
							friendItem.appendChild(contentContainer);
							contentContainer.style.flex = '1';
							contentContainer.style.maxWidth = 'calc(100% - 60px)';
							
							let nameText = document.createElement('div');
							contentContainer.appendChild(nameText);
							nameText.style.overflow = 'hidden';
							nameText.style.textOverflow = 'ellipsis';
							nameText.style.whiteSpace = 'nowrap';
							nameText.style.fontSize = '10px';
							nameText.style.fontWeight = 'bold';
							nameText.textContent = friend.username;
							
							let statusText = document.createElement('div');
							contentContainer.appendChild(statusText);
							statusText.textContent = friend.is_online ? 'Online' : 'Offline';
							statusText.style.color = friend.is_online ? '#008800' : '#888888';
							statusText.style.fontSize = '9px';
							
							let viewButton = document.createElement('div');
							friendItem.appendChild(viewButton);
							viewButton.textContent = 'View';
							viewButton.style.width = '30px';
							viewButton.style.height = '16px';
							viewButton.style.lineHeight = '16px';
							viewButton.style.fontSize = '9px';
							viewButton.style.marginLeft = '5px';
							viewButton.style.border = '1px solid #a0a0a0';
							viewButton.style.borderRadius = '2px';
							viewButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
							viewButton.style.cursor = 'pointer';
							viewButton.style.textAlign = 'center';
							viewButton.style.userSelect = 'none';
							viewButton.style.marginLeft = 'auto';

							viewButton.addEventListener('mouseenter', () => {
								viewButton.style.backgroundImage = 'linear-gradient(#f5f5f5, #e5e5e5)';
							});

							viewButton.addEventListener('mouseleave', () => {
								viewButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
							});

							viewButton.addEventListener('click', () => {
								const friendsTab = document.getElementById('social-app-Friends-tab');
								if (friendsTab) {
									friendsTab.click();
								}
							});
						});
						
						if (friends.length > 3) {
							let seeMoreItem = document.createElement('div');
							recentFriendsList?.appendChild(seeMoreItem);
							seeMoreItem.style.padding = '5px';
							seeMoreItem.style.textAlign = 'center';
							seeMoreItem.style.fontSize = '10px';
							seeMoreItem.style.color = '#555';
							seeMoreItem.style.fontStyle = 'italic';
							seeMoreItem.style.cursor = 'pointer';
							seeMoreItem.textContent = `View all ${friends.length} friends on the Friends tab`;
							
							seeMoreItem.addEventListener('mouseenter', () => {
								seeMoreItem.style.textDecoration = 'underline';
								seeMoreItem.style.color = '#003399';
							});
							
							seeMoreItem.addEventListener('mouseleave', () => {
								seeMoreItem.style.textDecoration = 'none';
								seeMoreItem.style.color = '#555';
							});
							
							seeMoreItem.addEventListener('click', () => {
								const friendsTab = document.getElementById('social-app-Friends-tab');
								if (friendsTab) {
									friendsTab.click();
								}
							});
						}
						
					} catch (error) {
						console.error('Failed to fetch recent friends:', error);
						
						const recentFriendsList = document.getElementById('recent-friends-list');
						if (recentFriendsList) {
							recentFriendsList.innerHTML = '';
							
							let errorMessage = document.createElement('div');
							recentFriendsList.appendChild(errorMessage);
							errorMessage.textContent = 'Failed to load friends list. Please try again.';
							errorMessage.style.padding = '10px';
							errorMessage.style.textAlign = 'center';
							errorMessage.style.color = '#cc0000';
							errorMessage.style.fontSize = '11px';
						}
					}
				};

				fetchRecentFriends();
				let refreshFriendsContainer = document.createElement('div');
				recentFriendsContainer.insertBefore(refreshFriendsContainer, recentFriendsList);
				refreshFriendsContainer.style.display = 'flex';
				refreshFriendsContainer.style.justifyContent = 'flex-end';
				refreshFriendsContainer.style.padding = '5px';
				refreshFriendsContainer.style.borderBottom = '1px solid #e0e0e0';

				let refreshFriendsButton = document.createElement('div');
				refreshFriendsContainer.appendChild(refreshFriendsButton);
				refreshFriendsButton.textContent = '🔄 Refresh';
				refreshFriendsButton.id = 'socialapp-recentfriend-refresh-button';
				refreshFriendsButton.style.fontSize = '10px';
				refreshFriendsButton.style.padding = '2px 6px';
				refreshFriendsButton.style.border = '1px solid #a0a0a0';
				refreshFriendsButton.style.borderRadius = '2px';
				refreshFriendsButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
				refreshFriendsButton.style.cursor = 'pointer';
				refreshFriendsButton.setAttribute('role', 'button');
				refreshFriendsButton.setAttribute('tabindex', '0');

				refreshFriendsButton.addEventListener('mouseenter', () => {
					refreshFriendsButton.style.backgroundImage = 'linear-gradient(#f5f5f5, #e5e5e5)';
				});

				refreshFriendsButton.addEventListener('mouseleave', () => {
					refreshFriendsButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
				});

				refreshFriendsButton.addEventListener('click', () => {
					refreshFriendsButton.textContent = '⌛ Loading...';
					refreshFriendsButton.style.backgroundImage = 'linear-gradient(#e0e0e0, #d0d0d0)';
					refreshFriendsButton.style.cursor = 'wait';
					refreshFriendsButton.style.pointerEvents = 'none';
					
					fetchRecentFriends().finally(() => {
						setTimeout(() => {
							refreshFriendsButton.textContent = '🔄 Refresh';
							refreshFriendsButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
							refreshFriendsButton.style.cursor = 'pointer';
							refreshFriendsButton.style.pointerEvents = 'auto';
						}, 1000);
					});
				});
			}
			let profileContent = createCategorieContainer('profile', contentContainer);
			{
				profileContent.style.backgroundColor = 'green';
				profileContent.style.backgroundColor = '#f5f3dc';

				let profileInfoContainer = document.createElement('div');
				profileContent.appendChild(profileInfoContainer);
				profileInfoContainer.style.width = 'calc(100% - 10px)';
				profileInfoContainer.style.margin = '5px';
				profileInfoContainer.style.padding = '5px';
				profileInfoContainer.style.backgroundColor = '#ffffff';
				profileInfoContainer.style.border = '1px solid #a0a0a0';
				profileInfoContainer.style.borderRadius = '3px';
				profileInfoContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.15)';

				let profileInfoTitle = document.createElement('div');
				profileInfoContainer.appendChild(profileInfoTitle);
				profileInfoTitle.style.width = 'calc(100% - 4px)';
				profileInfoTitle.style.padding = '3px 0';
				profileInfoTitle.style.backgroundImage = 'linear-gradient(#e8e8e8, #d8d8d8)';
				profileInfoTitle.style.borderBottom = '1px solid #c0c0c0';
				profileInfoTitle.style.fontSize = '11px';
				profileInfoTitle.style.fontWeight = 'bold';
				profileInfoTitle.style.color = '#003399';
				profileInfoTitle.textContent = 'Personal Information';
				profileInfoTitle.style.paddingLeft = '5px';

				let profileContentInner = document.createElement('div');
				profileInfoContainer.appendChild(profileContentInner);
				profileContentInner.style.display = 'flex';
				profileContentInner.style.padding = '10px 5px';
				profileContentInner.style.alignItems = 'center';

				let avatarContainer = document.createElement('div');
				profileContentInner.appendChild(avatarContainer);
				avatarContainer.style.width = '64px';
				avatarContainer.style.height = '64px';
				avatarContainer.style.marginRight = '10px';
				avatarContainer.style.border = '1px solid #c0c0c0';
				avatarContainer.style.backgroundColor = '#f0f0f0';
				avatarContainer.style.borderRadius = '3px';
				avatarContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
				avatarContainer.style.overflow = 'hidden';

				let avatarImage = document.createElement('img');
				avatarContainer.appendChild(avatarImage);
				avatarImage.style.width = '100%';
				avatarImage.style.height = '100%';
				avatarImage.style.backgroundColor = '#99ccff'; // Placeholder color
				avatarImage.src = './img/Start_Menu/demo-user-profile-icon.jpg'; // Default avatar
				avatarImage.classList.add('avatar-preview');

				// User info
				let userInfoContainer = document.createElement('div');
				profileContentInner.appendChild(userInfoContainer);
				userInfoContainer.style.flex = '1';
				userInfoContainer.style.width = 'calc(100% - 76px)';

				let usernameElement = document.createElement('div');
				userInfoContainer.appendChild(usernameElement);
				let usernameh2 = document.createElement('h2');
				usernameh2.classList.add('user-name-text');
				usernameh2.textContent = 'Xxx_D4rkS4suke36_xxX'; // Placeholder
				usernameh2.style.fontSize = '12px';
				usernameh2.style.fontWeight = 'bold';
				usernameh2.style.margin = '0';
				usernameh2.style.padding = '0';
				usernameh2.style.color = '#000';
				usernameh2.style.lineHeight = '1.2';
				usernameh2.style.overflow = 'hidden';
				usernameh2.style.maxWidth = '100%';
				usernameh2.style.overflowWrap = 'break-word';
				usernameh2.style.wordBreak = 'break-word';
				usernameh2.style.maxWidth = 'calc(100% - 2px)';
				usernameh2.style.marginBottom = '5px';
				usernameh2.style.textAlign = 'left';
				usernameElement.appendChild(usernameh2);
				usernameElement.style.maxWidth = 'calc(100% - 2px)';
				usernameElement.style.overflowWrap = 'break-word';
				usernameElement.style.wordBreak = 'break-word';
				usernameElement.style.whiteSpace = 'normal';
				usernameElement.style.overflow = 'hidden';
				usernameElement.style.lineHeight = '1.2';
				usernameElement.style.fontSize = '12px';
				usernameElement.style.fontWeight = 'bold';
				usernameElement.style.marginBottom = '5px';
				// API CALL NEEDED: Get username

				let userStatusElement = document.createElement('div');
				userInfoContainer.appendChild(userStatusElement);
				userStatusElement.textContent = 'User status or short bio goes here'; // Placeholder
				userStatusElement.style.fontSize = '10px';
				userStatusElement.style.color = '#555555';
				userStatusElement.style.marginBottom = '5px';
				userStatusElement.style.maxWidth = 'calc(100% - 2px)';
				userStatusElement.style.overflowWrap = 'break-word';
				userStatusElement.style.wordBreak = 'break-word';
				userStatusElement.style.whiteSpace = 'normal';
				userStatusElement.style.overflow = 'hidden';
				userStatusElement.style.lineHeight = '1.2';
				// API CALL NEEDED: Get user status/bio

				// Edit profile button
				let editProfileButton = document.createElement('button');
				userInfoContainer.appendChild(editProfileButton);
				editProfileButton.textContent = 'Edit Profile';
				editProfileButton.style.fontSize = '10px';
				editProfileButton.style.padding = '2px 5px';
				editProfileButton.style.border = '1px solid #a0a0a0';
				editProfileButton.style.borderRadius = '2px';
				editProfileButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
				editProfileButton.style.cursor = 'pointer';
				editProfileButton.addEventListener('mouseenter', () => {
					editProfileButton.style.backgroundImage = 'linear-gradient(#f5f5f5, #e5e5e5)';
				});
				editProfileButton.addEventListener('mouseleave', () => {
					editProfileButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
				});
				editProfileButton.addEventListener('click', () => {
					let settingsWindow = document.getElementById('settings-app-window') as HTMLElement;
					if (settingsWindow)
					{
						openAppWindow('', 'settings-app-window');
						let settingBackButton = document.getElementById('settings-app-back-button') as HTMLElement;
						settingBackButton.click();
						Appwindow.style.zIndex = '24';
						settingsWindow.style.zIndex = '25';
						let UserAccountTab = document.getElementById('settings-app-User Account-category') as HTMLElement;
						if (UserAccountTab)
							UserAccountTab.click();
					}
				});
				// API CALL NEEDED: Handle profile edit

				// Fetch user profile data
				const fetchUserProfile = async () => {
					try {
						const userToken = sessionStorage.getItem("wxp_token");
						const userId = sessionStorage.getItem("wxp_user_id");
						
						if (!userToken || !userId) {
							console.error("User token or ID not found");
							return;
						}
						
						// Fetch user profile using the getUserById API
						const userData = await getUserById(Number(userId));
						
						// Update the UI with user data
						const userNameText = document.querySelector('.user-name-text') as HTMLElement;
						const avatarPreview = document.querySelector('.avatar-preview') as HTMLImageElement;
						
						if (userNameText) {
							userNameText.textContent = userData.username || 'Unknown User';
						}
						
						if (avatarPreview && userData.avatar) {
							avatarPreview.src = userData.avatar;
						}
						
					} catch (error) {
						console.error("Failed to fetch user profile:", error);
					}
				};

				// Friends statistics section
				let friendsStatsContainer = document.createElement('div');
				profileContent.appendChild(friendsStatsContainer);
				friendsStatsContainer.style.width = 'calc(100% - 10px)';
				friendsStatsContainer.style.margin = '5px';
				friendsStatsContainer.style.marginTop = '10px';
				friendsStatsContainer.style.padding = '5px';
				friendsStatsContainer.style.backgroundColor = '#ffffff';
				friendsStatsContainer.style.border = '1px solid #a0a0a0';
				friendsStatsContainer.style.borderRadius = '3px';
				friendsStatsContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.15)';

				// Friends statistics header
				let friendsStatsTitle = document.createElement('div');
				friendsStatsContainer.appendChild(friendsStatsTitle);
				friendsStatsTitle.style.width = 'calc(100% - 4px)';
				friendsStatsTitle.style.padding = '3px 0';
				friendsStatsTitle.style.backgroundImage = 'linear-gradient(#e8e8e8, #d8d8d8)';
				friendsStatsTitle.style.borderBottom = '1px solid #c0c0c0';
				friendsStatsTitle.style.fontSize = '11px';
				friendsStatsTitle.style.fontWeight = 'bold';
				friendsStatsTitle.style.color = '#003399';
				friendsStatsTitle.textContent = 'Friendship Statistics';
				friendsStatsTitle.style.paddingLeft = '5px';

				// Friends count
				let friendsCountContainer = document.createElement('div');
				friendsStatsContainer.appendChild(friendsCountContainer);
				friendsCountContainer.style.padding = '8px 5px';
				friendsCountContainer.style.borderBottom = '1px solid #e0e0e0';

				let friendsCountLabel = document.createElement('span');
				friendsCountContainer.appendChild(friendsCountLabel);
				friendsCountLabel.textContent = 'Total Friends: ';
				friendsCountLabel.style.fontSize = '11px';
				friendsCountLabel.style.fontWeight = 'bold';

				let friendsCountValue = document.createElement('span');
				friendsCountContainer.appendChild(friendsCountValue);
				friendsCountValue.textContent = 'Loading...'; // Show loading initially
				friendsCountValue.style.fontSize = '11px';

				// Recently added friends title
				let recentFriendsTitle = document.createElement('div');
				friendsStatsContainer.appendChild(recentFriendsTitle);
				recentFriendsTitle.textContent = 'Recently Added:';
				recentFriendsTitle.style.fontSize = '11px';
				recentFriendsTitle.style.fontWeight = 'bold';
				recentFriendsTitle.style.padding = '5px';

				// Create container for recent friends list
				let recentFriendsList = document.createElement('div');
				friendsStatsContainer.appendChild(recentFriendsList);
				recentFriendsList.id = 'profile-recent-friends-list';
				recentFriendsList.style.maxHeight = '120px';
				recentFriendsList.style.overflowY = 'auto';
				recentFriendsList.innerHTML = '<div style="text-align:center;color:#888;font-size:10px;padding:5px;">Loading recent friends...</div>';

				// Function to fetch and display friend statistics
				const fetchFriendStatistics = async () => {
					try {
						const userToken = sessionStorage.getItem("wxp_token");
						if (!userToken) {
							console.error("User token not found");
							return;
						}
						
						// Get friends list using the API
						const friendsData = await getUserFriendsDetails(userToken);
						
						// Update total count
						friendsCountValue.textContent = friendsData.length.toString();
						
						// Clear the loading message
						recentFriendsList.innerHTML = '';
						
						// If no friends, show a message
						if (friendsData.length === 0) {
							recentFriendsList.innerHTML = '<div style="text-align:center;color:#888;font-size:10px;padding:5px;">No friends added yet</div>';
							return;
						}
						
						// Sort by most recently added (if available) or just take first 3
						const recentFriends = friendsData.slice(0, 3);
						
						// Display recent friends
						recentFriends.forEach(friend => {
							let friendItem = document.createElement('div');
							recentFriendsList.appendChild(friendItem);
							friendItem.style.display = 'flex';
							friendItem.style.alignItems = 'center';
							friendItem.style.padding = '5px';
							friendItem.style.borderBottom = '1px solid #e0e0e0';
							
							// Friend avatar container
							let friendAvatarContainer = document.createElement('div');
							friendItem.appendChild(friendAvatarContainer);
							friendAvatarContainer.style.width = '16px';
							friendAvatarContainer.style.height = '16px';
							friendAvatarContainer.style.marginRight = '5px';
							friendAvatarContainer.style.border = '1px solid #c0c0c0';
							friendAvatarContainer.style.borderRadius = '2px';
							friendAvatarContainer.style.overflow = 'hidden';
							
							// Avatar image
							let friendAvatarImg = document.createElement('img');
							friendAvatarContainer.appendChild(friendAvatarImg);
							friendAvatarImg.src = friend.avatar || "./img/Start_Menu/demo-user-profile-icon.jpg";
							friendAvatarImg.style.width = '100%';
							friendAvatarImg.style.height = '100%';
							friendAvatarImg.style.objectFit = 'cover';
							
							let friendInfo = document.createElement('div');
							friendItem.appendChild(friendInfo);
							
							let friendName = document.createElement('div');
							friendInfo.appendChild(friendName);
							friendName.textContent = friend.username;
							friendName.style.fontSize = '10px';
							friendName.style.fontWeight = 'bold';
							
							let statusInfo = document.createElement('div');
							friendInfo.appendChild(statusInfo);
							statusInfo.textContent = friend.is_online ? 'Online' : 'Offline';
							statusInfo.style.fontSize = '9px';
							statusInfo.style.color = friend.is_online ? '#008800' : '#888888';
						});
					} catch (error) {
						console.error("Failed to fetch friend statistics:", error);
						friendsCountValue.textContent = "Error";
						recentFriendsList.innerHTML = '<div style="text-align:center;color:red;font-size:10px;padding:5px;">Failed to load friends</div>';
					}
				};

				// Call the functions to load profile data
				fetchUserProfile();
				fetchFriendStatistics();

				// Add refresh button for statistics
				let refreshStatsButton = document.createElement('div');
				friendsStatsContainer.insertBefore(refreshStatsButton, recentFriendsTitle);
				refreshStatsButton.id = 'socialapp-refresh-profilestats-button';
				refreshStatsButton.textContent = '🔄 Refresh Stats';
				refreshStatsButton.style.fontSize = '10px';
				refreshStatsButton.style.padding = '2px 6px';
				refreshStatsButton.style.margin = '5px 0';
				refreshStatsButton.style.border = '1px solid #a0a0a0';
				refreshStatsButton.style.borderRadius = '2px';
				refreshStatsButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
				refreshStatsButton.style.cursor = 'pointer';
				refreshStatsButton.style.width = 'fit-content';
				refreshStatsButton.style.alignSelf = 'flex-end';

				refreshStatsButton.addEventListener('mouseenter', () => {
					refreshStatsButton.style.backgroundImage = 'linear-gradient(#f5f5f5, #e5e5e5)';
				});

				refreshStatsButton.addEventListener('mouseleave', () => {
					refreshStatsButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
				});

				refreshStatsButton.addEventListener('click', () => {
					refreshStatsButton.textContent = '⌛ Refreshing...';
					refreshStatsButton.style.cursor = 'wait';
					refreshStatsButton.style.pointerEvents = 'none';
					
					// Refresh data
					Promise.all([fetchUserProfile(), fetchFriendStatistics()])
						.finally(() => {
							setTimeout(() => {
								refreshStatsButton.textContent = '🔄 Refresh Stats';
								refreshStatsButton.style.cursor = 'pointer';
								refreshStatsButton.style.pointerEvents = 'auto';
							}, 1000);
						});
				});
			}
			let friendsContent = createCategorieContainer('friends', contentContainer);
			{
				friendsContent.style.backgroundColor = 'yellow';
				// Clear default styling
				friendsContent.style.backgroundColor = '#f5f3dc';

				// Search and Filters Section
				let searchContainer = document.createElement('div');
				friendsContent.appendChild(searchContainer);
				searchContainer.style.width = 'calc(100% - 10px)';
				searchContainer.style.margin = '5px';
				searchContainer.style.padding = '5px';
				searchContainer.style.backgroundColor = '#ffffff';
				searchContainer.style.border = '1px solid #a0a0a0';
				searchContainer.style.borderRadius = '3px';
				searchContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.15)';

				// Search and Filters Title
				let searchTitle = document.createElement('div');
				searchContainer.appendChild(searchTitle);
				searchTitle.style.width = 'calc(100% - 4px)';
				searchTitle.style.padding = '3px 0';
				searchTitle.style.backgroundImage = 'linear-gradient(#e8e8e8, #d8d8d8)';
				searchTitle.style.borderBottom = '1px solid #c0c0c0';
				searchTitle.style.fontSize = '11px';
				searchTitle.style.fontWeight = 'bold';
				searchTitle.style.color = '#003399';
				searchTitle.textContent = 'Search Friends';
				searchTitle.style.paddingLeft = '5px';

				// Search input container
				let searchInputContainer = document.createElement('div');
				searchContainer.appendChild(searchInputContainer);
				searchInputContainer.style.display = 'flex';
				searchInputContainer.style.alignItems = 'center';
				searchInputContainer.style.padding = '5px';
				searchInputContainer.style.marginBottom = '3px';

				// Search input
				let searchInput = document.createElement('input');
				searchInputContainer.appendChild(searchInput);
				searchInput.type = 'text';
				searchInput.placeholder = 'Enter friend name...';
				searchInput.style.flex = '1';
				searchInput.style.height = '18px';
				searchInput.style.padding = '2px 4px';
				searchInput.style.fontSize = '11px';
				searchInput.style.border = '1px solid #a0a0a0';
				searchInput.style.borderRadius = '2px';

				// Search button
				let searchButton = document.createElement('div');
				searchInputContainer.appendChild(searchButton);
				searchButton.textContent = '🔍';
				searchButton.style.marginLeft = '5px';
				searchButton.style.padding = '2px 5px';
				searchButton.style.fontSize = '11px';
				searchButton.style.border = '1px solid #a0a0a0';
				searchButton.style.borderRadius = '2px';
				searchButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
				searchButton.style.cursor = 'pointer';
				searchButton.addEventListener('mouseenter', () => {
					searchButton.style.backgroundImage = 'linear-gradient(#f5f5f5,rgb(202, 202, 202))';
				});
				searchButton.addEventListener('mouseleave', () => {
					searchButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
				});
				searchButton.addEventListener('mousedown', () => {
					searchButton.style.backgroundImage = 'linear-gradient(rgb(202, 202, 202), #f5f5f5)';
				});
				searchButton.addEventListener('mouseup', () => {
					searchButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
				});
				searchButton.addEventListener('click', () => {
					filterFriendsList(searchInput.value, currentFilter);
				});

				// Filter options
				let filterContainer = document.createElement('div');
				searchContainer.appendChild(filterContainer);
				filterContainer.style.display = 'flex';
				filterContainer.style.alignItems = 'center';
				filterContainer.style.padding = '0 5px 5px 5px';

				let filterLabel = document.createElement('span');
				filterContainer.appendChild(filterLabel);
				filterLabel.textContent = 'Sort by: ';
				filterLabel.style.fontSize = '10px';
				filterLabel.style.marginRight = '5px';

				// Filter buttons
				let currentFilter = 'name'; // Default filter
				const createFilterButton = (text: string, filterValue: string) => {
					let button = document.createElement('div');
					filterContainer.appendChild(button);
					button.textContent = text;
					button.style.fontSize = '10px';
					button.style.padding = '2px 2px';
					button.style.marginRight = '3px';
					button.style.border = '1px solid #a0a0a0';
					button.style.borderRadius = '2px';
					button.style.backgroundImage = filterValue === currentFilter 
						? 'linear-gradient(#d0d0d0, #c0c0c0)' 
						: 'linear-gradient(#f0f0f0, #e0e0e0)';
					button.style.cursor = 'pointer';
					
					button.addEventListener('mouseenter', () => {
						if (filterValue !== currentFilter)
							button.style.backgroundImage = 'linear-gradient(#f5f5f5, #e5e5e5)';
					});
					
					button.addEventListener('mouseleave', () => {
						button.style.backgroundImage = filterValue === currentFilter 
							? 'linear-gradient(#d0d0d0, #c0c0c0)' 
							: 'linear-gradient(#f0f0f0, #e0e0e0)';
					});
					
					button.addEventListener('click', () => {
						currentFilter = filterValue;
						// Update active button styles
						Array.from(filterContainer.children).forEach(child => {
							if (child instanceof HTMLElement && child !== filterLabel) {
								child.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
							}
						});
						button.style.backgroundImage = 'linear-gradient(#d0d0d0, #c0c0c0)';
						
						filterFriendsList(searchInput.value, currentFilter);
					});
					
					return button;
				};

				createFilterButton('Name', 'name');
				createFilterButton('Date Added', 'date');
				createFilterButton('Status', 'status');

				// Friends List Section
				let friendsListContainer = document.createElement('div');
				friendsContent.appendChild(friendsListContainer);
				friendsListContainer.style.width = 'calc(100% - 10px)';
				friendsListContainer.style.margin = '5px';
				friendsListContainer.style.marginTop = '10px';
				friendsListContainer.style.padding = '5px';
				friendsListContainer.style.backgroundColor = '#ffffff';
				friendsListContainer.style.border = '1px solid #a0a0a0';
				friendsListContainer.style.borderRadius = '3px';
				friendsListContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.15)';
				friendsListContainer.style.flex = '1';
				friendsListContainer.style.display = 'flex';
				friendsListContainer.style.flexDirection = 'column';
				friendsListContainer.style.overflowY = 'scroll';


				// Friends List Title
				let friendsListTitle = document.createElement('div');
				friendsListContainer.appendChild(friendsListTitle);
				friendsListTitle.style.width = 'calc(100% - 10px)';
				friendsListTitle.style.padding = '3px 0';
				friendsListTitle.style.backgroundImage = 'linear-gradient(#e8e8e8, #d8d8d8)';
				friendsListTitle.style.borderBottom = '1px solid #c0c0c0';
				friendsListTitle.style.fontSize = '11px';
				friendsListTitle.style.fontWeight = 'bold';
				friendsListTitle.style.color = '#003399';
				friendsListTitle.textContent = 'My Friends';
				friendsListTitle.style.paddingLeft = '5px';

				// Friends count display
				let friendsCountDisplay = document.createElement('div');
				friendsListContainer.appendChild(friendsCountDisplay);
				friendsCountDisplay.style.padding = '5px';
				friendsCountDisplay.style.fontSize = '10px';
				friendsCountDisplay.style.color = '#555555';
				friendsCountDisplay.style.borderBottom = '1px solid #e0e0e0';
				friendsCountDisplay.textContent = 'Loading friends...';

				// Scrollable friends list
				let friendsList = document.createElement('div');
				friendsListContainer.appendChild(friendsList);
				friendsList.id = 'friends-list';
				friendsList.style.flex = '1';
				friendsList.style.padding = '2px';

				// Function to create a friend element in the list
				const createFriendListItem = (friend: { id: string, name: string, avatar: string, status: string, addedDate: string }): HTMLElement => {
					let friendItem = document.createElement('div');
					friendsList.appendChild(friendItem);
					friendItem.style.display = 'flex';
					friendItem.style.alignItems = 'center';
					friendItem.style.padding = '5px';
					friendItem.style.borderBottom = '1px solid #e0e0e0';
					friendItem.style.cursor = 'pointer';
					
					friendItem.addEventListener('mouseenter', () => {
						friendItem.style.backgroundColor = '#f0f0f0';
					});
					
					friendItem.addEventListener('mouseleave', () => {
						friendItem.style.backgroundColor = 'transparent';
					});
					
					// Friend avatar
					let avatar = document.createElement('div');
					friendItem.appendChild(avatar);
					avatar.style.width = '24px';
					avatar.style.height = '24px';
					avatar.style.borderRadius = '3px';
					avatar.style.marginRight = '8px';
					avatar.style.border = '1px solid #c0c0c0';
					avatar.style.overflow = 'hidden';
					
					// Avatar image
					let avatarImg = document.createElement('img');
					avatar.appendChild(avatarImg);
					avatarImg.src = friend.avatar;
					avatarImg.style.width = '100%';
					avatarImg.style.height = '100%';
					avatarImg.style.objectFit = 'cover';
					
					// Friend information
					let infoContainer = document.createElement('div');
					friendItem.appendChild(infoContainer);
					infoContainer.style.flex = '1';
					
					let nameSpan = document.createElement('div');
					infoContainer.appendChild(nameSpan);
					nameSpan.textContent = friend.name;
					nameSpan.style.fontSize = '11px';
					nameSpan.style.fontWeight = 'bold';
					
					let statusInfo = document.createElement('div');
					infoContainer.appendChild(statusInfo);
					statusInfo.style.display = 'flex';
					statusInfo.style.alignItems = 'center';
					
					let statusDot = document.createElement('span');
					statusInfo.appendChild(statusDot);
					statusDot.style.width = '6px';
					statusDot.style.height = '6px';
					statusDot.style.borderRadius = '50%';
					statusDot.style.backgroundColor = friend.status === 'online' ? '#00aa00' : '#aaaaaa';
					statusDot.style.marginRight = '3px';
					
					let statusText = document.createElement('span');
					statusInfo.appendChild(statusText);
					statusText.textContent = friend.status === 'online' ? 'Online' : 'Offline';
					statusText.style.fontSize = '9px';
					statusText.style.color = friend.status === 'online' ? '#008800' : '#888888';
					
					let addedDateSpan = document.createElement('div');
					infoContainer.appendChild(addedDateSpan);
					addedDateSpan.textContent = `Added: ${friend.addedDate}`;
					addedDateSpan.style.fontSize = '9px';
					addedDateSpan.style.color = '#888888';
					
					// Action buttons container
					let actionsContainer = document.createElement('div');
					friendItem.appendChild(actionsContainer);
					actionsContainer.style.display = 'flex';
					
					// Remove friend button
					let removeButton = document.createElement('button');
					actionsContainer.appendChild(removeButton);
					removeButton.textContent = 'Remove';
					removeButton.style.fontSize = '9px';
					removeButton.style.padding = '2px 4px';
					removeButton.style.border = '1px solid #a0a0a0';
					removeButton.style.borderRadius = '2px';
					removeButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
					removeButton.style.cursor = 'pointer';
					
					removeButton.addEventListener('click', async (e) => {
						e.stopPropagation();
						if (confirm(`Are you sure you want to remove ${friend.name} from your friends?`)) {
							try {
								const userToken = sessionStorage.getItem("wxp_token");
								if (!userToken) {
									console.error("User token not found");
									return;
								}
								
								await removeFriend(userToken, friend.name);

								// If API call is successful, remove from UI and update count
								friendItem.remove();
								updateFriendsCount();
							} catch (error) {
								console.error('Failed to remove friend:', error);
								alert('Failed to remove friend. Please try again.');
							}
						}
					});
					
					return friendItem;
				};

				// Function to filter friends list based on search term and sort filter
				const filterFriendsList = async (searchTerm: string, sortBy: string) => {
					try {
						// Clear current list
						friendsList.innerHTML = '';
						
						// Show loading state
						friendsCountDisplay.textContent = 'Loading friends...';
						
						const userToken = sessionStorage.getItem("wxp_token");
						if (!userToken) {
							console.error("User token not found");
							friendsCountDisplay.textContent = 'Error: User not logged in';
							return;
						}
						
						// Fetch all friends
						const allFriendsResponse = await getUserFriendsDetails(userToken);
						
						// Deduplicate friends by ID to prevent duplicates from API
						const uniqueMap = new Map();
						allFriendsResponse.forEach(friend => {
							if (friend.id !== undefined) {
								uniqueMap.set(friend.id.toString(), friend);
							}
						});
						const allFriends = Array.from(uniqueMap.values());
						
						// Filter by search term
						let filteredFriends = allFriends;
						if (searchTerm) {
							filteredFriends = allFriends.filter(friend => 
								friend.username.toLowerCase().includes(searchTerm.toLowerCase())
							);
						}
						
						// Sort based on current filter
						if (sortBy === 'name') {
							filteredFriends.sort((a, b) => a.username.localeCompare(b.username));
						} else if (sortBy === 'date') {
							// API doesn't provide date info, so maintain order as returned
							// This would ideally use creation_date or similar if available
						} else if (sortBy === 'status') {
							filteredFriends.sort((a, b) => {
								if (a.is_online && !b.is_online) return -1;
								if (!a.is_online && b.is_online) return 1;
								return 0;
							});
						}
						
						// Create friend items for filtered list
						filteredFriends.forEach(friend => {
							const friendItem = {
								id: friend.id?.toString() || 'unknown',
								name: friend.username,
								avatar: friend.avatar || "./img/Start_Menu/demo-user-profile-icon.jpg",
								status: friend.is_online ? 'online' : 'offline',
								addedDate: 'N/A' // API doesn't provide this info
							};
							createFriendListItem(friendItem);
						});
						
						// Update count display
						updateFriendsCount(filteredFriends.length);
						
					} catch (error) {
						console.error('Failed to filter friends list:', error);
						friendsList.innerHTML = '<div style="padding:10px;color:red;font-size:11px;text-align:center;">Failed to load friends. Please try again.</div>';
						friendsCountDisplay.textContent = 'Error loading friends';
					}
				};

				// Function to update friends count display
				const updateFriendsCount = (count?: number) => {
					if (count !== undefined) {
						friendsCountDisplay.textContent = `Total Friends: ${count}`;
					} else {
						const userToken = sessionStorage.getItem("wxp_token");
						if (userToken) {
							getUserFriendsDetails(userToken)
								.then(friends => {
									friendsCountDisplay.textContent = `Total Friends: ${friends.length}`;
								})
								.catch(error => {
									console.error('Failed to get friends count:', error);
									friendsCountDisplay.textContent = 'Failed to load count';
								});
						} else {
							friendsCountDisplay.textContent = 'User not logged in';
						}
					}
				};

				// Initial load of friends list
				filterFriendsList('', currentFilter);
				// Add refresh button above friends list
				let refreshFriendsButtonContainer = document.createElement('div');
				friendsListContainer.insertBefore(refreshFriendsButtonContainer, friendsCountDisplay);
				refreshFriendsButtonContainer.style.display = 'flex';
				refreshFriendsButtonContainer.style.justifyContent = 'flex-end';
				refreshFriendsButtonContainer.style.padding = '5px';
				refreshFriendsButtonContainer.style.borderBottom = '1px solid #e0e0e0';

				let refreshFriendsListButton = document.createElement('div');
				refreshFriendsButtonContainer.appendChild(refreshFriendsListButton);
				refreshFriendsListButton.textContent = '🔄 Refresh List';
				refreshFriendsListButton.id = 'friends-refresh-button';
				refreshFriendsListButton.style.fontSize = '10px';
				refreshFriendsListButton.style.padding = '2px 6px';
				refreshFriendsListButton.style.border = '1px solid #a0a0a0';
				refreshFriendsListButton.style.borderRadius = '2px';
				refreshFriendsListButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
				refreshFriendsListButton.style.cursor = 'pointer';
				refreshFriendsListButton.setAttribute('role', 'button');
				refreshFriendsListButton.setAttribute('tabindex', '0');

				refreshFriendsListButton.addEventListener('mouseenter', () => {
					refreshFriendsListButton.style.backgroundImage = 'linear-gradient(#f5f5f5, #e5e5e5)';
				});

				refreshFriendsListButton.addEventListener('mouseleave', () => {
					refreshFriendsListButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
				});

				refreshFriendsListButton.addEventListener('click', () => {
					refreshFriendsListButton.textContent = '⌛ Refreshing...';
					refreshFriendsListButton.style.backgroundImage = 'linear-gradient(#e0e0e0, #d0d0d0)';
					refreshFriendsListButton.style.cursor = 'wait';
					refreshFriendsListButton.style.pointerEvents = 'none';
					searchInput.value = '';
					
					filterFriendsList('', currentFilter).finally(() => {
						setTimeout(() => {
							refreshFriendsListButton.textContent = '🔄 Refresh List';
							refreshFriendsListButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
							refreshFriendsListButton.style.cursor = 'pointer';
							refreshFriendsListButton.style.pointerEvents = 'auto';
						}, 1000);
					});
				});
			}
			let requestsContent = createCategorieContainer('requests', contentContainer);
			{
				requestsContent.style.backgroundColor = 'purple';
				// Clear default styling
				requestsContent.style.backgroundColor = '#f5f3dc';

				// Friend Request Management Container
				let requestManagementContainer = document.createElement('div');
				requestsContent.appendChild(requestManagementContainer);
				requestManagementContainer.style.width = 'calc(100% - 10px)';
				requestManagementContainer.style.margin = '5px';
				requestManagementContainer.style.padding = '5px';
				requestManagementContainer.style.backgroundColor = '#ffffff';
				requestManagementContainer.style.border = '1px solid #a0a0a0';
				requestManagementContainer.style.borderRadius = '3px';
				requestManagementContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.15)';

				// Container Title
				let requestTitle = document.createElement('div');
				requestManagementContainer.appendChild(requestTitle);
				requestTitle.style.width = 'calc(100% - 4px)';
				requestTitle.style.padding = '3px 0';
				requestTitle.style.backgroundImage = 'linear-gradient(#e8e8e8, #d8d8d8)';
				requestTitle.style.borderBottom = '1px solid #c0c0c0';
				requestTitle.style.fontSize = '11px';
				requestTitle.style.fontWeight = 'bold';
				requestTitle.style.color = '#003399';
				requestTitle.textContent = 'Add a Friend';
				requestTitle.style.paddingLeft = '5px';

				// Add friend section
				let addFriendContainer = document.createElement('div');
				requestManagementContainer.appendChild(addFriendContainer);
				addFriendContainer.id = 'socialapp-add-friend-container';
				addFriendContainer.style.padding = '8px 5px';
				addFriendContainer.style.borderBottom = '1px solid #e0e0e0';

				// Search user input container
				let searchUserContainer = document.createElement('div');
				addFriendContainer.appendChild(searchUserContainer);
				addFriendContainer.id = 'socialapp-search-user-container';
				searchUserContainer.style.display = 'flex';
				searchUserContainer.style.alignItems = 'center';
				searchUserContainer.style.marginBottom = '8px';

				// Search input
				let searchUserInput = document.createElement('input');
				searchUserContainer.appendChild(searchUserInput);
				searchUserInput.id = 'socialapp-search-user-input';
				searchUserInput.type = 'text';
				searchUserInput.placeholder = 'Enter username to add...';
				searchUserInput.style.flex = '1';
				searchUserInput.style.padding = '3px 5px';
				searchUserInput.style.fontSize = '11px';
				searchUserInput.style.border = '1px solid #a0a0a0';
				searchUserInput.style.borderRadius = '2px';

				// Send request button (initially disabled)
				let sendRequestButton = document.createElement('div');
				searchUserContainer.appendChild(sendRequestButton);
				sendRequestButton.id = 'socialapp-send-request-button';
				sendRequestButton.textContent = 'Add';
				sendRequestButton.setAttribute('role', 'button');
				sendRequestButton.setAttribute('tabindex', '0');
				sendRequestButton.setAttribute('data-disabled', 'true');
				sendRequestButton.style.width = '60px';
				sendRequestButton.style.maxWidth = '60px';
				sendRequestButton.style.boxSizing = 'border-box';
				sendRequestButton.style.marginLeft = '5px';
				sendRequestButton.style.padding = '2px 0px';
				sendRequestButton.style.fontSize = '10px';
				sendRequestButton.style.border = '1px solid #a0a0a0';
				sendRequestButton.style.borderRadius = '2px';
				sendRequestButton.style.backgroundImage = 'linear-gradient(#e0e0e0, #d0d0d0)';
				sendRequestButton.style.color = '#888888';
				sendRequestButton.style.cursor = 'default';
				sendRequestButton.style.textAlign = 'center';

				// Search results container
				let searchResultsContainer = document.createElement('div');
				addFriendContainer.appendChild(searchResultsContainer);
				searchResultsContainer.id = 'socialapp-search-results-container';
				searchResultsContainer.style.marginTop = '5px';
				searchResultsContainer.style.display = 'none';

				// Timer variable for debounce
				let searchTimeout: ReturnType<typeof setTimeout> | null = null;
				let currentSearchResult: { id: string, username: string, avatar: string } | null = null;

				// Add event listener to input for dynamic search
				searchUserInput.addEventListener('input', () => {
					// Clear previous timeout
					if (searchTimeout) {
						clearTimeout(searchTimeout);
					}
					
					// Reset button state
					sendRequestButton.setAttribute('data-disabled', 'true');
					sendRequestButton.style.backgroundImage = 'linear-gradient(#e0e0e0, #d0d0d0)';
					sendRequestButton.style.color = '#888888';
					sendRequestButton.style.cursor = 'default';
					
					// Hide search results while typing
					searchResultsContainer.style.display = 'none';
					
					// If input is empty, do nothing
					if (!searchUserInput.value.trim()) {
						return;
					}
					// Set new timeout
					searchTimeout = setTimeout(async () => {
						const username = searchUserInput.value.trim();
						
						// Show a loading indicator
						searchResultsContainer.style.display = 'block';
						searchResultsContainer.innerHTML = '<div style="text-align:center;font-size:11px;color:#555;">Searching...</div>';
						
						// Call the real search function
						await searchUser(username);
					}, 500); // Wait for 500ms of inactivity
					});

					// Function to search for a user
					const searchUser = async (username: string) => {
						// Clear previous results
						searchResultsContainer.innerHTML = '';
						
						if (!username || username.length < 3) {
							showUserNotFound();
							return;
						}
						
						try {
							// Get user token
							if (!userToken) {
								console.error("User token not found");
								return;
							}

							// Show loading indicator
							searchResultsContainer.style.display = 'block';
							searchResultsContainer.textContent = 'Searching for users...';
							
							// Get our own id to avoid displaying ourselves in search results
							const currentUserId = sessionStorage.getItem("wxp_user_id");
							
							// Call getAllUsers and await its promise to resolve
							const allUsers = await getAllUsers();
							
							if (!Array.isArray(allUsers)) {
								console.error('Invalid response format from getAllUsers');
								throw new Error('Invalid user data received');
							}
							
							// Filter users to find matches with the searched username
							const matchedUser = allUsers.find(user => 
								user.username?.toLowerCase() === username.toLowerCase() && 
								user.id !== parseInt(currentUserId || '0')
							);
							
							if (matchedUser) {
								currentSearchResult = {
									id: matchedUser.id?.toString() || '',
									username: matchedUser.username || '',
									avatar: matchedUser.avatar === "default" ? "./img/Start_Menu/demo-user-profile-icon.jpg" : (matchedUser.avatar || "./img/Start_Menu/demo-user-profile-icon.jpg")
								};
								showUserFound(currentSearchResult);
							} else {
								showUserNotFound();
							}
						} catch (error) {
							console.error('Error searching for user:', error);
							searchResultsContainer.innerHTML = '';
							searchResultsContainer.style.display = 'block';
							searchResultsContainer.style.padding = '5px';
							searchResultsContainer.style.border = '1px solid #ffcccc';
							searchResultsContainer.style.backgroundColor = '#fff8f8';
							searchResultsContainer.style.borderRadius = '3px';
							searchResultsContainer.style.color = '#cc0000';
							searchResultsContainer.style.fontSize = '11px';
							searchResultsContainer.textContent = 'Error searching for user. Please try again.';
						}
					};

					// Function to display user found
					const showUserFound = (user: { id: string, username: string, avatar: string }) => {
						searchResultsContainer.style.display = 'flex';
						searchResultsContainer.style.alignItems = 'center';
						searchResultsContainer.style.padding = '5px';
						searchResultsContainer.style.border = '1px solid #d0d0d0';
						searchResultsContainer.style.backgroundColor = '#f8f8f8';
						searchResultsContainer.style.borderRadius = '3px';
						
						// User avatar container
						let userAvatarContainer = document.createElement('div');
						searchResultsContainer.appendChild(userAvatarContainer);
						userAvatarContainer.style.width = '20px';
						userAvatarContainer.style.height = '20px';
						userAvatarContainer.style.borderRadius = '3px';
						userAvatarContainer.style.marginRight = '5px';
						userAvatarContainer.style.border = '1px solid #c0c0c0';
						userAvatarContainer.style.overflow = 'hidden';
						userAvatarContainer.style.display = 'flex';
						userAvatarContainer.style.justifyContent = 'center';
						userAvatarContainer.style.alignItems = 'center';
						
						// Add avatar image
						let avatarImg = document.createElement('img');
						userAvatarContainer.appendChild(avatarImg);
						avatarImg.src = user.avatar;
						avatarImg.style.width = '100%';
						avatarImg.style.height = '100%';
						avatarImg.style.objectFit = 'cover';
						
						// User info
						let userInfo = document.createElement('div');
						searchResultsContainer.appendChild(userInfo);
						userInfo.textContent = user.username;
						userInfo.style.flex = '1';
						userInfo.style.fontSize = '11px';
						
						// Status indicator
						let statusIndicator = document.createElement('div');
						searchResultsContainer.appendChild(statusIndicator);
						statusIndicator.innerHTML = '✓';
						statusIndicator.style.color = 'green';
						statusIndicator.style.fontWeight = 'bold';
						statusIndicator.style.marginLeft = '5px';
						
						// Activate send request button
						sendRequestButton.setAttribute('data-disabled', 'false');
						sendRequestButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
						sendRequestButton.style.color = '#000000';
						sendRequestButton.style.cursor = 'pointer';
						
						// Add hover effects to button
						sendRequestButton.onmouseenter = () => {
							if (sendRequestButton.getAttribute('data-disabled') === 'false') {
								sendRequestButton.style.backgroundImage = 'linear-gradient(#f5f5f5, #e5e5e5)';
							}
						};
						
						sendRequestButton.onmouseleave = () => {
							if (sendRequestButton.getAttribute('data-disabled') === 'false') {
								sendRequestButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
							}
						};
					}

				// Function to show user not found
				const showUserNotFound = () => {
					searchResultsContainer.style.display = 'block';
					searchResultsContainer.style.padding = '5px';
					searchResultsContainer.style.border = '1px solid #ffcccc';
					searchResultsContainer.style.backgroundColor = '#fff8f8';
					searchResultsContainer.style.borderRadius = '3px';
					searchResultsContainer.style.color = '#cc0000';
					searchResultsContainer.style.fontSize = '11px';
					searchResultsContainer.textContent = 'User not found. Please check the username.';
					
					currentSearchResult = null;
				}

				// Send friend request button click handler
				sendRequestButton.addEventListener('click', () => {
					if (currentSearchResult && sendRequestButton.getAttribute('data-disabled') === 'false') {
						if (userToken) {
							sendFriendRequest(userToken, currentSearchResult.username);
							console.log(`Friend request sent to ${currentSearchResult.username}`);
						}
						else
							alert('User token not found. Please log in again.');
						searchResultsContainer.innerHTML = '';
						searchResultsContainer.style.display = 'block';
						searchResultsContainer.style.padding = '5px';
						searchResultsContainer.style.border = '1px solid #ccffcc';
						searchResultsContainer.style.backgroundColor = '#f8fff8';
						searchResultsContainer.style.borderRadius = '3px';
						searchResultsContainer.style.color = '#008800';
						searchResultsContainer.style.fontSize = '11px';
						searchResultsContainer.textContent = `Friend request sent to ${currentSearchResult.username}!`;
						
						searchUserInput.value = '';
						sendRequestButton.setAttribute('data-disabled', 'true');
						sendRequestButton.style.backgroundImage = 'linear-gradient(#e0e0e0, #d0d0d0)';
						sendRequestButton.style.color = '#888888';
						sendRequestButton.style.cursor = 'default';
						currentSearchResult = null;
					}
				});

				// Pending Friend Requests Section
				let pendingRequestsContainer = document.createElement('div');
				requestsContent.appendChild(pendingRequestsContainer);
				pendingRequestsContainer.id = 'socialapp-pending-requests-container';
				pendingRequestsContainer.style.width = 'calc(100% - 10px)';
				pendingRequestsContainer.style.margin = '5px';
				pendingRequestsContainer.style.marginTop = '10px';
				pendingRequestsContainer.style.padding = '5px';
				pendingRequestsContainer.style.backgroundColor = '#ffffff';
				pendingRequestsContainer.style.border = '1px solid #a0a0a0';
				pendingRequestsContainer.style.borderRadius = '3px';
				pendingRequestsContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.15)';
				pendingRequestsContainer.style.flex = '1';
				pendingRequestsContainer.style.display = 'flex';
				pendingRequestsContainer.style.flexDirection = 'column';

				// Pending Requests Title
				let pendingRequestsTitle = document.createElement('div');
				pendingRequestsContainer.appendChild(pendingRequestsTitle);
				pendingRequestsTitle.style.width = 'calc(100% - 4px)';
				pendingRequestsTitle.style.padding = '3px 0';
				pendingRequestsTitle.style.backgroundImage = 'linear-gradient(#e8e8e8, #d8d8d8)';
				pendingRequestsTitle.style.borderBottom = '1px solid #c0c0c0';
				pendingRequestsTitle.style.fontSize = '11px';
				pendingRequestsTitle.style.fontWeight = 'bold';
				pendingRequestsTitle.style.color = '#003399';
				pendingRequestsTitle.textContent = 'Pending Friend Requests';
				pendingRequestsTitle.style.paddingLeft = '5px';

				// Add a refresh button for pending requests
				let refreshRequestsContainer = document.createElement('div');
				pendingRequestsContainer.appendChild(refreshRequestsContainer);
				refreshRequestsContainer.style.display = 'flex';
				refreshRequestsContainer.style.justifyContent = 'flex-end';
				refreshRequestsContainer.style.padding = '5px';
				refreshRequestsContainer.style.borderBottom = '1px solid #e0e0e0';

				let refreshButton = document.createElement('div');
				refreshRequestsContainer.appendChild(refreshButton);
				refreshButton.id = 'socialapp-refresh-requests-button';
				refreshButton.textContent = '🔄 Refresh';
				refreshButton.style.fontSize = '10px';
				refreshButton.style.padding = '2px 6px';
				refreshButton.style.border = '1px solid #a0a0a0';
				refreshButton.style.borderRadius = '2px';
				refreshButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
				refreshButton.style.cursor = 'pointer';
				refreshButton.setAttribute('role', 'button');
				refreshButton.setAttribute('tabindex', '0');

				refreshButton.addEventListener('mouseenter', () => {
					refreshButton.style.backgroundImage = 'linear-gradient(#f5f5f5, #e5e5e5)';
				});

				refreshButton.addEventListener('mouseleave', () => {
					refreshButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
				});

				
				let requestCountLabel = document.createElement('div');
				refreshRequestsContainer.insertBefore(requestCountLabel, refreshButton);
				requestCountLabel.id = 'socialapp-requests-count';
				requestCountLabel.textContent = 'Requests: 0';
				requestCountLabel.style.fontSize = '10px';
				requestCountLabel.style.marginRight = '8px';
				requestCountLabel.style.color = '#555555';
				requestCountLabel.style.alignSelf = 'center';

				const updateRequestCount = (count: number) => {
					const countLabel = document.getElementById('socialapp-requests-count');
					if (countLabel) {
						countLabel.textContent = `Requests: ${count}`;
						if (count > 0) {
							countLabel.style.fontWeight = 'bold';
							countLabel.style.color = '#003399';
						} else {
							countLabel.style.fontWeight = 'normal';
							countLabel.style.color = '#555555';
						}
					}
				};

				refreshButton.addEventListener('click', async () => {
					refreshButton.textContent = '⌛ Loading...';
					refreshButton.style.backgroundImage = 'linear-gradient(#e0e0e0, #d0d0d0)';
					refreshButton.style.cursor = 'wait';
					refreshButton.style.pointerEvents = 'none';

					let requestsList = document.getElementById('socialapp-pending-requests-list');
					if (requestsList) {
						requestsList.innerHTML = '';
					}
					
					try {
						let pendingRequests: { id: string, username: string, avatar: string, is_online: boolean }[] = [];
						
						if (userToken) {
							pendingRequests = await fetchFormattedPendingRequests(userToken);
						}
						
						if (pendingRequests.length === 0) {
							let emptyMessage = document.createElement('div');
							requestsList?.appendChild(emptyMessage);
							emptyMessage.textContent = 'No pending friend requests.';
							emptyMessage.style.padding = '10px';
							emptyMessage.style.textAlign = 'center';
							emptyMessage.style.color = '#888888';
							emptyMessage.style.fontSize = '11px';
							emptyMessage.style.fontStyle = 'italic';
						} else {
							updateRequestCount(pendingRequests.length);
							pendingRequests.forEach(request => {
								createRequestItem(request);
							});
						}
					} catch (error) {
						console.error('Failed to refresh friend requests:', error);
						let errorMessage = document.createElement('div');
						requestsList?.appendChild(errorMessage);
						errorMessage.textContent = 'Failed to load friend requests. Please try again.';
						errorMessage.style.padding = '10px';
						errorMessage.style.textAlign = 'center';
						errorMessage.style.color = '#cc0000';
						errorMessage.style.fontSize = '11px';
					} finally {
						setTimeout(() => {
							refreshButton.textContent = '🔄 Refresh';
							refreshButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
							refreshButton.style.cursor = 'pointer';
							refreshButton.style.pointerEvents = 'auto';
						}, 1000);
					}
				});

				let requestsList = document.createElement('div');
				pendingRequestsContainer.appendChild(requestsList);
				requestsList.id = 'socialapp-pending-requests-list';
				requestsList.style.overflowY = 'auto';
				requestsList.style.flex = '1';
				requestsList.style.maxHeight = '200px';

				const createRequestItem = (request: { id: string, username: string, avatar: string, is_online: boolean }): HTMLElement => {
					let requestItem = document.createElement('div');
					requestsList.appendChild(requestItem);
					requestItem.id = 'socialapp-request-item-' + request.id;
					requestItem.style.display = 'flex';
					requestItem.style.alignItems = 'center';
					requestItem.style.padding = '8px 5px';
					requestItem.style.borderBottom = '1px solid #e0e0e0';
					
					let userAvatar = document.createElement('div');
					requestItem.appendChild(userAvatar);
					userAvatar.style.width = '24px';
					userAvatar.style.height = '24px';
					userAvatar.style.borderRadius = '3px';
					userAvatar.style.marginRight = '8px';
					userAvatar.style.border = '1px solid #c0c0c0';
					userAvatar.style.overflow = 'hidden';
					userAvatar.style.display = 'flex';
					userAvatar.style.justifyContent = 'center';
					userAvatar.style.alignItems = 'center';

					let avatarImage = document.createElement('img');
					userAvatar.appendChild(avatarImage);
					avatarImage.style.width = '100%';
					avatarImage.style.height = '100%';
					avatarImage.style.objectFit = 'cover';
					avatarImage.src === "default" ? "./img/Start_Menu/demo-user-profile-icon.jpg" : (request.avatar || "./img/Start_Menu/demo-user-profile-icon.jpg");
					
					let userInfo = document.createElement('div');
					requestItem.appendChild(userInfo);
					userInfo.style.flex = '1';
					userInfo.style.maxWidth = 'calc(100% - 105px)';
					
					let username = document.createElement('div');
					userInfo.appendChild(username);
					username.textContent = request.username;
					username.style.fontSize = '11px';
					username.style.fontWeight = 'bold';
					username.style.overflow = 'hidden';
					username.style.textOverflow = 'ellipsis';
					username.style.whiteSpace = 'nowrap';
					username.style.maxWidth = 'calc(100% - 5px)';
					
					let statusInfo = document.createElement('div');
					userInfo.appendChild(statusInfo);
					statusInfo.style.display = 'flex';
					statusInfo.style.alignItems = 'center';
					
					let statusDot = document.createElement('span');
					statusInfo.appendChild(statusDot);
					statusDot.style.width = '6px';
					statusDot.style.height = '6px';
					statusDot.style.borderRadius = '50%';
					statusDot.style.backgroundColor = request.is_online ? '#00aa00' : '#aaaaaa';
					statusDot.style.marginRight = '3px';
					
					let statusText = document.createElement('span');
					statusInfo.appendChild(statusText);
					statusText.textContent = request.is_online ? 'Online' : 'Offline';
					statusText.style.fontSize = '9px';
					statusText.style.color = request.is_online ? '#008800' : '#888888';
					
					let actionButtons = document.createElement('div');
					requestItem.appendChild(actionButtons);
					actionButtons.style.display = 'flex';
					
					let acceptButton = document.createElement('div');
					acceptButton.id = 'socialapp-accept-request-button-' + request.id;
					actionButtons.appendChild(acceptButton);
					acceptButton.innerHTML = '✓';
					acceptButton.style.marginRight = '5px';
					acceptButton.style.padding = '2px 5px';
					acceptButton.style.fontSize = '10px';
					acceptButton.style.border = '1px solid #a0a0a0';
					acceptButton.style.borderRadius = '2px';
					acceptButton.style.backgroundImage = 'linear-gradient(#d0ffd0, #90ee90)';
					acceptButton.style.cursor = 'pointer';
					acceptButton.style.textAlign = 'center';
					acceptButton.style.minWidth = '20px';
					acceptButton.setAttribute('role', 'button');
					acceptButton.setAttribute('tabindex', '0');

					acceptButton.addEventListener('mouseenter', () => {
						acceptButton.style.backgroundImage = 'linear-gradient(#e0ffe0, #a0ffa0)';
					});

					acceptButton.addEventListener('mouseleave', () => {
						acceptButton.style.backgroundImage = 'linear-gradient(#d0ffd0, #90ee90)';
					});

					acceptButton.addEventListener('click', () => {
						if (userToken)
							acceptFriendRequest(userToken, request.username);
						requestItem.remove();
						
						showNotification(`You are now friends with ${request.username}!`, 'success');
					});

					let declineButton = document.createElement('div');
					actionButtons.appendChild(declineButton);
					declineButton.id = 'socialapp-decline-request-button-' + request.id;
					declineButton.innerHTML = '✗';
					declineButton.style.padding = '2px 5px';
					declineButton.style.fontSize = '10px';
					declineButton.style.border = '1px solid #a0a0a0';
					declineButton.style.borderRadius = '2px';
					declineButton.style.backgroundImage = 'linear-gradient(#ffd0d0, #ee9090)';
					declineButton.style.cursor = 'pointer';
					declineButton.style.textAlign = 'center';
					declineButton.style.minWidth = '20px';
					declineButton.setAttribute('role', 'button');
					declineButton.setAttribute('tabindex', '0');

					declineButton.addEventListener('mouseenter', () => {
						declineButton.style.backgroundImage = 'linear-gradient(#ffe0e0, #ffa0a0)';
					});

					declineButton.addEventListener('mouseleave', () => {
						declineButton.style.backgroundImage = 'linear-gradient(#ffd0d0, #ee9090)';
					});

					declineButton.addEventListener('click', () => {
						if (userToken)
							declineFriendRequest(userToken, request.username);
						requestItem.remove();
					});
					
					return requestItem;
				}

				const showNotification = (message: string, type: 'success' | 'error') => {
					let notification = document.createElement('div');
					requestsContent.appendChild(notification);
					notification.id = 'socialapp-' + type + '-notification';
					notification.textContent = message;
					notification.style.position = 'absolute';
					notification.style.bottom = '10px';
					notification.style.left = '50%';
					notification.style.transform = 'translateX(-50%)';
					notification.style.padding = '5px 10px';
					notification.style.borderRadius = '3px';
					notification.style.fontSize = '11px';
					notification.style.fontWeight = 'bold';
					notification.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
					notification.style.zIndex = '100';
					notification.style.maxWidth = 'calc(100% - 35px)';
					notification.style.overflow = 'hidden';
					notification.style.whiteSpace = 'nowrap';
					notification.style.textOverflow = 'ellipsis';
					
					if (type === 'success') {
						notification.style.backgroundColor = '#d4ffb8';
						notification.style.border = '1px solid #96e070';
						notification.style.color = '#2d7700';
					} else {
						notification.style.backgroundColor = '#ffb8b8';
						notification.style.border = '1px solid #e07070';
						notification.style.color = '#770000';
					}
					
					setTimeout(() => {
						notification.style.opacity = '0';
						notification.style.transition = 'opacity 0.5s';
						setTimeout(() => notification.remove(), 500);
					}, 3000);
				}

				let pendingRequests: { id: string, username: string, avatar: string, is_online: boolean }[] = [];
				
				if (userToken)
					pendingRequests = await fetchFormattedPendingRequests(userToken);

				if (pendingRequests.length === 0) {
					let emptyMessage = document.createElement('div');
					requestsList.appendChild(emptyMessage);
					emptyMessage.textContent = 'No pending friend requests.';
					emptyMessage.style.padding = '10px';
					emptyMessage.style.textAlign = 'center';
					emptyMessage.style.color = '#888888';
					emptyMessage.style.fontSize = '11px';
					emptyMessage.style.fontStyle = 'italic';
				} else {
					pendingRequests.forEach(request => {
						createRequestItem(request);
					});
				}
			}
			let homeTab = document.getElementById('social-app-Home-tab') as HTMLElement;
			let profileTab = document.getElementById('social-app-Profile-tab') as HTMLElement;
			let friendsTab = document.getElementById('social-app-Friends-tab') as HTMLElement;
			let requestsTab = document.getElementById('social-app-Requests-tab') as HTMLElement;
			if (homeTab && profileTab && friendsTab && requestsTab)
			{
				setActiveContent(homeContent);

				homeTab.addEventListener('click', () => {
					setActiveTab(homeTab);
					setActiveContent(homeContent);
					let refreshButton = document.getElementById('socialapp-recentfriend-refresh-button');
					if (refreshButton)
						refreshButton.click();
				});
				profileTab.addEventListener('click', () => {
					setActiveTab(profileTab);
					setActiveContent(profileContent);
					let refreshButton = document.getElementById('socialapp-refresh-profilestats-button');
					if (refreshButton)
						refreshButton.click();
				});
				friendsTab.addEventListener('click', () => {
					setActiveTab(friendsTab);
					setActiveContent(friendsContent);
					let refreshButton = document.getElementById('friends-refresh-button');
					if (refreshButton)
						refreshButton.click();
				});
				requestsTab.addEventListener('click', () => {
					setActiveTab(requestsTab);
					setActiveContent(requestsContent);
					let refreshButton = document.getElementById('socialapp-refresh-requests-button');
					if (refreshButton)
						refreshButton.click();
				});
				
			}
		}
	}

}
function searchUsersByUsername(userToken: string, username: string) {
	throw new Error("Function not implemented.");
}

