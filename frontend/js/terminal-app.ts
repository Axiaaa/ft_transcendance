document.addEventListener('DOMContentLoaded', () => {

	const appWindow = document.getElementById('terminal-app-window');
	if (!appWindow) { return; }
	let appWindowBody = appWindow.children[1] as HTMLElement;
	if (!appWindowBody) { return; }
	let appWindowBodyContent = document.createElement('div');
	appWindowBody.appendChild(appWindowBodyContent);
	console.log('Open terminal =', appWindow);


	// appWindowBodyContent.style.height = (parseInt(appWindow.style.height) - 45.5) + 'px';
	// appWindowBodyContent.style.width = (parseInt(appWindow.style.width) - 22) + 'px';
	appWindowBodyContent.style.height = '100%';
	appWindowBodyContent.style.width = '100%';
	appWindowBodyContent.style.backgroundColor = 'rgb(0, 0, 0)';
	appWindowBodyContent.style.color = 'lime';
	appWindowBodyContent.style.fontFamily = 'monospace';
	appWindowBodyContent.style.fontSize = '18px';
	appWindowBodyContent.style.padding = '10px';
	appWindowBodyContent.style.margin = '0';
	appWindowBodyContent.style.whiteSpace = 'pre-wrap';
	appWindowBodyContent.style.overflowY = 'auto';
	appWindowBodyContent.style.cursor = 'text';
	appWindowBodyContent.tabIndex = 0;
	// appWindowBodyContent.classList.add('window-body');
	// appWindow.appendChild(appWindowBodyContent);

	const inputLine = document.createElement('div');
	inputLine.id = 'input-line';
	inputLine.style.display = 'flex';
	inputLine.innerHTML = '<span>minishell $ </span><input type="text" id="terminal-input" style="background: black; color: lime; border: none; outline: none; font-family: monospace; flex: 1; font-size: 18px;">';
	appWindowBodyContent.appendChild(inputLine);

	const terminalInput = document.getElementById('terminal-input') as HTMLInputElement;
	if (!terminalInput) { return; }
	terminalInput.focus();

	appWindowBodyContent.addEventListener('click', () => terminalInput.focus());

	const services: { [key: string]: string } = {
		grafana: 'https://localhost:3000',
		prometheus: 'https://localhost:9090',
		kibana: 'https://localhost:5601',
		elasticsearch: 'https://localhost:9200',
		alertmanager: 'https://localhost:9093',
	};

	terminalInput.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			const command = terminalInput.value.trim();
			appWindowBodyContent.insertBefore(document.createTextNode(`minishell $ ${command}\n`), inputLine);
			terminalInput.value = '';

			if (command === 'hello') {
				appWindowBodyContent.insertBefore(document.createTextNode('Hello World!\n'), inputLine);
			} else if (services[command]) {
				window.open(services[command]);
			} else if (command === 'clear') {
				appWindowBodyContent.innerHTML = '';
				appWindowBodyContent.appendChild(inputLine);
			} else if (command === 'help') {
				appWindowBodyContent.insertBefore(document.createTextNode("No help for ya buddy\n"), inputLine);
			}
			else {
				appWindowBodyContent.insertBefore(document.createTextNode(`Unknown command: ${command}\n`), inputLine);
			}

			appWindowBodyContent.scrollTop = appWindowBodyContent.scrollHeight;
		}
	});
});
