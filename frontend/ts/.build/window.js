import { setIsAppOpen } from "./taskbar.js";
function resetWindows(windowElement) {
    windowElement.style.display = 'none';
    windowElement.style.width = '500px';
    windowElement.style.height = '400px';
    windowElement.style.left = '5%';
    windowElement.style.top = '5%';
    windowElement.style.zIndex = "24";
}
function maximize(windowElement, isMaximised) {
    console.log('maximise');
    if (isMaximised) {
        windowElement.style.width = '500px';
        windowElement.style.height = '400px';
        windowElement.style.left = '0px';
        windowElement.style.top = '0px';
        isMaximised = false;
    }
    else {
        windowElement.style.width = "".concat(window.innerWidth, "px");
        windowElement.style.height = "".concat(window.innerHeight, "px");
        windowElement.style.left = '0px';
        windowElement.style.top = '0px';
        isMaximised = true;
    }
    return isMaximised;
}
;
function minimize(windowElement, isMinimised) {
    console.log('minimise');
    if (isMinimised) {
        windowElement.style.display = 'block';
        isMinimised = false;
    }
    else {
        windowElement.style.display = 'none';
        isMinimised = true;
        var taskbarApp = document.getElementById(windowElement.id.replace('-window', '') + '-taskbar-icon');
        if (taskbarApp) {
            taskbarApp.style.backgroundColor = 'transparent';
            setIsAppOpen(false);
        }
    }
    return isMinimised;
}
function windowResize(isResizing, window, windowElement, e) {
    if (isResizing) {
        var newWidth = e.clientX - windowElement.offsetLeft + 5;
        var newHeight = e.clientY - windowElement.offsetTop + 5;
        var minWidth = 300;
        var minHeight = 200;
        windowElement.style.width = "".concat(Math.max(newWidth, minWidth), "px");
        windowElement.style.height = "".concat(Math.max(newHeight, minHeight), "px");
        if (windowElement.offsetLeft + windowElement.offsetWidth > window.innerWidth)
            windowElement.style.width = "".concat(window.innerWidth - windowElement.offsetLeft, "px");
        if (windowElement.offsetTop + windowElement.offsetHeight > window.innerHeight)
            windowElement.style.height = "".concat(window.innerHeight - windowElement.offsetTop, "px");
    }
}
document.addEventListener('DOMContentLoaded', function () {
    var Windows = document.getElementsByClassName('window');
    console.log('Found ' + Windows.length + ' windows:');
    Array.from(Windows).forEach(function (window, index) {
        console.log("Window ".concat(index, " details:"), window);
    });
    var _loop_1 = function (i) {
        var windowElement = Windows[i];
        var windowHeader = Windows[i].children[0];
        var isDragging = false;
        var isMaximised = false;
        var isMinimised = false;
        var windowTitle = windowHeader.children[0];
        windowTitle.style.fontSize = '13px';
        var isOpened = windowElement.classList.contains('opened-window');
        try {
            console.log("Traitement de la fen\u00EAtre ".concat(i));
            console.log('Window ' + i + ': ' + windowElement.id);
            console.log("Fen\u00EAtre ".concat(i, " trait\u00E9e avec succ\u00E8s"));
        }
        catch (error) {
            console.error("Erreur sur la fen\u00EAtre ".concat(i, ":"), error);
        }
        var closeButton = windowElement.children[0].children[1].children[2];
        closeButton.addEventListener('click', function () {
            isOpened = false;
            Windows[i].classList.remove('opened-window');
            console.log('close');
            resetWindows(windowElement);
            var taskbarApp = document.getElementById(windowElement.id.replace('-window', '') + '-taskbar-icon');
            if (taskbarApp) {
                taskbarApp.style.backgroundColor = 'transparent';
                taskbarApp.style.display = 'none';
                setIsAppOpen(false);
            }
        });
        var maximiseButton = windowElement.children[0].children[1].children[1];
        maximiseButton.addEventListener('click', function () {
            isMaximised = maximize(windowElement, isMaximised);
        });
        var minimiseButton = windowElement.children[0].children[1].children[0];
        minimiseButton.addEventListener('click', function () {
            isMinimised = minimize(windowElement, isMinimised);
        });
        windowElement.style.display = 'none';
        windowElement.style.zIndex = "24";
        var offsetX, offsetY;
        windowHeader.addEventListener('mousedown', function (e) {
            isDragging = true;
            offsetX = e.clientX - windowElement.offsetLeft;
            offsetY = e.clientY - windowElement.offsetTop;
        });
        windowElement.addEventListener('mousedown', function (e) {
            var allWindows = document.getElementsByClassName('window');
            for (var j = 0; j < allWindows.length; j++) {
                allWindows[j].style.zIndex = "24";
            }
            windowElement.style.zIndex = "25";
        });
        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                windowElement.style.left = "".concat(e.clientX - offsetX, "px");
                windowElement.style.top = "".concat(e.clientY - offsetY, "px");
                if (windowElement.offsetLeft < 0) {
                    windowElement.style.left = '0px';
                }
                if (windowElement.offsetTop < 0) {
                    windowElement.style.top = '0px';
                }
                if (windowElement.offsetLeft + windowElement.offsetWidth > window.innerWidth) {
                    windowElement.style.left = "".concat(window.innerWidth - windowElement.offsetWidth, "px");
                }
                if (windowElement.offsetTop + windowElement.offsetHeight > window.innerHeight) {
                    windowElement.style.top = "".concat(window.innerHeight - windowElement.offsetHeight, "px");
                }
            }
        });
        windowHeader.addEventListener('mouseup', function () {
            isDragging = false;
        });
        var isResizing = false;
        var resizeHandle = document.createElement('div');
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.width = '20px';
        resizeHandle.style.height = '20px';
        resizeHandle.style.right = '-10px';
        resizeHandle.style.bottom = '-10px';
        resizeHandle.style.zIndex = '0';
        windowElement.appendChild(resizeHandle);
        resizeHandle.addEventListener('mouseenter', function (e) {
            document.body.style.cursor = 'nwse-resize';
        });
        resizeHandle.addEventListener('mouseleave', function (e) {
            document.body.style.cursor = 'default';
        });
        resizeHandle.addEventListener('mousedown', function () {
            isResizing = true;
        });
        document.addEventListener('mousemove', function (e) {
            windowResize(isResizing, window, windowElement, e);
        });
        resizeHandle.addEventListener('mouseup', function () {
            isResizing = false;
        });
        var windowsContent = windowElement.children[1].children[0];
        if (windowsContent) {
            windowsContent.style.overflow = 'auto';
            windowsContent.style.height = 'calc(100% - 1px)';
            windowsContent.style.width = 'calc(100% - 1px)';
        }
        document.addEventListener('mouseup', function () {
            isDragging = false;
            isResizing = false;
        });
    };
    for (var i = 0; i < Windows.length; i++) {
        _loop_1(i);
    }
});
