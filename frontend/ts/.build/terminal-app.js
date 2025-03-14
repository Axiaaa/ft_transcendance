"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var appWindow = document.getElementById('terminal-app-window');
    if (!appWindow) {
        return;
    }
    var appWindowBody = appWindow.children[1];
    if (!appWindowBody) {
        return;
    }
    var appWindowBodyContent = document.createElement('div');
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
    var inputLine = document.createElement('div');
    inputLine.id = 'input-line';
    inputLine.style.display = 'flex';
    inputLine.innerHTML = '<span>minishell $ </span><input type="text" id="terminal-input" style="background: black; color: lime; border: none; outline: none; font-family: monospace; flex: 1; font-size: 18px;">';
    appWindowBodyContent.appendChild(inputLine);
    var terminalInput = document.getElementById('terminal-input');
    if (!terminalInput) {
        return;
    }
    terminalInput.focus();
    appWindowBodyContent.addEventListener('click', function () { return terminalInput.focus(); });
    var services = {
        grafana: 'https://localhost:3000',
        prometheus: 'https://localhost:9090',
        kibana: 'https://localhost:5601',
        elasticsearch: 'https://localhost:9200'
    };
    terminalInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            var command = terminalInput.value.trim();
            appWindowBodyContent.insertBefore(document.createTextNode("minishell $ ".concat(command, "\n")), inputLine);
            terminalInput.value = '';
            if (command === 'hello') {
                appWindowBodyContent.insertBefore(document.createTextNode('Hello World!\n'), inputLine);
            }
            else if (services[command]) {
                window.open(services[command]);
            }
            else if (command === 'clear') {
                appWindowBodyContent.innerHTML = '';
                appWindowBodyContent.appendChild(inputLine);
            }
            else if (command === 'help') {
                appWindowBodyContent.insertBefore(document.createTextNode("No help for ya buddy\n"), inputLine);
            }
            else {
                appWindowBodyContent.insertBefore(document.createTextNode("Unknown command: ".concat(command, "\n")), inputLine);
            }
            appWindowBodyContent.scrollTop = appWindowBodyContent.scrollHeight;
        }
    });
});
