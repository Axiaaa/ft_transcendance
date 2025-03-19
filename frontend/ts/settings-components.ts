import { sys } from "../node_modules/typescript/lib/typescript.js";
import { sendNotification } from "./notification.js";


document.addEventListener('DOMContentLoaded', () => {


	let categoryContainer = document.getElementById('settings-app-category-container') as HTMLElement;

	let appearanceCategory = document.getElementById('settings-app-appearance-container') as HTMLElement;
	
	
	// Appearance Settings
	
	//		Wallpaper Settings
	
	{
		let wallpaperSettings = document.getElementById('settings-app-Wallpaper-setting') as HTMLElement;

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

		let fileInput = document.createElement('input');
		rightColumn.appendChild(fileInput);
		fileInput.id = 'file-input';
		fileInput.type = 'file';
		fileInput.accept = 'image/*';
		fileInput.style.display = 'none';

		importButton.onclick = () => fileInput.click();

		fileInput.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				currentWallpaperName.textContent = file.name;
				document.body.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
				sendNotification('Wallpaper Changed', `Wallpaper changed to ${file.name}`, "./img/Settings_app/picture-icon.png");
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
		resolutionText.style.padding = '5px';


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
	exampleText.style.left = 'calc(100% - 170px)';
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
	minSize.textContent = '-5px';
	let range = document.createElement('input');
	fontSizeSlider.appendChild(range);
	range.id = 'range26';
	range.type = 'range';
	range.min = '-5';
	range.max = '5';
	range.value = '0';
	range.addEventListener('input', () => {
		const newSize = 15 + parseInt(range.value);
		exampleText.style.fontSize = `${newSize}px`;
		exampleText.textContent = `${newSize}px`;
	});
	let maxSize = document.createElement('label');
	fontSizeSlider.appendChild(maxSize);
	maxSize.htmlFor = 'range27';
	maxSize.textContent = '+5px';



	let applyButton = document.createElement('button');
	fontSizeInfo.appendChild(applyButton);
	applyButton.id = 'font-size-apply-button';
	applyButton.textContent = 'Apply';
	applyButton.style.padding = '5px 5px';
	applyButton.style.marginLeft = '10px';
	applyButton.style.left = 'calc(100% - 160px)';
	applyButton.style.position = 'absolute';
	applyButton.style.top = '35px';
	let previousSize = 0;
	applyButton.addEventListener('click', () => {
		if (applyButton.classList[0] && applyButton.classList[0].includes('font-size-applied-'))
		{
			previousSize = parseInt(applyButton.classList[0].replace('font-size-applied-', ''));
			applyButton.classList.remove('font-size-applied-' + previousSize);
		}
		applyButton.classList.add('font-size-applied-' + range.value);
		const allTextElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, div, button, input, label, a');
		allTextElements.forEach(element => {
			const currentSize = window.getComputedStyle(element).fontSize;
			const sizeNumber = parseInt(currentSize);
			if (!isNaN(sizeNumber)) {
				const newSize = sizeNumber + parseInt(range.value) - previousSize;
				(element as HTMLElement).style.fontSize = `${newSize}px`;
				
			}
		});
		if (parseInt(range.value) > 0)
			sendNotification('Font Size Changed', `Font size increased by ${range.value}px`, "./img/Utils/font-icon.png");
		else if (parseInt(range.value) < 0)
			sendNotification('Font Size Changed', `Font size decreased by ${range.value}px`, "./img/Utils/font-icon.png");
		else
			sendNotification('Font Size Changed', `Font size reset`, "./img/Utils/font-icon.png");
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

		let fileInput = document.createElement('input');
		rightColumn.appendChild(fileInput);
		fileInput.id = 'avatar-file-input';
		fileInput.type = 'file';
		fileInput.accept = 'image/*';
		fileInput.style.display = 'none';

		importButton.onclick = () => fileInput.click();

		fileInput.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				currentAvatarName.textContent = file.name;
				currentAvatarPreview.src = URL.createObjectURL(file);
				sendNotification('Avatar Changed', `Avatar changed to ${file.name}`, "./img/Utils/profile-icon.png");
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
		resolutionText.style.padding = '5px';

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

		applyButton.onclick = () => {
			if (!nameInput.value.match(/^[A-Za-z0-9_]+$/)) {
				sendNotification('Error', 'Invalid username format', "./img/Utils/error-icon.png");
				return;
			}
			if (confirm(`Are you sure you want to change your username to "${nameInput.value}"?`)) {
				sendNotification('Username Changed', `Username changed to ${nameInput.value}`, "./img/Utils/profile-icon.png");
				nameInput.value = '';
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

		applyButton.onclick = () => {
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
		Span.style.overflow = 'hidden';
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
			creators.textContent = "Jcuzin; Lcamerly; Mcourbon; Aammirat; Yallo";
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
			let githubRepoURL = document.createElement('a');
			githubRepoURL.href = 'https://github.com/Axiaaa/ft_transcendance';
			githubRepoURL.textContent = 'Open on Github';
			githubRepoURL.target = '_blank'; // Add this line to open in new tab
			githubRepoURL.style.color = '#007bff';
			githubRepoURL.style.textDecoration = 'none';
			let githubRepo = createFormatedSpan(sysInfo6);
			githubRepo.appendChild(githubRepoURL);

			let license = createFormatedSpan(sysInfo7);
			let licensePromise = fetch('https://api.github.com/repos/Axiaaa/ft_transcendance/license')
			.then(response => response.json())
			.then(data => {
				return data.license?.name || 'License information not available';
			})
			.catch(error => {
				console.error('Error fetching license:', error);
				return 'License information not available';
			});
			licensePromise.then(licenseText => license.textContent = licenseText);

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
			let currentVersionText = fetch('https://api.github.com/repos/Axiaaa/ft_transcendance/releases/latest')
				.then(response => response.json())
				.then(data => {
					let version = data.tag_name;
					if (version.startsWith('0.')) {
						version = 'Beta ' + version;
					}
					currentVersion.textContent = version;
					return version;
				})
				.catch(error => {
					console.error('Error fetching current version:', error);
					let fallbackVersion = 'Beta 0.7';
					currentVersion.textContent = fallbackVersion;
					return fallbackVersion;
				});


			let latestVersionStatus = createFormatedSpan(updateInfo2);
			let latestVersionStatusText = "";
			let latestVersionStatusCheckButton = document.createElement('button');
			updateInfo2.appendChild(latestVersionStatusCheckButton);
			latestVersionStatusCheckButton.onclick = () => {
				latestVersionStatusCheckButton.textContent = 'Checking...';
				latestVersionStatusCheckButton.disabled = true;
				fetch('https://api.github.com/repos/Axiaaa/ft_transcendance/releases/latest')
				.then(response => response.json())
				.then(data => {
					latestVersionStatusText = data.tag_name;
					console.log('Latest version:', latestVersionStatusText);
					latestVersionStatus.textContent = latestVersionStatusText;
					if (!latestVersionStatusText || latestVersionStatusText.includes('API rate limit exceeded')) {
						sendNotification('Error', 'Failed to check version', "./img/Utils/error-icon.png");
					} else if (latestVersionStatusText === currentVersion.textContent) {
						sendNotification('System Update', 'System is up to date', "./img/Utils/update-icon.png");
					} else {
						sendNotification('System Update', 'New version available', "./img/Utils/update-icon.png");
					}
					latestVersionStatusCheckButton.textContent = 'Check for Updates';
				})
				.catch(error => {
					console.error('Error fetching latest version:', error);
					latestVersionStatusText = "Beta 0.7"; // Fallback version if fetch fails
					latestVersionStatus.textContent = latestVersionStatusText;
					sendNotification('Error', 'Failed to check for updates', "./img/Utils/error-icon.png");
					latestVersionStatusCheckButton.textContent = 'Check for Updates';
				});
				setTimeout(() => latestVersionStatusCheckButton.disabled = false, 3000);
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

			let restoreSystemButton = document.createElement('button');
			restoreInfo1.appendChild(restoreSystemButton);
			restoreSystemButton.textContent = 'Restore System';
			restoreSystemButton.style.padding = '5px 10px';
			restoreSystemButton.style.margin = '10px';
			restoreSystemButton.style.marginTop = '0';
			restoreSystemButton.style.marginBottom = '0';
			restoreSystemButton.onclick = () => {
				restoreSystemButton.disabled = true;
				restoreSystemButton.textContent = 'Restoring...';
				if (confirm('Are you sure you want to restore the system ?')) {
					sendNotification('System Restore', 'System restored to default settings', "./img/Utils/restore-icon.png");
				}
				setTimeout(() => {
					restoreSystemButton.disabled = false;
					restoreSystemButton.textContent = 'Restore System';
				}, 3000);
			}
		}
	}
});
