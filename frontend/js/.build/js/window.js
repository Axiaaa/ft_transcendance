"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var Windows = document.getElementsByClassName('window');
    var _loop_1 = function (i) {
        var isDragging = false;
        var windowElement = Windows[i];
        var windowHeader = Windows[i].children[0];
        var closeButton = windowElement.children[0].children[1].children[2];
        closeButton.addEventListener('click', function () {
            console.log('close');
            if (windowElement.style.display === 'none')
                windowElement.style.display = 'block';
            else
                windowElement.style.display = 'none';
        });
        var maximiseButton = windowElement.children[0].children[1].children[1];
        var isMaximised = false;
        maximiseButton.addEventListener('click', function () {
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
        document.addEventListener('mouseup', function () {
            isDragging = false;
        });
        var isResizing = false;
        var resizeHandle = document.createElement('div');
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.width = '10px';
        resizeHandle.style.height = '10px';
        resizeHandle.style.right = '0px';
        resizeHandle.style.bottom = '0px';
        resizeHandle.style.backgroundColor = 'white';
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
        });
        resizeHandle.addEventListener('mouseup', function () {
            isResizing = false;
        });
        var windowsContent = windowElement.children[1].children[0];
        windowsContent.style.overflow = 'auto';
        windowsContent.style.height = 'calc(100% - 1px)';
        windowsContent.style.width = 'calc(100% - 1px)';
    };
    for (var i = 0; i < Windows.length; i++) {
        _loop_1(i);
    }
});
