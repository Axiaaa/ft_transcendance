document.addEventListener('DOMContentLoaded', () => {

	let appWindow = document.getElementById('settings-app-window') as HTMLElement;
	appWindow.style.minHeight = '400px';
	appWindow.style.minWidth = '600px';
	let appWindowBody = appWindow.children[1] as HTMLElement;


	function createCategory(name: string, img?: string): HTMLDivElement {
		let category = document.createElement('div');
		category.classList.add('category');
		category.id = "settings-app-" + name + '-category';
		category.textContent = name;
		category.style.color = 'white';
		category.style.fontSize = '12px';
		category.style.fontWeight = 'bold';
		category.style.width = '150px';
		category.style.height = 'auto';
		category.style.margin = '10px auto';
		category.style.display = 'grid';
		category.style.gridTemplateColumns = '1fr auto';
		category.style.gridAutoFlow = 'dense';
		category.style.justifyContent = 'space-between';
		category.style.position = 'relative';
		category.style.padding = '0 5px';
		category.style.boxSizing = 'border-box';
		category.style.transition = 'background-color 0.2s ease';
		category.style.left = '5px';
		category.style.top = '5px';
		
		category.addEventListener('mouseenter', () => {
			category.style.backgroundColor = 'rgb(100, 105, 235)';
		});
		category.addEventListener('mouseleave', () => {
			category.style.backgroundColor = 'transparent';
		});
		category.style.textAlign = 'center';
		category.style.lineHeight = '40px';
		let	isOpen = false;
		let icon = document.createElement('img');
		category.appendChild(icon);
		if (img)
			icon.src = img;
		else
			icon.src = './img/Control_Panel_XP.png';
		icon.style.width = '45px';
		icon.style.height = '45px';
		icon.style.marginRight = '5px';
		icon.style.userSelect = 'none';
		icon.style.pointerEvents = 'none';
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
	let forwardButton = createButton('./img/Settings_app/back-icon.png');
	forwardButton.style.transform = 'scaleX(-1)';
	let SearchButton = createButton('./img/Settings_app/search-icon.png');
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
	leftColumn.style.width = '35%';
	leftColumn.style.minWidth = '200px';
	leftColumn.style.maxWidth = '400px';
	leftColumn.style.height = '100%';
	leftColumn.style.float = 'left';
	leftColumn.style.background = 'linear-gradient(to bottom, rgb(117, 142, 219), rgb(109, 124, 218), rgb(104, 108, 213))';
	
	let leftColumnMenus = document.createElement('img');
	leftColumnMenus.id = 'settings-app-left-column-menus';
	leftColumn.appendChild(leftColumnMenus);
	leftColumnMenus.src = './img/xp_controlpanel_left_cmp.png';
	leftColumnMenus.style.width = '90%';
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
	rightColumn.style.width = '65%';
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



	let Appearance = createCategory('Appearance');
	let Personalization = createCategory('Personalization');
	let UserAccount = createCategory('User Account');
	let Network = createCategory('Network');
	let Hardware = createCategory('Hardware');
	let System = createCategory('System');
	let Security = createCategory('Security');
	let DateAndTime = createCategory('Date and Time');
	let Accessibility = createCategory('Accessibility');
	let Speech = createCategory('Speech');
	let Privacy = createCategory('Privacy');
	
	
	appWindow.children[1].appendChild(appContent);
});