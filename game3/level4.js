let swstatus = Array(9).fill(0);

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
            swstatus[0] = swstatus[0] === 1 ? 0 : 1;
            swstatus[2] = swstatus[2] === 1 ? 0 : 1;
            swstatus[4] = swstatus[4] === 1 ? 0 : 1;
            swstatus[6] = swstatus[6] === 1 ? 0 : 1;
            swstatus[8] = swstatus[8] === 1 ? 0 : 1;
            break;
        case 1:
            swstatus[1] = swstatus[1] === 1 ? 0 : 1;
            swstatus[3] = swstatus[3] === 1 ? 0 : 1;
            swstatus[5] = swstatus[5] === 1 ? 0 : 1;
            swstatus[7] = swstatus[7] === 1 ? 0 : 1;
            break;
        case 2:
            swstatus[0] = swstatus[0] === 1 ? 0 : 1;
            swstatus[1] = swstatus[1] === 1 ? 0 : 1;
            swstatus[2] = swstatus[2] === 1 ? 0 : 1;
            break;
        case 3:
            swstatus[1] = swstatus[1] === 1 ? 0 : 1;
            swstatus[3] = swstatus[3] === 1 ? 0 : 1;
            swstatus[5] = swstatus[5] === 1 ? 0 : 1;
            swstatus[7] = swstatus[7] === 1 ? 0 : 1;
            break;
        case 4:
            swstatus[3] = swstatus[3] === 1 ? 0 : 1;
            swstatus[4] = swstatus[4] === 1 ? 0 : 1;
            swstatus[5] = swstatus[5] === 1 ? 0 : 1;
            break;
        case 5:
            swstatus[2] = swstatus[2] === 1 ? 0 : 1;
            swstatus[5] = swstatus[5] === 1 ? 0 : 1;
            swstatus[8] = swstatus[8] === 1 ? 0 : 1;
            break;
        case 6:
            swstatus[6] = swstatus[6] === 1 ? 0 : 1;
            swstatus[7] = swstatus[7] === 1 ? 0 : 1;
            swstatus[8] = swstatus[8] === 1 ? 0 : 1;
            break;
        case 7:
            swstatus[1] = swstatus[1] === 1 ? 0 : 1;
            swstatus[4] = swstatus[4] === 1 ? 0 : 1;
            swstatus[7] = swstatus[7] === 1 ? 0 : 1;
            break;
        case 8:
            swstatus[0] = swstatus[0] === 1 ? 0 : 1;
            swstatus[2] = swstatus[2] === 1 ? 0 : 1;
            swstatus[4] = swstatus[4] === 1 ? 0 : 1;
            swstatus[6] = swstatus[6] === 1 ? 0 : 1;
            swstatus[8] = swstatus[8] === 1 ? 0 : 1;
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
        saveProgress(5);
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
document.getElementById("sw4").onclick = function () { clicksw(4); };
document.getElementById("sw5").onclick = function () { clicksw(5); };
document.getElementById("sw6").onclick = function () { clicksw(6); };
document.getElementById("sw7").onclick = function () { clicksw(7); };
document.getElementById("sw8").onclick = function () { clicksw(8); };