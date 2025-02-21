const windowHeader = document.querySelector('.title-bar');
const windowElement = document.querySelector('.window');

let isDragging = false;
let offsetX, offsetY;

windowHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - windowElement.offsetLeft;
    offsetY = e.clientY - windowElement.offsetTop;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        windowElement.style.left = `${e.clientX - offsetX}px`;
        windowElement.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});
