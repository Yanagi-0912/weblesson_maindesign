let swstatus = Array(4).fill(0);

// 取得所有按鈕的狀態並存入 swstatus
function GetAllStatus() {
    document.querySelectorAll('.switch').forEach((switchElement, index) => {
        swstatus[index] = switchElement.classList.contains('on') ? 1 : 0;
    });
}

// 依 swstatus[] 設定畫面上所有開關的狀態 (on/off)
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
    switch (index) {
        case 0:
            swstatus[1] = swstatus[1] === 1 ? 0 : 1;
            swstatus[3] = swstatus[3] === 1 ? 0 : 1;
            break;
        case 1:
            swstatus[2] = swstatus[2] === 1 ? 0 : 1;
            break;
        case 2:
            swstatus[3] = swstatus[3] === 1 ? 0 : 1;
            break;
        case 3:
            swstatus[0] = swstatus[0] === 1 ? 0 : 1;
            break;
        default:
            console.warn(`Invalid index: ${index}`);
            return;
    }
    SetAllStatus();
    Complete();
}

function Complete() {
    if (swstatus.every(status => status === 1)) {
        alert("恭喜過關！");
        // 原本 localStorage.setItem("game3Progress", level)
        // 改為呼叫後端API保存進度
        saveProgress(3); 
        // 如果您已有 completeLevel(3) 寫法，就呼叫它
        completeLevel(3); 
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

// 綁定按鈕事件 (id="sw0", "sw1", "sw2", "sw3")
document.getElementById("sw0").onclick = () => clicksw(0);
document.getElementById("sw1").onclick = () => clicksw(1);
document.getElementById("sw2").onclick = () => clicksw(2);
document.getElementById("sw3").onclick = () => clicksw(3);
