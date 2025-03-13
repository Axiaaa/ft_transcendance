export function sendNotification(title, message, icon) {
    var taskbar = document.getElementById('taskbar');
    if (!taskbar)
        return;
    var notification = document.createElement('div');
    notification.id = 'notification-icon';
    notification.style.position = 'absolute';
    notification.style.right = '110px';
    notification.style.bottom = '40px';
    notification.style.width = '300px';
    notification.style.height = '60px';
    notification.style.borderRadius = '12px';
    notification.style.border = '2px solid rgba(0, 0, 0, 0.85)';
    notification.style.boxShadow = '2 2 8px rgba(0, 0, 0, 0.75)';
    notification.style.background = 'rgb(255, 254, 216)';
    notification.style.transition = 'opacity 0.75s ease';
    notification.style.opacity = '0';
    setTimeout(function () {
        notification.style.opacity = '1';
    }, 50);
    var triangle = document.createElement('div');
    triangle.style.position = 'absolute';
    triangle.style.right = '20px';
    triangle.style.bottom = '-18px';
    triangle.style.width = '0';
    triangle.style.height = '0';
    triangle.style.borderLeft = '25px solid transparent';
    triangle.style.borderTop = '20px solid rgb(255, 254, 216)';
    notification.appendChild(triangle);
    var notificationTitle = document.createElement('h3');
    notificationTitle.id = 'notification-title';
    notificationTitle.style.position = 'absolute';
    notificationTitle.style.width = 'calc(100% - 75px)';
    notificationTitle.style.height = 'calc(100% - 35px)';
    notificationTitle.style.left = '40px';
    notificationTitle.style.top = '-10px';
    notificationTitle.style.color = 'black';
    notificationTitle.style.fontSize = '15px';
    notificationTitle.style.fontWeight = 'bold';
    notificationTitle.style.fontFamily = 'Arial, sans-serif';
    notificationTitle.style.textShadow = '1px 1px rgba(0, 0, 0, 0.3)';
    notificationTitle.innerText = title;
    notificationTitle.style.overflow = 'hidden';
    notificationTitle.style.textOverflow = 'ellipsis';
    notificationTitle.style.whiteSpace = 'nowrap';
    notification.appendChild(notificationTitle);
    var notificationText = document.createElement('p');
    notificationText.id = 'notification-text';
    notificationText.style.position = 'absolute';
    notificationText.style.width = 'calc(100% - 15px)';
    notificationText.style.height = 'calc(100% - 32px)';
    notificationText.style.left = '10px';
    notificationText.style.top = '18px';
    notificationText.style.color = 'black';
    notificationText.style.fontSize = '12px';
    notificationText.style.fontFamily = 'Arial, sans-serif';
    notificationText.innerText = message;
    notificationText.style.overflow = 'scroll';
    notificationText.style.overflowX = 'scroll';
    notificationText.style.overflowY = 'hidden';
    var scrollSpeed = 0;
    var scrollAnimation;
    notificationText.addEventListener('wheel', function (e) {
        e.preventDefault();
        // Adjust scroll speed based on deltaY
        var acceleration = Math.abs(e.deltaY) / 120; // doubled from 150
        scrollSpeed = Math.min(10, Math.max(5, acceleration * 10)); // halved from 20,10
        clearInterval(scrollAnimation);
        scrollAnimation = setInterval(function () {
            if (e.deltaY > 0) {
                notificationText.scrollLeft += scrollSpeed;
            }
            else {
                notificationText.scrollLeft -= scrollSpeed;
            }
            // Decelerate
            scrollSpeed *= 0.95;
            if (scrollSpeed < 0.5) {
                clearInterval(scrollAnimation);
            }
        }, 16);
    });
    notificationText.style.textOverflow = 'ellipsis';
    notificationText.style.whiteSpace = 'nowrap';
    notification.appendChild(notificationText);
    var notificationIcon = document.createElement('img');
    notificationIcon.id = 'notification-icon';
    notificationIcon.style.position = 'absolute';
    notificationIcon.style.left = '10px';
    notificationIcon.style.top = '8px';
    notificationIcon.style.width = '20px';
    notificationIcon.style.height = 'auto';
    notificationIcon.style.borderRadius = '5px';
    notificationIcon.src = icon;
    notificationIcon.style.userSelect = 'none';
    notificationIcon.draggable = false;
    notification.appendChild(notificationIcon);
    var notificationClose = document.createElement('div');
    notificationClose.id = 'notification-close';
    notificationClose.style.position = 'absolute';
    notificationClose.style.right = '8px';
    notificationClose.style.top = '6px';
    notificationClose.style.width = '20px';
    notificationClose.style.height = '20px';
    notificationClose.style.borderRadius = '5px';
    notificationClose.style.border = '1.5px solid rgba(0, 0, 0, 0.27)';
    notificationClose.style.cursor = 'pointer';
    notificationClose.innerHTML = '&#10005;';
    notificationClose.style.color = '#666';
    notificationClose.style.fontSize = '14px';
    notificationClose.style.fontWeight = 'bold';
    notificationClose.style.textAlign = 'center';
    notificationClose.style.lineHeight = '18px';
    notification.appendChild(notificationClose);
    notification.style.display = 'block';
    taskbar.appendChild(notification);
    var isHovering = false;
    notification.addEventListener('mouseenter', function () {
        isHovering = true;
    });
    notification.addEventListener('mouseleave', function () {
        isHovering = false;
    });
    notificationClose.addEventListener('mouseenter', function () {
        notificationClose.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    });
    notificationClose.addEventListener('mouseleave', function () {
        notificationClose.style.backgroundColor = 'transparent';
    });
    notificationClose.addEventListener('click', function () {
        notification.style.opacity = '0';
        setTimeout(function () {
            notification.style.display = 'none';
            notification.remove();
        }, 750);
    });
    setTimeout(function () {
        if (isHovering)
            return;
        notification.style.opacity = '0';
        setTimeout(function () {
            notification.style.display = 'none';
            notification.remove();
        }, 750);
    }, 10000);
}
document.addEventListener('DOMContentLoaded', function () {
    // Welcome Message
    var message = "Welcome to WindowsXPong ! This is a simple pong game created using TypeScript and HTML5 Canvas. This project is a part of the WindowsXP project, a recreation of the Windows XP operating system using TypeScript, HTML, and CSS. The project is open-source and available on GitHub. This project is created by Jcuzin, Lcamerly, Mcourbon, Aammmirat & Yallo. Enjoy your time on WindowsXPong !";
    sendNotification("Welcome to WindowsXPong !", message, "https://media.giphy.com/media/c5skRQb3BXp8RwKGKW/giphy.gif?cid=790b7611o1187e2a31w6cpl715es06ac2ji3emsexex42ha4&ep=v1_gifs_search&rid=giphy.gif&ct=g");
});
