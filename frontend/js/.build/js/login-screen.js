"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var loginScreen = document.getElementsByClassName("login-screen")[0];
    // Visual Effect Addons
    var loginScreenMiddleBar = document.createElement('div');
    loginScreenMiddleBar.className = 'login-screen-middle-bar';
    var style = document.createElement('style');
    style.textContent = "\n\t\t\t.login-screen-middle-bar {\n\t\t\t\tposition: absolute;\n\t\t\t\tbackground: linear-gradient(180deg, transparent 0%, rgb(187, 187, 187) 50%, transparent 100%);\n\t\t\t\twidth: 2px;\n\t\t\t\theight: 80%;\n\t\t\t\tz-index: 1000;\n\t\t\t\tleft: 50%;\n\t\t\t\ttop: 10%;\n\t\t\t}\n\t\t";
    document.head.appendChild(style);
    var loginScreenTopBar = document.createElement('div');
    loginScreenTopBar.className = 'login-screen-top-bar';
    var topBarStyle = document.createElement('style');
    topBarStyle.textContent = "\n\t\t\t.login-screen-top-bar {\n\t\t\t\tposition: absolute;\n\t\t\t\tbackground: linear-gradient(90deg, transparent 0%, rgb(231, 231, 231) 50%, transparent 100%);\n\t\t\t\theight: 4px;\n\t\t\t\twidth: 80%;\n\t\t\t\tz-index: 1000;\n\t\t\t\tleft: 5%;\n\t\t\t\ttop: 10%;\n\t\t\t}\n\t\t";
    document.head.appendChild(topBarStyle);
    loginScreen.appendChild(loginScreenTopBar);
    loginScreen.appendChild(loginScreenMiddleBar);
    loginScreen.style.display = 'block';
    var profiles = document.getElementsByClassName("login-screen-right-profile-box");
    var NewProfile = document.getElementById("new-profile");
    var _loop_1 = function (i) {
        var profile = profiles[i];
        var isClicked = false;
        var isHovered = false;
        profile.addEventListener('mousedown', function () {
            isClicked = true;
            if (isHovered)
                profile.style.backgroundColor = 'rgba(41, 74, 127, 0.75)';
            else
                profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
            profile.style.backgroundColor = 'rgba(59, 104, 178, 0.61)';
            profile.style.backgroundColor = 'transparent';
        });
        profile.addEventListener('click', function () {
            if (profile.id !== 'new-profile')
                loginScreen.style.display = 'none';
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
    };
    for (var i = 0; i < profiles.length; i++) {
        _loop_1(i);
    }
    var form = document.getElementsByClassName("login-screen-formulary")[0];
    form.style.display = 'none';
    var backbutton = document.createElement('img');
    backbutton.src = './img/back-icon.png';
    backbutton.style.width = '35px';
    backbutton.style.height = '35px';
    backbutton.style.position = 'absolute';
    backbutton.style.left = '5%';
    backbutton.style.top = '120px';
    backbutton.style.bottom = '10px';
    form.appendChild(backbutton);
    backbutton.addEventListener('click', function () {
        form.style.display = 'none';
        for (var i = 0; i < profiles.length; i++) {
            profiles[i].style.display = 'block';
        }
    });
    backbutton.addEventListener('mouseenter', function () {
        backbutton.style.filter = 'brightness(1.2)';
    });
    backbutton.addEventListener('mouseleave', function () {
        backbutton.style.filter = 'brightness(1)';
    });
    NewProfile.addEventListener('click', function () {
        for (var i = 0; i < profiles.length; i++) {
            profiles[i].style.display = 'none';
        }
        form.style.display = 'block';
    });
});
