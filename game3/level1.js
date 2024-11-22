
document.querySelectorAll('.switch').forEach((switchElement) => {
    switchElement.addEventListener('click', () => {
        switchElement.classList.toggle('on');
    });
});