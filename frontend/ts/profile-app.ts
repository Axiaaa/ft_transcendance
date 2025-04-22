import { openAppWindow } from "./app-icon.js";
import { sendNotification } from "./notification.js";
import { getCurrentUser, getMatchDetails, getUser, getUserById, getUserByUsername, getUserMatchHistory, isUserOnline } from "./API.js";
import { forEachChild } from "typescript";

function openProfile(AppLauncher: string, profileTab?: string): void
{
	let AppId = 'profile-app-window';
	openAppWindow("", AppId);
	let appTaskbarIcon = document.getElementById('profile-app-taskbar-icon') as HTMLElement;
	if (appTaskbarIcon)
	{
		appTaskbarIcon.style.display = 'flex';
		appTaskbarIcon.style.backgroundColor = 'rgba(137, 163, 206, 0.49)';
		let GeneralContent = document.getElementById('profile-app-content-main-right-General-content') as HTMLElement;
		let HistoryMatchContent = document.getElementById('profile-app-content-main-right-HistoryMatch-content') as HTMLElement;
		let StatsContent = document.getElementById('profile-app-content-main-right-Stats-content') as HTMLElement;
		if (GeneralContent && HistoryMatchContent && StatsContent)
		{
			if (profileTab)
			{
				if (profileTab === 'general')
				{
					GeneralContent.style.display = 'flex';
					HistoryMatchContent.style.display = 'none';
					StatsContent.style.display = 'none';
				}
				else if (profileTab === 'HistoryMatch')
				{
					GeneralContent.style.display = 'none';
					HistoryMatchContent.style.display = 'flex';
					StatsContent.style.display = 'none';
				}
				else if (profileTab === 'stats')
				{
					GeneralContent.style.display = 'none';
					HistoryMatchContent.style.display = 'none';
					StatsContent.style.display = 'flex';
				}
			}
		}
	}
}

function createCategorieTab(Name: string, Icon: string, Container: HTMLElement)
{
	if (!Container) return;
	let categorie = document.createElement('div');
	Container.appendChild(categorie);
	categorie.id = 'profile-app-content-main-left-' + Name;
	categorie.style.width = '100%';
	categorie.style.minWidth = '100%';
	categorie.style.maxWidth = '100%';
	categorie.style.height = '45px';
	categorie.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
	categorie.style.cursor = 'pointer';
	categorie.style.display = 'flex';
	categorie.addEventListener('mouseenter', () => {
		categorie.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
	});
	categorie.addEventListener('mouseleave', () => {
		categorie.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
	});
	categorie.addEventListener('mousedown', () => {
		categorie.style.backgroundColor = 'rgba(0, 0, 0, 0.35)';
	});
	categorie.addEventListener('mouseup', () => {
		categorie.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
	});

	let categorieIcon = document.createElement('img');
	categorie.appendChild(categorieIcon);
	categorieIcon.src = Icon;
	categorieIcon.style.height = '20px';
	categorieIcon.style.width = 'auto';
	categorieIcon.style.margin = '13px 5px';
	categorieIcon.style.marginLeft = '10px';
	categorieIcon.style.display = 'block';

	let categorieTitle = document.createElement('h3');
	categorie.appendChild(categorieTitle);
	categorieTitle.innerText = Name;
	categorieTitle.style.color = 'white';
	categorieTitle.style.textAlign = 'left';
	categorieTitle.style.margin = '13px 4px';
	categorieTitle.style.fontSize = '15px';

	return categorie;
}

function createCategorieContainer(Name: string, Container: HTMLElement)
{
	if (!Container) return;
	let categorie = document.createElement('div');
	Container.appendChild(categorie);
	categorie.id = 'profile-app-content-main-right-' + Name + '-content';
	categorie.style.width = 'calc(100% - 20px)';
	categorie.style.height = 'calc(100% - 20px)';
	categorie.style.display = 'none';
	categorie.style.flexDirection = 'column';
	categorie.style.alignItems = 'left';
	categorie.style.justifyContent = 'left';
	categorie.style.padding = '10px';

	let categorieTitle = document.createElement('h2');
	categorie.appendChild(categorieTitle);
	categorieTitle.innerText = Name;
	categorieTitle.style.color = 'white';
	categorieTitle.style.textAlign = 'left';
	categorieTitle.style.margin = '15px 10px';
	categorieTitle.style.fontSize = '30px';
	categorieTitle.style.fontWeight = 'bold';
	categorieTitle.style.textShadow = '1px 1px rgba(0, 0, 0, 0.3)';

	let categorieTitleLine = document.createElement('hr');
	categorie.appendChild(categorieTitleLine);
	categorieTitleLine.style.width = '100%';
	categorieTitleLine.style.height = '2px';
	categorieTitleLine.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
	categorieTitleLine.style.margin = '20px 0px';
	categorieTitleLine.style.marginTop = '0px';
	categorieTitleLine.style.border = 'none';
	return categorie;
}

