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

	let	leftColumn = document.createElement('div');
	appContent.appendChild(leftColumn);
	leftColumn.style.width = '35%';
	leftColumn.style.height = '100%';
	leftColumn.style.float = 'left';
	leftColumn.style.background = 'linear-gradient(to bottom, rgb(117, 142, 219), rgb(109, 124, 218), rgb(104, 108, 213))';

	let rightColumn = document.createElement('div');
	appContent.appendChild(rightColumn);
	rightColumn.style.width = '65%';
	rightColumn.style.height = '100%';
	rightColumn.style.float = 'left';
	rightColumn.style.backgroundColor = 'rgba(88, 93, 223, 0.78)';
	


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