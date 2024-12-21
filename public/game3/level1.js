let swstatus = Array(4).fill(0);

// 取得所有按鈕的狀態並存入 swstatus
function GetAllStatus() {
    document.querySelectorAll('.switch').forEach((switchElement, index) => {
        swstatus[index] = switchElement.classList.contains('on') ? 1 : 0;
    });
}

// 設定所有按鈕的狀態
function SetAllStatus() {
    document.querySelectorAll('.switch').forEach((switchElement, index) => {
        if (swstatus[index] === 1) {
            switchElement.classList.add('on');
        } else {
            switchElement.classList.remove('on');
        }
    });
}

function clicksw(index) {
    if (index < 0 || index >= swstatus.length) {
        console.warn(`Invalid index: ${index}`);
        return;
    }
    swstatus[index] = (swstatus[index] === 1) ? 0 : 1;
    SetAllStatus();
    Complete();
}

function Complete() {
    if (swstatus.every(status => status === 1)) {
        alert("恭喜過關！");
        saveProgress(2);
        completeLevel(2); 
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

// 綁定按鈕點擊事件
document.getElementById("sw0").onclick = function () { clicksw(0); };
document.getElementById("sw1").onclick = function () { clicksw(1); };
document.getElementById("sw2").onclick = function () { clicksw(2); };
document.getElementById("sw3").onclick = function () { clicksw(3); };
