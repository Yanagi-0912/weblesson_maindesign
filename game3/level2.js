let swstatus = Array(4).fill(0);

//取得所有按鈕的狀態並存入
function GetAllStatus() {
    document.querySelectorAll('.switch').forEach((switchElement, index) => {
        swstatus[index] = switchElement.classList.contains('on') ? 1 : 0;
    });
}

//設定所有按鈕的狀態
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
            break;
    }
    SetAllStatus();
    Complete();
}

function Complete() {
    if (swstatus.every(status => status === 1)) {
        alert("恭喜過關！");
        saveProgress(3);
    }
}

function saveProgress(level) {
    // 保存玩家進度
    localStorage.setItem("game3Progress", level);
}

document.getElementById("sw0").onclick = function () { clicksw(0); };
document.getElementById("sw1").onclick = function () { clicksw(1); };
document.getElementById("sw2").onclick = function () { clicksw(2); };
document.getElementById("sw3").onclick = function () { clicksw(3); };
