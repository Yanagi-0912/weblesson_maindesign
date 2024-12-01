// 當頁面加載時，初始化按鈕狀態
document.addEventListener("DOMContentLoaded", function() {
    // 確保所有關卡按鈕都可用
    for (let i = 1; i <= 10; i++) {
        setButtonState(i);
    }
});

// 設定按鈕為啟用狀態
function setButtonState(level) {
    const button = document.querySelector(`#level${level}`);
    if (button) {
        // 解鎖關卡按鈕
        button.disabled = false;
        button.style.backgroundColor = '#ff6347'; // 解鎖時的顏色
    }
}

// 模擬玩家進入關卡的功能
function enterLevel(level) {
    console.log(`進入關卡 ${level}`);
    // 可以在這裡加入記錄進度或其他邏輯
}
