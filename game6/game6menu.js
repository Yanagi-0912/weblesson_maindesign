// 當頁面加載時，檢查 localStorage 並設置關卡按鈕的狀態
document.addEventListener("DOMContentLoaded", function() {
    // 讀取儲存的關卡進度，若無進度則設為 0
    let progress = localStorage.getItem("game5Progress");
    progress = progress ? parseInt(progress) : 1; // 預設從關卡 1 開始

    // 根據進度鎖定不該解鎖的關卡
    for (let i = 1; i <= 10; i++) {
        setButtonState(i, progress, i);
    }
});

// 根據關卡進度設定按鈕的狀態，鎖定 +2 關卡
function setButtonState(level, progress, buttonId) {
    const button = document.querySelector(`#level${level}`);
    if (level > progress) {
        // 鎖定關卡按鈕
        button.disabled = true;
        button.style.backgroundColor = '#ccc'; // 灰色表示鎖定
    } else {
        // 解鎖關卡按鈕
        button.disabled = false;
        button.style.backgroundColor = '#ff6347'; // 解鎖時的顏色
    }
}

// 假設這個函數用來觸發關卡完成並儲存進度
function completeLevel(level) {
    // 儲存玩家的最新關卡進度
    saveProgress(level);
    // 更新按鈕狀態
    let progress = localStorage.getItem("game5Progress");
    progress = progress ? parseInt(progress) : 1;
    for (let i = 1; i <= 10; i++) {
        setButtonState(i, progress, i);
    }
}
