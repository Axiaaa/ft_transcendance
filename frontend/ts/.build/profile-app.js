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
import { openAppWindow } from "./app-icon.js";
import { getCurrentUser } from "./API.js";
function openProfile(AppLauncher, profileTab) {
    var AppId = 'profile-app-window';
    openAppWindow("", AppId);
    var appTaskbarIcon = document.getElementById('profile-app-taskbar-icon');
    if (appTaskbarIcon) {
        appTaskbarIcon.style.display = 'flex';
        appTaskbarIcon.style.backgroundColor = 'rgba(137, 163, 206, 0.49)';
        var GeneralContent = document.getElementById('profile-app-content-main-right-General-content');
        var TournamentsContent = document.getElementById('profile-app-content-main-right-Tournaments-content');
        var StatsContent = document.getElementById('profile-app-content-main-right-Stats-content');
        if (GeneralContent && TournamentsContent && StatsContent) {
            if (profileTab) {
                if (profileTab === 'general') {
                    GeneralContent.style.display = 'flex';
                    TournamentsContent.style.display = 'none';
                    StatsContent.style.display = 'none';
                }
                else if (profileTab === 'tournaments') {
                    GeneralContent.style.display = 'none';
                    TournamentsContent.style.display = 'flex';
                    StatsContent.style.display = 'none';
                }
                else if (profileTab === 'stats') {
                    GeneralContent.style.display = 'none';
                    TournamentsContent.style.display = 'none';
                    StatsContent.style.display = 'flex';
                }
            }
        }
    }
}
function createCategorieTab(Name, Icon, Container) {
    if (!Container)
        return;
    var categorie = document.createElement('div');
    Container.appendChild(categorie);
    categorie.id = 'profile-app-content-main-left-' + Name;
    categorie.style.width = '100%';
    categorie.style.minWidth = '100%';
    categorie.style.maxWidth = '100%';
    categorie.style.height = '45px';
    categorie.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
    categorie.style.cursor = 'pointer';
    categorie.style.display = 'flex';
    categorie.addEventListener('mouseenter', function () {
        categorie.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
    });
    categorie.addEventListener('mouseleave', function () {
        categorie.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
    });
    categorie.addEventListener('mousedown', function () {
        categorie.style.backgroundColor = 'rgba(0, 0, 0, 0.35)';
    });
    categorie.addEventListener('mouseup', function () {
        categorie.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
    });
    var categorieIcon = document.createElement('img');
    categorie.appendChild(categorieIcon);
    categorieIcon.src = Icon;
    categorieIcon.style.height = '20px';
    categorieIcon.style.width = 'auto';
    categorieIcon.style.margin = '13px 5px';
    categorieIcon.style.marginLeft = '10px';
    categorieIcon.style.display = 'block';
    var categorieTitle = document.createElement('h3');
    categorie.appendChild(categorieTitle);
    categorieTitle.innerText = Name;
    categorieTitle.style.color = 'white';
    categorieTitle.style.textAlign = 'left';
    categorieTitle.style.margin = '13px 5px';
    categorieTitle.style.fontSize = '15px';
    return categorie;
}
function createCategorieContainer(Name, Container) {
    if (!Container)
        return;
    var categorie = document.createElement('div');
    Container.appendChild(categorie);
    categorie.id = 'profile-app-content-main-right-' + Name + '-content';
    categorie.style.width = 'calc(100% - 20px)';
    categorie.style.height = 'calc(100% - 20px)';
    categorie.style.display = 'none';
    categorie.style.flexDirection = 'column';
    categorie.style.alignItems = 'left';
    categorie.style.justifyContent = 'left';
    categorie.style.padding = '10px';
    var categorieTitle = document.createElement('h2');
    categorie.appendChild(categorieTitle);
    categorieTitle.innerText = Name;
    categorieTitle.style.color = 'white';
    categorieTitle.style.textAlign = 'left';
    categorieTitle.style.margin = '15px 10px';
    categorieTitle.style.fontSize = '30px';
    categorieTitle.style.fontWeight = 'bold';
    categorieTitle.style.textShadow = '1px 1px rgba(0, 0, 0, 0.3)';
    var categorieTitleLine = document.createElement('hr');
    categorie.appendChild(categorieTitleLine);
    categorieTitleLine.style.width = '100%';
    categorieTitleLine.style.height = '2px';
    categorieTitleLine.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    categorieTitleLine.style.margin = '20px 0px';
    categorieTitleLine.style.marginTop = '0px';
    categorieTitleLine.style.border = 'none';
    return categorie;
}
function addTournamentHistory(Container, Player1, Player2, Score1, Score2) {
    if (!Container)
        return;
    var tournamentHistoryEntry = document.createElement('div');
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
    var player1Column = document.createElement('div');
    player1Column.style.display = 'flex';
    player1Column.style.flexDirection = 'column';
    player1Column.style.alignItems = 'center';
    tournamentHistoryEntry.appendChild(player1Column);
    var player1Label = document.createElement('h3');
    player1Label.innerText = 'Player 1';
    player1Label.style.color = 'white';
    player1Label.style.margin = '0 0 5px 0';
    player1Label.style.fontSize = '12px';
    player1Column.appendChild(player1Label);
    var player1Name = document.createElement('h3');
    player1Name.innerText = Player1;
    player1Name.style.color = 'white';
    player1Name.style.fontWeight = 'bold';
    player1Name.style.fontSize = '10px';
    player1Column.appendChild(player1Name);
    // Column 2: VS
    var vsColumn = document.createElement('div');
    vsColumn.style.display = 'flex';
    vsColumn.style.alignItems = 'center';
    tournamentHistoryEntry.appendChild(vsColumn);
    var vsText = document.createElement('h3');
    vsText.innerText = 'VS';
    vsText.style.color = 'white';
    vsText.style.fontWeight = 'bold';
    vsText.style.fontSize = '18px';
    vsColumn.appendChild(vsText);
    // Column 3: Player 2
    var player2Column = document.createElement('div');
    player2Column.style.display = 'flex';
    player2Column.style.flexDirection = 'column';
    player2Column.style.alignItems = 'center';
    tournamentHistoryEntry.appendChild(player2Column);
    var player2Label = document.createElement('h3');
    player2Label.innerText = 'Player 2';
    player2Label.style.color = 'white';
    player2Label.style.margin = '0 0 5px 0';
    player2Label.style.fontSize = '12px';
    player2Column.appendChild(player2Label);
    var player2Name = document.createElement('h3');
    player2Name.innerText = Player2;
    player2Name.style.color = 'white';
    player2Name.style.fontWeight = 'auto';
    player2Name.style.fontSize = '10px';
    player2Column.appendChild(player2Name);
    // Column 4: Score
    var scoreColumn = document.createElement('div');
    scoreColumn.style.display = 'flex';
    scoreColumn.style.flexDirection = 'column';
    scoreColumn.style.alignItems = 'center';
    tournamentHistoryEntry.appendChild(scoreColumn);
    var scoreLabel = document.createElement('h3');
    scoreLabel.innerText = 'Score';
    scoreLabel.style.color = 'white';
    scoreLabel.style.margin = '0 0 5px 0';
    scoreLabel.style.fontSize = '12px';
    scoreColumn.appendChild(scoreLabel);
    var scoreText = document.createElement('h3');
    scoreText.innerText = "".concat(Score1, " / ").concat(Score2);
    scoreText.style.color = 'white';
    scoreText.style.fontWeight = 'auto';
    scoreText.style.fontSize = '10px';
    scoreColumn.appendChild(scoreText);
    // Column 5: Winner
    var winnerColumn = document.createElement('div');
    winnerColumn.style.display = 'flex';
    winnerColumn.style.flexDirection = 'column';
    winnerColumn.style.alignItems = 'center';
    tournamentHistoryEntry.appendChild(winnerColumn);
    var winnerLabel = document.createElement('h3');
    winnerLabel.innerText = 'Winner';
    winnerLabel.style.color = 'white';
    winnerLabel.style.margin = '0 0 5px 0';
    winnerLabel.style.fontSize = '12px';
    winnerColumn.appendChild(winnerLabel);
    var winnerName = document.createElement('h3');
    var winner = Score1 > Score2 ? Player1 : Player2;
    winnerName.innerText = winner;
    winnerName.style.color = 'white';
    winnerName.style.fontWeight = 'auto';
    winnerName.style.fontSize = '10px';
    winnerColumn.appendChild(winnerName);
    return tournamentHistoryEntry;
}
document.addEventListener('DOMContentLoaded', function () { return __awaiter(void 0, void 0, void 0, function () {
    var App, AppContent, AppLauncherMain, AppLauncherTournaments, AppLauncherStats, AppContentMain, leftContainer, General, Tournaments, Stats, rightContainer, GeneralCategorie, TournamentsCategorie, StatsCategorie, GeneralContent_1, profileInfoContainer, avatarContainer, avatarImg, usernameDisplay, user, error_1, statusContainer, statusIndicator, statusText, lastLoginInfo, editProfileButton_1, TournamentsContent_1, TournamentHistoryTitle, TournamentHistory, tournament1, StatsContent_1, winLossSection, winLossTitle, winLossBar, wins, losses, winRate, winBar, ratioText, statsSection, statsTitle, statsTable_1, totalMatches, pointsScored, avgMatchDuration, highestScore, statsData, statsNote;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                App = document.getElementById('profile-app-window');
                if (!App)
                    return [2 /*return*/];
                App.style.width = '470px';
                App.style.minWidth = '470px';
                App.style.height = '370px';
                AppContent = App.children[1];
                if (!AppContent) {
                    console.log('Profile App Content not found');
                    return [2 /*return*/];
                }
                AppLauncherMain = document.getElementById('start-menu-profile-main');
                if (AppLauncherMain) {
                    AppLauncherMain.addEventListener('click', function () {
                        openProfile('start-menu-profile-main', 'general');
                    });
                }
                AppLauncherTournaments = document.getElementById('start-menu-profile-my-tournaments');
                if (AppLauncherTournaments) {
                    AppLauncherTournaments.addEventListener('click', function () {
                        openProfile('start-menu-profile-my-tournaments', 'tournaments');
                    });
                }
                AppLauncherStats = document.getElementById('start-menu-profile-my-stats');
                if (AppLauncherStats) {
                    AppLauncherStats.addEventListener('click', function () {
                        openProfile('start-menu-profile-my-stats', 'stats');
                    });
                }
                AppContentMain = document.createElement('div');
                AppContentMain.id = 'profile-app-content-main';
                AppContentMain.style.width = '100%';
                AppContentMain.style.height = '100%';
                AppContentMain.style.display = 'flex';
                AppContent.appendChild(AppContentMain);
                {
                    leftContainer = document.createElement('div');
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
                        General = createCategorieTab('General', './img/Utils/infos-icon.png', leftContainer);
                        Tournaments = createCategorieTab('Tournaments', './img/Start_Menu/cup-icon.png', leftContainer);
                        Stats = createCategorieTab('Stats', './img/Start_Menu/stats-icon.png', leftContainer);
                    }
                }
                rightContainer = document.createElement('div');
                AppContentMain.appendChild(rightContainer);
                rightContainer.id = 'profile-app-content-main-right';
                rightContainer.style.backgroundColor = 'rgb(163, 177, 233)';
                rightContainer.style.width = 'calc(100% - 150px)';
                rightContainer.style.minWidth = 'calc(100% - 150px)';
                rightContainer.style.maxWidth = 'calc(100% - 150px)';
                rightContainer.style.height = '100%';
                rightContainer.style.overflow = 'auto';
                GeneralCategorie = document.getElementById('profile-app-content-main-left-General');
                TournamentsCategorie = document.getElementById('profile-app-content-main-left-Tournaments');
                StatsCategorie = document.getElementById('profile-app-content-main-left-Stats');
                GeneralContent_1 = createCategorieContainer('General', rightContainer);
                if (!GeneralContent_1) return [3 /*break*/, 5];
                profileInfoContainer = document.createElement('div');
                profileInfoContainer.style.display = 'flex';
                profileInfoContainer.style.flexDirection = 'column';
                profileInfoContainer.style.alignItems = 'center';
                profileInfoContainer.style.padding = '15px';
                profileInfoContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                profileInfoContainer.style.border = '1px solid rgba(0, 0, 0, 0.3)';
                profileInfoContainer.style.borderRadius = '5px';
                profileInfoContainer.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
                GeneralContent_1.appendChild(profileInfoContainer);
                avatarContainer = document.createElement('div');
                avatarContainer.style.width = '100px';
                avatarContainer.style.height = '100px';
                avatarContainer.style.marginBottom = '10px';
                avatarContainer.style.border = '1px solid #7E7E7E';
                avatarContainer.style.padding = '3px';
                avatarContainer.style.backgroundColor = 'white';
                avatarContainer.style.boxShadow = '1px 1px 3px rgba(0, 0, 0, 0.3)';
                profileInfoContainer.appendChild(avatarContainer);
                avatarImg = document.createElement('img');
                avatarImg.alt = 'User Avatar';
                avatarImg.classList.add('avatar-preview');
                avatarImg.src = './img/Start_Menu/demo-user-profile-icon.jpg'; // Default avatar - replace with user's actual avatar from API
                avatarImg.style.width = '100%';
                avatarImg.style.height = '100%';
                avatarImg.style.objectFit = 'cover';
                avatarContainer.appendChild(avatarImg);
                usernameDisplay = document.createElement('h2');
                usernameDisplay.innerText = 'Loading...'; // Placeholder text while fetching username
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log('Fetching username...');
                return [4 /*yield*/, getCurrentUser(sessionStorage.getItem('wxp_token'))];
            case 2:
                user = _a.sent();
                if (user)
                    usernameDisplay.innerText = user.username;
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error('Error fetching username:', error_1);
                usernameDisplay.innerText = 'Unknown User, please log in';
                return [3 /*break*/, 4];
            case 4:
                usernameDisplay.style.color = '#333';
                usernameDisplay.style.fontSize = '18px';
                usernameDisplay.style.fontWeight = 'bold';
                usernameDisplay.style.margin = '5px 0';
                usernameDisplay.style.textShadow = '1px 1px 1px rgba(255, 255, 255, 0.5)';
                profileInfoContainer.appendChild(usernameDisplay);
                statusContainer = document.createElement('div');
                statusContainer.style.display = 'flex';
                statusContainer.style.alignItems = 'center';
                statusContainer.style.marginTop = '5px';
                profileInfoContainer.appendChild(statusContainer);
                statusIndicator = document.createElement('div');
                statusIndicator.style.width = '12px';
                statusIndicator.style.height = '12px';
                statusIndicator.style.borderRadius = '50%';
                statusIndicator.style.backgroundColor = '#4CAF50'; // Green for online - should be dynamic based on API response
                statusIndicator.style.marginRight = '5px';
                statusIndicator.style.border = '1px solid rgba(0, 0, 0, 0.3)';
                statusIndicator.style.boxShadow = '0 0 3px rgba(0, 0, 0, 0.2)';
                statusContainer.appendChild(statusIndicator);
                statusText = document.createElement('span');
                statusText.innerText = 'Online'; // Should be dynamic based on API response
                statusText.style.color = '#333';
                statusText.style.fontSize = '14px';
                statusContainer.appendChild(statusText);
                lastLoginInfo = document.createElement('p');
                lastLoginInfo.innerText = 'Last login: Today at 9:45 AM'; // Should be dynamic based on API response
                lastLoginInfo.style.color = '#555';
                lastLoginInfo.style.fontSize = '12px';
                lastLoginInfo.style.margin = '10px 0 5px 0';
                lastLoginInfo.style.fontStyle = 'italic';
                profileInfoContainer.appendChild(lastLoginInfo);
                editProfileButton_1 = document.createElement('button');
                editProfileButton_1.innerText = 'Edit Profile';
                editProfileButton_1.style.padding = '5px 10px';
                editProfileButton_1.style.margin = '10px 0';
                editProfileButton_1.style.backgroundColor = '#ECE9D8';
                editProfileButton_1.style.border = '1px solid #ACA899';
                editProfileButton_1.style.borderRadius = '3px';
                editProfileButton_1.style.color = '#000';
                editProfileButton_1.style.fontSize = '12px';
                editProfileButton_1.style.cursor = 'pointer';
                editProfileButton_1.style.boxShadow = '1px 1px 3px rgba(0, 0, 0, 0.2)';
                profileInfoContainer.appendChild(editProfileButton_1);
                // Add hover effect for the button
                editProfileButton_1.addEventListener('mouseenter', function () {
                    editProfileButton_1.style.backgroundColor = '#F0F0F0';
                });
                editProfileButton_1.addEventListener('mouseleave', function () {
                    editProfileButton_1.style.backgroundColor = '#ECE9D8';
                });
                editProfileButton_1.addEventListener('mousedown', function () {
                    editProfileButton_1.style.backgroundColor = '#DCDAC0';
                    editProfileButton_1.style.boxShadow = 'inset 1px 1px 3px rgba(0, 0, 0, 0.2)';
                });
                editProfileButton_1.addEventListener('mouseup', function () {
                    editProfileButton_1.style.backgroundColor = '#F0F0F0';
                    editProfileButton_1.style.boxShadow = '1px 1px 3px rgba(0, 0, 0, 0.2)';
                });
                // API CALL NEEDED: On button click, open edit profile form and save changes to the backend
                editProfileButton_1.addEventListener('click', function () {
                    // Open edit profile modal or navigate to edit profile page
                    // Implement form to update user profile data
                    var settingsApp = document.getElementById('settings-app-window');
                    if (settingsApp) {
                        openAppWindow('', 'settings-app-window');
                        App.style.zIndex = '24';
                        settingsApp.style.zIndex = '25';
                        var UserAccountTab = document.getElementById('settings-app-User Account-category');
                        if (UserAccountTab) {
                            UserAccountTab.click();
                        }
                    }
                });
                _a.label = 5;
            case 5:
                TournamentsContent_1 = createCategorieContainer('Tournaments', rightContainer);
                if (TournamentsContent_1) {
                    {
                        TournamentHistoryTitle = document.createElement('h3');
                        TournamentsContent_1.appendChild(TournamentHistoryTitle);
                        TournamentHistoryTitle.innerText = 'Tournament History';
                        TournamentHistoryTitle.style.color = 'white';
                        TournamentHistoryTitle.style.textAlign = 'left';
                        TournamentHistoryTitle.style.margin = '10px 10px';
                        TournamentHistoryTitle.style.fontSize = '20px';
                        TournamentHistoryTitle.style.fontWeight = 'bold';
                        TournamentHistoryTitle.style.textShadow = '1px 1px rgba(0, 0, 0, 0.3)';
                        TournamentHistory = document.createElement('div');
                        TournamentsContent_1.appendChild(TournamentHistory);
                        TournamentHistory.style.width = '100%';
                        TournamentHistory.style.height = '100%';
                        TournamentHistory.style.display = 'flex';
                        TournamentHistory.style.flexDirection = 'column';
                        TournamentHistory.style.alignItems = 'left';
                        TournamentHistory.style.justifyContent = 'left';
                        TournamentHistory.style.overflow = 'auto';
                        TournamentHistory.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
                        tournament1 = addTournamentHistory(TournamentHistory, 'Michel', 'Francis', 0, 2);
                    }
                }
                StatsContent_1 = createCategorieContainer('Stats', rightContainer);
                if (StatsContent_1) {
                    winLossSection = document.createElement('div');
                    StatsContent_1.appendChild(winLossSection);
                    winLossSection.style.margin = '10px 0';
                    winLossSection.style.padding = '10px';
                    winLossSection.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
                    winLossSection.style.border = '1px solid rgba(0, 0, 0, 0.3)';
                    winLossSection.style.borderRadius = '3px';
                    winLossTitle = document.createElement('h3');
                    winLossSection.appendChild(winLossTitle);
                    winLossTitle.innerText = 'Win/Loss Ratio';
                    winLossTitle.style.color = 'white';
                    winLossTitle.style.fontSize = '18px';
                    winLossTitle.style.marginBottom = '10px';
                    winLossTitle.style.textShadow = '1px 1px rgba(0, 0, 0, 0.3)';
                    winLossBar = document.createElement('div');
                    winLossSection.appendChild(winLossBar);
                    winLossBar.style.width = '100%';
                    winLossBar.style.height = '25px';
                    winLossBar.style.backgroundColor = '#d3d3d3';
                    winLossBar.style.border = '1px solid #666';
                    winLossBar.style.position = 'relative';
                    winLossBar.style.borderRadius = '2px';
                    winLossBar.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, 0.2)';
                    wins = 15;
                    losses = 7;
                    winRate = Math.round((wins / (wins + losses)) * 100);
                    winBar = document.createElement('div');
                    winLossBar.appendChild(winBar);
                    winBar.style.width = "".concat(winRate, "%");
                    winBar.style.height = '100%';
                    winBar.style.backgroundColor = 'rgb(75, 192, 75)';
                    winBar.style.display = 'inline-block';
                    winBar.style.borderRadius = '2px 0 0 2px';
                    ratioText = document.createElement('div');
                    winLossSection.appendChild(ratioText);
                    ratioText.innerText = "Win Rate: ".concat(winRate, "% (").concat(wins, " wins, ").concat(losses, " losses)");
                    ratioText.style.color = 'white';
                    ratioText.style.fontSize = '14px';
                    ratioText.style.marginTop = '5px';
                    ratioText.style.textAlign = 'center';
                    statsSection = document.createElement('div');
                    StatsContent_1.appendChild(statsSection);
                    // statsSection.style.width = '100%';
                    statsSection.style.margin = '15px 0';
                    statsSection.style.padding = '10px';
                    statsSection.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
                    statsSection.style.border = '1px solid rgba(0, 0, 0, 0.3)';
                    statsSection.style.borderRadius = '3px';
                    statsTitle = document.createElement('h3');
                    statsSection.appendChild(statsTitle);
                    statsTitle.innerText = 'Game Statistics';
                    statsTitle.style.color = 'white';
                    statsTitle.style.fontSize = '18px';
                    statsTitle.style.marginBottom = '10px';
                    statsTitle.style.textShadow = '1px 1px rgba(0, 0, 0, 0.3)';
                    statsTable_1 = document.createElement('table');
                    statsSection.appendChild(statsTable_1);
                    statsTable_1.style.width = '100%';
                    statsTable_1.style.borderCollapse = 'collapse';
                    statsTable_1.style.color = 'white';
                    statsTable_1.style.fontSize = '14px';
                    totalMatches = wins + losses;
                    pointsScored = 254;
                    avgMatchDuration = '3m 42s';
                    highestScore = 11;
                    statsData = [
                        { label: 'Total Matches', value: totalMatches },
                        { label: 'Points Scored', value: pointsScored },
                        { label: 'Average Match Duration', value: avgMatchDuration },
                        { label: 'Highest Score', value: highestScore }
                    ];
                    statsData.forEach(function (stat) {
                        var row = document.createElement('tr');
                        statsTable_1.appendChild(row);
                        row.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
                        var labelCell = document.createElement('td');
                        row.appendChild(labelCell);
                        labelCell.innerText = stat.label;
                        labelCell.style.padding = '8px';
                        labelCell.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                        labelCell.style.fontWeight = 'bold';
                        var valueCell = document.createElement('td');
                        row.appendChild(valueCell);
                        valueCell.innerText = stat.value.toString();
                        valueCell.style.padding = '8px';
                        valueCell.style.textAlign = 'right';
                    });
                    statsNote = document.createElement('p');
                    statsSection.appendChild(statsNote);
                    statsNote.innerText = 'Statistics are updated after each game';
                    statsNote.style.color = 'rgba(255, 255, 255, 0.7)';
                    statsNote.style.fontSize = '12px';
                    statsNote.style.marginTop = '10px';
                    statsNote.style.fontStyle = 'italic';
                }
                if (GeneralContent_1 && TournamentsContent_1 && StatsContent_1) {
                    if (GeneralCategorie) {
                        GeneralCategorie.addEventListener('click', function () {
                            GeneralContent_1.style.display = 'flex';
                            TournamentsContent_1.style.display = 'none';
                            StatsContent_1.style.display = 'none';
                        });
                    }
                    if (TournamentsCategorie) {
                        TournamentsCategorie.addEventListener('click', function () {
                            GeneralContent_1.style.display = 'none';
                            TournamentsContent_1.style.display = 'flex';
                            StatsContent_1.style.display = 'none';
                        });
                    }
                    if (StatsCategorie) {
                        StatsCategorie.addEventListener('click', function () {
                            GeneralContent_1.style.display = 'none';
                            TournamentsContent_1.style.display = 'none';
                            StatsContent_1.style.display = 'flex';
                        });
                    }
                }
                return [2 /*return*/];
        }
    });
}); });
