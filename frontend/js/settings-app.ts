document.addEventListener('DOMContentLoaded', () => {

	let appWindow = document.getElementById('settings-app-window') as HTMLElement;
	let appWindowBody = appWindow.children[1] as HTMLElement;


	function createCategory(name: string): HTMLDivElement {
		let category = document.createElement('div');
		category.classList.add('category');
		category.id = name + '-category';
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
		category.style.padding = '0 10px';
		category.style.boxSizing = 'border-box';
		category.style.transition = 'background-color 0.2s ease';
		category.style.left = '0px';
		category.style.top = '40px';
		
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
		icon.src = './img/Control_Panel_XP.png';
		icon.style.width = '40px';
		icon.style.height = '40px';
		icon.style.marginRight = '5px';
		category.insertBefore(icon, category.firstChild);
		rightColumn.appendChild(category);
		return category;
	}


	appWindowBody.style.height = 'calc(100% - 40px)';
	let appContent = document.createElement('div');
	appContent.style.width = '100%';
	appContent.style.height = '100%';
	appContent.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
	appContent.style.display = 'auto';

	let appHeader = document.createElement('img');
	appContent.appendChild(appHeader);
	appHeader.src = './img/xp_controlpanel_top_bar.jpg';
	appHeader.style.width = '100%';
	appHeader.style.height = 'auto';
	appHeader.style.display = 'block';
	appHeader.style.position = 'relative';
	appHeader.style.padding = '0 10px';
	appHeader.style.boxSizing = 'border-box';
	appHeader.style.top = '0px';
	appHeader.style.left = '0px';
	appHeader.style.overflow = 'hidden';
	appHeader.style.zoom = '0.5';

	let	leftColumn = document.createElement('div');
	appContent.appendChild(leftColumn);
	leftColumn.style.width = '35%';
	leftColumn.style.height = '75%';
	leftColumn.style.float = 'left';
	leftColumn.style.background = 'linear-gradient(to bottom, rgb(117, 142, 219), rgb(109, 124, 218), rgb(104, 108, 213))';
	let leftColumnMenus = document.createElement('img');
	leftColumn.appendChild(leftColumnMenus);
	leftColumnMenus.src = './img/xp_controlpanel_left_cmp.png';
	leftColumnMenus.style.width = '';
	leftColumnMenus.style.height = 'auto';
	leftColumnMenus.style.margin = '10px auto';
	leftColumnMenus.style.display = 'block';
	leftColumnMenus.style.position = 'relative';
	leftColumnMenus.style.padding = '0 10px';


	let rightColumn = document.createElement('div');
	appContent.appendChild(rightColumn);
	rightColumn.style.width = '65%';
	rightColumn.style.height = '75%';
	rightColumn.style.float = 'left';
	rightColumn.style.display = 'grid';
	rightColumn.style.gridTemplateColumns = 'repeat(auto-fill, 150px)';
	rightColumn.style.gridAutoFlow = 'dense';
	rightColumn.style.justifyContent = 'space-between';
	rightColumn.style.position = 'relative';
	rightColumn.style.padding = '0 10px';
	rightColumn.style.boxSizing = 'border-box';
	rightColumn.style.overflowX = 'scroll';
	rightColumn.style.overflowY = 'scroll';
	rightColumn.style.backgroundColor = 'rgba(88, 93, 223, 0.78)';
	let	rightColumnTitle = document.createElement('div');
	rightColumn.appendChild(rightColumnTitle);
	rightColumnTitle.textContent = 'Pick a category';
	rightColumnTitle.style.color = 'rgba(212, 206, 255, 0.9)';
	rightColumnTitle.style.fontSize = '30px';
	rightColumnTitle.style.fontWeight = 'bold';
	rightColumnTitle.style.width = '400px';
	rightColumnTitle.style.height = '80px';
	rightColumnTitle.style.margin = '10px auto';
	rightColumnTitle.style.textAlign = 'left';
	rightColumnTitle.style.position = 'relative';
	rightColumnTitle.style.padding = '0 10px';
	rightColumnTitle.style.boxSizing = 'border-box';
	rightColumnTitle.style.top = '20px';
	rightColumnTitle.style.left = '20px';

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