async function addTournamentHistory(Container: HTMLElement, Player1: string, Player2: string, Score1: number, Score2: number, matchDate: Date = new Date())
{
	if (!Container) return;
	let tournamentHistoryEntry = document.createElement('div');
	Container.appendChild(tournamentHistoryEntry);
	tournamentHistoryEntry.style.width = 'calc(100% - 50px)';
	tournamentHistoryEntry.style.padding = '10px 15px';
	tournamentHistoryEntry.style.margin = '8px 10px';
	tournamentHistoryEntry.style.border = '1px solid rgba(0, 0, 0, 0.4)';
	tournamentHistoryEntry.style.borderRadius = '4px';
	tournamentHistoryEntry.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
	tournamentHistoryEntry.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.15)';
	tournamentHistoryEntry.style.display = 'flex';
	tournamentHistoryEntry.style.flexDirection = 'column';

	// Date information section
	const dateSection = document.createElement('div');
	dateSection.style.width = '100%';
	dateSection.style.marginBottom = '8px';
	dateSection.style.paddingBottom = '5px';
	dateSection.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
	dateSection.style.display = 'flex';
	dateSection.style.justifyContent = 'space-between';
	tournamentHistoryEntry.appendChild(dateSection);
	
	// Format the date nicely
	const formattedDate = matchDate.toLocaleDateString('en-US', {
		year: 'numeric', 
		month: 'short', 
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
	
	// Calculate time elapsed
	const now = new Date();
	const diffMs = now.getTime() - matchDate.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let timeAgo = '';
	
	if (diffDays > 0) {
		timeAgo = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
	} else if (diffHrs > 0) {
		timeAgo = `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
	} else {
		const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
		timeAgo = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
	}
	
	const dateDisplay = document.createElement('span');
	dateDisplay.innerText = formattedDate;
	dateDisplay.style.color = 'rgba(255, 255, 255, 0.7)';
	dateDisplay.style.fontSize = '12px';
	dateDisplay.style.fontStyle = 'italic';
	dateSection.appendChild(dateDisplay);
	
	const timeAgoDisplay = document.createElement('span');
	timeAgoDisplay.innerText = timeAgo;
	timeAgoDisplay.style.color = 'rgba(255, 255, 255, 0.7)';
	timeAgoDisplay.style.fontSize = '12px';
	timeAgoDisplay.style.fontStyle = 'italic';
	dateSection.appendChild(timeAgoDisplay);

	// Match details section
	const matchDetailsContainer = document.createElement('div');
	matchDetailsContainer.style.display = 'flex';
	matchDetailsContainer.style.justifyContent = 'space-between';
	matchDetailsContainer.style.alignItems = 'center';
	matchDetailsContainer.style.marginTop = '5px';
	tournamentHistoryEntry.appendChild(matchDetailsContainer);

	// Player 1 info
	const player1Container = document.createElement('div');
	player1Container.style.flex = '2';
	player1Container.style.textAlign = 'center';
	player1Container.style.padding = '5px';
	player1Container.style.backgroundColor = Score1 > Score2 ? 'rgba(75, 192, 75, 0.2)' : 'transparent';
	player1Container.style.borderRadius = '3px';
	player1Container.style.display = 'flex';
	player1Container.style.flexDirection = 'column';
	player1Container.style.alignItems = 'center';
	matchDetailsContainer.appendChild(player1Container);

	// Player 1 avatar
	const player1AvatarContainer = document.createElement('div');
	player1AvatarContainer.style.width = '40px';
	player1AvatarContainer.style.height = '40px';
	player1AvatarContainer.style.marginBottom = '5px';
	player1AvatarContainer.style.border = '1px solid rgba(255, 255, 255, 0.3)';
	player1AvatarContainer.style.borderRadius = '50%';
	player1AvatarContainer.style.overflow = 'hidden';
	player1AvatarContainer.style.backgroundColor = 'white';
	player1Container.appendChild(player1AvatarContainer);

	const player1Avatar = document.createElement('img');
	{
		let player1User = await getUserByUsername(Player1);
		player1Avatar.src = './img/Start_Menu/demo-user-profile-icon.jpg'; // Default avatar
		if (player1User)
			player1Avatar.src = player1User.avatar || './img/Start_Menu/demo-user-profile-icon.jpg'; // Default avatar
	}
	player1Avatar.style.width = '100%';
	player1Avatar.style.height = '100%';
	player1Avatar.style.objectFit = 'cover';
	player1AvatarContainer.appendChild(player1Avatar);

	const player1Name = document.createElement('div');
	player1Name.innerText = Player1;
	player1Name.style.color = 'white';
	player1Name.style.fontWeight = Score1 > Score2 ? 'bold' : 'normal';
	player1Name.style.fontSize = '14px';
	player1Container.appendChild(player1Name);

	// VS and score display
	const scoreContainer = document.createElement('div');
	scoreContainer.style.flex = '1';
	scoreContainer.style.display = 'flex';
	scoreContainer.style.flexDirection = 'column';
	scoreContainer.style.alignItems = 'center';
	scoreContainer.style.padding = '0 10px';
	matchDetailsContainer.appendChild(scoreContainer);

	const scoreText = document.createElement('div');
	scoreText.innerText = `${Score1} - ${Score2}`;
	scoreText.style.color = 'white';
	scoreText.style.fontSize = '16px';
	scoreText.style.fontWeight = 'bold';
	scoreText.style.padding = '3px 8px';
	scoreText.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
	scoreText.style.borderRadius = '10px';
	scoreText.style.margin = '3px 0';
	scoreContainer.appendChild(scoreText);

	const vsText = document.createElement('div');
	vsText.innerText = 'VS';
	vsText.style.color = 'rgba(255, 255, 255, 0.6)';
	vsText.style.fontSize = '12px';
	scoreContainer.appendChild(vsText);

	// Player 2 info
	const player2Container = document.createElement('div');
	player2Container.style.flex = '2';
	player2Container.style.textAlign = 'center';
	player2Container.style.padding = '5px';
	player2Container.style.backgroundColor = Score2 > Score1 ? 'rgba(75, 192, 75, 0.2)' : 'transparent';
	player2Container.style.borderRadius = '3px';
	player2Container.style.display = 'flex';
	player2Container.style.flexDirection = 'column';
	player2Container.style.alignItems = 'center';
	matchDetailsContainer.appendChild(player2Container);

	// Player 2 avatar
	const player2AvatarContainer = document.createElement('div');
	player2AvatarContainer.style.width = '40px';
	player2AvatarContainer.style.height = '40px';
	player2AvatarContainer.style.marginBottom = '5px';
	player2AvatarContainer.style.border = '1px solid rgba(255, 255, 255, 0.3)';
	player2AvatarContainer.style.borderRadius = '50%';
	player2AvatarContainer.style.overflow = 'hidden';
	player2AvatarContainer.style.backgroundColor = 'white';
	player2Container.appendChild(player2AvatarContainer);

	const player2Avatar = document.createElement('img');
	{
		let player2User = await getUserByUsername(Player2);
		player2Avatar.src = './img/Start_Menu/demo-user-profile-icon.jpg'; // Default avatar
		if (player2User)
			player2Avatar.src = player2User.avatar || './img/Start_Menu/demo-user-profile-icon.jpg'; // Default avatar
	}
	player2Avatar.style.width = '100%';
	player2Avatar.style.height = '100%';
	player2Avatar.style.objectFit = 'cover';
	player2AvatarContainer.appendChild(player2Avatar);

	const player2Name = document.createElement('div');
	player2Name.innerText = Player2;
	player2Name.style.color = 'white';
	player2Name.style.fontWeight = Score2 > Score1 ? 'bold' : 'normal';
	player2Name.style.fontSize = '14px';
	player2Container.appendChild(player2Name);

	// Winner display
	const winner = Score1 > Score2 ? Player1 : Player2;
	const winnerContainer = document.createElement('div');
	winnerContainer.style.width = '100%';
	winnerContainer.style.textAlign = 'right';
	winnerContainer.style.marginTop = '8px';
	winnerContainer.style.paddingTop = '5px';
	winnerContainer.style.borderTop = '1px solid rgba(255, 255, 255, 0.2)';
	tournamentHistoryEntry.appendChild(winnerContainer);

	const winnerDisplay = document.createElement('div');
	winnerDisplay.innerHTML = `Winner: <span style="font-weight:bold">${winner}</span>`;
	winnerDisplay.style.color = 'white';
	winnerDisplay.style.fontSize = '13px';
	winnerContainer.appendChild(winnerDisplay);

	return tournamentHistoryEntry;
}


export async function initProfileApp()
{

	let App = document.getElementById('profile-app-window') as HTMLElement;
	if (!App) return;
	App.style.width = '470px';
	App.style.minWidth = '570px';
	App.style.height = '370px';
	let AppContent = App.children[1] as HTMLElement;
	if (!AppContent)
	{
		console.log('Profile App Content not found');
		return;
	}
	let AppLauncherMain = document.getElementById('start-menu-profile-main') as HTMLElement;
	if (AppLauncherMain)
	{
		AppLauncherMain.addEventListener('click', () => {
			openProfile('start-menu-profile-main', 'general');
		});
	}
	let AppLauncherHistoryMatch = document.getElementById('start-menu-profile-my-history') as HTMLElement;
	if (AppLauncherHistoryMatch)
	{
		AppLauncherHistoryMatch.addEventListener('click', () => {
			openProfile('start-menu-profile-my-history', 'HistoryMatch');
		});
	}
	let AppLauncherStats = document.getElementById('start-menu-profile-my-stats') as HTMLElement;
	if (AppLauncherStats)
	{
		AppLauncherStats.addEventListener('click', () => {
			openProfile('start-menu-profile-my-stats', 'stats');
		});
	}


	// App Content
	let AppContentMain = document.createElement('div');
	AppContentMain.id = 'profile-app-content-main';
	AppContentMain.style.width = '100%';
	AppContentMain.style.height = '100%';
	AppContentMain.style.display = 'flex';
	AppContent.appendChild(AppContentMain);
	{
		let leftContainer = document.createElement('div');
		AppContentMain.appendChild(leftContainer);
		leftContainer.id = 'profile-app-content-main-left';
		leftContainer.style.background = 'linear-gradient(rgb(117, 142, 219), rgb(109, 124, 218), rgb(104, 108, 213))';
		leftContainer.style.width = '150px';
		leftContainer.style.minWidth = '150px';
		leftContainer.style.maxWidth = '150px';
		leftContainer.style.height = '100%';
		leftContainer.style.overflow = 'auto';
		leftContainer.style.display = 'flex';
		leftContainer.style.flexDirection = 'column';
		leftContainer.style.alignItems = 'center';
		{
			// Categories tabs
			let General = createCategorieTab('General', './img/Utils/infos-icon.png', leftContainer);
			let HistoryMatch = createCategorieTab('Match History', './img/Start_Menu/cup-icon.png', leftContainer);
			let Stats = createCategorieTab('Stats', './img/Start_Menu/stats-icon.png', leftContainer);
		}
	}
	{
		let rightContainer = document.createElement('div');
		AppContentMain.appendChild(rightContainer);
		rightContainer.id = 'profile-app-content-main-right';
		rightContainer.style.backgroundColor = 'rgb(163, 177, 233)';
		rightContainer.style.width = 'calc(100% - 150px)';
		rightContainer.style.minWidth = 'calc(100% - 150px)';
		rightContainer.style.maxWidth = 'calc(100% - 150px)';
		rightContainer.style.height = '100%';
		rightContainer.style.overflow = 'auto';
		
		{
			// Categories content
			let GeneralCategorie = document.getElementById('profile-app-content-main-left-General') as HTMLElement;
			let HistoryMatchCategorie = document.getElementById('profile-app-content-main-left-HistoryMatch') as HTMLElement;
			let StatsCategorie = document.getElementById('profile-app-content-main-left-Stats') as HTMLElement;

			
			let GeneralContent = createCategorieContainer('General', rightContainer);
			if (GeneralContent)
			{
				{
					// Profile information container
					let profileInfoContainer = document.createElement('div');
					profileInfoContainer.style.display = 'flex';
					profileInfoContainer.style.flexDirection = 'column';
					profileInfoContainer.style.alignItems = 'center';
					profileInfoContainer.style.padding = '15px';
					profileInfoContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
					profileInfoContainer.style.border = '1px solid rgba(0, 0, 0, 0.3)';
					profileInfoContainer.style.borderRadius = '5px';
					profileInfoContainer.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
					GeneralContent.appendChild(profileInfoContainer);

					// User avatar container
					let avatarContainer = document.createElement('div');
					avatarContainer.style.width = '100px';
					avatarContainer.style.height = '100px';
					avatarContainer.style.marginBottom = '10px';
					avatarContainer.style.border = '1px solid #7E7E7E';
					avatarContainer.style.padding = '3px';
					avatarContainer.style.backgroundColor = 'white';
					avatarContainer.style.boxShadow = '1px 1px 3px rgba(0, 0, 0, 0.3)';
					profileInfoContainer.appendChild(avatarContainer);

					// User avatar image
					let avatarImg = document.createElement('img');
					avatarImg.alt = 'User Avatar';
					avatarImg.classList.add('avatar-preview');
					avatarImg.src = './img/Start_Menu/demo-user-profile-icon.jpg'; // Default avatar - replace with user's actual avatar from API
					avatarImg.style.width = '100%';
					avatarImg.style.height = '100%';
					avatarImg.style.objectFit = 'cover';
					avatarContainer.appendChild(avatarImg);

					let usernameDisplay = document.createElement('h2');
					usernameDisplay.innerText = 'Loading...';
					usernameDisplay.classList.add('user-name-text');
					usernameDisplay.style.color = '#333';
					usernameDisplay.style.fontSize = '18px';
					usernameDisplay.style.fontWeight = 'bold';
					usernameDisplay.style.margin = '5px 0';
					usernameDisplay.style.textShadow = '1px 1px 1px rgba(255, 255, 255, 0.5)';
					profileInfoContainer.appendChild(usernameDisplay);

					// Status container
					let statusContainer = document.createElement('div');
					statusContainer.style.display = 'flex';
					statusContainer.style.alignItems = 'center';
					statusContainer.style.marginTop = '5px';
					profileInfoContainer.appendChild(statusContainer);

					// Online status indicator (circle)
					let statusIndicator = document.createElement('div');
					statusIndicator.style.width = '12px';
					statusIndicator.style.height = '12px';
					statusIndicator.style.borderRadius = '50%';
					statusIndicator.style.backgroundColor = '#4CAF50'; // Green for online
					statusIndicator.style.marginRight = '5px';
					statusIndicator.style.border = '1px solid rgba(0, 0, 0, 0.3)';
					statusIndicator.style.boxShadow = '0 0 3px rgba(0, 0, 0, 0.2)';
					statusContainer.appendChild(statusIndicator);

					// Status text
					// Related to the same API CALL as status indicator
					let statusText = document.createElement('span');
					statusText.innerText = 'Online'; 
					statusText.style.color = '#333';
					statusText.style.fontSize = '14px';
					statusContainer.appendChild(statusText);
					{
						let currentUser = getCurrentUser(sessionStorage.getItem('wxp_token') as string);
						let isOnline = isUserOnline((await currentUser).username);
						if (!isOnline)
						{
							statusIndicator.style.backgroundColor = '#F44336'; // Red for offline
							statusText.innerText = 'Offline';
						}
					}

					// Last login information
					let lastLoginInfo = document.createElement('p');
					lastLoginInfo.innerText = 'Last login:' + ' Loading...';
					{
						let currentUser = getCurrentUser(sessionStorage.getItem('wxp_token') as string);
						let lastLogin = (await currentUser).last_login;
						let lastLoginDate = new Date(lastLogin);
						let options: Intl.DateTimeFormatOptions = {
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit',
							hour12: false,
						};
						let formattedDate = lastLoginDate.toLocaleString('en-US', options);
						lastLoginInfo.innerText = 'Last login: ' + formattedDate;
					} // Replace with actual last login info from API
					lastLoginInfo.style.color = '#555';
					lastLoginInfo.style.fontSize = '12px';
					lastLoginInfo.style.margin = '10px 0 5px 0';
					lastLoginInfo.style.fontStyle = 'italic';
					profileInfoContainer.appendChild(lastLoginInfo);

					// Edit profile button
					let editProfileButton = document.createElement('button');
					editProfileButton.innerText = 'Edit Profile';
					editProfileButton.style.padding = '5px 10px';
					editProfileButton.style.margin = '10px 0';
					editProfileButton.style.backgroundColor = '#ECE9D8';
					editProfileButton.style.border = '1px solid #ACA899';
					editProfileButton.style.borderRadius = '3px';
					editProfileButton.style.color = '#000';
					editProfileButton.style.fontSize = '12px';
					editProfileButton.style.cursor = 'pointer';
					editProfileButton.style.boxShadow = '1px 1px 3px rgba(0, 0, 0, 0.2)';
					profileInfoContainer.appendChild(editProfileButton);

					// Add hover effect for the button
					editProfileButton.addEventListener('mouseenter', () => {
						editProfileButton.style.backgroundColor = '#F0F0F0';
					});
					editProfileButton.addEventListener('mouseleave', () => {
						editProfileButton.style.backgroundColor = '#ECE9D8';
					});
					editProfileButton.addEventListener('mousedown', () => {
						editProfileButton.style.backgroundColor = '#DCDAC0';
						editProfileButton.style.boxShadow = 'inset 1px 1px 3px rgba(0, 0, 0, 0.2)';
					});
					editProfileButton.addEventListener('mouseup', () => {
						editProfileButton.style.backgroundColor = '#F0F0F0';
						editProfileButton.style.boxShadow = '1px 1px 3px rgba(0, 0, 0, 0.2)';
					});
					editProfileButton.addEventListener('click', () => {
						// Open edit profile modal or navigate to edit profile page
						// Implement form to update user profile data
						let settingsApp = document.getElementById('settings-app-window') as HTMLElement;
						if (settingsApp)
						{
							openAppWindow('', 'settings-app-window');
							App.style.zIndex = '24';
							settingsApp.style.zIndex = '25';
							let UserAccountTab = document.getElementById('settings-app-User Account-category') as HTMLElement;
							if (UserAccountTab) {
								UserAccountTab.click();
							}
						}
					});
				}
			}
			
			let HistoryMatchContent = createCategorieContainer('HistoryMatch', rightContainer);
			if (HistoryMatchContent)
			{
				
					
					let TournamentHistoryTitle = document.createElement('h3');
					HistoryMatchContent.appendChild(TournamentHistoryTitle);
					TournamentHistoryTitle.innerText = 'Tournament History';
					TournamentHistoryTitle.style.color = 'white';
					TournamentHistoryTitle.style.textAlign = 'left';
					TournamentHistoryTitle.style.margin = '10px 10px';
					TournamentHistoryTitle.style.fontSize = '20px';
					TournamentHistoryTitle.style.fontWeight = 'bold';
					TournamentHistoryTitle.style.textShadow = '1px 1px rgba(0, 0, 0, 0.3)';
					let TournamentHistory = document.createElement('div');
					HistoryMatchContent.appendChild(TournamentHistory);
					TournamentHistory.style.width = '100%';
					TournamentHistory.style.height = '100%';
					TournamentHistory.style.display = 'flex';
					TournamentHistory.style.flexDirection = 'column';
					TournamentHistory.style.alignItems = 'left';
					TournamentHistory.style.justifyContent = 'left';
					TournamentHistory.style.overflow = 'auto';
					TournamentHistory.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';

					// API Call to get the tournament history
					
						const updateHistory = async () => {
							try {
								console.log('Fetching tournament history of user ' + sessionStorage.getItem('wxp_user_id'));
								let matchHistory = getUserMatchHistory(sessionStorage.getItem('wxp_token') as string);
								console.log('HistoryTab is: ' + matchHistory);
								
								// Keep track of matches added to prevent duplicates
								const matchesAdded = new Set();
								
								(await matchHistory).forEach(async (matchId) => {
									// Skip if this match ID is already displayed
									if (matchesAdded.has(matchId)) {
										console.log(`Match ${matchId} already added, skipping duplicate`);
										return;
									}
									
									let matchHistoryData = await getMatchDetails(matchId);
									console.log('HistoryData is: ' + matchHistoryData);
									if (matchHistoryData) {
										interface MatchData {
											player1: string;
											player2: string;
											score: string;
											winner: string;
											created_at: string;
										}
										
										// Process the single match
										const match = matchHistoryData as unknown as MatchData;
										let player1_id = match.player1;
										let player2_id = match.player2;
										let player1 = getUserById(Number(player1_id));
										let player2 = getUserById(Number(player2_id));
										let player1Name = (await player1).username;
										let player2Name = (await player2).username;
										let score = match.score.split(' - ');
										let score1 = parseInt(score[0]);
										let score2 = parseInt(score[1]);
										// Convert ISO 8601 format date string (e.g. "2025-04-22T19:52:19.071Z") to Date object
										let matchDate = new Date(match.created_at);
										console.log('Match date is: ' + matchDate);
										let winner = match.winner;
										
										// Mark this match as added
										matchesAdded.add(matchId);
										
										if (winner === player1Name)
											addTournamentHistory(TournamentHistory, player1Name, player2Name, score1, score2, matchDate);
										else
											addTournamentHistory(TournamentHistory, player2Name, player1Name, score2, score1, matchDate);
									}
								})
							}
							catch (error) {
								console.error('Error fetching tournament history:', error);
								sendNotification('Error', 'Failed to load tournament history.', 'error');
							}
							// EXAMPLE HISTORY ELEMENT let tournament1 = addTournamentHistory(TournamentHistory, 'Michel', 'Francis', 0, 2);
						}
					updateHistory();
					// Add refresh button container
					let refreshContainer = document.createElement('div');
					refreshContainer.style.width = '100%';
					refreshContainer.style.display = 'flex';
					refreshContainer.style.justifyContent = 'flex-end';
					refreshContainer.style.marginBottom = '10px';
					TournamentHistory.parentNode?.insertBefore(refreshContainer, TournamentHistory);

					// Create refresh button
					let refreshButton = document.createElement('button');
					refreshButton.innerText = 'Refresh History';
					refreshButton.style.padding = '3px 10px';
					refreshButton.style.backgroundColor = '#ECE9D8';
					refreshButton.style.border = '1px solid #ACA899';
					refreshButton.style.borderRadius = '3px';
					refreshButton.style.color = '#000';
					refreshButton.style.fontSize = '12px';
					refreshButton.style.cursor = 'pointer';
					refreshButton.style.boxShadow = '1px 1px 3px rgba(0, 0, 0, 0.2)';
					refreshContainer.appendChild(refreshButton);

					// Add hover and click effects
					refreshButton.addEventListener('mouseenter', () => {
						refreshButton.style.backgroundColor = '#F0F0F0';
					});
					refreshButton.addEventListener('mouseleave', () => {
						refreshButton.style.backgroundColor = '#ECE9D8';
					});
					refreshButton.addEventListener('mousedown', () => {
						refreshButton.style.backgroundColor = '#DCDAC0';
						refreshButton.style.boxShadow = 'inset 1px 1px 3px rgba(0, 0, 0, 0.2)';
					});
					refreshButton.addEventListener('mouseup', () => {
						refreshButton.style.backgroundColor = '#F0F0F0';
						refreshButton.style.boxShadow = '1px 1px 3px rgba(0, 0, 0, 0.2)';
					});

					// Add click handler to refresh the history
					refreshButton.addEventListener('click', () => {
						// Clear existing history items
						while (TournamentHistory.firstChild) {
						refreshButton.style.pointerEvents = 'none';
						refreshButton.style.opacity = '0.5';
						refreshButton.textContent = 'Loading...';
							TournamentHistory.removeChild(TournamentHistory.firstChild);
						}
						// Refresh the history
						updateHistory();
						setTimeout(() => {
							refreshButton.style.pointerEvents = 'auto';
							refreshButton.style.opacity = '1';
							refreshButton.textContent = 'Refresh History';
						}
						, 1000);
					});
				
			}

			let StatsContent = createCategorieContainer('Stats', rightContainer);
			if (StatsContent)
			{
				// Win/Loss section
				let winLossSection = document.createElement('div');
				StatsContent.appendChild(winLossSection);
				winLossSection.style.margin = '10px 0';
				winLossSection.style.padding = '10px';
				winLossSection.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
				winLossSection.style.border = '1px solid rgba(0, 0, 0, 0.3)';
				winLossSection.style.borderRadius = '3px';

				let winLossTitle = document.createElement('h3');
				winLossSection.appendChild(winLossTitle);
				winLossTitle.innerText = 'Win/Loss Ratio';
				winLossTitle.style.color = 'white';
				winLossTitle.style.fontSize = '18px';
				winLossTitle.style.marginBottom = '10px';
				winLossTitle.style.textShadow = '1px 1px rgba(0, 0, 0, 0.3)';

				// Win/Loss visualization
				let winLossBar = document.createElement('div');
				winLossSection.appendChild(winLossBar);
				winLossBar.style.width = '100%';
				winLossBar.style.height = '25px';
				winLossBar.style.backgroundColor = '#d3d3d3';
				winLossBar.style.border = '1px solid #666';
				winLossBar.style.position = 'relative';
				winLossBar.style.borderRadius = '2px';
				winLossBar.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, 0.2)';

				// API Call to get the win/loss ratio
					// Dummy data - replace with API call
				const wins = 15;
				const losses = 7;
				const winRate = Math.round((wins / (wins + losses)) * 100);

				let winBar = document.createElement('div');
				winLossBar.appendChild(winBar);
				winBar.style.width = `${winRate}%`;
				winBar.style.height = '100%';
				winBar.style.backgroundColor = 'rgb(75, 192, 75)';
				winBar.style.display = 'inline-block';
				winBar.style.borderRadius = '2px 0 0 2px';

				let ratioText = document.createElement('div');
				winLossSection.appendChild(ratioText);
				ratioText.innerText = `Win Rate: ${winRate}% (${wins} wins, ${losses} losses)`;
				ratioText.style.color = 'white';
				ratioText.style.fontSize = '14px';
				ratioText.style.marginTop = '5px';
				ratioText.style.textAlign = 'center';

				// Game Statistics section
				let statsSection = document.createElement('div');
				StatsContent.appendChild(statsSection);
				// statsSection.style.width = '100%';
				statsSection.style.margin = '15px 0';
				statsSection.style.padding = '10px';
				statsSection.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
				statsSection.style.border = '1px solid rgba(0, 0, 0, 0.3)';
				statsSection.style.borderRadius = '3px';

				let statsTitle = document.createElement('h3');
				statsSection.appendChild(statsTitle);
				statsTitle.innerText = 'Game Statistics';
				statsTitle.style.color = 'white';
				statsTitle.style.fontSize = '18px';
				statsTitle.style.marginBottom = '10px';
				statsTitle.style.textShadow = '1px 1px rgba(0, 0, 0, 0.3)';

				// Stats table
				let statsTable = document.createElement('table');
				statsSection.appendChild(statsTable);
				statsTable.style.width = '100%';
				statsTable.style.borderCollapse = 'collapse';
				statsTable.style.color = 'white';
				statsTable.style.fontSize = '14px';

				// API Call to get the game statistics
					// Dummy data - replace with API call
				const totalMatches = wins + losses;
				const pointsScored = 254;
				const avgMatchDuration = '3m 42s';
				const highestScore = 11;

				const statsData = [
					{ label: 'Total Matches', value: totalMatches },
					{ label: 'Points Scored', value: pointsScored },
					{ label: 'Average Match Duration', value: avgMatchDuration },
					{ label: 'Highest Score', value: highestScore }
				];

				statsData.forEach(stat => {
					let row = document.createElement('tr');
					statsTable.appendChild(row);
					row.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
					
					let labelCell = document.createElement('td');
					row.appendChild(labelCell);
					labelCell.innerText = stat.label;
					labelCell.style.padding = '8px';
					labelCell.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
					labelCell.style.fontWeight = 'bold';
					
					let valueCell = document.createElement('td');
					row.appendChild(valueCell);
					valueCell.innerText = stat.value.toString();
					valueCell.style.padding = '8px';
					valueCell.style.textAlign = 'right';
				});

				// Note about updating stats
				let statsNote = document.createElement('p');
				statsSection.appendChild(statsNote);
				statsNote.innerText = 'Statistics are updated after each game';
				statsNote.style.color = 'rgba(255, 255, 255, 0.7)';
				statsNote.style.fontSize = '12px';
				statsNote.style.marginTop = '10px';
				statsNote.style.fontStyle = 'italic';
			}
			if (GeneralContent && HistoryMatchContent && StatsContent)
			{
				if (GeneralCategorie)
				{
					GeneralCategorie.addEventListener('click', () => {
						GeneralContent.style.display = 'flex';
						HistoryMatchContent.style.display = 'none';
						StatsContent.style.display = 'none';
					});
				}
				if (HistoryMatchCategorie)
				{
					HistoryMatchCategorie.addEventListener('click', () => {
						GeneralContent.style.display = 'none';
						HistoryMatchContent.style.display = 'flex';
						StatsContent.style.display = 'none';
					});
				}
				if (StatsCategorie)
				{
					StatsCategorie.addEventListener('click', () => {
						GeneralContent.style.display = 'none';
						HistoryMatchContent.style.display = 'none';
						StatsContent.style.display = 'flex';
					});
				}
			}
		}
	}
};
