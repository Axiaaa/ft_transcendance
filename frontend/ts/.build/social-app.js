import { openAppWindow } from "./app-icon.js";
function createTab(Name, Container) {
    var tab = document.createElement('div');
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
    tab.addEventListener('mouseenter', function () {
        tab.style.backgroundColor = '#e0dfc0';
    });
    tab.addEventListener('mouseleave', function () {
        if (tab.classList.contains('active-tab'))
            tab.style.backgroundColor = '#c0bfa0';
        else
            tab.style.backgroundColor = '#d3d2b3';
    });
    tab.addEventListener('mousedown', function () {
        tab.style.backgroundColor = '#c0bfa0';
    });
    tab.addEventListener('mouseup', function () {
        tab.style.backgroundColor = '#e0dfc0';
    });
    var title = document.createElement('h3');
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
function createCategorieContainer(Name, Container) {
    var categorie = document.createElement('div');
    Container.appendChild(categorie);
    categorie.id = "social-app-" + Name + '-categorie';
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
function setActiveTab(Tab) {
    var tabsContainer = document.getElementById('social-app-tabs-container');
    if (!tabsContainer)
        return;
    var tabs = tabsContainer.children;
    for (var i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        if (tab.classList.contains('active-tab')) {
            tab.classList.remove('active-tab');
            tab.style.backgroundColor = '#d3d2b3';
        }
    }
    Tab.classList.add('active-tab');
}
function setActiveContent(Content) {
    var contentContainer = document.getElementById('social-app-content-container');
    if (!contentContainer)
        return;
    var contents = contentContainer.children;
    for (var i = 0; i < contents.length; i++) {
        var content = contents[i];
        if (content.style.display === 'flex')
            content.style.display = 'none';
    }
    Content.style.display = 'flex';
}
function createNotification(notification) {
    var notificationsList = document.getElementById('notifications-list');
    var notificationItem = document.createElement('div');
    notificationsList.appendChild(notificationItem);
    notificationItem.style.padding = '5px';
    notificationItem.style.borderBottom = '1px solid #e0e0e0';
    notificationItem.style.fontSize = '11px';
    var icon = document.createElement('span');
    notificationItem.appendChild(icon);
    icon.style.display = 'inline-block';
    icon.style.width = '16px';
    icon.style.height = '16px';
    icon.style.marginRight = '5px';
    icon.style.backgroundColor = notification.type === 'friend_request' ? '#ffcc00' : '#66cc99';
    icon.style.verticalAlign = 'middle';
    var text = document.createElement('span');
    notificationItem.appendChild(text);
    text.textContent = notification.type === 'friend_request'
        ? "".concat(notification.user, " sent you a friend request")
        : "".concat(notification.user, " updated their profile");
    var timeSpan = document.createElement('span');
    notificationItem.appendChild(timeSpan);
    timeSpan.textContent = " - ".concat(notification.time);
    timeSpan.style.color = '#888888';
    timeSpan.style.fontSize = '9px';
    return notificationItem;
}
function createFriendElement(friend) {
    var recentFriendsList = document.getElementById('recent-friends-list');
    var friendItem = document.createElement('div');
    recentFriendsList.appendChild(friendItem);
    friendItem.style.padding = '5px';
    friendItem.style.borderBottom = '1px solid #e0e0e0';
    friendItem.style.display = 'flex';
    friendItem.style.alignItems = 'center';
    friendItem.style.cursor = 'pointer';
    friendItem.addEventListener('mouseenter', function () {
        friendItem.style.backgroundColor = '#f0f0f0';
    });
    friendItem.addEventListener('mouseleave', function () {
        friendItem.style.backgroundColor = 'transparent';
    });
    var avatar = document.createElement('div');
    friendItem.appendChild(avatar);
    avatar.style.width = '24px';
    avatar.style.height = '24px';
    avatar.style.backgroundColor = friend.avatar;
    avatar.style.borderRadius = '3px';
    avatar.style.marginRight = '8px';
    avatar.style.border = '1px solid #c0c0c0';
    var infoContainer = document.createElement('div');
    friendItem.appendChild(infoContainer);
    infoContainer.style.flex = '1';
    var nameSpan = document.createElement('div');
    infoContainer.appendChild(nameSpan);
    nameSpan.textContent = friend.name;
    nameSpan.style.fontSize = '11px';
    nameSpan.style.fontWeight = 'bold';
    var statusSpan = document.createElement('div');
    infoContainer.appendChild(statusSpan);
    statusSpan.textContent = friend.status === 'online' ? 'Online' : 'Offline';
    statusSpan.style.fontSize = '9px';
    statusSpan.style.color = friend.status === 'online' ? '#008800' : '#888888';
    var actionsContainer = document.createElement('div');
    friendItem.appendChild(actionsContainer);
    return friendItem;
}
document.addEventListener('DOMContentLoaded', function () {
    var Appwindow = document.getElementById('social-app-window');
    if (!Appwindow)
        return;
    var AppBody = Appwindow.children[1];
    if (!AppBody)
        return;
    Appwindow.style.minWidth = '220px';
    Appwindow.style.maxWidth = '220px';
    Appwindow.style.minHeight = '400px';
    var globalContainer = document.createElement('div');
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
        var header = document.createElement('div');
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
            var tabsContainer = document.createElement('div');
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
                var tab1 = createTab('Home', tabsContainer);
                var tab2 = createTab('Profile', tabsContainer);
                var tab3 = createTab('Friends', tabsContainer);
                var tab4 = createTab('Requests', tabsContainer);
            }
        }
        var contentContainer = document.createElement('div');
        globalContainer.appendChild(contentContainer);
        contentContainer.id = 'social-app-content-container';
        contentContainer.style.width = 'calc(100% - 6px)';
        contentContainer.style.height = 'calc(100% - 55px)';
        contentContainer.style.overflow = 'hidden';
        contentContainer.style.margin = '0px 3px';
        // contentContainer.style.backgroundColor = 'blue';
        contentContainer.style.display = 'flex';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.justifyContent = 'left';
        contentContainer.style.alignItems = 'center';
        {
            var homeContent_1 = createCategorieContainer('home', contentContainer);
            {
                // Notifications Section
                var notificationsContainer = document.createElement('div');
                homeContent_1.appendChild(notificationsContainer);
                notificationsContainer.id = 'social-app-notifications-container';
                notificationsContainer.style.width = 'calc(100% - 10px)';
                notificationsContainer.style.margin = '5px';
                notificationsContainer.style.padding = '5px';
                notificationsContainer.style.backgroundColor = '#ffffff';
                notificationsContainer.style.border = '1px solid #a0a0a0';
                notificationsContainer.style.borderRadius = '3px';
                notificationsContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.15)';
                // Notifications Title
                var notificationsTitle = document.createElement('div');
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
                var notificationsList = document.createElement('div');
                notificationsContainer.appendChild(notificationsList);
                notificationsList.id = 'notifications-list';
                notificationsList.style.width = '100%';
                notificationsList.style.maxHeight = '100px';
                notificationsList.style.overflowY = 'auto';
                // API Call
                // Comment: API Call needed here to fetch recent notifications
                var sampleNotifications = [
                    { type: 'friend_request', user: 'JohnDoe', time: '2 hours ago' },
                    { type: 'friend_update', user: 'JaneSmith', time: 'Yesterday' }
                ];
                sampleNotifications.forEach(function (notification) {
                    createNotification(notification);
                });
                // Recent Friends Section
                var recentFriendsContainer = document.createElement('div');
                homeContent_1.appendChild(recentFriendsContainer);
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
                var recentFriendsTitle = document.createElement('div');
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
                var recentFriendsList = document.createElement('div');
                recentFriendsContainer.appendChild(recentFriendsList);
                recentFriendsList.id = 'recent-friends-list';
                recentFriendsList.style.width = '100%';
                recentFriendsList.style.maxHeight = '150px';
                recentFriendsList.style.overflowY = 'auto';
                // API Call needed here to fetch recent friends
                var sampleFriends = [
                    { name: 'Alice Cooper', avatar: '#ff9999', status: 'online' },
                    { name: 'Bob Smith', avatar: '#99ccff', status: 'offline' },
                    { name: 'Charlie Davis', avatar: '#99ff99', status: 'online' }
                ];
                sampleFriends.forEach(function (friend) {
                    createFriendElement(friend);
                });
            }
            var profileContent_1 = createCategorieContainer('profile', contentContainer);
            {
                profileContent_1.style.backgroundColor = 'green';
                // Create profile container with Windows XP style
                profileContent_1.style.backgroundColor = '#f5f3dc';
                // Profile information section
                var profileInfoContainer = document.createElement('div');
                profileContent_1.appendChild(profileInfoContainer);
                profileInfoContainer.style.width = 'calc(100% - 10px)';
                profileInfoContainer.style.margin = '5px';
                profileInfoContainer.style.padding = '5px';
                profileInfoContainer.style.backgroundColor = '#ffffff';
                profileInfoContainer.style.border = '1px solid #a0a0a0';
                profileInfoContainer.style.borderRadius = '3px';
                profileInfoContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.15)';
                // Profile information header
                var profileInfoTitle = document.createElement('div');
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
                var profileContentInner = document.createElement('div');
                profileInfoContainer.appendChild(profileContentInner);
                profileContentInner.style.display = 'flex';
                profileContentInner.style.padding = '10px 5px';
                profileContentInner.style.alignItems = 'center';
                // Avatar
                var avatarContainer = document.createElement('div');
                profileContentInner.appendChild(avatarContainer);
                avatarContainer.style.width = '64px';
                avatarContainer.style.height = '64px';
                avatarContainer.style.marginRight = '10px';
                avatarContainer.style.border = '1px solid #c0c0c0';
                avatarContainer.style.backgroundColor = '#f0f0f0';
                avatarContainer.style.borderRadius = '3px';
                avatarContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
                avatarContainer.style.overflow = 'hidden';
                var avatarImage = document.createElement('img');
                avatarContainer.appendChild(avatarImage);
                avatarImage.style.width = '100%';
                avatarImage.style.height = '100%';
                avatarImage.style.backgroundColor = '#99ccff'; // Placeholder color
                avatarImage.src = './img/Start_Menu/demo-user-profile-icon.jpg'; // Default avatar
                // API CALL NEEDED: Get user avatar
                // User info
                var userInfoContainer = document.createElement('div');
                profileContentInner.appendChild(userInfoContainer);
                userInfoContainer.style.flex = '1';
                userInfoContainer.style.width = 'calc(100% - 76px)';
                var usernameElement = document.createElement('div');
                userInfoContainer.appendChild(usernameElement);
                usernameElement.textContent = 'Xxx_D4rkS4suke36_xxX'; // Placeholder
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
                var userStatusElement = document.createElement('div');
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
                var editProfileButton_1 = document.createElement('button');
                userInfoContainer.appendChild(editProfileButton_1);
                editProfileButton_1.textContent = 'Edit Profile';
                editProfileButton_1.style.fontSize = '10px';
                editProfileButton_1.style.padding = '2px 5px';
                editProfileButton_1.style.border = '1px solid #a0a0a0';
                editProfileButton_1.style.borderRadius = '2px';
                editProfileButton_1.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
                editProfileButton_1.style.cursor = 'pointer';
                editProfileButton_1.addEventListener('mouseenter', function () {
                    editProfileButton_1.style.backgroundImage = 'linear-gradient(#f5f5f5, #e5e5e5)';
                });
                editProfileButton_1.addEventListener('mouseleave', function () {
                    editProfileButton_1.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
                });
                editProfileButton_1.addEventListener('click', function () {
                    var settingsWindow = document.getElementById('settings-app-window');
                    if (settingsWindow) {
                        openAppWindow('', 'settings-app-window');
                        Appwindow.style.zIndex = '24';
                        settingsWindow.style.zIndex = '25';
                        var UserAccountTab = document.getElementById('settings-app-User Account-category');
                        if (UserAccountTab)
                            UserAccountTab.click();
                    }
                });
                // API CALL NEEDED: Handle profile edit
                // Friends statistics section
                var friendsStatsContainer = document.createElement('div');
                profileContent_1.appendChild(friendsStatsContainer);
                friendsStatsContainer.style.width = 'calc(100% - 10px)';
                friendsStatsContainer.style.margin = '5px';
                friendsStatsContainer.style.marginTop = '10px';
                friendsStatsContainer.style.padding = '5px';
                friendsStatsContainer.style.backgroundColor = '#ffffff';
                friendsStatsContainer.style.border = '1px solid #a0a0a0';
                friendsStatsContainer.style.borderRadius = '3px';
                friendsStatsContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.15)';
                // Friends statistics header
                var friendsStatsTitle = document.createElement('div');
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
                var friendsCountContainer = document.createElement('div');
                friendsStatsContainer.appendChild(friendsCountContainer);
                friendsCountContainer.style.padding = '8px 5px';
                friendsCountContainer.style.borderBottom = '1px solid #e0e0e0';
                var friendsCountLabel = document.createElement('span');
                friendsCountContainer.appendChild(friendsCountLabel);
                friendsCountLabel.textContent = 'Total Friends: ';
                friendsCountLabel.style.fontSize = '11px';
                friendsCountLabel.style.fontWeight = 'bold';
                var friendsCountValue = document.createElement('span');
                friendsCountContainer.appendChild(friendsCountValue);
                friendsCountValue.textContent = '0'; // Placeholder
                friendsCountValue.style.fontSize = '11px';
                // API CALL NEEDED: Get total friends count
                // Recently added friends
                var recentFriendsTitle = document.createElement('div');
                friendsStatsContainer.appendChild(recentFriendsTitle);
                recentFriendsTitle.textContent = 'Recently Added:';
                recentFriendsTitle.style.fontSize = '11px';
                recentFriendsTitle.style.fontWeight = 'bold';
                recentFriendsTitle.style.padding = '5px';
                var recentFriendsList_1 = document.createElement('div');
                friendsStatsContainer.appendChild(recentFriendsList_1);
                recentFriendsList_1.style.maxHeight = '120px';
                recentFriendsList_1.style.overflowY = 'auto';
                // API CALL NEEDED: Get recently added friends
                // Displaying placeholder recent friends
                var sampleRecentFriends = [
                    { name: 'David Brown', avatar: '#ffcc99', addedDate: '2 days ago' },
                    { name: 'Emma Wilson', avatar: '#cc99ff', addedDate: '1 week ago' }
                ];
                sampleRecentFriends.forEach(function (friend) {
                    var friendItem = document.createElement('div');
                    recentFriendsList_1.appendChild(friendItem);
                    friendItem.style.display = 'flex';
                    friendItem.style.alignItems = 'center';
                    friendItem.style.padding = '5px';
                    friendItem.style.borderBottom = '1px solid #e0e0e0';
                    var friendAvatar = document.createElement('div');
                    friendItem.appendChild(friendAvatar);
                    friendAvatar.style.width = '16px';
                    friendAvatar.style.height = '16px';
                    friendAvatar.style.backgroundColor = friend.avatar;
                    friendAvatar.style.marginRight = '5px';
                    friendAvatar.style.border = '1px solid #c0c0c0';
                    friendAvatar.style.borderRadius = '2px';
                    var friendInfo = document.createElement('div');
                    friendItem.appendChild(friendInfo);
                    var friendName = document.createElement('div');
                    friendInfo.appendChild(friendName);
                    friendName.textContent = friend.name;
                    friendName.style.fontSize = '10px';
                    friendName.style.fontWeight = 'bold';
                    var addedDate = document.createElement('div');
                    friendInfo.appendChild(addedDate);
                    addedDate.textContent = "Added ".concat(friend.addedDate);
                    addedDate.style.fontSize = '9px';
                    addedDate.style.color = '#888888';
                });
            }
            var friendsContent_1 = createCategorieContainer('friends', contentContainer);
            {
                friendsContent_1.style.backgroundColor = 'yellow';
                // Clear default styling
                friendsContent_1.style.backgroundColor = '#f5f3dc';
                // Search and Filters Section
                var searchContainer = document.createElement('div');
                friendsContent_1.appendChild(searchContainer);
                searchContainer.style.width = 'calc(100% - 10px)';
                searchContainer.style.margin = '5px';
                searchContainer.style.padding = '5px';
                searchContainer.style.backgroundColor = '#ffffff';
                searchContainer.style.border = '1px solid #a0a0a0';
                searchContainer.style.borderRadius = '3px';
                searchContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.15)';
                // Search and Filters Title
                var searchTitle = document.createElement('div');
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
                var searchInputContainer = document.createElement('div');
                searchContainer.appendChild(searchInputContainer);
                searchInputContainer.style.display = 'flex';
                searchInputContainer.style.alignItems = 'center';
                searchInputContainer.style.padding = '5px';
                searchInputContainer.style.marginBottom = '3px';
                // Search input
                var searchInput_1 = document.createElement('input');
                searchInputContainer.appendChild(searchInput_1);
                searchInput_1.type = 'text';
                searchInput_1.placeholder = 'Enter friend name...';
                searchInput_1.style.flex = '1';
                searchInput_1.style.height = '18px';
                searchInput_1.style.padding = '2px 4px';
                searchInput_1.style.fontSize = '11px';
                searchInput_1.style.border = '1px solid #a0a0a0';
                searchInput_1.style.borderRadius = '2px';
                // Search button
                var searchButton_1 = document.createElement('div');
                searchInputContainer.appendChild(searchButton_1);
                searchButton_1.textContent = '🔍';
                searchButton_1.style.marginLeft = '5px';
                searchButton_1.style.padding = '2px 5px';
                searchButton_1.style.fontSize = '11px';
                searchButton_1.style.border = '1px solid #a0a0a0';
                searchButton_1.style.borderRadius = '2px';
                searchButton_1.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
                searchButton_1.style.cursor = 'pointer';
                searchButton_1.addEventListener('mouseenter', function () {
                    searchButton_1.style.backgroundImage = 'linear-gradient(#f5f5f5,rgb(202, 202, 202))';
                });
                searchButton_1.addEventListener('mouseleave', function () {
                    searchButton_1.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
                });
                searchButton_1.addEventListener('mousedown', function () {
                    searchButton_1.style.backgroundImage = 'linear-gradient(rgb(202, 202, 202), #f5f5f5)';
                });
                searchButton_1.addEventListener('mouseup', function () {
                    searchButton_1.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
                });
                searchButton_1.addEventListener('click', function () {
                    // API CALL NEEDED: Search friends by name using searchInput.value
                    filterFriendsList_1(searchInput_1.value, currentFilter_1);
                });
                // Filter options
                var filterContainer_1 = document.createElement('div');
                searchContainer.appendChild(filterContainer_1);
                filterContainer_1.style.display = 'flex';
                filterContainer_1.style.alignItems = 'center';
                filterContainer_1.style.padding = '0 5px 5px 5px';
                var filterLabel = document.createElement('span');
                filterContainer_1.appendChild(filterLabel);
                filterLabel.textContent = 'Sort by: ';
                filterLabel.style.fontSize = '10px';
                filterLabel.style.marginRight = '5px';
                // Filter buttons
                var currentFilter_1 = 'name'; // Default filter
                var createFilterButton = function (text, filterValue) {
                    var button = document.createElement('div');
                    filterContainer_1.appendChild(button);
                    button.textContent = text;
                    button.style.fontSize = '10px';
                    button.style.padding = '2px 2px';
                    button.style.marginRight = '3px';
                    button.style.border = '1px solid #a0a0a0';
                    button.style.borderRadius = '2px';
                    button.style.backgroundImage = filterValue === currentFilter_1
                        ? 'linear-gradient(#d0d0d0, #c0c0c0)'
                        : 'linear-gradient(#f0f0f0, #e0e0e0)';
                    button.style.cursor = 'pointer';
                    button.addEventListener('mouseenter', function () {
                        if (filterValue !== currentFilter_1)
                            button.style.backgroundImage = 'linear-gradient(#f5f5f5, #e5e5e5)';
                    });
                    button.addEventListener('mouseleave', function () {
                        button.style.backgroundImage = filterValue === currentFilter_1
                            ? 'linear-gradient(#d0d0d0, #c0c0c0)'
                            : 'linear-gradient(#f0f0f0, #e0e0e0)';
                    });
                    button.addEventListener('click', function () {
                        currentFilter_1 = filterValue;
                        // Update active button styles
                        Array.from(filterContainer_1.children).forEach(function (child) {
                            if (child instanceof HTMLButtonElement) {
                                child.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
                            }
                        });
                        button.style.backgroundImage = 'linear-gradient(#d0d0d0, #c0c0c0)';
                        // API CALL NEEDED: Get friends sorted by specified filter
                        filterFriendsList_1(searchInput_1.value, currentFilter_1);
                    });
                    return button;
                };
                createFilterButton('Name', 'name');
                createFilterButton('Date Added', 'date');
                createFilterButton('Status', 'status');
                // Friends List Section
                var friendsListContainer = document.createElement('div');
                friendsContent_1.appendChild(friendsListContainer);
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
                var friendsListTitle = document.createElement('div');
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
                var friendsCountDisplay_1 = document.createElement('div');
                friendsListContainer.appendChild(friendsCountDisplay_1);
                friendsCountDisplay_1.style.padding = '5px';
                friendsCountDisplay_1.style.fontSize = '10px';
                friendsCountDisplay_1.style.color = '#555555';
                friendsCountDisplay_1.style.borderBottom = '1px solid #e0e0e0';
                friendsCountDisplay_1.textContent = 'Loading friends...';
                // Scrollable friends list
                var friendsList_1 = document.createElement('div');
                friendsListContainer.appendChild(friendsList_1);
                friendsList_1.id = 'friends-list';
                friendsList_1.style.flex = '1';
                // friendsList.style.overflowY = 'scroll';
                friendsList_1.style.padding = '2px';
                // Function to create a friend element in the list
                var createFriendListItem_1 = function (friend) {
                    var friendItem = document.createElement('div');
                    friendsList_1.appendChild(friendItem);
                    friendItem.style.display = 'flex';
                    friendItem.style.alignItems = 'center';
                    friendItem.style.padding = '5px';
                    friendItem.style.borderBottom = '1px solid #e0e0e0';
                    friendItem.style.cursor = 'pointer';
                    friendItem.addEventListener('mouseenter', function () {
                        friendItem.style.backgroundColor = '#f0f0f0';
                    });
                    friendItem.addEventListener('mouseleave', function () {
                        friendItem.style.backgroundColor = 'transparent';
                    });
                    // Friend avatar
                    var avatar = document.createElement('div');
                    friendItem.appendChild(avatar);
                    avatar.style.width = '24px';
                    avatar.style.height = '24px';
                    avatar.style.backgroundColor = friend.avatar;
                    avatar.style.borderRadius = '3px';
                    avatar.style.marginRight = '8px';
                    avatar.style.border = '1px solid #c0c0c0';
                    // Friend information
                    var infoContainer = document.createElement('div');
                    friendItem.appendChild(infoContainer);
                    infoContainer.style.flex = '1';
                    var nameSpan = document.createElement('div');
                    infoContainer.appendChild(nameSpan);
                    nameSpan.textContent = friend.name;
                    nameSpan.style.fontSize = '11px';
                    nameSpan.style.fontWeight = 'bold';
                    var statusInfo = document.createElement('div');
                    infoContainer.appendChild(statusInfo);
                    statusInfo.style.display = 'flex';
                    statusInfo.style.alignItems = 'center';
                    var statusDot = document.createElement('span');
                    statusInfo.appendChild(statusDot);
                    statusDot.style.width = '6px';
                    statusDot.style.height = '6px';
                    statusDot.style.borderRadius = '50%';
                    statusDot.style.backgroundColor = friend.status === 'online' ? '#00aa00' : '#aaaaaa';
                    statusDot.style.marginRight = '3px';
                    var statusText = document.createElement('span');
                    statusInfo.appendChild(statusText);
                    statusText.textContent = friend.status === 'online' ? 'Online' : 'Offline';
                    statusText.style.fontSize = '9px';
                    statusText.style.color = friend.status === 'online' ? '#008800' : '#888888';
                    var addedDateSpan = document.createElement('div');
                    infoContainer.appendChild(addedDateSpan);
                    addedDateSpan.textContent = "Added: ".concat(friend.addedDate);
                    addedDateSpan.style.fontSize = '9px';
                    addedDateSpan.style.color = '#888888';
                    // Action buttons container
                    var actionsContainer = document.createElement('div');
                    friendItem.appendChild(actionsContainer);
                    actionsContainer.style.display = 'flex';
                    // Remove friend button
                    var removeButton = document.createElement('button');
                    actionsContainer.appendChild(removeButton);
                    removeButton.textContent = 'Remove';
                    removeButton.style.fontSize = '9px';
                    removeButton.style.padding = '2px 4px';
                    removeButton.style.border = '1px solid #a0a0a0';
                    removeButton.style.borderRadius = '2px';
                    removeButton.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
                    removeButton.style.cursor = 'pointer';
                    removeButton.addEventListener('click', function (e) {
                        e.stopPropagation();
                        if (confirm("Are you sure you want to remove ".concat(friend.name, " from your friends?"))) {
                            // API CALL NEEDED: Remove friend
                            friendItem.remove();
                            // Update friends count
                            updateFriendsCount_1();
                        }
                    });
                    return friendItem;
                };
                // Function to filter friends list based on search term and sort filter
                var filterFriendsList_1 = function (searchTerm, sortBy) {
                    // Clear current list
                    friendsList_1.innerHTML = '';
                    // API CALL NEEDED: Get friends filtered by search term and sorted by sortBy
                    // For now, use sample data
                    var filteredFriends = sampleFriends_1.filter(function (friend) {
                        return friend.name.toLowerCase().includes(searchTerm.toLowerCase());
                    });
                    // Sort based on current filter
                    if (sortBy === 'name') {
                        filteredFriends.sort(function (a, b) { return a.name.localeCompare(b.name); });
                    }
                    else if (sortBy === 'date') {
                        // For demo purposes just reverse the array
                        filteredFriends.reverse();
                    }
                    else if (sortBy === 'status') {
                        filteredFriends.sort(function (a, b) {
                            if (a.status === 'online' && b.status !== 'online')
                                return -1;
                            if (a.status !== 'online' && b.status === 'online')
                                return 1;
                            return 0;
                        });
                    }
                    // Create friend items for filtered list
                    filteredFriends.forEach(function (friend) {
                        createFriendListItem_1(friend);
                    });
                    // Update count display
                    updateFriendsCount_1(filteredFriends.length);
                };
                // Function to update friends count display
                var updateFriendsCount_1 = function (count) {
                    // API CALL NEEDED: Get total friends count if count not provided
                    friendsCountDisplay_1.textContent = "Total Friends: ".concat(count !== undefined ? count : sampleFriends_1.length);
                };
                // Sample friends data for demonstration
                var sampleFriends_1 = [
                    { id: '1', name: 'Alice Cooper', avatar: '#ff9999', status: 'online', addedDate: '2023-01-15' },
                    { id: '2', name: 'Bob Smith', avatar: '#99ccff', status: 'offline', addedDate: '2023-02-20' },
                    { id: '3', name: 'Charlie Davis', avatar: '#99ff99', status: 'online', addedDate: '2023-03-10' },
                    { id: '4', name: 'David Jones', avatar: '#ffcc99', status: 'offline', addedDate: '2023-04-05' },
                    { id: '5', name: 'Eve Williams', avatar: '#cc99ff', status: 'online', addedDate: '2023-05-12' }
                ];
                // Initial load of friends list
                filterFriendsList_1('', currentFilter_1);
            }
            var requestsContent_1 = createCategorieContainer('requests', contentContainer);
            {
                requestsContent_1.style.backgroundColor = 'purple';
                // Clear default styling
                requestsContent_1.style.backgroundColor = '#f5f3dc';
                // Friend Request Management Container
                var requestManagementContainer = document.createElement('div');
                requestsContent_1.appendChild(requestManagementContainer);
                requestManagementContainer.style.width = 'calc(100% - 10px)';
                requestManagementContainer.style.margin = '5px';
                requestManagementContainer.style.padding = '5px';
                requestManagementContainer.style.backgroundColor = '#ffffff';
                requestManagementContainer.style.border = '1px solid #a0a0a0';
                requestManagementContainer.style.borderRadius = '3px';
                requestManagementContainer.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.15)';
                // Container Title
                var requestTitle = document.createElement('div');
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
                var addFriendContainer = document.createElement('div');
                requestManagementContainer.appendChild(addFriendContainer);
                addFriendContainer.style.padding = '8px 5px';
                addFriendContainer.style.borderBottom = '1px solid #e0e0e0';
                // Search user input container
                var searchUserContainer = document.createElement('div');
                addFriendContainer.appendChild(searchUserContainer);
                searchUserContainer.style.display = 'flex';
                searchUserContainer.style.alignItems = 'center';
                searchUserContainer.style.marginBottom = '8px';
                // Search input
                var searchUserInput_1 = document.createElement('input');
                searchUserContainer.appendChild(searchUserInput_1);
                searchUserInput_1.type = 'text';
                searchUserInput_1.placeholder = 'Enter username to add...';
                searchUserInput_1.style.flex = '1';
                searchUserInput_1.style.padding = '3px 5px';
                searchUserInput_1.style.fontSize = '11px';
                searchUserInput_1.style.border = '1px solid #a0a0a0';
                searchUserInput_1.style.borderRadius = '2px';
                // Send request button (initially disabled)
                var sendRequestButton_1 = document.createElement('div');
                searchUserContainer.appendChild(sendRequestButton_1);
                sendRequestButton_1.textContent = 'Add';
                sendRequestButton_1.setAttribute('role', 'button');
                sendRequestButton_1.setAttribute('tabindex', '0');
                sendRequestButton_1.setAttribute('data-disabled', 'true');
                sendRequestButton_1.style.width = '60px';
                sendRequestButton_1.style.maxWidth = '60px';
                sendRequestButton_1.style.boxSizing = 'border-box';
                sendRequestButton_1.style.marginLeft = '5px';
                sendRequestButton_1.style.padding = '2px 0px';
                sendRequestButton_1.style.fontSize = '10px';
                sendRequestButton_1.style.border = '1px solid #a0a0a0';
                sendRequestButton_1.style.borderRadius = '2px';
                sendRequestButton_1.style.backgroundImage = 'linear-gradient(#e0e0e0, #d0d0d0)';
                sendRequestButton_1.style.color = '#888888';
                sendRequestButton_1.style.cursor = 'default';
                sendRequestButton_1.style.textAlign = 'center';
                // Search results container
                var searchResultsContainer_1 = document.createElement('div');
                addFriendContainer.appendChild(searchResultsContainer_1);
                searchResultsContainer_1.style.marginTop = '5px';
                searchResultsContainer_1.style.display = 'none';
                // Timer variable for debounce
                var searchTimeout_1 = null;
                var currentSearchResult_1 = null;
                // Add event listener to input for dynamic search
                searchUserInput_1.addEventListener('input', function () {
                    // Clear previous timeout
                    if (searchTimeout_1) {
                        clearTimeout(searchTimeout_1);
                    }
                    // Reset button state
                    sendRequestButton_1.setAttribute('data-disabled', 'true');
                    sendRequestButton_1.style.backgroundImage = 'linear-gradient(#e0e0e0, #d0d0d0)';
                    sendRequestButton_1.style.color = '#888888';
                    sendRequestButton_1.style.cursor = 'default';
                    // Hide search results while typing
                    searchResultsContainer_1.style.display = 'none';
                    // If input is empty, do nothing
                    if (!searchUserInput_1.value.trim()) {
                        return;
                    }
                    // Set new timeout
                    searchTimeout_1 = setTimeout(function () {
                        // API CALL NEEDED: Search for user by username
                        var username = searchUserInput_1.value.trim();
                        searchUser_1(username);
                    }, 2000); // Wait for 2 seconds of inactivity
                });
                // Function to search for a user
                var searchUser_1 = function (username) {
                    // Clear previous results
                    searchResultsContainer_1.innerHTML = '';
                    // API CALL NEEDED: Search for user by username
                    // For demo, simulate API call with mock data
                    // In a real implementation, this would be:
                    // fetch('/api/users/search?username=' + username)
                    //   .then(response => response.json())
                    //   .then(handleSearchResult)
                    //   .catch(error => showSearchError(error));
                    // Simulate API response
                    setTimeout(function () {
                        // For demo, randomly decide if user exists
                        var userExists = username.length > 3;
                        if (userExists) {
                            currentSearchResult_1 = {
                                id: 'user123',
                                username: username,
                                avatar: '#' + Math.floor(Math.random() * 16777215).toString(16) // Random color
                            };
                            showUserFound_1(currentSearchResult_1);
                        }
                        else {
                            showUserNotFound_1();
                        }
                    }, 500);
                };
                // Function to display user found
                var showUserFound_1 = function (user) {
                    searchResultsContainer_1.style.display = 'flex';
                    searchResultsContainer_1.style.alignItems = 'center';
                    searchResultsContainer_1.style.padding = '5px';
                    searchResultsContainer_1.style.border = '1px solid #d0d0d0';
                    searchResultsContainer_1.style.backgroundColor = '#f8f8f8';
                    searchResultsContainer_1.style.borderRadius = '3px';
                    // User avatar
                    var userAvatar = document.createElement('div');
                    searchResultsContainer_1.appendChild(userAvatar);
                    userAvatar.style.width = '20px';
                    userAvatar.style.height = '20px';
                    userAvatar.style.backgroundColor = user.avatar;
                    userAvatar.style.borderRadius = '3px';
                    userAvatar.style.marginRight = '5px';
                    userAvatar.style.border = '1px solid #c0c0c0';
                    // User info
                    var userInfo = document.createElement('div');
                    searchResultsContainer_1.appendChild(userInfo);
                    userInfo.textContent = user.username;
                    userInfo.style.flex = '1';
                    userInfo.style.fontSize = '11px';
                    // Status indicator
                    var statusIndicator = document.createElement('div');
                    searchResultsContainer_1.appendChild(statusIndicator);
                    statusIndicator.innerHTML = '✓';
                    statusIndicator.style.color = 'green';
                    statusIndicator.style.fontWeight = 'bold';
                    statusIndicator.style.marginLeft = '5px';
                    // Activate send request button
                    sendRequestButton_1.setAttribute('data-disabled', 'false');
                    sendRequestButton_1.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
                    sendRequestButton_1.style.color = '#000000';
                    sendRequestButton_1.style.cursor = 'pointer';
                    // Add hover effects to button
                    sendRequestButton_1.onmouseenter = function () {
                        if (sendRequestButton_1.getAttribute('data-disabled') === 'false') {
                            sendRequestButton_1.style.backgroundImage = 'linear-gradient(#f5f5f5, #e5e5e5)';
                        }
                    };
                    sendRequestButton_1.onmouseleave = function () {
                        if (sendRequestButton_1.getAttribute('data-disabled') === 'false') {
                            sendRequestButton_1.style.backgroundImage = 'linear-gradient(#f0f0f0, #e0e0e0)';
                        }
                    };
                };
                // Function to show user not found
                var showUserNotFound_1 = function () {
                    searchResultsContainer_1.style.display = 'block';
                    searchResultsContainer_1.style.padding = '5px';
                    searchResultsContainer_1.style.border = '1px solid #ffcccc';
                    searchResultsContainer_1.style.backgroundColor = '#fff8f8';
                    searchResultsContainer_1.style.borderRadius = '3px';
                    searchResultsContainer_1.style.color = '#cc0000';
                    searchResultsContainer_1.style.fontSize = '11px';
                    searchResultsContainer_1.textContent = 'User not found. Please check the username.';
                    currentSearchResult_1 = null;
                };
                // Send friend request button click handler
                sendRequestButton_1.addEventListener('click', function () {
                    if (currentSearchResult_1 && sendRequestButton_1.getAttribute('data-disabled') === 'false') {
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
                        searchResultsContainer_1.innerHTML = '';
                        searchResultsContainer_1.style.display = 'block';
                        searchResultsContainer_1.style.padding = '5px';
                        searchResultsContainer_1.style.border = '1px solid #ccffcc';
                        searchResultsContainer_1.style.backgroundColor = '#f8fff8';
                        searchResultsContainer_1.style.borderRadius = '3px';
                        searchResultsContainer_1.style.color = '#008800';
                        searchResultsContainer_1.style.fontSize = '11px';
                        searchResultsContainer_1.textContent = "Friend request sent to ".concat(currentSearchResult_1.username, "!");
                        // Reset
                        searchUserInput_1.value = '';
                        sendRequestButton_1.setAttribute('data-disabled', 'true');
                        sendRequestButton_1.style.backgroundImage = 'linear-gradient(#e0e0e0, #d0d0d0)';
                        sendRequestButton_1.style.color = '#888888';
                        sendRequestButton_1.style.cursor = 'default';
                        currentSearchResult_1 = null;
                    }
                });
                // Pending Friend Requests Section
                var pendingRequestsContainer = document.createElement('div');
                requestsContent_1.appendChild(pendingRequestsContainer);
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
                var pendingRequestsTitle = document.createElement('div');
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
                var requestsList_1 = document.createElement('div');
                pendingRequestsContainer.appendChild(requestsList_1);
                requestsList_1.id = 'pending-requests-list';
                requestsList_1.style.overflowY = 'auto';
                requestsList_1.style.flex = '1';
                requestsList_1.style.maxHeight = '200px';
                // Function to create request item
                var createRequestItem_1 = function (request) {
                    var requestItem = document.createElement('div');
                    requestsList_1.appendChild(requestItem);
                    requestItem.style.display = 'flex';
                    requestItem.style.alignItems = 'center';
                    requestItem.style.padding = '8px 5px';
                    requestItem.style.borderBottom = '1px solid #e0e0e0';
                    // User avatar
                    var userAvatar = document.createElement('div');
                    requestItem.appendChild(userAvatar);
                    userAvatar.style.width = '24px';
                    userAvatar.style.height = '24px';
                    userAvatar.style.backgroundColor = request.avatar;
                    userAvatar.style.borderRadius = '3px';
                    userAvatar.style.marginRight = '8px';
                    userAvatar.style.border = '1px solid #c0c0c0';
                    // User info container
                    var userInfo = document.createElement('div');
                    requestItem.appendChild(userInfo);
                    userInfo.style.flex = '1';
                    // Username
                    var username = document.createElement('div');
                    userInfo.appendChild(username);
                    username.textContent = request.username;
                    username.style.fontSize = '11px';
                    username.style.fontWeight = 'bold';
                    // Request time
                    var requestTime = document.createElement('div');
                    userInfo.appendChild(requestTime);
                    requestTime.textContent = request.time;
                    requestTime.style.fontSize = '9px';
                    requestTime.style.color = '#888888';
                    // Action buttons container
                    var actionButtons = document.createElement('div');
                    requestItem.appendChild(actionButtons);
                    actionButtons.style.display = 'flex';
                    // Accept button
                    var acceptButton = document.createElement('div');
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
                    acceptButton.addEventListener('mouseenter', function () {
                        acceptButton.style.backgroundImage = 'linear-gradient(#e0ffe0, #a0ffa0)';
                    });
                    acceptButton.addEventListener('mouseleave', function () {
                        acceptButton.style.backgroundImage = 'linear-gradient(#d0ffd0, #90ee90)';
                    });
                    acceptButton.addEventListener('click', function () {
                        // API CALL NEEDED: Accept friend request
                        // fetch('/api/friends/request/accept', {
                        //   method: 'POST',
                        //   headers: { 'Content-Type': 'application/json' },
                        //   body: JSON.stringify({ requestId: request.id })
                        // })
                        // Remove the request from the list
                        requestItem.remove();
                        // Show success message
                        showNotification_1("You are now friends with ".concat(request.username, "!"), 'success');
                    });
                    // Decline button
                    var declineButton = document.createElement('div');
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
                    declineButton.addEventListener('mouseenter', function () {
                        declineButton.style.backgroundImage = 'linear-gradient(#ffe0e0, #ffa0a0)';
                    });
                    declineButton.addEventListener('mouseleave', function () {
                        declineButton.style.backgroundImage = 'linear-gradient(#ffd0d0, #ee9090)';
                    });
                    declineButton.addEventListener('click', function () {
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
                };
                // Function to show notification
                var showNotification_1 = function (message, type) {
                    var notification = document.createElement('div');
                    requestsContent_1.appendChild(notification);
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
                    }
                    else {
                        notification.style.backgroundColor = '#ffb8b8';
                        notification.style.border = '1px solid #e07070';
                        notification.style.color = '#770000';
                    }
                    // Remove after 3 seconds
                    setTimeout(function () {
                        notification.style.opacity = '0';
                        notification.style.transition = 'opacity 0.5s';
                        setTimeout(function () { return notification.remove(); }, 500);
                    }, 3000);
                };
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
                var sampleRequests = [
                    { id: 'req1', username: 'ProGamer123', avatar: '#ff9999', time: '2 hours ago' },
                    { id: 'req2', username: 'CoolDude42', avatar: '#99ccff', time: 'Yesterday' },
                    { id: 'req3', username: 'GameMaster99', avatar: '#ffcc99', time: '3 days ago' }
                ];
                // Create empty state message
                if (sampleRequests.length === 0) {
                    var emptyMessage = document.createElement('div');
                    requestsList_1.appendChild(emptyMessage);
                    emptyMessage.textContent = 'No pending friend requests.';
                    emptyMessage.style.padding = '10px';
                    emptyMessage.style.textAlign = 'center';
                    emptyMessage.style.color = '#888888';
                    emptyMessage.style.fontSize = '11px';
                    emptyMessage.style.fontStyle = 'italic';
                }
                else {
                    // Create request items
                    sampleRequests.forEach(function (request) {
                        createRequestItem_1(request);
                    });
                }
            }
            var homeTab_1 = document.getElementById('social-app-Home-tab');
            var profileTab_1 = document.getElementById('social-app-Profile-tab');
            var friendsTab_1 = document.getElementById('social-app-Friends-tab');
            var requestsTab_1 = document.getElementById('social-app-Requests-tab');
            if (homeTab_1 && profileTab_1 && friendsTab_1 && requestsTab_1) {
                setActiveContent(homeContent_1);
                homeTab_1.addEventListener('click', function () {
                    setActiveTab(homeTab_1);
                    setActiveContent(homeContent_1);
                });
                profileTab_1.addEventListener('click', function () {
                    setActiveTab(profileTab_1);
                    setActiveContent(profileContent_1);
                });
                friendsTab_1.addEventListener('click', function () {
                    setActiveTab(friendsTab_1);
                    setActiveContent(friendsContent_1);
                });
                requestsTab_1.addEventListener('click', function () {
                    setActiveTab(requestsTab_1);
                    setActiveContent(requestsContent_1);
                });
            }
        }
    }
});
