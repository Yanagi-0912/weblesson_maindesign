const boardSize = 6;
const maxLevel = 10;
const board = Array.from({ length: boardSize * boardSize }, () => null);
let coin = 0;
let generateCost = 0;
let generateCount = 0;
let productionRate = 0;
let isBoosted = false;

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
        alert("Coin 不足！");
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
    generateCost = Math.pow(2, generateCount - 1);
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
    document.getElementById("coin-display").innerText = `Coin: ${coin}`;
}

function updateCostDisplay() {
    document.getElementById("cost-display").innerText = `消耗: ${generateCost}`;
}

function updateEfficiency() {
    productionRate = board.reduce((rate, level) => rate + (level || 0), 0);
    const displayRate = isBoosted ? productionRate * 2 : productionRate;
    document.getElementById("efficiency-display").innerText = `效率: ${displayRate} /秒`;
}

function collectCoins() {
    const coinsToAdd = isBoosted ? productionRate * 2 : productionRate;
    coin += coinsToAdd;
    updateCoinDisplay();
}

function earnCoin() {
    coin += 1;
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

document.getElementById("generate-btn").onclick = generateItem;
document.getElementById("earn-btn").onclick = earnCoin;
document.getElementById("speed-btn").onclick = applySpeedBoost;
document.getElementById("double-coin-btn").onclick = doubleCoin;
document.getElementById("win-start-btn").onclick = generateHighLevelItem;

setInterval(collectCoins, 1000);

createBoard();
updateCoinDisplay();
updateCostDisplay();