// game3menu.js

document.addEventListener("DOMContentLoaded", async function() {
    try {
        // 向後端請求此玩家的關卡進度
        const res = await fetch('/game3-progress');
        const data = await res.json();

        if (data.success) {
            // 若後端回傳 { success: true, progress: 數字 }，更新按鈕顯示
            const progress = data.progress || 1;
            updateButtons(progress);
        } else {
            // 未登入或無法取得進度，您可視需求顯示警告或預設為1
            console.warn("取得關卡進度失敗:", data.message);
            updateButtons(1);
        }
    } catch (err) {
        console.error("伺服器或網路錯誤:", err);
        updateButtons(1);
    }
});

// 設定按鈕的解鎖/鎖定
function updateButtons(progress) {
    for (let level = 1; level <= 10; level++) {
        const btn = document.getElementById(`level${level}`);
        if (!btn) continue;

        if (level > progress) {
            // 鎖定
            btn.disabled = true;
            btn.style.backgroundColor = '#ccc';
        } else {
            // 解鎖
            btn.disabled = false;
            btn.style.backgroundColor = '#ff6347';
        }
    }
}

// 進入關卡 (可視需求)
function enterLevel(level) {
    // 這裡僅示範可加上「若該關卡被鎖住，就不進入」的防呆
    const btn = document.getElementById(`level${level}`);
    if (btn.disabled) {
        alert("此關卡尚未解鎖！");
        return;
    }
    console.log(`進入關卡 ${level} ...`);
    // 依需求：window.location.href = `level${level}.html`
}

// 完成某關卡後 (在關卡中呼叫)
async function completeLevel(level) {
    try {
        // 假設玩家完成了第 level 關，新的進度至少是 level+1
        const newProgress = level + 1;

        const res = await fetch('/game3-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ progress: newProgress })
        });
        const data = await res.json();
        if (data.success) {
            // 更新按鈕狀態
            updateButtons(data.updatedProgress);
            alert(`恭喜通關第 ${level} 關，已解鎖到關卡 ${data.updatedProgress}！`);
        } else {
            console.error("更新進度失敗:", data.message);
        }
    } catch (err) {
        console.error("更新進度發生錯誤:", err);
    }
}

function saveProgress(level) {
    fetch('/game3-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: level })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            console.log("進度儲存成功，伺服器回傳 updatedProgress=", data.updatedProgress);
        } else {
            console.error("儲存進度失敗：", data.message);
        }
    })
    .catch(err => {
        console.error("伺服器發生錯誤：", err);
    });
}
