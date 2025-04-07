import { sendNotification } from "./notification.js";
function resetEasterEgg(CurrentContent, InternetExplorerWindow, InternetExplorerWindowBody, EasterEgg, windowTitle) {
    if (CurrentContent) {
        CurrentContent.style.display = 'block';
        CurrentContent.style.opacity = '1';
    }
    if (EasterEgg && InternetExplorerWindowBody && InternetExplorerWindowBody.contains(EasterEgg))
        InternetExplorerWindowBody.removeChild(EasterEgg);
    setTimeout(function () {
        CurrentContent.style.transition = '';
    }, 100);
    if (InternetExplorerWindow) {
        InternetExplorerWindow.style.minWidth = '400px';
        InternetExplorerWindow.style.minHeight = '400px';
        InternetExplorerWindow.style.maxWidth = '100%';
        InternetExplorerWindow.style.maxHeight = '100%';
        InternetExplorerWindow.style.width = '800px';
        InternetExplorerWindow.style.height = '600px';
        setTimeout(function () {
            InternetExplorerWindow.style.transition = '';
        }, 100);
    }
    if (windowTitle) {
        windowTitle.innerText = 'Internet Explorer';
        setTimeout(function () {
            windowTitle.style.transition = '';
        }, 100);
    }
}
document.addEventListener('DOMContentLoaded', function () {
    var InternetExplorerWindow = document.getElementById('internet explorer-app-window');
    if (InternetExplorerWindow) {
        var InternetExplorerWindowBody_1 = InternetExplorerWindow.children[1];
        var CurrentContent_1 = InternetExplorerWindowBody_1.children[0];
        CurrentContent_1.draggable = false;
        var closeButton = InternetExplorerWindow.children[0].children[1].children[2];
        var minimizeButton = InternetExplorerWindow.children[0].children[1].children[0];
        var windowTitle_1 = InternetExplorerWindow.children[0].children[0];
        var EasterEgg_1 = document.createElement('iframe');
        EasterEgg_1.id = 'easter-egg';
        EasterEgg_1.src = 'https://alula.github.io/SpaceCadetPinball/';
        EasterEgg_1.width = '100%';
        EasterEgg_1.height = '100%';
        EasterEgg_1.style.border = 'none';
        var clickCount_1 = 0;
        var lastClickTime_1 = 0;
        CurrentContent_1.addEventListener('dblclick', function () {
            var currentTime = new Date().getTime();
            if (currentTime - lastClickTime_1 < 500)
                clickCount_1++;
            else
                clickCount_1 = 0;
            lastClickTime_1 = currentTime;
            if (clickCount_1 >= 3) {
                InternetExplorerWindow.style.transition = 'width 1s ease, height 1s ease, min-width 1s ease, min-height 1s ease, max-width 1s ease, max-height 1s ease';
                CurrentContent_1.style.transition = 'opacity 1s ease-out';
                windowTitle_1.style.transition = 'color 1s ease';
                setTimeout(function () {
                    CurrentContent_1.style.opacity = '0';
                }, 100);
                setTimeout(function () {
                    CurrentContent_1.style.display = 'none';
                }, 1100);
                InternetExplorerWindowBody_1.appendChild(EasterEgg_1);
                windowTitle_1.innerText = 'Space Cadet Pinball';
                InternetExplorerWindow.style.minWidth = '625px';
                InternetExplorerWindow.style.minHeight = '510px';
                InternetExplorerWindow.style.maxWidth = '625px';
                InternetExplorerWindow.style.maxHeight = '510px';
                InternetExplorerWindow.style.width = '625px';
                InternetExplorerWindow.style.height = '510px';
                sendNotification('Easter Egg activated', 'Enjoy a game of Space Cadet Pinball ! Credit: https://alula.github.io/SpaceCadetPinball/', 'img/Utils/pinball-icon.png');
            }
        });
        closeButton.addEventListener('click', function () {
            console.log('close AAAAAAAAAAAA');
            resetEasterEgg(CurrentContent_1, InternetExplorerWindow, InternetExplorerWindowBody_1, EasterEgg_1, windowTitle_1);
        });
        minimizeButton.addEventListener('click', function () {
            resetEasterEgg(CurrentContent_1, InternetExplorerWindow, InternetExplorerWindowBody_1, EasterEgg_1, windowTitle_1);
        });
    }
});
