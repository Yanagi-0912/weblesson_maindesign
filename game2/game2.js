const boardSize = 6;
const maxLevel = 10;
const board = Array.from({ length: boardSize * boardSize }, () => null);
let coin = 0;
let generateCost = 0;
let generateCount = 0;
let productionRate = 0;
let isBoosted = false;
let levelupCost = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
let itemname = ['融合', '隕石', '彗星', '衛星', '小行星', '行星', '恆星', '黑洞', '星系', '星系團', '超星系團'];
let itemEfficiency = [1, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512];

function createBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = '';
    board.forEach((item, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = index;
        cell.ondragover = (e) => e.preventDefault();
        cell.ondrop = (e) => handleDrop(e, index);
        if (item) {
            const img = document.createElement("div");
            img.classList.add("item");
            img.style.backgroundImage = `url('pic${String(item).padStart(2, '0')}.png')`;
            img.draggable = true;
            img.dataset.level = item;
            img.ondragstart = (e) => handleDragStart(e, index);
            cell.appendChild(img);
        }
        gameBoard.appendChild(cell);
    });
    updateEfficiency();
}

function generateItem() {
    if (coin < generateCost) {
        alert("宇宙塵埃不足！");
        return;
    }
    if (generateCost > 0) coin -= generateCost;
    updateCoinDisplay();

    const emptyCells = board.map((item, index) => item === null ? index : null).filter(index => index !== null);
    if (emptyCells.length === 0) {
        alert("棋盤已滿！");
        return;
    }
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = 1;
    generateCount++;
    generateCost = Math.pow(2, generateCount - 1) / itemEfficiency[0];
    updateCostDisplay();
    createBoard();
}

function handleDragStart(event, fromIndex) {
    event.dataTransfer.setData("fromIndex", fromIndex);
}

function handleDrop(event, toIndex) {
    const fromIndex = event.dataTransfer.getData("fromIndex");
    const fromLevel = board[fromIndex];
    const toLevel = board[toIndex];

    if (fromIndex !== toIndex) {
        if (toLevel === null) {
            board[toIndex] = fromLevel;
            board[fromIndex] = null;
        } else if (fromLevel === toLevel && fromLevel < maxLevel) {
            board[toIndex] = toLevel + 1;
            board[fromIndex] = null;
        }
        createBoard();
    }
}

function updateCoinDisplay() {
    document.getElementById("coin-display").innerText = `宇宙塵埃: ${coin}`;
}

function updateCostDisplay() {
    document.getElementById("cost-display").innerText = `消耗: ${generateCost}`;
}

function updateLevelDisplay(n) {
    const levelDisplay = document.getElementById(`level-display${n}`);
    levelDisplay.innerHTML = `升級${itemname[n]}<br>${itemEfficiency[n]}${n === 0 ? '/次' : '/秒'}<br>消耗: ${levelupCost[n]}`;
}

function updateEfficiency() {
    productionRate = board.reduce((rate, level) => rate + (level ? itemEfficiency[level] : 0), 0);
    const displayRate = isBoosted ? productionRate * 2 : productionRate;
    document.getElementById("efficiency-display").innerText = `效率: ${displayRate} /秒`;
}

function collectCoins() {
    const coinsToAdd = isBoosted ? productionRate * 2 : productionRate;
    if (coinsToAdd > 0) {
        coin += coinsToAdd;
        updateCoinDisplay();
    }
}

function earnCoin() {
    coin += itemEfficiency[0];
    updateCoinDisplay();
}

function applySpeedBoost() {
    if (isBoosted) return;
    isBoosted = true;
    updateEfficiency();
    setTimeout(() => {
        isBoosted = false;
        updateEfficiency();
    }, 30000);
}

function doubleCoin() {
    coin *= 2;
    updateCoinDisplay();
}

function generateHighLevelItem() {
    const emptyCells = board.map((item, index) => item === null ? index : null).filter(index => index !== null);
    if (emptyCells.length === 0) {
        alert("棋盤已滿！");
        return;
    }
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = maxLevel;
    createBoard();
}

function upgradeItem(n) {
    if (coin < levelupCost[n]) {
        alert("宇宙塵埃不足！");
        return;
    }
    coin -= levelupCost[n];
    levelupCost[n] *= 2;
    itemEfficiency[n] *= 2;
    updateCostDisplay();
    updateLevelDisplay(n);
    updateEfficiency();
    updateCoinDisplay();
}

// 初始化按鈕功能
document.getElementById("generate-btn").onclick = generateItem;
document.getElementById("earn-btn").onclick = earnCoin;
document.getElementById("speed-btn").onclick = applySpeedBoost;
document.getElementById("double-coin-btn").onclick = doubleCoin;
document.getElementById("win-start-btn").onclick = generateHighLevelItem;

for (let i = 0; i <= 10; i++) {
    const button = document.getElementById(`upgrade-btn${i}`);
    if (button) {
        button.onclick = () => upgradeItem(i);
    }
}


console.log('productionRate:', productionRate);

// 确保 setInterval 正常执行
setInterval(() => {
    collectCoins();
    console.log('Coin collected at:', new Date());
}, 1000);

// 初始化界面
createBoard();
updateCoinDisplay();
updateCostDisplay();
updateEfficiency();

for (let i = 0; i <= maxLevel; i++) {
    updateLevelDisplay(i);
}
