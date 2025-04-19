import { openAppWindow } from "./app-icon.js";

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
	// tab.style.userSelect = 'none';

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

function createNotification(notification: { type: string, user: string, time: string }): HTMLElement {
	let notificationsList = document.getElementById('notifications-list') as HTMLElement;
	let notificationItem = document.createElement('div');
	notificationsList.appendChild(notificationItem);
	notificationItem.style.padding = '5px';
	notificationItem.style.borderBottom = '1px solid #e0e0e0';
	notificationItem.style.fontSize = '11px';
	
	let icon = document.createElement('span');
	notificationItem.appendChild(icon);
	icon.style.display = 'inline-block';
	icon.style.width = '16px';
	icon.style.height = '16px';
	icon.style.marginRight = '5px';
	icon.style.backgroundColor = notification.type === 'friend_request' ? '#ffcc00' : '#66cc99';
	icon.style.verticalAlign = 'middle';
	
	let text = document.createElement('span');
	notificationItem.appendChild(text);
	text.textContent = notification.type === 'friend_request' 
		? `${notification.user} sent you a friend request` 
		: `${notification.user} updated their profile`;
	
	let timeSpan = document.createElement('span');
	notificationItem.appendChild(timeSpan);
	timeSpan.textContent = ` - ${notification.time}`;
	timeSpan.style.color = '#888888';
	timeSpan.style.fontSize = '9px';

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

document.addEventListener('DOMContentLoaded', () => {

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
		contentContainer.style.height = 'calc(100% - 55px)';
		contentContainer.style.overflow = 'hidden';
		contentContainer.style.margin = '0px 3px';
		contentContainer.style.display = 'flex';
		contentContainer.style.flexDirection = 'column';
		contentContainer.style.justifyContent = 'left';
		contentContainer.style.alignItems = 'center';
		{
			let homeContent = createCategorieContainer('home', contentContainer);
			{
				// Notifications Section
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

				// Notifications Title
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

				// Notifications List
				let notificationsList = document.createElement('div');
				notificationsContainer.appendChild(notificationsList);
				notificationsList.id = 'notifications-list';
				notificationsList.style.width = '100%';
				notificationsList.style.maxHeight = '100px';
				notificationsList.style.overflowY = 'auto';

				// API Call
				// Comment: API Call needed here to fetch recent notifications
				let sampleNotifications = [
					{ type: 'friend_request', user: 'JohnDoe', time: '2 hours ago' },
					{ type: 'friend_update', user: 'JaneSmith', time: 'Yesterday' }
				];

				sampleNotifications.forEach(notification => {
					createNotification(notification);
				});

				// Recent Friends Section
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

				// Recent Friends Title
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

				// Recent Friends List
				let recentFriendsList = document.createElement('div');
				recentFriendsContainer.appendChild(recentFriendsList);
				recentFriendsList.id = 'recent-friends-list';
				recentFriendsList.style.width = '100%';
				recentFriendsList.style.maxHeight = '150px';
				recentFriendsList.style.overflowY = 'auto';

				// API Call needed here to fetch recent friends
				let sampleFriends = [
					{ name: 'Alice Cooper', avatar: '#ff9999', status: 'online' },
					{ name: 'Bob Smith', avatar: '#99ccff', status: 'offline' },
					{ name: 'Charlie Davis', avatar: '#99ff99', status: 'online' }
				];

				sampleFriends.forEach(friend => {
					createFriendElement(friend);
				});
			}
			let profileContent = createCategorieContainer('profile', contentContainer);
			{
				profileContent.style.backgroundColor = 'green';
				// Create profile container with Windows XP style
				profileContent.style.backgroundColor = '#f5f3dc';

				// Profile information section
				let profileInfoContainer = document.createElement('div');
				profileContent.appendChild(profileInfoContainer);
				profileInfoContainer.style.width = 'calc(100% - 10px)';
				profileInfoContainer.style.margin = '5px';
				profileInfoContainer.style.padding = '5px';
				profileInfoContainer.style.backgroundColor = '#ffffff';
				profileInfoContainer.style.border = '1px solid #a0a0a0';
				profileInfoContainer.style.borderRadius = '3px';
				profileInfoContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.15)';

				// Profile information header
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

				// Profile content
				let profileContentInner = document.createElement('div');
				profileInfoContainer.appendChild(profileContentInner);
				profileContentInner.style.display = 'flex';
				profileContentInner.style.padding = '10px 5px';
				profileContentInner.style.alignItems = 'center';

				// Avatar
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
				// API CALL NEEDED: Get user avatar

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
				friendsCountValue.textContent = '0'; // Placeholder
				friendsCountValue.style.fontSize = '11px';
				// API CALL NEEDED: Get total friends count

				// Recently added friends
				let recentFriendsTitle = document.createElement('div');
				friendsStatsContainer.appendChild(recentFriendsTitle);
				recentFriendsTitle.textContent = 'Recently Added:';
				recentFriendsTitle.style.fontSize = '11px';
				recentFriendsTitle.style.fontWeight = 'bold';
				recentFriendsTitle.style.padding = '5px';

				let recentFriendsList = document.createElement('div');
				friendsStatsContainer.appendChild(recentFriendsList);
				recentFriendsList.style.maxHeight = '120px';
				recentFriendsList.style.overflowY = 'auto';

				// API CALL NEEDED: Get recently added friends
				// Displaying placeholder recent friends
				let sampleRecentFriends = [
					{ name: 'David Brown', avatar: '#ffcc99', addedDate: '2 days ago' },
					{ name: 'Emma Wilson', avatar: '#cc99ff', addedDate: '1 week ago' }
				];

				sampleRecentFriends.forEach(friend => {
					let friendItem = document.createElement('div');
					recentFriendsList.appendChild(friendItem);
					friendItem.style.display = 'flex';
					friendItem.style.alignItems = 'center';
					friendItem.style.padding = '5px';
					friendItem.style.borderBottom = '1px solid #e0e0e0';
					
					let friendAvatar = document.createElement('div');
					friendItem.appendChild(friendAvatar);
					friendAvatar.style.width = '16px';
					friendAvatar.style.height = '16px';
					friendAvatar.style.backgroundColor = friend.avatar;
					friendAvatar.style.marginRight = '5px';
					friendAvatar.style.border = '1px solid #c0c0c0';
					friendAvatar.style.borderRadius = '2px';
					
					let friendInfo = document.createElement('div');
					friendItem.appendChild(friendInfo);
					
					let friendName = document.createElement('div');
					friendInfo.appendChild(friendName);
					friendName.textContent = friend.name;
					friendName.style.fontSize = '10px';
					friendName.style.fontWeight = 'bold';
					
					let addedDate = document.createElement('div');
					friendInfo.appendChild(addedDate);
					addedDate.textContent = `Added ${friend.addedDate}`;
					addedDate.style.fontSize = '9px';
					addedDate.style.color = '#888888';
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
					// API CALL NEEDED: Search friends by name using searchInput.value
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
							if (child instanceof HTMLButtonElement) {
								child.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
							}
						});
						button.style.backgroundImage = 'linear-gradient(#d0d0d0, #c0c0c0)';
						
						// API CALL NEEDED: Get friends sorted by specified filter
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
				// friendsList.style.overflowY = 'scroll';
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
					avatar.style.backgroundColor = friend.avatar;
					avatar.style.borderRadius = '3px';
					avatar.style.marginRight = '8px';
					avatar.style.border = '1px solid #c0c0c0';
					
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
					
					removeButton.addEventListener('click', (e) => {
						e.stopPropagation();
						if (confirm(`Are you sure you want to remove ${friend.name} from your friends?`)) {
							// API CALL NEEDED: Remove friend
							friendItem.remove();
							// Update friends count
							updateFriendsCount();
						}
					});
					
					return friendItem;
				}

				// Function to filter friends list based on search term and sort filter
				const filterFriendsList = (searchTerm: string, sortBy: string) => {
					// Clear current list
					friendsList.innerHTML = '';
					
					// API CALL NEEDED: Get friends filtered by search term and sorted by sortBy
					// For now, use sample data
					let filteredFriends = sampleFriends.filter(friend => 
						friend.name.toLowerCase().includes(searchTerm.toLowerCase())
					);
					
					// Sort based on current filter
					if (sortBy === 'name') {
						filteredFriends.sort((a, b) => a.name.localeCompare(b.name));
					} else if (sortBy === 'date') {
						// For demo purposes just reverse the array
						filteredFriends.reverse();
					} else if (sortBy === 'status') {
						filteredFriends.sort((a, b) => {
							if (a.status === 'online' && b.status !== 'online') return -1;
							if (a.status !== 'online' && b.status === 'online') return 1;
							return 0;
						});
					}
					
					// Create friend items for filtered list
					filteredFriends.forEach(friend => {
						createFriendListItem(friend);
					});
					
					// Update count display
					updateFriendsCount(filteredFriends.length);
				};

				// Function to update friends count display
				const updateFriendsCount = (count?: number) => {
					// API CALL NEEDED: Get total friends count if count not provided
					friendsCountDisplay.textContent = `Total Friends: ${count !== undefined ? count : sampleFriends.length}`;
				};

				// Sample friends data for demonstration
				const sampleFriends = [
					{ id: '1', name: 'Alice Cooper', avatar: '#ff9999', status: 'online', addedDate: '2023-01-15' },
					{ id: '2', name: 'Bob Smith', avatar: '#99ccff', status: 'offline', addedDate: '2023-02-20' },
					{ id: '3', name: 'Charlie Davis', avatar: '#99ff99', status: 'online', addedDate: '2023-03-10' },
					{ id: '4', name: 'David Jones', avatar: '#ffcc99', status: 'offline', addedDate: '2023-04-05' },
					{ id: '5', name: 'Eve Williams', avatar: '#cc99ff', status: 'online', addedDate: '2023-05-12' }
				];

				// Initial load of friends list
				filterFriendsList('', currentFilter);
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
				addFriendContainer.style.padding = '8px 5px';
				addFriendContainer.style.borderBottom = '1px solid #e0e0e0';

				// Search user input container
				let searchUserContainer = document.createElement('div');
				addFriendContainer.appendChild(searchUserContainer);
				searchUserContainer.style.display = 'flex';
				searchUserContainer.style.alignItems = 'center';
				searchUserContainer.style.marginBottom = '8px';

				// Search input
				let searchUserInput = document.createElement('input');
				searchUserContainer.appendChild(searchUserInput);
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
					searchTimeout = setTimeout(() => {
						// API CALL NEEDED: Search for user by username
						const username = searchUserInput.value.trim();
						searchUser(username);
					}, 2000); // Wait for 2 seconds of inactivity
				});

				// Function to search for a user
				const searchUser = (username: string) => {
					// Clear previous results
					searchResultsContainer.innerHTML = '';
					
					// API CALL NEEDED: Search for user by username
					// For demo, simulate API call with mock data
					// In a real implementation, this would be:
					// fetch('/api/users/search?username=' + username)
					//   .then(response => response.json())
					//   .then(handleSearchResult)
					//   .catch(error => showSearchError(error));
					
					// Simulate API response
					setTimeout(() => {
						// For demo, randomly decide if user exists
						const userExists = username.length > 3;
						
						if (userExists) {
							currentSearchResult = {
								id: 'user123',
								username: username,
								avatar: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color
							};
							showUserFound(currentSearchResult);
						} else {
							showUserNotFound();
						}
					}, 500);
				}

				// Function to display user found
				const showUserFound = (user: { id: string, username: string, avatar: string }) => {
					searchResultsContainer.style.display = 'flex';
					searchResultsContainer.style.alignItems = 'center';
					searchResultsContainer.style.padding = '5px';
					searchResultsContainer.style.border = '1px solid #d0d0d0';
					searchResultsContainer.style.backgroundColor = '#f8f8f8';
					searchResultsContainer.style.borderRadius = '3px';
					
					// User avatar
					let userAvatar = document.createElement('div');
					searchResultsContainer.appendChild(userAvatar);
					userAvatar.style.width = '20px';
					userAvatar.style.height = '20px';
					userAvatar.style.backgroundColor = user.avatar;
					userAvatar.style.borderRadius = '3px';
					userAvatar.style.marginRight = '5px';
					userAvatar.style.border = '1px solid #c0c0c0';
					
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
						// API CALL NEEDED: Send friend request
						// In a real implementation:
						// fetch('/api/friends/request', {
						//   method: 'POST',
						//   headers: { 'Content-Type': 'application/json' },
						//   body: JSON.stringify({ userId: currentSearchResult.id })
						// })
						//   .then(response => response.json())
						//   .then(handleRequestSent)
						//   .catch(error => showRequestError(error));
						
						// Simulate successful request
						searchResultsContainer.innerHTML = '';
						searchResultsContainer.style.display = 'block';
						searchResultsContainer.style.padding = '5px';
						searchResultsContainer.style.border = '1px solid #ccffcc';
						searchResultsContainer.style.backgroundColor = '#f8fff8';
						searchResultsContainer.style.borderRadius = '3px';
						searchResultsContainer.style.color = '#008800';
						searchResultsContainer.style.fontSize = '11px';
						searchResultsContainer.textContent = `Friend request sent to ${currentSearchResult.username}!`;
						
						// Reset
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

				// Create the requests list container
				let requestsList = document.createElement('div');
				pendingRequestsContainer.appendChild(requestsList);
				requestsList.id = 'pending-requests-list';
				requestsList.style.overflowY = 'auto';
				requestsList.style.flex = '1';
				requestsList.style.maxHeight = '200px';

				// Function to create request item
				const createRequestItem = (request: { id: string, username: string, avatar: string, time: string }): HTMLElement => {
					let requestItem = document.createElement('div');
					requestsList.appendChild(requestItem);
					requestItem.style.display = 'flex';
					requestItem.style.alignItems = 'center';
					requestItem.style.padding = '8px 5px';
					requestItem.style.borderBottom = '1px solid #e0e0e0';
					
					// User avatar
					let userAvatar = document.createElement('div');
					requestItem.appendChild(userAvatar);
					userAvatar.style.width = '24px';
					userAvatar.style.height = '24px';
					userAvatar.style.backgroundColor = request.avatar;
					userAvatar.style.borderRadius = '3px';
					userAvatar.style.marginRight = '8px';
					userAvatar.style.border = '1px solid #c0c0c0';
					
					// User info container
					let userInfo = document.createElement('div');
					requestItem.appendChild(userInfo);
					userInfo.style.flex = '1';
					
					// Username
					let username = document.createElement('div');
					userInfo.appendChild(username);
					username.textContent = request.username;
					username.style.fontSize = '11px';
					username.style.fontWeight = 'bold';
					
					// Request time
					let requestTime = document.createElement('div');
					userInfo.appendChild(requestTime);
					requestTime.textContent = request.time;
					requestTime.style.fontSize = '9px';
					requestTime.style.color = '#888888';
					
					// Action buttons container
					let actionButtons = document.createElement('div');
					requestItem.appendChild(actionButtons);
					actionButtons.style.display = 'flex';
					
					// Accept button
					let acceptButton = document.createElement('div');
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
						// API CALL NEEDED: Accept friend request
						// fetch('/api/friends/request/accept', {
						//   method: 'POST',
						//   headers: { 'Content-Type': 'application/json' },
						//   body: JSON.stringify({ requestId: request.id })
						// })
						
						// Remove the request from the list
						requestItem.remove();
						
						// Show success message
						showNotification(`You are now friends with ${request.username}!`, 'success');
					});

					// Decline button
					let declineButton = document.createElement('div');
					actionButtons.appendChild(declineButton);
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
						// API CALL NEEDED: Decline friend request
						// fetch('/api/friends/request/decline', {
						//   method: 'POST',
						//   headers: { 'Content-Type': 'application/json' },
						//   body: JSON.stringify({ requestId: request.id })
						// })
						
						// Remove the request from the list
						requestItem.remove();
					});
					
					return requestItem;
				}

				// Function to show notification
				const showNotification = (message: string, type: 'success' | 'error') => {
					let notification = document.createElement('div');
					requestsContent.appendChild(notification);
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
					
					if (type === 'success') {
						notification.style.backgroundColor = '#d4ffb8';
						notification.style.border = '1px solid #96e070';
						notification.style.color = '#2d7700';
					} else {
						notification.style.backgroundColor = '#ffb8b8';
						notification.style.border = '1px solid #e07070';
						notification.style.color = '#770000';
					}
					
					// Remove after 3 seconds
					setTimeout(() => {
						notification.style.opacity = '0';
						notification.style.transition = 'opacity 0.5s';
						setTimeout(() => notification.remove(), 500);
					}, 3000);
				}

				// Load pending requests
				// API CALL NEEDED: Fetch pending friend requests
				// In a real implementation:
				// fetch('/api/friends/requests/pending')
				//   .then(response => response.json())
				//   .then(requests => {
				//     requests.forEach(request => createRequestItem(request));
				//   })
				//   .catch(error => console.error('Error fetching requests:', error));

				// Sample data for demo purposes
				const sampleRequests = [
					{ id: 'req1', username: 'ProGamer123', avatar: '#ff9999', time: '2 hours ago' },
					{ id: 'req2', username: 'CoolDude42', avatar: '#99ccff', time: 'Yesterday' },
					{ id: 'req3', username: 'GameMaster99', avatar: '#ffcc99', time: '3 days ago' }
				];

				// Create empty state message
				if (sampleRequests.length === 0) {
					let emptyMessage = document.createElement('div');
					requestsList.appendChild(emptyMessage);
					emptyMessage.textContent = 'No pending friend requests.';
					emptyMessage.style.padding = '10px';
					emptyMessage.style.textAlign = 'center';
					emptyMessage.style.color = '#888888';
					emptyMessage.style.fontSize = '11px';
					emptyMessage.style.fontStyle = 'italic';
				} else {
					// Create request items
					sampleRequests.forEach(request => {
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
				});
				profileTab.addEventListener('click', () => {
					setActiveTab(profileTab);
					setActiveContent(profileContent);
				});
				friendsTab.addEventListener('click', () => {
					setActiveTab(friendsTab);
					setActiveContent(friendsContent);
				});
				requestsTab.addEventListener('click', () => {
					setActiveTab(requestsTab);
					setActiveContent(requestsContent);
				});
				
			}
		}
	}

});