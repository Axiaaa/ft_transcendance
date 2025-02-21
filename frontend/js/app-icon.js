const appicon = document.querySelector('.app-icon');

let isDragging = false;
let offsetX, offsetY;

appicon.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - appicon.offsetLeft;
    offsetY = e.clientY - appicon.offsetTop;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        appicon.style.left = `${e.clientX - offsetX}px`;
        appicon.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});