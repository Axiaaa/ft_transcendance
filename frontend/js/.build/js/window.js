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
    };
    for (var i = 0; i < Windows.length; i++) {
        _loop_1(i);
    }
});
