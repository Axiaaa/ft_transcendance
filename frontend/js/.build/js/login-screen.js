"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var loginScreen = document.getElementsByClassName("login-screen")[0];
    loginScreen.style.display = 'none';
    var profile = document.getElementsByClassName("login-screen-right-profile-box")[0];
    var isClicked = false;
    var isHovered = false;
    profile.addEventListener('mousedown', function () {
        isClicked = true;
        if (isHovered)
            profile.style.backgroundColor = 'rgba(41, 74, 127, 0.75)';
        else
            profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
        loginScreen.style.display = 'none';
        profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
        profile.style.backgroundColor = 'transparent';
    });
    profile.addEventListener('mouseup', function () {
        isClicked = false;
        if (isHovered)
            profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
        else
            profile.style.backgroundColor = 'transparent';
    });
    profile.addEventListener('mouseenter', function () {
        isHovered = true;
        if (isClicked)
            profile.style.backgroundColor = 'rgba(41, 74, 127, 0.75)';
        else
            profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
    });
    profile.addEventListener('mouseleave', function () {
        isHovered = false;
        profile.style.backgroundColor = 'transparent';
    });
});
