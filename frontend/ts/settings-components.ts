import { sendNotification } from "./notification.js";
import { deleteUserAvatar, deleteUserBackground, getAllUsers, isAvatarUserExists, isBackgroundUserExists, updateUser } from "./API.js";

import { getUserAvatar, uploadFile } from "./API.js";
import { updateUserImages } from "./login-screen.js";
import { setFont, updateAllUserNames } from "./system.js";

document.addEventListener('DOMContentLoaded', () => {


	let categoryContainer = document.getElementById('settings-app-category-container') as HTMLElement;

	let appearanceCategory = document.getElementById('settings-app-appearance-container') as HTMLElement;

	
	// Appearance Settings
	
	//		Wallpaper Settings
	
	{
		let wallpaperSettings = document.getElementById('settings-app-Wallpaper-setting') as HTMLElement;
		if (!wallpaperSettings)
			console.log('Wallpaper settings element not found');
		const documentBody = getComputedStyle(document.body);
		let actualWallpaper = documentBody.getPropertyValue('background-image')
			.split('/')
			.pop()
			?.replace(/['"]/g, '') || 'default.jpg';

		let wallpaperSettingsContainer = document.createElement('div');
		wallpaperSettingsContainer.id = 'wallpaper-settings-container';
		wallpaperSettingsContainer.style.display = 'flex';
		wallpaperSettingsContainer.style.alignItems = 'center';
		
		wallpaperSettings.appendChild(wallpaperSettingsContainer);
		let wallpaperInfo = document.createElement('div');
		wallpaperInfo.id = 'wallpaper-info';
		wallpaperInfo.style.display = 'flex';
		wallpaperInfo.style.gap = '20px';

		let leftColumn = document.createElement('div');
		leftColumn.style.display = 'flex';
		leftColumn.style.flexDirection = 'column';
		leftColumn.style.margin = '5px 0';
		wallpaperInfo.appendChild(leftColumn);

		let currentWallpaperTitle = document.createElement('span');
		leftColumn.appendChild(currentWallpaperTitle);
		currentWallpaperTitle.textContent = 'Current Wallpaper:';
		currentWallpaperTitle.style.fontSize = '12px';
		currentWallpaperTitle.style.marginBottom = '5px';
		currentWallpaperTitle.style.fontWeight = 'bold';

		let currentWallpaperPreview = document.createElement('img');
		leftColumn.appendChild(currentWallpaperPreview);
		currentWallpaperPreview.id = 'current-wallpaper-preview';
		currentWallpaperPreview.classList.add('user-background');
		currentWallpaperPreview.src = `url(${document.body.style.backgroundImage})` || './img/Login_Screen/default-wallpaper.jpg';
		currentWallpaperPreview.style.width = '100px';
		currentWallpaperPreview.style.height = '80px';
		currentWallpaperPreview.style.border = '1px solid #999';
		currentWallpaperPreview.style.borderRadius = '3px';
		currentWallpaperPreview.style.marginBottom = '5px';
		currentWallpaperPreview.style.objectFit = 'cover';

		let currentWallpaperName = document.createElement('span');
		leftColumn.appendChild(currentWallpaperName);
		currentWallpaperName.id = 'current-wallpaper-name';
		currentWallpaperName.textContent = actualWallpaper;
		currentWallpaperTitle.style.fontSize = '11px';
		currentWallpaperName.style.overflow = 'hidden';
		currentWallpaperName.style.textOverflow = 'ellipsis';
		currentWallpaperName.style.whiteSpace = 'nowrap';
		currentWallpaperName.style.maxWidth = '110px';
		currentWallpaperName.style.maxHeight = '50px';
		currentWallpaperName.style.fontSize = '11px';

		let rightColumn = document.createElement('div');
		rightColumn.style.display = 'flex';
		rightColumn.style.flexDirection = 'column';
		rightColumn.style.marginLeft = 'calc(100% - 310px)';
		wallpaperInfo.appendChild(rightColumn);

		let importButton = document.createElement('button');
		rightColumn.appendChild(importButton);
		importButton.id = 'import-button';
		importButton.textContent = 'Change Wallpaper';
		importButton.style.padding = '5px 10px';
		importButton.style.marginBottom = '5px';
		importButton.style.transform = 'translateY(+20px)';

		let fileInput = document.createElement('input');
		rightColumn.appendChild(fileInput);
		fileInput.id = 'file-input';
		fileInput.type = 'file';
		fileInput.accept = 'image/*';
		fileInput.style.display = 'none';

		importButton.onclick = () => fileInput.click();

		fileInput.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				let currentuserID = await Number(sessionStorage.getItem('wxp_user_id'));
				await uploadFile(currentuserID, file, 'wallpaper')
				.then(response => {
					if (response && response.ok === true) {
						let wallpaperURL = document.getElementsByClassName('user-background')[0] as HTMLImageElement;
						if (wallpaperURL)
							wallpaperURL.src = URL.createObjectURL(file);
						currentWallpaperName.textContent = file.name;
						updateUserImages(undefined, file);
						document.body.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
						sendNotification('Wallpaper Changed', `Wallpaper changed to ${file.name}`, "./img/Settings_app/picture-icon.png");
					}
				}).catch(error => {
					console.error('Error uploading wallpaper:', error);
					sendNotification('Error', 'Failed to upload wallpaper', "./img/Utils/error-icon.png");
				});
			}
			else
				sendNotification('Error', 'No file selected', "./img/Utils/error-icon.png");
		};

		let resolutionText = document.createElement('span');
		rightColumn.appendChild(resolutionText);
		resolutionText.id = 'resolution-text';
		resolutionText.textContent = 'Recommended: 1920x1080';
		resolutionText.style.color = '#666';
		resolutionText.style.fontSize = '10px';
		resolutionText.style.transform = 'translateY(+20px)';

		let formatText = document.createElement('span');
		rightColumn.appendChild(formatText);
		formatText.id = 'wallpaper-format-text';
		formatText.textContent = 'Accepted formats: PNG, JPG, JPEG';
		formatText.style.color = '#666';
		formatText.style.fontSize = '10px';
		formatText.style.transform = 'translateY(+20px)';

		let sizeText = document.createElement('span');
		rightColumn.appendChild(sizeText);
		sizeText.id = 'wallpaper-size-text';
		sizeText.textContent = 'Maximum file size: 5 MB';
		sizeText.style.color = '#666';
		sizeText.style.fontSize = '10px';
		sizeText.style.transform = 'translateY(+20px)';
		wallpaperSettings.appendChild(wallpaperInfo);
	}








	//		Font Size Settings

	let fontSizeSettings = document.getElementById('settings-app-Font Size-setting') as HTMLElement;
	let fontSizeSettingsContainer = document.createElement('div');
	fontSizeSettings.appendChild(fontSizeSettingsContainer);
	fontSizeSettingsContainer.id = 'font-size-settings-container';
	fontSizeSettingsContainer.style.display = 'flex';
	fontSizeSettingsContainer.style.alignItems = 'center';

	let fontSizeValue = document.body.style.fontSize;
	let fontSizeValueNumber = parseInt(fontSizeValue.replace('px', ''));

	let fontSizeInfo = document.createElement('div');
	fontSizeSettingsContainer.appendChild(fontSizeInfo);
	fontSizeInfo.id = 'font-size-info';
	fontSizeInfo.style.display = 'flex';
	fontSizeInfo.style.margin = '10px';
	
	let exampleText = document.createElement('span');
	fontSizeInfo.appendChild(exampleText);
	exampleText.style.position = 'absolute';
	exampleText.style.right = '35px';
	exampleText.style.top = '5px';
	exampleText.style.left = 'calc(100% - 125px)';
	exampleText.style.fontSize = `15px`;
	exampleText.style.maxHeight = '50px';
	exampleText.style.overflow = 'hidden';
	exampleText.style.maxWidth = '110px';
	exampleText.style.textOverflow = 'ellipsis';
	exampleText.style.whiteSpace = 'nowrap';
	exampleText.textContent = `12px`;

	let fontSizeSlider = document.createElement('div');
	fontSizeInfo.appendChild(fontSizeSlider);
	fontSizeSlider.id = 'font-size-slider';
	fontSizeSlider.classList.add('field-row');
	fontSizeSlider.style.width = '100%';


	let minSize = document.createElement('label');
	fontSizeSlider.appendChild(minSize);
	minSize.htmlFor = 'range26';
	minSize.textContent = '-3px';
	let range = document.createElement('input');
	fontSizeSlider.appendChild(range);
	range.id = 'range26';
	range.type = 'range';
	range.min = '-3';
	range.max = '3';
	range.value = '0';
	range.addEventListener('input', () => {
		const newSize = 15 + parseInt(range.value);
		exampleText.style.fontSize = `${newSize}px`;
		exampleText.textContent = `${newSize}px`;
	});
	let maxSize = document.createElement('label');
	fontSizeSlider.appendChild(maxSize);
	maxSize.htmlFor = 'range27';
	maxSize.textContent = '+3px';


	

	let applyButton = document.createElement('button');
	fontSizeInfo.appendChild(applyButton);
	applyButton.id = 'font-size-apply-button';
	applyButton.textContent = 'Apply';
	applyButton.style.padding = '5px 5px';
	applyButton.style.marginLeft = '10px';
	applyButton.style.left = 'calc(100% - 125px)';
	applyButton.style.position = 'absolute';
	applyButton.style.top = '35px';
	let previousSize = 0;
	applyButton.addEventListener('click', () => {
		setFont(parseInt(range.value), previousSize);
	});




	// User Account Settings

	let userAccountContainer = document.getElementById('settings-app-user-account-container') as HTMLElement;

	{
		let UserAccountAvatar = document.getElementById('settings-app-Avatar-setting') as HTMLElement;

		let avatarSettings = document.createElement('div');
		avatarSettings.id = 'avatar-settings-container';
		avatarSettings.style.display = 'flex';
		avatarSettings.style.alignItems = 'center';

		UserAccountAvatar.appendChild(avatarSettings);

		let avatarInfo = document.createElement('div');
		avatarInfo.id = 'avatar-info';
		avatarInfo.style.display = 'flex';
		avatarInfo.style.gap = '20px';

		let leftColumn = document.createElement('div');
		leftColumn.style.display = 'flex';
		leftColumn.style.flexDirection = 'column';
		avatarInfo.appendChild(leftColumn);

		let currentAvatarTitle = document.createElement('span');
		leftColumn.appendChild(currentAvatarTitle);
		currentAvatarTitle.textContent = 'Current Avatar:';
		currentAvatarTitle.style.fontSize = '12px';
		currentAvatarTitle.style.marginBottom = '5px';
		currentAvatarTitle.style.fontWeight = 'bold';

		let currentAvatarPreview = document.createElement('img');
		leftColumn.appendChild(currentAvatarPreview);
		currentAvatarPreview.id = 'current-avatar-preview';
		currentAvatarPreview.classList.add('avatar-preview');
		currentAvatarPreview.src = './img/Login_Screen/demo-user-profile-icon.jpg';
		currentAvatarPreview.style.width = '55px';
		currentAvatarPreview.style.height = '55px';
		currentAvatarPreview.style.borderRadius = '10%';
		currentAvatarPreview.style.marginBottom = '10px';
		currentAvatarPreview.style.objectFit = 'cover';

		let currentAvatarName = document.createElement('span');
		leftColumn.appendChild(currentAvatarName);
		currentAvatarName.id = 'current-avatar-name';
		currentAvatarName.textContent = 'default.jpg';
		currentAvatarName.style.fontSize = '11px';
		currentAvatarName.style.overflow = 'hidden';
		currentAvatarName.style.textOverflow = 'ellipsis';
		currentAvatarName.style.whiteSpace = 'nowrap';
		currentAvatarName.style.maxWidth = '110px';
		currentAvatarName.style.maxHeight = '50px';
		currentAvatarName.style.marginBottom = '10px';

		let rightColumn = document.createElement('div');
		rightColumn.style.display = 'flex';
		rightColumn.style.flexDirection = 'column';
		rightColumn.style.marginLeft = 'calc(100% - 270px)';
		rightColumn.style.transform = 'translateY(+25%)';
		avatarInfo.appendChild(rightColumn);

		let importButton = document.createElement('button');
		rightColumn.appendChild(importButton);
		importButton.id = 'avatar-import-button';
		importButton.textContent = 'Change Avatar';
		importButton.style.padding = '5px 10px';
		importButton.style.marginBottom = '5px';
		importButton.style.transform = 'translateY(-10px)';

		let fileInput = document.createElement('input');
		rightColumn.appendChild(fileInput);
		fileInput.id = 'avatar-file-input';
		fileInput.type = 'file';
		fileInput.accept = 'image/*';
		fileInput.style.display = 'none';

		importButton.onclick = () => fileInput.click();

		fileInput.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				let currentuserID = await Number(sessionStorage.getItem('wxp_user_id'));
				await uploadFile(currentuserID, file, 'avatar')
				.then(async response => {
					if (response && response.ok === true) {
						let newAvatar = await getUserAvatar(currentuserID);
						if (newAvatar)
							console.log("New avatar URL: ", newAvatar);
						currentAvatarName.textContent = file.name;
						currentAvatarPreview.src = URL.createObjectURL(file);
						updateUserImages(file);
						sendNotification('Avatar Changed', `Avatar changed to ${newAvatar}`, "./img/Utils/profile-icon.png");
					}
				}).catch(error => {
					console.error('Error uploading avatar:', error);
					sendNotification('Error', 'Failed to upload avatar', "./img/Utils/error-icon.png");
				});
				
			}
			else {
				sendNotification('Error', 'No file selected', "./img/Utils/error-icon.png");
			}
		};

		let resolutionText = document.createElement('span');
		rightColumn.appendChild(resolutionText);
		resolutionText.id = 'avatar-resolution-text';
		resolutionText.textContent = 'Recommended: 256x256';
		resolutionText.style.color = '#666';
		resolutionText.style.fontSize = '10px';
		resolutionText.style.transform = 'translateY(-10px)';

		let formatText = document.createElement('span');
		rightColumn.appendChild(formatText);
		formatText.id = 'avatar-format-text';
		formatText.textContent = 'Accepted formats: PNG, JPG, JPEG';
		formatText.style.color = '#666';
		formatText.style.fontSize = '10px';
		formatText.style.transform = 'translateY(-10px)';

		let sizeText = document.createElement('span');
		rightColumn.appendChild(sizeText);
		sizeText.id = 'avatar-size-text';
		sizeText.textContent = 'Maximum file size: 5 MB';
		sizeText.style.color = '#666';
		sizeText.style.fontSize = '10px';
		sizeText.style.transform = 'translateY(-10px)';
		UserAccountAvatar.appendChild(avatarInfo);
	}


	let userAccountName = document.getElementById('settings-app-Account Name-setting') as HTMLElement;
	{
		let nameSettings = document.createElement('div');
		nameSettings.style.display = 'flex';
		nameSettings.style.alignItems = 'center';
		userAccountName.appendChild(nameSettings);

		let nameInfo = document.createElement('div');
		nameInfo.style.display = 'flex';
		nameInfo.style.gap = '20px';

		let leftColumn = document.createElement('div');
		leftColumn.style.display = 'flex';
		leftColumn.style.flexDirection = 'column';
		nameInfo.appendChild(leftColumn);

		let currentNameTitle = document.createElement('span');
		leftColumn.appendChild(currentNameTitle);
		currentNameTitle.textContent = 'New Username:';
		currentNameTitle.style.fontSize = '12px';
		currentNameTitle.style.marginBottom = '5px';
		currentNameTitle.style.fontWeight = 'bold';

		let nameInput = document.createElement('input');
		leftColumn.appendChild(nameInput);
		nameInput.type = 'text';
		nameInput.pattern = '[A-Za-z0-9_]+';
		nameInput.title = 'Only letters, numbers and underscore allowed';
		nameInput.style.width = '150px';
		nameInput.style.marginBottom = '5px';

		let rightColumn = document.createElement('div');
		rightColumn.style.display = 'flex';
		rightColumn.style.flexDirection = 'column';
		rightColumn.style.marginLeft = 'calc(100% - 310px)';
		nameInfo.appendChild(rightColumn);

		let applyButton = document.createElement('button');
		rightColumn.appendChild(applyButton);
		applyButton.textContent = 'Change Username';
		applyButton.style.padding = '5px 10px';

		applyButton.onclick = async () => {
			if (!nameInput.value.match(/^[A-Za-z0-9_]+$/)) {
				sendNotification('Error', 'Invalid username format', "./img/Utils/error-icon.png");
				return;
			}
			if (nameInput.value.length >= 20) {
				sendNotification('Error', 'Username too long', "./img/Utils/error-icon.png");
				return;
			}
			const userList = await getAllUsers();
			if (userList.find(user => user.username === nameInput.value)) {
				sendNotification('Error', 'Username already taken', "./img/Utils/error-icon.png");
				return;
			}
			if (confirm(`Are you sure you want to change your username to "${nameInput.value}"?`)) {
				sendNotification('Username Changed', `Username changed to ${nameInput.value}`, "./img/Utils/profile-icon.png");
				await updateUser(sessionStorage.getItem('wxp_user_id'), { username: nameInput.value })
				nameInput.value = '';
				updateAllUserNames();
			}
		};
		let usernameText = document.createElement('span');
		rightColumn.appendChild(usernameText);
		usernameText.textContent = 'Only letters, numbers and underscores allowed';
		usernameText.style.color = '#666';
		usernameText.style.fontSize = '10px';
		usernameText.style.padding = '5px';
		userAccountName.appendChild(nameInfo);
	}


	
	let userAccountPassword = document.getElementById('settings-app-Password-setting') as HTMLElement;
	{
		let passwordSettings = document.createElement('div');
		passwordSettings.style.display = 'flex';
		passwordSettings.style.alignItems = 'center';
		userAccountPassword.appendChild(passwordSettings);

		let passwordInfo = document.createElement('div');
		passwordInfo.style.display = 'flex';
		passwordInfo.style.gap = '20px';

		let leftColumn = document.createElement('div');
		leftColumn.style.display = 'flex';
		leftColumn.style.flexDirection = 'column';
		passwordInfo.appendChild(leftColumn);

		let newPasswordTitle = document.createElement('span');
		leftColumn.appendChild(newPasswordTitle);
		newPasswordTitle.textContent = 'New Password:';
		newPasswordTitle.style.fontSize = '12px';
		newPasswordTitle.style.marginBottom = '5px';
		newPasswordTitle.style.fontWeight = 'bold';

		let passwordInput = document.createElement('input');
		leftColumn.appendChild(passwordInput);
		passwordInput.type = 'password';
		passwordInput.style.width = '150px';
		passwordInput.style.marginBottom = '10px';

		let confirmPasswordTitle = document.createElement('span');
		leftColumn.appendChild(confirmPasswordTitle);
		confirmPasswordTitle.textContent = 'Confirm Password:';
		confirmPasswordTitle.style.fontSize = '12px';
		confirmPasswordTitle.style.marginBottom = '5px';
		confirmPasswordTitle.style.fontWeight = 'bold';

		let confirmPasswordInput = document.createElement('input');
		leftColumn.appendChild(confirmPasswordInput);
		confirmPasswordInput.type = 'password';
		confirmPasswordInput.style.width = '150px';
		confirmPasswordInput.style.marginBottom = '5px';

		let rightColumn = document.createElement('div');
		rightColumn.style.display = 'flex';
		rightColumn.style.flexDirection = 'column';
		rightColumn.style.marginLeft = 'calc(100% - 310px)';
		passwordInfo.appendChild(rightColumn);

		let applyButton = document.createElement('button');
		rightColumn.appendChild(applyButton);
		applyButton.textContent = 'Change Password';
		applyButton.style.padding = '5px 10px';

		applyButton.onclick = async () => {
			if (passwordInput.value !== confirmPasswordInput.value) {
				sendNotification('Error', 'Passwords do not match', "./img/Utils/error-icon.png");
				return;
			}
			if (passwordInput.value.length < 8) {
				sendNotification('Error', 'Password must be at least 8 characters', "./img/Utils/error-icon.png");
				return;
			}
			if (!/[A-Z]/.test(passwordInput.value)) {
				sendNotification('Error', 'Password must contain at least 1 uppercase letter', "./img/Utils/error-icon.png");
				return;
			}
			if (!/[a-z]/.test(passwordInput.value)) {
				sendNotification('Error', 'Password must contain at least 1 lowercase letter', "./img/Utils/error-icon.png");
				return;
			}
			if (!/[0-9]/.test(passwordInput.value)) {
				sendNotification('Error', 'Password must contain at least 1 number', "./img/Utils/error-icon.png");
				return;
			}
			if (confirm('Are you sure you want to change your password?')) {
				sendNotification('Password Changed', 'Password successfully changed', "./img/Utils/profile-icon.png");
				await updateUser(sessionStorage.getItem('wxp_user_id'), { password: passwordInput.value })
				passwordInput.value = '';
				confirmPasswordInput.value = '';
			}
		};
		let passwordText = document.createElement('span');
		rightColumn.appendChild(passwordText);
		passwordText.textContent = 'At least 8 characters, 1 uppercase, 1 lowercase, 1 number';
		passwordText.style.color = '#666';
		passwordText.style.fontSize = '10px';
		passwordText.style.padding = '5px';
		userAccountPassword.appendChild(passwordInfo);
	}



	// System Settings

	function createInformationElement(Name: string, Container: HTMLElement): HTMLElement
	{
		let Element = document.createElement('div');
		Element.id = Name.toLowerCase().replace(' ', '-') + "-info";
		Container.appendChild(Element);
		Element.style.position = 'relative';
		Element.style.width = 'calc(100% - 20px)';
		Element.style.padding = '10px';
		Element.style.border = '1px solid #ddd';
		Element.style.borderRadius = '5px';
		Element.style.backgroundColor = '#f9f9f9';
		Element.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.1)';
		Element.style.display = 'flex';
		Element.style.flexDirection = 'column';
		Element.style.gap = '5px';
		Element.style.margin = '10px';
		let ElementTitle = document.createElement('span');
		Element.appendChild(ElementTitle);
		ElementTitle.textContent = Name;
		ElementTitle.style.fontSize = '12px';
		ElementTitle.style.fontWeight = 'bold';
		ElementTitle.style.margin = '5px';
		ElementTitle.style.marginBottom = '0';
		ElementTitle.style.textShadow = '0 0 5px rgba(0, 0, 0, 0.1)';
		let ElementSubTitleBar = document.createElement('hr');
		Element.appendChild(ElementSubTitleBar);
		ElementSubTitleBar.style.width = '100%';
		ElementSubTitleBar.style.margin = '5px';
		ElementSubTitleBar.style.marginTop = '0';
		ElementSubTitleBar.style.marginBottom = '10px';
		ElementSubTitleBar.style.border = '0';
		ElementSubTitleBar.style.borderTop = '1px solid #ddd';
		ElementSubTitleBar.style.borderBottom = '1px solid #fff';
		ElementSubTitleBar.style.height = '1px';
		ElementSubTitleBar.style.backgroundColor = 'rgba(0, 0, 0, 0.39)';
		ElementSubTitleBar.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.1)';
		return Element;
	}

	function createFormatedSpan(Container: HTMLElement): HTMLElement
	{
		let Span = document.createElement('span');
		Container.appendChild(Span);
		// Span.style.overflow = 'hidden';
		Span.style.textOverflow = 'ellipsis';
		Span.style.whiteSpace = 'nowrap';
		Span.style.maxWidth = 'calc(100% - 20px)';
		Span.style.maxHeight = '50px';
		Span.style.fontSize = '11px';
		Span.style.margin = '10px';
		Span.style.marginTop = '0';
		Span.style.marginBottom = '0';
		return Span;
	}

	let systemSettingsContainer = document.getElementById('settings-app-system-settings-container') as HTMLElement;
	{
		// System Informations

		let systemInformationsBox = document.getElementById('settings-app-System Information-setting') as HTMLElement;
		{
			let systemInformationsContainer = document.createElement('div');
			systemInformationsBox.appendChild(systemInformationsContainer);
			systemInformationsContainer.id = 'system-informations-container';
			systemInformationsContainer.style.display = 'flex';
			systemInformationsContainer.style.flexDirection = 'column';
			systemInformationsContainer.style.alignItems = 'center';

			

			let sysInfo1 = createInformationElement('System Name', systemInformationsContainer);
			let sysInfo2 = createInformationElement('System Version', systemInformationsContainer);
			let sysInfo3 = createInformationElement('Creators', systemInformationsContainer);
			let sysInfo4 = createInformationElement('Creation Date', systemInformationsContainer);
			let sysInfo5 = createInformationElement('Last Update', systemInformationsContainer);
			let sysInfo6 = createInformationElement('Github Repository', systemInformationsContainer);
			let sysInfo7 = createInformationElement('License', systemInformationsContainer);


			let systemName = createFormatedSpan(sysInfo1);
			systemName.textContent = "Windows XPong (Transcendance Edition)";
			let systemVersion = createFormatedSpan(sysInfo2);
			systemVersion.textContent = "Beta 0.7";

			let creators = createFormatedSpan(sysInfo3);
			
			// Create a styled contributors container
			let contributorsContainer = document.createElement('div');
			sysInfo3.style.height = '330px';
			contributorsContainer.style.display = 'flex';
			contributorsContainer.style.flexDirection = 'column';
			contributorsContainer.style.gap = '10px';
			contributorsContainer.style.width = '100%';
			contributorsContainer.style.maxHeight = '900px';
			contributorsContainer.style.height = '100%';
			contributorsContainer.style.overflowY = 'auto';
			contributorsContainer.style.padding = '5px';
			contributorsContainer.style.border = '1px solid #B1CCEF';
			contributorsContainer.style.borderRadius = '3px';
			contributorsContainer.style.backgroundColor = '#F5F9FF';
			contributorsContainer.style.height = "fit-content";

			// Contributors data with GitHub profiles and roles
			const contributorsData = [
				{
					username: 'Jcuzin',
					github: 'https://github.com/Ocyn',
					role: ' Windows XP UI/UX Designer ',
					icon: '🖥️'
				},
				{
					username: 'Lcamerly',
					github: 'https://github.com/Axiaaa',
					role: 'Backend & DevOps',
					icon: '🛠️'
				},
				{
					username: 'Mcourbon',
					github: 'https://github.com/mcourbon',
					role: 'Pong Game & Tournament Designe',
					icon: '🎮'
				},
				{
					username: 'Aammirat',
					github: 'https://github.com/nonomex',
					role: 'Cybersecurity and API Integration',
					icon: '🔒'
				},
				{
					username: 'Yallo',
					github: 'https://github.com/Sarfoula',
					role: 'AI Opponent & Optimization',
					icon: '🤖'
				}
			];

			// Create each contributor card
			contributorsData.forEach(contributor => {
				let card = document.createElement('div');
				card.style.display = 'flex';
				card.style.alignItems = 'center';
				card.style.padding = '5px';
				card.style.borderBottom = '1px solid #E0E9F5';
				card.style.transition = 'background-color 0.2s';
				
				// Hover effect
				card.onmouseover = () => { card.style.backgroundColor = '#E5EFFF'; };
				card.onmouseout = () => { card.style.backgroundColor = 'transparent'; };
				
				// Icon
				let icon = document.createElement('div');
				icon.textContent = contributor.icon;
				icon.style.fontSize = '20px';
				icon.style.width = '30px';
				icon.style.height = '30px';
				icon.style.display = 'flex';
				icon.style.alignItems = 'center';
				icon.style.justifyContent = 'center';
				icon.style.backgroundColor = '#0078D7';
				icon.style.color = 'white';
				icon.style.borderRadius = '50%';
				icon.style.marginRight = '10px';
				card.appendChild(icon);
				
				// Content
				let content = document.createElement('div');
				content.style.display = 'flex';
				content.style.flexDirection = 'column';
				content.style.flex = '1';
				
				// Username with GitHub link
				let usernameLink = document.createElement('a');
				usernameLink.href = contributor.github;
				usernameLink.textContent = contributor.username;
				usernameLink.target = '_blank';
				usernameLink.style.color = '#0066CC';
				usernameLink.style.textDecoration = 'none';
				usernameLink.style.fontWeight = 'bold';
				usernameLink.style.fontSize = '11px';
				usernameLink.onmouseover = () => { usernameLink.style.textDecoration = 'underline'; };
				usernameLink.onmouseout = () => { usernameLink.style.textDecoration = 'none'; };
				content.appendChild(usernameLink);
				
				// Role
				let role = document.createElement('span');
				role.textContent = contributor.role;
				role.style.fontSize = '10px';
				role.style.color = '#666';
				content.appendChild(role);
				
				card.appendChild(content);
				
				// GitHub icon link
				let githubLink = document.createElement('a');
				githubLink.href = contributor.github;
				githubLink.target = '_blank';
				githubLink.style.marginLeft = 'auto';
				githubLink.style.display = 'flex';
				githubLink.style.alignItems = 'center';
				githubLink.style.justifyContent = 'center';
				githubLink.title = `Visit ${contributor.username}'s GitHub profile`;
				
				let githubIcon = document.createElement('div');
				githubIcon.textContent = '🔗';
				githubIcon.style.fontSize = '14px';
				githubIcon.style.width = '20px';
				githubIcon.style.height = '20px';
				githubIcon.style.display = 'flex';
				githubIcon.style.alignItems = 'center';
				githubIcon.style.justifyContent = 'center';
				
				githubLink.appendChild(githubIcon);
				card.appendChild(githubLink);
				
				contributorsContainer.appendChild(card);
			});

			// Title for the contributors section
			let contributorsTitle = document.createElement('div');
			contributorsTitle.textContent = 'Project Contributors:';
			contributorsTitle.style.fontSize = '12px';
			contributorsTitle.style.fontWeight = 'bold';
			contributorsTitle.style.marginBottom = '5px';

			// Replace the text with our enhanced content
			creators.textContent = '';
			creators.appendChild(contributorsTitle);
			creators.appendChild(contributorsContainer);
			let creationDate = createFormatedSpan(sysInfo4);
			creationDate.textContent = "2025-01-12";
			let lastUpdate = createFormatedSpan(sysInfo5);
			let lastUpdateText = "";
			fetch('https://api.github.com/repos/Axiaaa/ft_transcendance/commits/main')
			.then(response => response.json())
			.then(data => {
				lastUpdateText = data.commit.author.date.split('T')[0];
				console.log('Last commit date:', lastUpdateText);
				lastUpdate.textContent = lastUpdateText;
			})
			.catch(error => {
				console.error('Error fetching last commit date:', error);
				lastUpdateText = "2025-01-12"; // Fallback date if fetch fails
				lastUpdate.textContent = lastUpdateText;
			});
			let githubRepoContainer = document.createElement('div');
			githubRepoContainer.style.display = 'flex';
			githubRepoContainer.style.flexDirection = 'column';
			githubRepoContainer.style.width = '100%';

			// GitHub link with icon
			let githubLinkRow = document.createElement('div');
			githubLinkRow.style.display = 'flex';
			githubLinkRow.style.alignItems = 'center';
			githubLinkRow.style.marginBottom = '10px';
			sysInfo6.style.height = "200px";

			// GitHub icon
			let githubIcon = document.createElement('div');
			githubIcon.innerHTML = `
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: #333;">
					<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
				</svg>
			`;
			githubLinkRow.appendChild(githubIcon);

			// GitHub link with enhanced styling
			let githubRepoURL = document.createElement('a');
			githubRepoURL.href = 'https://github.com/Axiaaa/ft_transcendance';
			githubRepoURL.textContent = 'ft_transcendance on GitHub';
			githubRepoURL.target = '_blank';
			githubRepoURL.style.color = '#0078d7';
			githubRepoURL.style.textDecoration = 'none';
			githubRepoURL.style.fontWeight = 'bold';
			githubRepoURL.style.fontSize = '12px';
			githubRepoURL.style.marginLeft = '10px';
			githubRepoURL.style.padding = '5px 10px';
			githubRepoURL.style.border = '1px solid #d8e6f2';
			githubRepoURL.style.borderRadius = '3px';
			githubRepoURL.style.backgroundImage = 'linear-gradient(to bottom, #f0f7ff, #d8e6f2)';
			githubRepoURL.style.boxShadow = '0 1px 1px rgba(0, 0, 0, 0.1)';

			// Hover effect
			githubRepoURL.onmouseover = () => {
				githubRepoURL.style.backgroundImage = 'linear-gradient(to bottom, #d8e6f2, #c0d8eb)';
				githubRepoURL.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.2)';
			};
			githubRepoURL.onmouseout = () => {
				githubRepoURL.style.backgroundImage = 'linear-gradient(to bottom, #f0f7ff, #d8e6f2)';
				githubRepoURL.style.boxShadow = '0 1px 1px rgba(0, 0, 0, 0.1)';
			};

			githubLinkRow.appendChild(githubRepoURL);
			githubRepoContainer.appendChild(githubLinkRow);

			// Project information in Windows XP style infobox
			let projectInfo = document.createElement('div');
			projectInfo.style.fontSize = '11px';
			projectInfo.style.backgroundColor = '#f9f9ff';
			projectInfo.style.border = '1px solid #d0d0ee';
			projectInfo.style.borderRadius = '3px';
			projectInfo.style.padding = '8px 10px';
			projectInfo.style.marginTop = '5px';
			projectInfo.innerHTML = `
				<div style="margin-bottom:5px; word-wrap: break-word;"><b>Project Description:</b> Pong game with WinXP style</div>
				<div style="margin-bottom:5px; word-wrap: break-word;"><b>Technologies:</b> TypeScript, Node.js, SQLite, BabylonJS</div>
				<div style="word-wrap: break-word;"><b>Project Status:</b> In active development</div>
			`;
			projectInfo.style.width = 'calc(100% - 22px)';
			projectInfo.style.overflowWrap = 'break-word';
			githubRepoContainer.appendChild(projectInfo);

			// View Stats button (simulated)
			let statsButton = document.createElement('button');
			statsButton.textContent = 'View Project Stats';
			statsButton.style.marginTop = '10px';
			statsButton.style.padding = '3px 8px';
			statsButton.style.fontSize = '10px';
			statsButton.onclick = () => {
				window.open('https://github.com/Axiaaa/ft_transcendance/graphs/contributors', '_blank');
			};
			githubRepoContainer.appendChild(statsButton);

			let githubRepo = createFormatedSpan(sysInfo6);
			githubRepo.style.margin = '0';
			githubRepo.style.maxWidth = 'none';
			githubRepo.appendChild(githubRepoContainer);

			let license = createFormatedSpan(sysInfo7);
			license.textContent = "License information not yet available";
			license.style.color = "#777777"; // Grey color for unavailable information
			license.style.fontStyle = "italic";

			sysInfo1.appendChild(systemName);
			sysInfo2.appendChild(systemVersion);
			sysInfo3.appendChild(creators);
			sysInfo4.appendChild(creationDate);
			sysInfo5.appendChild(lastUpdate);
			sysInfo6.appendChild(githubRepo);
			sysInfo7.appendChild(license);
		}

		let systemUpdatesBox = document.getElementById('settings-app-System Update-setting') as HTMLElement;
		{
			let systemUpdatesContainer = document.createElement('div');
			systemUpdatesBox.appendChild(systemUpdatesContainer);
			systemUpdatesContainer.id = 'system-updates-container';
			systemUpdatesContainer.style.display = 'flex';
			systemUpdatesContainer.style.flexDirection = 'column';
			systemUpdatesContainer.style.alignItems = 'center';

			let updateInfo1 = createInformationElement('Current Version', systemUpdatesContainer);
			let updateInfo2 = createInformationElement('Latest Version Status', systemUpdatesContainer);

			let currentVersion = createFormatedSpan(updateInfo1);
			currentVersion.textContent = "Beta 0.7";
			let systemCategoryButton = document.getElementById('settings-app-System-category') as HTMLElement;
			systemCategoryButton.onclick = () => {
				// Fetch commit count from the GitHub API
				fetch('https://api.github.com/repos/Axiaaa/ft_transcendance/commits?per_page=1')
					.then(response => {
						// Get total commit count from the Link header
						const linkHeader = response.headers.get('Link');
						let totalCommits = 0;
						
						if (linkHeader) {
							const matches = linkHeader.match(/page=(\d+)>; rel="last"/);
							if (matches && matches[1]) {
								totalCommits = parseInt(matches[1], 10);
							}
						}
						
						// If we couldn't get the count, use a fallback
						if (totalCommits === 0) {
							throw new Error('Could not determine commit count');
						}
						
						// Generate version number: major.minor.patch
						const major = Math.floor(totalCommits / 100);
						const minor = Math.floor((totalCommits % 100) / 10);
						const patch = totalCommits % 10;
						
						const versionString = `${major}.${minor}.${patch}`;
						currentVersion.textContent = versionString;
						return versionString;
					})
					.catch(error => {
						console.error('Error calculating version number:', error);
						const fallbackVersion = '0.7.0';
						currentVersion.textContent = fallbackVersion;
						return fallbackVersion;
					});
			};

			let latestVersionStatus = createFormatedSpan(updateInfo2);
			let latestVersionStatusText = "";
			let latestVersionStatusCheckButton = document.createElement('button');
			updateInfo2.appendChild(latestVersionStatusCheckButton);
			latestVersionStatusCheckButton.onclick = () => {
				latestVersionStatusCheckButton.textContent = 'Checking...';
				latestVersionStatusCheckButton.disabled = true;
				setTimeout(() => latestVersionStatusCheckButton.disabled = false, 3000);
				latestVersionStatusCheckButton.textContent = 'Check for Updates';
			};
			latestVersionStatusCheckButton.textContent = 'Check for Updates';
			latestVersionStatusCheckButton.style.padding = '5px 10px';
			latestVersionStatusCheckButton.style.margin = '10px';
			latestVersionStatusCheckButton.style.marginTop = '0';
			latestVersionStatusCheckButton.style.marginBottom = '0';

			updateInfo1.appendChild(currentVersion);
			updateInfo2.appendChild(latestVersionStatus);
		}

		let systemRestoreBox = document.getElementById('settings-app-System Restore-setting') as HTMLElement;
		{
			let systemRestoreContainer = document.createElement('div');
			systemRestoreBox.appendChild(systemRestoreContainer);
			systemRestoreContainer.id = 'system-restore-container';
			systemRestoreContainer.style.display = 'flex';
			systemRestoreContainer.style.flexDirection = 'column';
			systemRestoreContainer.style.alignItems = 'center';

			let restoreInfo1 = createInformationElement('Restore System', systemRestoreContainer);

			let restoreWarning = document.createElement('div');
			restoreInfo1.appendChild(restoreWarning);
			restoreWarning.style.margin = '10px 0';

			let resetExplanation = document.createElement('p');
			restoreWarning.appendChild(resetExplanation);
			resetExplanation.textContent = 'Restoring the system will reset your personalization settings, including your custom avatar and wallpaper images.';
			resetExplanation.style.color = '#666';
			resetExplanation.style.fontSize = '11px';
			resetExplanation.style.margin = '5px 0';

			let disclaimerBox = document.createElement('div');
			restoreWarning.appendChild(disclaimerBox);
			disclaimerBox.style.backgroundColor = '#FFFFC1';
			disclaimerBox.style.border = '1px solid #DEDB87';
			disclaimerBox.style.padding = '8px 10px';
			disclaimerBox.style.borderRadius = '3px';
			disclaimerBox.style.marginTop = '5px';

			let warningIcon = document.createElement('span');
			disclaimerBox.appendChild(warningIcon);
			warningIcon.innerHTML = '⚠️ ';
			warningIcon.style.fontWeight = 'bold';

			let disclaimer = document.createElement('span');
			disclaimerBox.appendChild(disclaimer);
			disclaimer.textContent = 'WARNING: Your custom images will be permanently deleted and cannot be recovered.';
			disclaimer.style.color = '#8B0000';
			disclaimer.style.fontSize = '10px';
			disclaimer.style.fontWeight = 'bold';

			let restoreSystemButton = document.createElement('button');
			restoreSystemButton.id = 'restore-system-button';
			restoreInfo1.appendChild(restoreSystemButton);
			restoreSystemButton.textContent = 'Restore System';
			restoreSystemButton.style.padding = '5px 10px';
			restoreSystemButton.style.margin = '10px';
			restoreSystemButton.style.marginTop = '0';
			restoreSystemButton.style.marginBottom = '0';
			restoreSystemButton.onclick = () => {
				restoreSystemButton.disabled = true;
				if (confirm('Are you sure you want to restore the system ?')) {
					restoreSystemButton.textContent = 'Restoring...';
					setTimeout(async () => {
						if (await isAvatarUserExists(Number(sessionStorage.getItem('wxp_user_id'))))
							deleteUserAvatar(Number(sessionStorage.getItem('wxp_user_id')));
						if (await isBackgroundUserExists(Number(sessionStorage.getItem('wxp_user_id'))))
							deleteUserBackground(Number(sessionStorage.getItem('wxp_user_id')));
						setFont(0, 0);
						sendNotification('System Restore', 'System restored to default settings', "./img/Utils/restore-icon.png");
					});
					
				}
				setTimeout(() => {
					restoreSystemButton.disabled = false;
					restoreSystemButton.textContent = 'Restore System';
				}, 3000);
			}
		}
	}

	let regionCategory = document.getElementById('settings-app-region-category-container') as HTMLElement;
	{
		let regionSettings = document.getElementById('settings-app-Region-setting') as HTMLElement;
		{
			let regionContainer = document.createElement('div');
			regionSettings.appendChild(regionContainer);
			regionContainer.id = 'region-settings-container';
			regionContainer.style.display = 'flex';
			regionContainer.style.flexDirection = 'column';
			regionContainer.style.alignItems = 'center';

			let regionInfo = createInformationElement('Region Settings', regionContainer);

			let regionSelectContainer = document.createElement('div');
			regionInfo.appendChild(regionSelectContainer);
			regionSelectContainer.style.display = 'flex';
			regionSelectContainer.style.alignItems = 'center';
			regionSelectContainer.style.marginBottom = '10px';

			let regionLabel = document.createElement('span');
			regionSelectContainer.appendChild(regionLabel);
			regionLabel.textContent = 'Current Region:';
			regionLabel.style.fontSize = '12px';
			regionLabel.style.marginRight = '10px';

			let regionSelect = document.createElement('select');
			regionSelectContainer.appendChild(regionSelect);
			regionSelect.disabled = true;
			regionSelect.style.width = '150px';

			const regions = [
				"United States", "European Union", "United Kingdom", 
				"Canada", "Australia", "Japan", "China", "Brazil", 
				"India", "Russia", "South Korea", "France"
			];

			regions.forEach(region => {
				let option = document.createElement('option');
				option.value = region.toLowerCase().replace(/\s+/g, '-');
				option.textContent = region;
				if (region === "European Union") {
					option.selected = true;
				}
				regionSelect.appendChild(option);
			});

			let unavailableMessage = document.createElement('div');
			regionInfo.appendChild(unavailableMessage);
			unavailableMessage.style.backgroundColor = '#FFFFC1';
			unavailableMessage.style.border = '1px solid #DEDB87';
			unavailableMessage.style.padding = '10px';
			unavailableMessage.style.margin = '10px 0';
			unavailableMessage.style.borderRadius = '5px';
			unavailableMessage.style.position = 'relative';

			let warningIcon = document.createElement('div');
			unavailableMessage.appendChild(warningIcon);
			warningIcon.innerHTML = '&#9888;';
			warningIcon.style.position = 'absolute';
			warningIcon.style.left = '10px';
			warningIcon.style.top = '50%';
			warningIcon.style.transform = 'translateY(-50%)';
			warningIcon.style.fontSize = '16px';
			warningIcon.style.color = '#E5AD00';

			let messageText = document.createElement('p');
			unavailableMessage.appendChild(messageText);
			messageText.textContent = 'Region settings are not available in this version. This feature will be implemented in a future update.';
			messageText.style.margin = '0 0 0 25px';
			messageText.style.fontSize = '11px';
			messageText.style.color = '#555';

			let comingSoonLabel = document.createElement('div');
			regionInfo.appendChild(comingSoonLabel);
			comingSoonLabel.textContent = 'Coming Soon in Windows XPong Update';
			comingSoonLabel.style.color = '#003399';
			comingSoonLabel.style.fontSize = '11px';
			comingSoonLabel.style.fontStyle = 'italic';
			comingSoonLabel.style.fontWeight = 'bold';
			comingSoonLabel.style.textAlign = 'center';
			comingSoonLabel.style.marginTop = '5px';
		}
		let languageSettings = document.getElementById('settings-app-Language-setting') as HTMLElement;
		{
			let languageContainer = document.createElement('div');
			languageSettings.appendChild(languageContainer);
			languageContainer.id = 'language-settings-container';
			languageContainer.style.display = 'flex';
			languageContainer.style.flexDirection = 'column';
			languageContainer.style.alignItems = 'center';

			let languageInfo = createInformationElement('Language Settings', languageContainer);

			let languageSelectContainer = document.createElement('div');
			languageInfo.appendChild(languageSelectContainer);
			languageSelectContainer.style.display = 'flex';
			languageSelectContainer.style.alignItems = 'center';
			languageSelectContainer.style.marginBottom = '10px';

			let languageLabel = document.createElement('span');
			languageSelectContainer.appendChild(languageLabel);
			languageLabel.textContent = 'Current Language:';
			languageLabel.style.fontSize = '12px';
			languageLabel.style.marginRight = '10px';

			let languageSelect = document.createElement('select');
			languageSelectContainer.appendChild(languageSelect);
			languageSelect.disabled = true;
			languageSelect.style.width = '150px';

			const languages = [
				"English (US)", "English (UK)", "French", "German", 
				"Spanish", "Italian", "Portuguese", "Dutch", 
				"Russian", "Chinese (Simplified)", "Japanese", "Korean"
			];

			languages.forEach(language => {
				let option = document.createElement('option');
				option.value = language.toLowerCase().replace(/[\s()]+/g, '-');
				option.textContent = language;
				if (language === "English (US)") {
					option.selected = true;
				}
				languageSelect.appendChild(option);
			});

			let unavailableMessage = document.createElement('div');
			languageInfo.appendChild(unavailableMessage);
			unavailableMessage.style.backgroundColor = '#FFFFC1';
			unavailableMessage.style.border = '1px solid #DEDB87';
			unavailableMessage.style.padding = '10px';
			unavailableMessage.style.margin = '10px 0';
			unavailableMessage.style.borderRadius = '5px';
			unavailableMessage.style.position = 'relative';

			let warningIcon = document.createElement('div');
			unavailableMessage.appendChild(warningIcon);
			warningIcon.innerHTML = '&#9888;';
			warningIcon.style.position = 'absolute';
			warningIcon.style.left = '10px';
			warningIcon.style.top = '50%';
			warningIcon.style.transform = 'translateY(-50%)';
			warningIcon.style.fontSize = '16px';
			warningIcon.style.color = '#E5AD00';

			let messageText = document.createElement('p');
			unavailableMessage.appendChild(messageText);
			messageText.textContent = 'Language settings are not available in this version. This feature will be implemented in a future update.';
			messageText.style.margin = '0 0 0 25px';
			messageText.style.fontSize = '11px';
			messageText.style.color = '#555';

			let comingSoonLabel = document.createElement('div');
			languageInfo.appendChild(comingSoonLabel);
			comingSoonLabel.textContent = 'Coming Soon in Windows XPong Update';
			comingSoonLabel.style.color = '#003399';
			comingSoonLabel.style.fontSize = '11px';
			comingSoonLabel.style.fontStyle = 'italic';
			comingSoonLabel.style.fontWeight = 'bold';
			comingSoonLabel.style.textAlign = 'center';
			comingSoonLabel.style.marginTop = '5px';
		}
		let timezoneSettings = document.getElementById('settings-app-Time Zone-setting') as HTMLElement;
		{
			let timezoneContainer = document.createElement('div');
			timezoneSettings.appendChild(timezoneContainer);
			timezoneContainer.id = 'timezone-settings-container';
			timezoneContainer.style.display = 'flex';
			timezoneContainer.style.flexDirection = 'column';
			timezoneContainer.style.alignItems = 'center';

			let timezoneInfo = createInformationElement('Timezone Settings', timezoneContainer);

			let timezoneSelectContainer = document.createElement('div');
			timezoneInfo.appendChild(timezoneSelectContainer);
			timezoneSelectContainer.style.display = 'flex';
			timezoneSelectContainer.style.alignItems = 'center';
			timezoneSelectContainer.style.marginBottom = '10px';

			let timezoneLabel = document.createElement('span');
			timezoneSelectContainer.appendChild(timezoneLabel);
			timezoneLabel.textContent = 'Current Timezone:';
			timezoneLabel.style.fontSize = '12px';
			timezoneLabel.style.marginRight = '10px';

			let timezoneSelect = document.createElement('select');
			timezoneSelectContainer.appendChild(timezoneSelect);
			timezoneSelect.disabled = true;
			timezoneSelect.style.width = '150px';

			const timezones = [
				"(GMT-12:00) International Date Line West",
				"(GMT-11:00) Midway Island, Samoa",
				"(GMT-10:00) Hawaii",
				"(GMT-09:00) Alaska",
				"(GMT-08:00) Pacific Time (US & Canada)",
				"(GMT-07:00) Mountain Time (US & Canada)",
				"(GMT-06:00) Central Time (US & Canada)",
				"(GMT-05:00) Eastern Time (US & Canada)",
				"(GMT-04:00) Atlantic Time (Canada)",
				"(GMT-03:00) Brasilia, Buenos Aires",
				"(GMT-02:00) Mid-Atlantic",
				"(GMT-01:00) Azores, Cape Verde Is.",
				"(GMT+00:00) Greenwich Mean Time, Dublin, London",
				"(GMT+01:00) Amsterdam, Berlin, Paris, Rome",
				"(GMT+02:00) Athens, Cairo, Istanbul",
				"(GMT+03:00) Moscow, St. Petersburg",
				"(GMT+04:00) Abu Dhabi, Dubai",
				"(GMT+05:00) Islamabad, Karachi",
				"(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
				"(GMT+06:00) Dhaka",
				"(GMT+07:00) Bangkok, Hanoi, Jakarta",
				"(GMT+08:00) Beijing, Hong Kong, Singapore",
				"(GMT+09:00) Tokyo, Seoul",
				"(GMT+10:00) Brisbane, Melbourne, Sydney",
				"(GMT+11:00) Magadan, Solomon Is.",
				"(GMT+12:00) Auckland, Wellington"
			];

			timezones.forEach(timezone => {
				let option = document.createElement('option');
				option.value = timezone.toLowerCase().replace(/[\s()&:,\.]+/g, '-');
				option.textContent = timezone;
				if (timezone === "(GMT+01:00) Amsterdam, Berlin, Paris, Rome") {
					option.selected = true;
				}
				timezoneSelect.appendChild(option);
			});

			let currentTimeContainer = document.createElement('div');
			timezoneInfo.appendChild(currentTimeContainer);
			currentTimeContainer.style.display = 'flex';
			currentTimeContainer.style.alignItems = 'center';
			currentTimeContainer.style.marginBottom = '10px';

			let currentTimeLabel = document.createElement('span');
			currentTimeContainer.appendChild(currentTimeLabel);
			currentTimeLabel.textContent = 'Current Time:';
			currentTimeLabel.style.fontSize = '12px';
			currentTimeLabel.style.marginRight = '10px';

			let currentTimeDisplay = document.createElement('span');
			currentTimeContainer.appendChild(currentTimeDisplay);
			currentTimeDisplay.textContent = new Date().toLocaleTimeString();
			currentTimeDisplay.style.fontSize = '12px';
			currentTimeDisplay.style.fontWeight = 'bold';

			setInterval(() => {
				currentTimeDisplay.textContent = new Date().toLocaleTimeString();
			}, 1000);

			let unavailableMessage = document.createElement('div');
			timezoneInfo.appendChild(unavailableMessage);
			unavailableMessage.style.backgroundColor = '#FFFFC1';
			unavailableMessage.style.border = '1px solid #DEDB87';
			unavailableMessage.style.padding = '10px';
			unavailableMessage.style.margin = '10px 0';
			unavailableMessage.style.borderRadius = '5px';
			unavailableMessage.style.position = 'relative';

			let warningIcon = document.createElement('div');
			unavailableMessage.appendChild(warningIcon);
			warningIcon.innerHTML = '&#9888;';
			warningIcon.style.position = 'absolute';
			warningIcon.style.left = '10px';
			warningIcon.style.top = '50%';
			warningIcon.style.transform = 'translateY(-50%)';
			warningIcon.style.fontSize = '16px';
			warningIcon.style.color = '#E5AD00';

			let messageText = document.createElement('p');
			unavailableMessage.appendChild(messageText);
			messageText.textContent = 'Timezone settings are not available in this version. This feature will be implemented in a future update.';
			messageText.style.margin = '0 0 0 25px';
			messageText.style.fontSize = '11px';
			messageText.style.color = '#555';

			let comingSoonLabel = document.createElement('div');
			timezoneInfo.appendChild(comingSoonLabel);
			comingSoonLabel.textContent = 'Coming Soon in Windows XPong Update';
			comingSoonLabel.style.color = '#003399';
			comingSoonLabel.style.fontSize = '11px';
			comingSoonLabel.style.fontStyle = 'italic';
			comingSoonLabel.style.fontWeight = 'bold';
			comingSoonLabel.style.textAlign = 'center';
			comingSoonLabel.style.marginTop = '5px';
		}
	}
	let accessibilityCategory = document.getElementById('settings-app-accessibility-category-container') as HTMLElement;
	{
		let wipMessage = document.getElementById('settings-app-Work in progress-setting');
		if (wipMessage) {
			let accessibilityContainer = document.createElement('div');
			wipMessage.appendChild(accessibilityContainer);
			accessibilityContainer.id = 'accessibility-settings-container';
			accessibilityContainer.style.display = 'flex';
			accessibilityContainer.style.flexDirection = 'column';
			accessibilityContainer.style.alignItems = 'center';
			accessibilityContainer.style.padding = '10px';

			let accessibilityInfo = createInformationElement('Accessibility Settings', accessibilityContainer);

			let featureDescription = document.createElement('p');
			accessibilityInfo.appendChild(featureDescription);
			featureDescription.textContent = 'This section will contain settings for screen readers, high contrast themes, keyboard navigation, and other accessibility features.';
			featureDescription.style.fontSize = '11px';
			featureDescription.style.margin = '5px 0 15px 0';

			let unavailableMessage = document.createElement('div');
			accessibilityInfo.appendChild(unavailableMessage);
			unavailableMessage.style.backgroundColor = '#FFFFC1';
			unavailableMessage.style.border = '1px solid #DEDB87';
			unavailableMessage.style.padding = '10px';
			unavailableMessage.style.margin = '10px 0';
			unavailableMessage.style.borderRadius = '5px';
			unavailableMessage.style.position = 'relative';

			let warningIcon = document.createElement('div');
			unavailableMessage.appendChild(warningIcon);
			warningIcon.innerHTML = '&#9888;';
			warningIcon.style.position = 'absolute';
			warningIcon.style.left = '10px';
			warningIcon.style.top = '50%';
			warningIcon.style.transform = 'translateY(-50%)';
			warningIcon.style.fontSize = '16px';
			warningIcon.style.color = '#E5AD00';

			let messageText = document.createElement('p');
			unavailableMessage.appendChild(messageText);
			messageText.textContent = 'Accessibility settings are not available in this version. These features will be implemented in a future update of Windows XPong.';
			messageText.style.margin = '0 0 0 25px';
			messageText.style.fontSize = '11px';
			messageText.style.color = '#555';

			let comingSoonLabel = document.createElement('div');
			accessibilityInfo.appendChild(comingSoonLabel);
			comingSoonLabel.textContent = 'Coming Soon in Windows XPong Update';
			comingSoonLabel.style.color = '#003399';
			comingSoonLabel.style.fontSize = '11px';
			comingSoonLabel.style.fontStyle = 'italic';
			comingSoonLabel.style.fontWeight = 'bold';
			comingSoonLabel.style.textAlign = 'center';
			comingSoonLabel.style.marginTop = '10px';
			comingSoonLabel.style.padding = '5px';
			comingSoonLabel.style.backgroundImage = 'linear-gradient(to bottom, #E5EFFF, #C4DDFF)';
			comingSoonLabel.style.border = '1px solid #B1CCEF';
			comingSoonLabel.style.borderRadius = '3px';
			comingSoonLabel.style.width = '80%';
		}
	}
	let privacyCategory = document.getElementById('settings-app-privacy-category-container') as HTMLElement;
	{
		let privacyPolicySettings = document.getElementById('settings-app-Privacy Policy-setting') as HTMLElement;
		{
			let privacyContainer = document.createElement('div');
			privacyPolicySettings.appendChild(privacyContainer);
			privacyContainer.id = 'privacy-policy-container';
			privacyContainer.style.display = 'flex';
			privacyContainer.style.flexDirection = 'column';
			privacyContainer.style.alignItems = 'center';
			
			let policyInfo = createInformationElement('Privacy Policy', privacyContainer);
			
			let policyTextArea = document.createElement('div');
			policyInfo.appendChild(policyTextArea);
			policyTextArea.style.backgroundColor = '#FFFFFF';
			policyTextArea.style.border = '1px solid #7A9BC8';
			policyTextArea.style.padding = '10px';
			policyTextArea.style.margin = '5px 0';
			policyTextArea.style.borderRadius = '3px';
			policyTextArea.style.height = '200px';
			policyTextArea.style.overflowY = 'auto';
			policyTextArea.style.fontSize = '11px';
			policyTextArea.style.color = '#333333';
			policyTextArea.style.lineHeight = '1.4';
			
			policyTextArea.innerHTML = `
				<div style="font-weight:bold; color:#003399; margin-bottom:10px; font-size:12px;">Windows XPong Privacy Commitment</div>
				
				<p>At Windows XPong, we are committed to protecting your privacy and ensuring your personal data remains secure. Unlike many online services, our platform operates with minimal data collection and adheres to strict privacy principles.</p>
				
				<p>We believe your gaming experience should be free from unwanted distractions. That's why we <span style="font-weight:bold;">do not employ any targeted advertising</span> on our platform. Your activity within Windows XPong is never tracked for marketing purposes, and we do not build user profiles for advertisers.</p>
				
				<p>Furthermore, we've designed Windows XPong to be accessible with minimal personal information. Most features and functions of our platform are available without requiring you to provide sensitive personal details. We only collect information that is necessary to provide you with our services.</p>
				
				<div style="font-weight:bold; color:#003399; margin:10px 0; font-size:12px;">Your Data Rights (GDPR Compliance)</div>
				
				<p>Windows XPong fully complies with the European General Data Protection Regulation (GDPR). This means you have the right to:</p>
				
				<ul style="margin-left:20px; margin-top:5px;">
					<li>Access your personal data that we may hold</li>
					<li>Request the correction of inaccurate information</li>
					<li>Request the deletion of your personal data</li>
					<li>Object to the processing of your data</li>
					<li>Request the transfer of your data (data portability)</li>
				</ul>
				
				<p>As stated in Article 5 of the GDPR, personal data shall be: "collected for specified, explicit and legitimate purposes and not further processed in a manner that is incompatible with those purposes."</p>
				
				<p>For more information about your rights under the GDPR, you can visit the <a href="https://gdpr-info.eu/" style="color:#0066CC; text-decoration:underline;">official GDPR portal</a> or the <a href="https://ec.europa.eu/info/law/law-topic/data-protection_en" style="color:#0066CC; text-decoration:underline;">European Commission's data protection website</a>.</p>
				
				<div style="font-weight:bold; color:#003399; margin:10px 0; font-size:12px;">Cookies and Local Storage</div>
				
				<p>Windows XPong uses only essential cookies and local storage that are necessary for the platform to function properly. We do not use any tracking cookies for marketing or analytics purposes that could compromise your privacy.</p>
				
				<div style="font-weight:bold; color:#003399; margin:10px 0; font-size:12px;">Contact Information</div>
				
				<p>If you have any questions or concerns about our privacy practices, please don't hesitate to contact our data protection team at <a href="mailto:privacy@windowsxpong.example" style="color:#0066CC; text-decoration:underline;">privacy@windowsxpong.example</a>.</p>
				
				<div style="background-color:#F2F5FB; border:1px solid #D1E0F0; padding:10px; margin-top:10px; border-radius:3px;">
					<p style="margin:0; font-style:italic;">"The protection of natural persons in relation to the processing of personal data is a fundamental right." — Recital 1, GDPR</p>
				</div>
			`;
			
			let gdprInfo = createInformationElement('GDPR Compliance', privacyContainer);
			
			let gdprContent = document.createElement('div');
			gdprInfo.appendChild(gdprContent);
			gdprContent.style.padding = '5px';
			
			let gdprText = document.createElement('p');
			gdprContent.appendChild(gdprText);
			gdprText.innerHTML = `Windows XPong complies with the General Data Protection Regulation (GDPR), which protects EU citizens' data privacy. We implement appropriate technical and organizational measures to ensure data security.`;
			gdprText.style.fontSize = '11px';
			gdprText.style.margin = '5px 0';
			
			let gdprShield = document.createElement('div');
			gdprContent.appendChild(gdprShield);
			gdprShield.style.display = 'flex';
			gdprShield.style.alignItems = 'center';
			gdprShield.style.justifyContent = 'center';
			gdprShield.style.margin = '10px 0';
			
			let shieldIcon = document.createElement('img');
			gdprShield.appendChild(shieldIcon);
			shieldIcon.src = './img/Settings_app/privacy-icon.png';
			shieldIcon.alt = 'GDPR Protection Shield';
			shieldIcon.style.width = '32px';
			shieldIcon.style.height = '32px';
			shieldIcon.style.marginRight = '10px';
			
			let shieldText = document.createElement('span');
			gdprShield.appendChild(shieldText);
			shieldText.textContent = 'Your data is protected under GDPR guidelines';
			shieldText.style.fontSize = '11px';
			shieldText.style.fontWeight = 'bold';
			shieldText.style.color = '#003399';
			
			let gdprLinks = document.createElement('div');
			gdprContent.appendChild(gdprLinks);
			gdprLinks.style.marginTop = '10px';
			
			let linksTitle = document.createElement('span');
			gdprLinks.appendChild(linksTitle);
			linksTitle.textContent = 'Learn more about data protection:';
			linksTitle.style.display = 'block';
			linksTitle.style.fontSize = '11px';
			linksTitle.style.marginBottom = '5px';
			
			const createXpLink = (text: string, url: string) => {
				let link = document.createElement('a');
				gdprLinks.appendChild(link);
				link.href = url;
				link.textContent = text;
				link.target = '_blank';
				link.style.display = 'block';
				link.style.fontSize = '11px';
				link.style.color = '#0066CC';
				link.style.textDecoration = 'none';
				link.style.padding = '2px 0 2px 20px';
				link.style.backgroundImage = 'url("./img/Utils/link-icon.png")';
				link.style.backgroundRepeat = 'no-repeat';
				link.style.backgroundPosition = 'left center';
				link.style.backgroundSize = '16px 16px';
				link.onmouseover = () => {
					link.style.textDecoration = 'underline';
				};
				link.onmouseout = () => {
					link.style.textDecoration = 'none';
				};
				return link;
			};
			
			createXpLink('Official EU GDPR Portal', 'https://gdpr-info.eu/');
			createXpLink('European Commission - Data Protection', 'https://ec.europa.eu/info/law/law-topic/data-protection_en');
			createXpLink('Your GDPR Rights Explained', 'https://gdpr.eu/rights-data-subjects/');
			
			let dataInfo = createInformationElement('Data Collection', privacyContainer);
			
			let dataContent = document.createElement('div');
			dataInfo.appendChild(dataContent);
			dataContent.style.padding = '5px';
			
			const createToggleOption = (optionText: string, defaultChecked: boolean) => {
				let optionContainer = document.createElement('div');
				dataContent.appendChild(optionContainer);
				optionContainer.style.display = 'flex';
				optionContainer.style.alignItems = 'center';
				optionContainer.style.margin = '5px 0';
				
				let checkbox = document.createElement('input');
				optionContainer.appendChild(checkbox);
				checkbox.type = 'checkbox';
				checkbox.checked = defaultChecked;
				checkbox.style.marginRight = '10px';
				
				let label = document.createElement('span');
				optionContainer.appendChild(label);
				label.textContent = optionText;
				label.style.fontSize = '11px';
				
				return optionContainer;
			};
			
			let dataIntro = document.createElement('p');
			dataContent.appendChild(dataIntro);
			dataIntro.textContent = 'Control what data Windows XPong collects. Most features work without any data collection.';
			dataIntro.style.fontSize = '11px';
			dataIntro.style.margin = '5px 0 10px 0';
			
			createToggleOption('Allow essential cookies for basic functionality', true);
			createToggleOption('Participate in anonymous usage statistics', false);
			createToggleOption('Save game preferences locally', true);
			createToggleOption('Remember login session', true);
			
			let dataNote = document.createElement('p');
			dataContent.appendChild(dataNote);
			dataNote.innerHTML = '<strong>Note:</strong> Changes to privacy settings may require a system restart to take effect.';
			dataNote.style.fontSize = '10px';
			dataNote.style.fontStyle = 'italic';
			dataNote.style.margin = '10px 0 5px 0';
			dataNote.style.color = '#666666';
			
			let applyButton = document.createElement('button');
			dataContent.appendChild(applyButton);
			applyButton.textContent = 'Apply Changes';
			applyButton.style.marginTop = '10px';
			applyButton.style.padding = '3px 10px';
			applyButton.onclick = () => {
				const privacySettings = {
					essentialCookies: (document.querySelector('input[type="checkbox"]:nth-of-type(1)') as HTMLInputElement)?.checked ?? true,
					usageStatistics: (document.querySelector('input[type="checkbox"]:nth-of-type(2)') as HTMLInputElement)?.checked ?? false,
					saveGamePreferences: (document.querySelector('input[type="checkbox"]:nth-of-type(3)') as HTMLInputElement)?.checked ?? true,
					rememberLogin: (document.querySelector('input[type="checkbox"]:nth-of-type(4)') as HTMLInputElement)?.checked ?? true
				};
				sendNotification('Privacy Settings', 'Your privacy settings have been updated', "./img/Settings_app/privacy-icon.png");
				
				console.log('Privacy settings to be sent to API:', privacySettings);
			};
		}
	}

});
