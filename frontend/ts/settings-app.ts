import { openAppWindow } from "./app-icon.js";

document.addEventListener('DOMContentLoaded', () => {

	let appWindow = document.getElementById('settings-app-window') as HTMLElement;
	appWindow.style.minHeight = '400px';
	appWindow.style.minWidth = '600px';
	let appWindowBody = appWindow.children[1] as HTMLElement;


	function createCategory(name: string, img: string, settingpage?: HTMLDivElement): HTMLDivElement {
		let category = document.createElement('div');
		category.classList.add('category');
		category.id = "settings-app-" + name + '-category';
		let categoryText = document.createElement('h5');
		category.appendChild(categoryText);
		categoryText.textContent = name;
		categoryText.style.color = 'white';
		categoryText.style.fontSize = '13px';
		categoryText.style.lineHeight = 'normal';
		categoryText.style.fontWeight = 'bold';
		categoryText.style.textAlign = 'left';
		categoryText.style.width = 'calc(100% - 50px)';
		categoryText.style.height = 'fit-content';
		categoryText.style.margin = '0px';
		categoryText.style.left = '60px';
		categoryText.style.top = 'calc(50% - 10px)';
		categoryText.style.position = 'absolute';
		categoryText.style.padding = '0 2px';
		categoryText.style.boxSizing = 'border-box';
		categoryText.style.textShadow = '1px 1px 1px rgba(0, 0, 0, 0.5)';
		// categoryText.style.backgroundColor = 'green';
		category.style.width = '150px';
		category.style.height = '60px';
		category.style.margin = '10px auto';
		category.style.position = 'relative';
		category.style.padding = '0 10px';
		category.style.boxSizing = 'border-box';
		category.style.transition = 'background-color 0.2s ease';
		category.style.left = '5px';
		category.style.top = '5px';
		category.style.cursor = 'pointer';
		category.style.borderRadius = '2px';
		
		category.addEventListener('mouseenter', () => {
			category.style.backgroundColor = 'rgb(75, 78, 178)';
		});
		category.addEventListener('mouseleave', () => {
			category.style.backgroundColor = 'transparent';
		});
		category.addEventListener('click', () => {
			categoryContainer.style.display = 'none';
			rightColumnTitle.style.display = 'none';
			if (settingpage)
				settingpage.style.display = 'block';
		});

		let	isOpen = false;
		let icon = document.createElement('img');
		category.appendChild(icon);
		if (img)
			icon.src = img;
		else
			icon.src = './img/Control_Panel_XP.png';
		icon.style.width = '45px';
		icon.style.height = '45px';
		icon.style.position = 'absolute';
		icon.style.top = '5px';
		icon.style.left = '5px';
		icon.style.padding = '0 5px';
		icon.style.marginRight = '5px';
		icon.style.userSelect = 'none';
		icon.style.pointerEvents = 'none';
		icon.style.filter = 'drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5))';
		category.insertBefore(icon, category.firstChild);
		categoryContainer.appendChild(category);
		return category;
	}


	let appContent = document.createElement('div');
	appContent.id = 'settings-app-content';
	appContent.style.width = '100%';
	appContent.style.height = '100%';
	appContent.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
	appContent.style.display = 'auto';

	let appHeader = document.createElement('div');
	appHeader.id = 'setting-app-header';
	appContent.appendChild(appHeader);
	appHeader.style.width = '100%';
	appHeader.style.height = '50px';
	appHeader.style.background = 'rgb(255, 244, 209)';
	appHeader.style.display = 'block';
	appHeader.style.position = 'relative';
	appHeader.style.boxSizing = 'border-box';
	appHeader.style.top = '0px';
	appHeader.style.left = '0px';
	appHeader.style.overflow = 'hidden';

	let OptionContainer = document.createElement('div');
	appHeader.appendChild(OptionContainer);
	OptionContainer.id = 'settings-app-header-options';
	OptionContainer.style.width = '100%';
	OptionContainer.style.height = '35%';
	OptionContainer.style.background = 'rgb(255, 244, 209)';
	OptionContainer.style.display = 'block';
	OptionContainer.style.position = 'relative';
	OptionContainer.style.top = '0px';
	OptionContainer.style.left = '0px';
	OptionContainer.style.overflow = 'hidden';
	OptionContainer.style.display = 'flex';
	OptionContainer.style.justifyContent = 'left';
	// OptionContainer.style.backgroundColor = 'rgba(255, 0, 0, 0.38)';

	function createAppHeaderOptions(name: string)
	{
		let option = document.createElement('div');
		option.classList.add('app-header-option');
		OptionContainer.appendChild(option);
		option.id = 'settings-app-' + name + '-option';
		option.textContent = name;
		option.style.color = 'black';
		option.style.fontSize = '12px';
		option.style.width = 'auto';
		option.style.height = 'fit-content';
		option.style.top = '-1px';
		option.style.left = '5px';
		option.style.margin = '2px 0px';
		option.style.display = 'flex';
		option.style.justifyContent = 'left';
		option.style.alignItems = 'center';
		option.style.flexDirection = 'column';
		option.style.position = 'relative';
		option.style.padding = '0 5px';
		option.style.textShadow = '0.5px 0.5px 0.5px rgba(0, 0, 0, 0.1)';
		option.addEventListener('mouseenter', () => {
			option.style.backgroundColor = 'rgb(193, 191, 183)';
			// option.style.color = 'white';
		});
		option.addEventListener('mouseleave', () => {
			option.style.backgroundColor = 'transparent';
			// option.style.color = 'black';
		});
	}
	createAppHeaderOptions('File');
	createAppHeaderOptions('Edit');
	createAppHeaderOptions('View');
	createAppHeaderOptions('Favorites');
	createAppHeaderOptions('Tools');
	createAppHeaderOptions('Help');
	
	let ButtonContainer = document.createElement('div');
	appHeader.appendChild(ButtonContainer);
	ButtonContainer.style.width = '100%';
	ButtonContainer.style.height = '65%';
	ButtonContainer.style.display = 'flex';
	ButtonContainer.style.justifyContent = 'left';
	ButtonContainer.style.position = 'absolute';
	ButtonContainer.style.top = '35%';
	ButtonContainer.style.left = 'auto';
	ButtonContainer.style.overflow = 'hidden';
	ButtonContainer.style.flexDirection = 'initial';
	ButtonContainer.style.padding = '0 2px';
	ButtonContainer.style.boxSizing = 'border-box';
	// ButtonContainer.style.backgroundColor = 'rgba(55, 255, 0, 0.27)';
	function createButton(img: string): HTMLImageElement
	{
		let Button = document.createElement('img');
		ButtonContainer.appendChild(Button);
		Button.src = img;
		Button.style.width = '20px';
		Button.style.height = '20px';
		Button.style.position = 'relative';
		Button.style.top = `calc(50% - 8px)`;
		Button.style.left = '0px';
		Button.style.cursor = 'pointer';
		Button.style.overflow = 'hidden';
		Button.style.padding = '0 10px';
		Button.style.filter = 'drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.3))';
		Button.draggable = false;

		Button.addEventListener('mouseenter', () => {
			Button.style.filter = 'brightness(1.2)';
		});
		Button.addEventListener('mouseleave', () => {
			Button.style.filter = 'brightness(1)';
		});
		return Button;
	}

	let backButton = createButton('./img/Settings_app/back-icon.png');
	backButton.id = 'settings-app-back-button';
	backButton.addEventListener('click', () => {
		categoryContainer.style.display = 'grid';
		rightColumnTitle.style.display = 'block';
		const appearanceContainer = document.getElementById('settings-app-appearance-container');
		if (appearanceContainer)
			appearanceContainer.style.display = 'none';
		const UserAccountContainer = document.getElementById('settings-app-user-account-container');
		if (UserAccountContainer)
			UserAccountContainer.style.display = 'none';
		const SystemContainer = document.getElementById('settings-app-system-container');
		if (SystemContainer)
			SystemContainer.style.display = 'none';
		const LanguageRegionContainer = document.getElementById('settings-app-language-region-container');
		if (LanguageRegionContainer)
			LanguageRegionContainer.style.display = 'none';
		const AccessibilityContainer = document.getElementById('settings-app-accessibility-container');
		if (AccessibilityContainer)
			AccessibilityContainer.style.display = 'none';
		const PrivacyContainer = document.getElementById('settings-app-privacy-container');
		if (PrivacyContainer)
			PrivacyContainer.style.display = 'none';
	});


	let forwardButton = createButton('./img/Settings_app/back-icon.png');
	forwardButton.style.transform = 'scaleX(-1)';
	forwardButton.style.filter = 'grayscale(100%)';
	forwardButton.style.pointerEvents = 'none';
	let SearchButton = createButton('./img/Settings_app/search-icon.png');
	SearchButton.id = 'settings-app-search-button';
	let Searchbar = document.createElement('input');
	ButtonContainer.appendChild(Searchbar);
	Searchbar.type = 'text';
	Searchbar.placeholder = 'Search a setting';
	Searchbar.style.width = 'calc(100% - 170px)';
	Searchbar.style.height = '20px';
	Searchbar.style.position = 'relative';
	Searchbar.style.top = `calc(50% - 10px)`;
	Searchbar.style.left = '20x';
	Searchbar.style.padding = '0 10px';
	Searchbar.style.border = 'none';
	Searchbar.style.borderRadius = '5px';
	Searchbar.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
	Searchbar.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
	Searchbar.style.outline = 'none';
	Searchbar.style.fontFamily = 'Arial';
	Searchbar.style.fontSize = '12px';
	Searchbar.style.color = 'black';
	Searchbar.style.textAlign = 'left';
	SearchButton.addEventListener('click', () => {
		Searchbar.focus();
	});

	let GoSearchButton = createButton('./img/Settings_app/go-button.png');
	GoSearchButton.id = 'settings-app-search-button-go';
	GoSearchButton.style.width = '20px';
	GoSearchButton.style.height = '20px';
	GoSearchButton.style.position = 'relative';
	GoSearchButton.style.top = `calc(50% - 11px)`;
	GoSearchButton.style.left = '0px';
	GoSearchButton.style.padding = '0 5px';
	GoSearchButton.style.filter = 'drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.3))';
	GoSearchButton.style.cursor = 'pointer';
	GoSearchButton.style.overflow = 'hidden';
	GoSearchButton.draggable = false;


	let	leftColumn = document.createElement('div');
	leftColumn.id = 'settings-app-left-column';
	appContent.appendChild(leftColumn);
	leftColumn.style.position = 'relative';
	leftColumn.style.top = '0px';
	leftColumn.style.width = '220px';
	leftColumn.style.minWidth = '220px';
	leftColumn.style.maxWidth = '220px';
	leftColumn.style.height = '100%';
	leftColumn.style.float = 'left';
	leftColumn.style.background = 'linear-gradient(to bottom, rgb(117, 142, 219), rgb(109, 124, 218), rgb(104, 108, 213))';
	
	let leftColumnMenus = document.createElement('img');
	leftColumnMenus.id = 'settings-app-left-column-menus';
	leftColumn.appendChild(leftColumnMenus);
	leftColumnMenus.src = './img/Settings_app/xp_controlpanel_left_cmp.png';
	leftColumnMenus.style.width = '200px';
	leftColumnMenus.style.overflow = 'hidden';
	leftColumnMenus.style.height = 'auto';
	leftColumnMenus.style.margin = '10px auto';
	leftColumnMenus.style.display = 'block';
	leftColumnMenus.style.position = 'relative';
	leftColumnMenus.style.padding = '0 10px';
	leftColumnMenus.style.userSelect = 'none';
	leftColumnMenus.style.pointerEvents = 'none';

	let rightColumn = document.createElement('div');
	rightColumn.id = 'settings-app-right-column';
	appContent.appendChild(rightColumn);
	rightColumn.style.width = 'calc(100% - 225px)';
	rightColumn.style.height = 'calc(100% - 80px)';
	rightColumn.style.position = 'absolute';
	rightColumn.style.boxSizing = 'border-box';
	rightColumn.style.overflow = 'hidden';
	rightColumn.style.bottom = '3px';
	rightColumn.style.right = '3px';
	rightColumn.style.backgroundColor = 'rgba(88, 93, 223, 0.78)';
	
	let categoryContainer = document.createElement('div');
	categoryContainer.id = 'settings-app-category-container';
	rightColumn.appendChild(categoryContainer);
	categoryContainer.style.width = '100%';
	categoryContainer.style.height = 'calc(100% - 80px)';
	categoryContainer.style.display = 'grid';
	categoryContainer.style.gridTemplateColumns = 'repeat(auto-fill, 150px)';
	categoryContainer.style.gridAutoFlow = 'dense';
	categoryContainer.style.justifyContent = 'space-around';
	categoryContainer.style.position = 'absolute';
	categoryContainer.style.padding = '5px 5px';
	categoryContainer.style.boxSizing = 'border-box';
	categoryContainer.style.bottom = '0px';
	categoryContainer.style.left = '0px';
	categoryContainer.style.overflowX = 'scroll';
	categoryContainer.style.overflowY = 'scroll';
	// categoryContainer.style.backgroundColor = 'rgba(88, 93, 223, 0.78)';

	let categoryContainerBackground = document.createElement('img');
	categoryContainerBackground.id = 'settings-app-category-container-background';
	categoryContainer.appendChild(categoryContainerBackground);
	categoryContainerBackground.src = './img/Settings_app/Control_Panel_XP.png';
	categoryContainerBackground.style.width = '90%';
	categoryContainerBackground.style.height = 'auto';
	categoryContainerBackground.style.opacity = '0.1';
	categoryContainerBackground.style.position = 'absolute';
	categoryContainerBackground.style.top = '0px';
	categoryContainerBackground.style.left = '0px';
	categoryContainerBackground.style.padding = '0 10px';
	categoryContainerBackground.style.boxSizing = 'border-box';
	categoryContainerBackground.style.userSelect = 'none';
	categoryContainerBackground.style.overflow = 'hidden';
	categoryContainerBackground.draggable = false;

	let	rightColumnTitle = document.createElement('div');
	rightColumnTitle.id = 'settings-app-right-column-title';
	rightColumn.appendChild(rightColumnTitle);
	rightColumnTitle.textContent = 'Pick a category';
	rightColumnTitle.style.color = 'rgba(232, 229, 255, 0.9)';
	rightColumnTitle.style.fontSize = '32px';
	rightColumnTitle.style.fontWeight = 'bold';
	rightColumnTitle.style.width = '400px';
	rightColumnTitle.style.height = '80px';
	rightColumnTitle.style.margin = '10px 10px';
	rightColumnTitle.style.textAlign = 'left';
	rightColumnTitle.style.position = 'relative';
	rightColumnTitle.style.padding = '0 10px';
	rightColumnTitle.style.boxSizing = 'border-box';
	rightColumnTitle.style.top = '12px';
	rightColumnTitle.style.left = '15px';

	
	function createSettingsContainer(name: string): HTMLDivElement {
		let settingsContainer = document.createElement('div');
		settingsContainer.id = 'settings-app-' + name + '-container';
		rightColumn.appendChild(settingsContainer);
		settingsContainer.style.width = '100%';
		settingsContainer.style.height = '100%';
		settingsContainer.style.position = 'absolute';
		settingsContainer.style.top = '0px';
		settingsContainer.style.left = '0px';
		settingsContainer.style.display = 'none';
		settingsContainer.style.backgroundColor = 'rgba(255, 3, 3, 0.07)';
		let SettingTitle = document.createElement('h3');
		settingsContainer.appendChild(SettingTitle);
		SettingTitle.textContent = name.charAt(0).toUpperCase() + name.slice(1);
		SettingTitle.style.color = 'white';
		SettingTitle.style.fontSize = '24px';
		SettingTitle.style.fontWeight = 'bold';
		SettingTitle.style.width = 'calc(100% - 20px)';
		SettingTitle.style.height = '50px';
		SettingTitle.style.margin = '10px 10px';
		SettingTitle.style.textAlign = 'left';
		SettingTitle.style.position = 'relative';
		SettingTitle.style.padding = '0 10px';
		SettingTitle.style.boxSizing = 'border-box';
		SettingTitle.style.top = '0px';
		SettingTitle.style.left = '0px';
		SettingTitle.style.overflow = 'hidden';
		// SettingTitle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
		let rowsContainer = document.createElement('div');
		rowsContainer.id = 'settings-app-' + name + '-rows-container';
		settingsContainer.appendChild(rowsContainer);
		rowsContainer.style.width = 'calc(100% - 20px)';
		rowsContainer.style.height = 'calc(100% - 70px)';
		rowsContainer.style.position = 'relative';
		rowsContainer.style.top = '0px';
		rowsContainer.style.left = '0px';
		rowsContainer.style.display = 'row';
		rowsContainer.style.justifyContent = 'space-around';
		rowsContainer.style.padding = '5px 5px';
		rowsContainer.style.boxSizing = 'border-box';
		rowsContainer.style.bottom = '0px';
		rowsContainer.style.left = '0px';
		rowsContainer.style.overflowX = 'scroll';
		rowsContainer.style.overflowY = 'scroll';
		return settingsContainer;
	}

	function createSetting(Name: string, Container: HTMLElement, Content?: HTMLElement): HTMLElement
	{
		let Setting = document.createElement('div');
		Setting.classList.add('setting');
		Setting.id = 'settings-app-' + Name + '-setting';
		let rowsContainer = Container.children[1];
		rowsContainer.appendChild(Setting);
		Setting.style.width = 'calc(100% - 5px)';
		Setting.style.height = 'auto';
		Setting.style.margin = '10px 10px';
		Setting.style.position = 'relative';
		Setting.style.padding = '0 10px';
		Setting.style.boxSizing = 'border-box';
		Setting.style.top = '0px';
		Setting.style.left = '0px';
		Setting.style.overflow = 'hidden';
		Setting.style.borderRadius = '5px';
		Setting.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
		Setting.style.boxShadow = '1px 1px 1px black';
		let SettingText = document.createElement('h4');
		Setting.appendChild(SettingText);
		SettingText.textContent = Name;
		SettingText.style.color = 'black';
		SettingText.style.fontSize = '14px';
		SettingText.style.fontWeight = 'bold';
		SettingText.style.width = 'fit-content';
		SettingText.style.height = '30px';
		SettingText.style.margin = '0px';
		SettingText.style.textAlign = 'left';
		SettingText.style.position = 'relative';
		SettingText.style.padding = '5px 10px';
		SettingText.style.boxSizing = 'border-box';
		SettingText.style.top = '0px';
		SettingText.style.left = '0px';
		SettingText.style.overflow = 'hidden';
		SettingText.style.borderBottomLeftRadius = '5px';
		SettingText.style.borderBottomRightRadius = '5px';
		SettingText.style.boxShadow = '1px 1px 1px black';
		SettingText.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
		if (Content)
		{
			Setting.appendChild(Content);
			Content.style.width = 'calc(100% - 20px)';
			Content.style.height = 'calc(100% - 50px)';
			Content.style.margin = '0px';
			Content.style.position = 'relative';
			Content.style.padding = '0 10px';
			Content.style.boxSizing = 'border-box';
			Content.style.top = '0px';
			Content.style.left = '0px';
			Content.style.overflow = 'hidden';
		}
		return Setting;
	}
	
	let appearanceContainer = createSettingsContainer('appearance');
	
	let appearanceSetting1 = createSetting('Wallpaper', appearanceContainer);
	let appearanceSetting2 = createSetting('Font Size', appearanceContainer);

	let UserAccountContainer = createSettingsContainer('user-account');
	let UserAccountSetting1 = createSetting('Avatar', UserAccountContainer);
	let UserAccountSetting2 = createSetting('Account Name', UserAccountContainer);
	let UserAccountSetting3 = createSetting('Password', UserAccountContainer);

	let SystemContainer = createSettingsContainer('system');
	let SystemSetting1 = createSetting('System Information', SystemContainer);
	let SystemSetting2 = createSetting('System Update', SystemContainer);
	let SystemSetting3 = createSetting('System Restore', SystemContainer);
	
	let regionsContainer = createSettingsContainer('language-region');
	let regionsSetting1 = createSetting('Region', regionsContainer);
	let regionsSetting2 = createSetting('Language', regionsContainer);
	let regionsSetting3 = createSetting('Time Zone', regionsContainer);

	let AccessibilityContainer = createSettingsContainer('accessibility');
	let AccessibilitySetting1 = createSetting('Work in progress', AccessibilityContainer);

	let PrivacyContainer = createSettingsContainer('privacy');
	let PrivacySetting1 = createSetting('Privacy Policy', PrivacyContainer);

	let Appearance = createCategory('Appearance and Theme', './img/Settings_app/appearance-icon.png', appearanceContainer);
	let UserAccount = createCategory('User Account', './img/Settings_app/user-account.png', UserAccountContainer);
	let System = createCategory('System', './img/Settings_app/system-icon.png', SystemContainer);
	let LanguageRegion = createCategory('Language & Region', './img/Settings_app/regions-language.png', regionsContainer);
	let Accessibility = createCategory('Accessibility', './img/Settings_app/accessibility-icon.png', AccessibilityContainer);
	let Privacy = createCategory('Privacy', './img/Settings_app/privacy-icon.png', PrivacyContainer);



	appWindow.children[1].appendChild(appContent);

	{
		let	controlPanelIcon = document.getElementById('start-menu-settings') as HTMLElement;
		controlPanelIcon.addEventListener('click', () => {
			openAppWindow('', 'settings-app-window');
		});
	}
	{
		let resetSettingsIcon = document.getElementById('start-menu-reset-settings') as HTMLElement;
		resetSettingsIcon.addEventListener('click', () => {
			openAppWindow('', 'settings-app-window');
			let systemSetting = document.getElementById('settings-app-System-category') as HTMLElement;
			systemSetting.click();
			let systemRestore = document.getElementById('restore-system-button') as HTMLElement;
			systemRestore.click();
		});
	}
	{
		let helpIcon = document.getElementById('start-menu-help') as HTMLElement;
		helpIcon.addEventListener('click', () => {
			openAppWindow('', 'settings-app-window');
			let privacySetting = document.getElementById('settings-app-Privacy-category') as HTMLElement;
			privacySetting.click();
		});
	}
	{
		let searchIcon = document.getElementById('start-menu-search') as HTMLElement;
		searchIcon.addEventListener('click', () => {
			openAppWindow('', 'settings-app-window');
			let searchButton = document.getElementById('settings-app-search-button') as HTMLElement;
			searchButton.click();
		});
	}
});