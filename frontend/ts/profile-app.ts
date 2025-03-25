import { send } from "process";
import { openAppWindow } from "./app-icon.js";
import { sendNotification } from "./notification.js";

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
		let TournamentsContent = document.getElementById('profile-app-content-main-right-Tournaments-content') as HTMLElement;
		let StatsContent = document.getElementById('profile-app-content-main-right-Stats-content') as HTMLElement;
		if (GeneralContent && TournamentsContent && StatsContent)
		{
			if (profileTab)
			{
				if (profileTab === 'general')
				{
					GeneralContent.style.display = 'flex';
					TournamentsContent.style.display = 'none';
					StatsContent.style.display = 'none';
				}
				else if (profileTab === 'tournaments')
				{
					GeneralContent.style.display = 'none';
					TournamentsContent.style.display = 'flex';
					StatsContent.style.display = 'none';
				}
				else if (profileTab === 'stats')
				{
					GeneralContent.style.display = 'none';
					TournamentsContent.style.display = 'none';
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
	categorieTitle.style.margin = '13px 5px';
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

function addTournamentHistory(Container: HTMLElement, Player1: string, Player2: string, Score1: number, Score2: number)
{
	if (!Container) return;
	let tournamentHistoryEntry = document.createElement('div');
	Container.appendChild(tournamentHistoryEntry);
	tournamentHistoryEntry.style.width = 'calc(100% - 30px)';
	tournamentHistoryEntry.style.height = 'auto';
	tournamentHistoryEntry.style.display = 'flex';
	tournamentHistoryEntry.style.flexDirection = 'row';
	tournamentHistoryEntry.style.alignItems = 'center';
	tournamentHistoryEntry.style.justifyContent = 'space-between';
	tournamentHistoryEntry.style.padding = '5px 10px';
	tournamentHistoryEntry.style.margin = '10px 0px';
	tournamentHistoryEntry.style.marginTop = '0px';
	tournamentHistoryEntry.style.border = '1px solid rgba(0, 0, 0, 0.58)';
	tournamentHistoryEntry.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';

	// Column 1: Player 1
	const player1Column = document.createElement('div');
	player1Column.style.display = 'flex';
	player1Column.style.flexDirection = 'column';
	player1Column.style.alignItems = 'center';
	tournamentHistoryEntry.appendChild(player1Column);

	const player1Label = document.createElement('h3');
	player1Label.innerText = 'Player 1';
	player1Label.style.color = 'white';
	player1Label.style.margin = '0 0 5px 0';
	player1Label.style.fontSize = '12px';
	player1Column.appendChild(player1Label);

	const player1Name = document.createElement('h3');
	player1Name.innerText = Player1;
	player1Name.style.color = 'white';
	player1Name.style.fontWeight = 'bold';
	player1Name.style.fontSize = '10px';
	player1Column.appendChild(player1Name);

	// Column 2: VS
	const vsColumn = document.createElement('div');
	vsColumn.style.display = 'flex';
	vsColumn.style.alignItems = 'center';
	tournamentHistoryEntry.appendChild(vsColumn);

	const vsText = document.createElement('h3');
	vsText.innerText = 'VS';
	vsText.style.color = 'white';
	vsText.style.fontWeight = 'bold';
	vsText.style.fontSize = '18px';
	vsColumn.appendChild(vsText);

	// Column 3: Player 2
	const player2Column = document.createElement('div');
	player2Column.style.display = 'flex';
	player2Column.style.flexDirection = 'column';
	player2Column.style.alignItems = 'center';
	tournamentHistoryEntry.appendChild(player2Column);

	const player2Label = document.createElement('h3');
	player2Label.innerText = 'Player 2';
	player2Label.style.color = 'white';
	player2Label.style.margin = '0 0 5px 0';
	player2Label.style.fontSize = '12px';
	player2Column.appendChild(player2Label);

	const player2Name = document.createElement('h3');
	player2Name.innerText = Player2;
	player2Name.style.color = 'white';
	player2Name.style.fontWeight = 'auto';
	player2Name.style.fontSize = '10px';
	player2Column.appendChild(player2Name);

	// Column 4: Score
	const scoreColumn = document.createElement('div');
	scoreColumn.style.display = 'flex';
	scoreColumn.style.flexDirection = 'column';
	scoreColumn.style.alignItems = 'center';
	tournamentHistoryEntry.appendChild(scoreColumn);

	const scoreLabel = document.createElement('h3');
	scoreLabel.innerText = 'Score';
	scoreLabel.style.color = 'white';
	scoreLabel.style.margin = '0 0 5px 0';
	scoreLabel.style.fontSize = '12px';
	scoreColumn.appendChild(scoreLabel);

	const scoreText = document.createElement('h3');
	scoreText.innerText = `${Score1} / ${Score2}`;
	scoreText.style.color = 'white';
	scoreText.style.fontWeight = 'auto';
	scoreText.style.fontSize = '10px';
	scoreColumn.appendChild(scoreText);

	// Column 5: Winner
	const winnerColumn = document.createElement('div');
	winnerColumn.style.display = 'flex';
	winnerColumn.style.flexDirection = 'column';
	winnerColumn.style.alignItems = 'center';
	tournamentHistoryEntry.appendChild(winnerColumn);

	const winnerLabel = document.createElement('h3');
	winnerLabel.innerText = 'Winner';
	winnerLabel.style.color = 'white';
	winnerLabel.style.margin = '0 0 5px 0';
	winnerLabel.style.fontSize = '12px';
	winnerColumn.appendChild(winnerLabel);

	const winnerName = document.createElement('h3');
	const winner = Score1 > Score2 ? Player1 : Player2;
	winnerName.innerText = winner;
	winnerName.style.color = 'white';
	winnerName.style.fontWeight = 'auto';
	winnerName.style.fontSize = '10px';
	winnerColumn.appendChild(winnerName);

	return tournamentHistoryEntry;
}


document.addEventListener('DOMContentLoaded', () => {

	let App = document.getElementById('profile-app-window') as HTMLElement;
	if (!App) return;
	App.style.width = '470px';
	App.style.minWidth = '470px';
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
	let AppLauncherTournaments = document.getElementById('start-menu-profile-my-tournaments') as HTMLElement;
	if (AppLauncherTournaments)
	{
		AppLauncherTournaments.addEventListener('click', () => {
			openProfile('start-menu-profile-my-tournaments', 'tournaments');
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
			let Tournaments = createCategorieTab('Tournaments', './img/Start_Menu/cup-icon.png', leftContainer);
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
			let TournamentsCategorie = document.getElementById('profile-app-content-main-left-Tournaments') as HTMLElement;
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
					// API CALL NEEDED: Fetch user's profile picture from the backend
					let avatarImg = document.createElement('img');
					avatarImg.src = './img/Start_Menu/demo-user-profile-icon.jpg'; // Default avatar - replace with user's actual avatar from API
					avatarImg.style.width = '100%';
					avatarImg.style.height = '100%';
					avatarImg.style.objectFit = 'cover';
					avatarContainer.appendChild(avatarImg);

					// Username display
					// API CALL NEEDED: Fetch user's username from the backend
					let usernameDisplay = document.createElement('h3');
					usernameDisplay.innerText = 'Xxx_D4rkS4suke36_xxX'; // Default Username
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
					// API CALL NEEDED: Fetch user's online status from the backend
					let statusIndicator = document.createElement('div');
					statusIndicator.style.width = '12px';
					statusIndicator.style.height = '12px';
					statusIndicator.style.borderRadius = '50%';
					statusIndicator.style.backgroundColor = '#4CAF50'; // Green for online - should be dynamic based on API response
					statusIndicator.style.marginRight = '5px';
					statusIndicator.style.border = '1px solid rgba(0, 0, 0, 0.3)';
					statusIndicator.style.boxShadow = '0 0 3px rgba(0, 0, 0, 0.2)';
					statusContainer.appendChild(statusIndicator);

					// Status text
					// Related to the same API CALL as status indicator
					let statusText = document.createElement('span');
					statusText.innerText = 'Online'; // Should be dynamic based on API response
					statusText.style.color = '#333';
					statusText.style.fontSize = '14px';
					statusContainer.appendChild(statusText);

					// Last login information
					// API CALL NEEDED: Fetch user's last login timestamp from the backend
					let lastLoginInfo = document.createElement('p');
					lastLoginInfo.innerText = 'Last login: Today at 9:45 AM'; // Should be dynamic based on API response
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
					// API CALL NEEDED: On button click, open edit profile form and save changes to the backend
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
			
			let TournamentsContent = createCategorieContainer('Tournaments', rightContainer);
			if (TournamentsContent)
			{
				{
					
					let TournamentHistoryTitle = document.createElement('h3');
					TournamentsContent.appendChild(TournamentHistoryTitle);
					TournamentHistoryTitle.innerText = 'Tournament History';
					TournamentHistoryTitle.style.color = 'white';
					TournamentHistoryTitle.style.textAlign = 'left';
					TournamentHistoryTitle.style.margin = '10px 10px';
					TournamentHistoryTitle.style.fontSize = '20px';
					TournamentHistoryTitle.style.fontWeight = 'bold';
					TournamentHistoryTitle.style.textShadow = '1px 1px rgba(0, 0, 0, 0.3)';
					let TournamentHistory = document.createElement('div');
					TournamentsContent.appendChild(TournamentHistory);
					TournamentHistory.style.width = '100%';
					TournamentHistory.style.height = '100%';
					TournamentHistory.style.display = 'flex';
					TournamentHistory.style.flexDirection = 'column';
					TournamentHistory.style.alignItems = 'left';
					TournamentHistory.style.justifyContent = 'left';
					TournamentHistory.style.overflow = 'auto';
					TournamentHistory.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';

					// API Call to get the tournament history
					let tournament1 = addTournamentHistory(TournamentHistory, 'Michel', 'Francis', 0, 2);
				}
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
			if (GeneralContent && TournamentsContent && StatsContent)
			{
				if (GeneralCategorie)
				{
					GeneralCategorie.addEventListener('click', () => {
						GeneralContent.style.display = 'flex';
						TournamentsContent.style.display = 'none';
						StatsContent.style.display = 'none';
					});
				}
				if (TournamentsCategorie)
				{
					TournamentsCategorie.addEventListener('click', () => {
						GeneralContent.style.display = 'none';
						TournamentsContent.style.display = 'flex';
						StatsContent.style.display = 'none';
					});
				}
				if (StatsCategorie)
				{
					StatsCategorie.addEventListener('click', () => {
						GeneralContent.style.display = 'none';
						TournamentsContent.style.display = 'none';
						StatsContent.style.display = 'flex';
					});
				}
			}
		}
	}
});