document.querySelectorAll('.switch').forEach((switchElement) => {
    switchElement.addEventListener('click', () => {
        switchElement.classList.toggle('on');
    });
});

// 函數：取得全部按鈕的當前狀態
function getAllSwitchStates() {
    const states = [];
    document.querySelectorAll('.switch').forEach((switchElement) => {
        states.push(switchElement.classList.contains('on') ? 1 : 0);
    });
    return states; // 回傳一個包含每個按鈕狀態的陣列
}

// 函數：反轉指定按鈕的狀態
function toggleSwitchState(index) {
    const switchElement = document.querySelector(`.switch[data-index="${index}"]`);
    if (switchElement) {
        switchElement.classList.toggle('on');
    } else {
        console.warn(`按鈕索引 ${index} 無效！`);
    }
}
