"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var appWindow = document.getElementById('terminal-app-window');
    if (!appWindow) {
        return;
    }
    var appWindowBody = appWindow.children[1];
    console.log('Open terminal =', appWindow);
    if (!appWindowBody) {
        return;
    }
    appWindow.style.minWidth = '400px';
    appWindow.style.minHeight = '300px';
    appWindowBody.style.height = (parseInt(appWindow.style.height) - 45.5) + 'px';
    appWindowBody.style.width = (parseInt(appWindow.style.width) - 22) + 'px';
    appWindowBody.style.backgroundColor = 'rgb(0, 0, 0)';
    appWindowBody.style.color = 'lime';
    appWindowBody.style.fontFamily = 'monospace';
    appWindowBody.style.fontSize = '18px';
    appWindowBody.style.padding = '10px';
    appWindowBody.style.margin = '0';
    appWindowBody.style.whiteSpace = 'pre-wrap';
    appWindowBody.style.overflowY = 'auto';
    appWindowBody.style.cursor = 'text';
    appWindowBody.tabIndex = 0;
    appWindowBody.classList.add('window-body');
    appWindow.appendChild(appWindowBody);
    var inputLine = document.createElement('div');
    inputLine.id = 'input-line';
    inputLine.style.display = 'flex';
    inputLine.innerHTML = '<span>minishell $ </span><input type="text" id="terminal-input" style="background: black; color: lime; border: none; outline: none; font-family: monospace; flex: 1; font-size: 18px;">';
    appWindowBody.appendChild(inputLine);
    var terminalInput = document.getElementById('terminal-input');
    if (!terminalInput) {
        return;
    }
    terminalInput.focus();
    appWindowBody.addEventListener('click', function () { return terminalInput.focus(); });
    var services = {
        grafana: 'https://localhost:3000',
        prometheus: 'https://localhost:9090',
        kibana: 'https://localhost:5601',
        elasticsearch: 'https://localhost:9200'
    };
    terminalInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            var command = terminalInput.value.trim();
            appWindowBody.insertBefore(document.createTextNode("minishell $ ".concat(command, "\n")), inputLine);
            terminalInput.value = '';
            if (command === 'hello') {
                appWindowBody.insertBefore(document.createTextNode('Hello World!\n'), inputLine);
            }
            else if (services[command]) {
                window.open(services[command]);
            }
            else if (command === 'clear') {
                appWindowBody.innerHTML = '';
                appWindowBody.appendChild(inputLine);
            }
            else if (command === 'help') {
                appWindowBody.insertBefore(document.createTextNode("No help for ya buddy\n"), inputLine);
            }
            else {
                appWindowBody.insertBefore(document.createTextNode("Unknown command: ".concat(command, "\n")), inputLine);
            }
            appWindowBody.scrollTop = appWindowBody.scrollHeight;
        }
    });
});
