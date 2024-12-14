const gameBoard = document.getElementById("gameBoard");
const statusDisplay = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

const modes = {
    PVP: "玩家 vs 玩家",
    EASY: "玩家 vs 電腦 (簡單)",
    MEDIUM: "玩家 vs 電腦 (中等)",
    HARD: "玩家 vs 電腦 (困難)"
};

let board = [];
const boardSize = 19;
let currentPlayer = "black"; // 初始玩家為黑子
let gameMode = null;
let isGameActive = false;

// 初始化棋盤
function initializeBoard() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
    gameBoard.innerHTML = "";
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.col = j;
            gameBoard.appendChild(cell);
        }
    }
    isGameActive = true;
    statusDisplay.textContent = `${currentPlayer === "black" ? "黑子" : "白子"}的回合`;
}

// 檢查是否有勝利
function checkWin(row, col) {
    const directions = [
        { dr: 0, dc: 1 }, // 水平
        { dr: 1, dc: 0 }, // 垂直
        { dr: 1, dc: 1 }, // 右下
        { dr: 1, dc: -1 } // 左下
    ];

    const player = board[row][col];
    for (const { dr, dc } of directions) {
        let count = 1;
        for (let step = 1; step < 5; step++) {
            const r = row + dr * step;
            const c = col + dc * step;
            if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === player) {
                count++;
            } else {
                break;
            }
        }
        for (let step = 1; step < 5; step++) {
            const r = row - dr * step;
            const c = col - dc * step;
            if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === player) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 5) {
            return true;
        }
    }
    return false;
}

// 執行落子
function makeMove(row, col) {
    if (board[row][col] !== null || !isGameActive) return;

    board[row][col] = currentPlayer;
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add("taken", currentPlayer);

    if (checkWin(row, col)) {
        statusDisplay.textContent = `${currentPlayer === "black" ? "黑子" : "白子"}獲勝！`;
        isGameActive = false;
    } else {
        currentPlayer = currentPlayer === "black" ? "white" : "black"; // 切換玩家
        statusDisplay.textContent = `${currentPlayer === "black" ? "黑子" : "白子"}的回合`;

        // 如果遊戲還在進行中，且當前不是玩家對戰模式
        if (isGameActive && gameMode !== modes.PVP && currentPlayer === "white") {
            setTimeout(() => {
                if (gameMode === modes.EASY) {
                    easyAIMove();
                } else if (gameMode === modes.MEDIUM) {
                    mediumAIMove();
                } else if (gameMode === modes.HARD) {
                    hardAIMove();
                }
            }, 500); // 模擬電腦思考時間
        }
    }
}

// 隨機選擇一個空格來下棋（簡單模式）
function easyAIMove() {
    const emptyCells = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === null) {
                emptyCells.push({ row, col });
            }
        }
    }
    if (emptyCells.length > 0) {
        const randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(randomMove.row, randomMove.col);
    }
}

// 中等模式（略簡單的策略，選擇一個最近的空格）
function mediumAIMove() {
    const emptyCells = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === null) {
                emptyCells.push({ row, col });
            }
        }
    }
    // 假設最簡單的策略是選擇距離當前棋子的最近空格
    if (emptyCells.length > 0) {
        const move = emptyCells[0]; // 這裡可以加入更進階的判斷
        makeMove(move.row, move.col);
    }
}

// 困難模式（更強的策略）
function hardAIMove() {
    const emptyCells = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === null) {
                emptyCells.push({ row, col });
            }
        }
    }
    if (emptyCells.length > 0) {
        const move = emptyCells[0]; // 這裡可以加入更加複雜的策略
        makeMove(move.row, move.col);
    }
}

// 點擊事件處理
gameBoard.addEventListener("click", (e) => {
    if (!isGameActive || gameMode === null) return;
    const cell = e.target;
    if (!cell.classList.contains("cell") || cell.classList.contains("taken")) return;

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    makeMove(row, col);
});

// 遊戲模式按鈕
function startGame(mode) {
    gameMode = mode;
    currentPlayer = "black"; // 每局遊戲重置為黑子先手
    initializeBoard();
    statusDisplay.textContent = `模式: ${gameMode}，${currentPlayer === "black" ? "黑子" : "白子"}的回合`;
}

document.getElementById("pvpMode").addEventListener("click", () => startGame(modes.PVP));
document.getElementById("easyMode").addEventListener("click", () => startGame(modes.EASY));
document.getElementById("mediumMode").addEventListener("click", () => startGame(modes.MEDIUM));
document.getElementById("hardMode").addEventListener("click", () => startGame(modes.HARD));

// 重新開始
resetBtn.addEventListener("click", () => {
    gameMode = null;
    statusDisplay.textContent = "請選擇遊戲模式";
    gameBoard.innerHTML = "";
    isGameActive = false;
});
