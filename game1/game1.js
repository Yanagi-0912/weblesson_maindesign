const words = ["APPLE", "GRAPE", "PEACH", "BERRY", "MANGO", "MARCH", "APRIL", "RESET", "START", "CARRY", "INDIA"];
let currentLevel = 0;
let secretWord, attempts, timer, secondsElapsed;
let rankingData = JSON.parse(localStorage.getItem("rankingData")) || [];
    
function startNewRound() {
    if (currentLevel >= words.length) {
        alert("遊戲結束！你已經完成所有關卡！");
        stopTimer();
        return;
    }
    secretWord = words[currentLevel];
    attempts = 0;
    secondsElapsed = 0;
    document.getElementById("timer").textContent = `時間: ${secondsElapsed} 秒`;
    document.getElementById("level-progress").textContent = `關卡進度：${currentLevel + 1} / ${words.length}`;
    document.getElementById("message").textContent = "";
    document.getElementById("guess-input").value = "";
    document.getElementById("name-input-section").style.display = "none";
    createBoard();
    startTimer();
}
    
function createBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";
    for (let i = 0; i < 6 * 5; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        gameBoard.appendChild(tile);
    }
}
    
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        secondsElapsed++;
        document.getElementById("timer").textContent = `時間: ${secondsElapsed} 秒`;
    }, 1000);
}
    
function stopTimer() {
    clearInterval(timer);
}
    
function checkGuess() {
    const guessInput = document.getElementById("guess-input");
    const guess = guessInput.value.toUpperCase();
    
    if (guess.length !== 5) {
        alert("請輸入5個字母的單字！");
        return;
    }
    if (attempts >= 6) {
        alert("已達到最大猜測次數！");
        return;
    }
    
    const rowStart = attempts * 5;
    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById("game-board").children[rowStart + i];
        tile.textContent = guess[i];
        if (guess[i] === secretWord[i]) {
            tile.classList.add("correct");
        } else if (secretWord.includes(guess[i])) {
            tile.classList.add("present");
        } else {
            tile.classList.add("absent");
        }
    }
    
    attempts++;
    guessInput.value = "";
    
    if (guess === secretWord) {
        document.getElementById("message").textContent = "恭喜你猜對了！";
        stopTimer();
        showNameInput();
    }
}
    
function oneClickSolve() {
    alert(secretWord);
}
    
function showNameInput() {
    document.getElementById("name-input-section").style.display = "block";
}
    
function saveScore() {
    const playerName = document.getElementById("player-name").value.trim();
    if (!playerName) {
        alert("請輸入名稱！");
        return;
    }

    rankingData.push({
        name: playerName,
        time: secondsElapsed,
        level: currentLevel + 1
    });

    // 排序：先按關卡排序，再按時間排序
    rankingData.sort((a, b) => b.level - a.level || a.time - b.time);

    localStorage.setItem("rankingData", JSON.stringify(rankingData));
    displayRanking();
    document.getElementById("name-input-section").style.display = "none";
    
    currentLevel++;
    if (currentLevel < words.length) {
        startNewRound();
    }
}
    
function displayRanking() {
    const rankingList = document.getElementById("ranking-list");
    rankingList.innerHTML = rankingData
        .map((data, index) => {
            return `<div class="rank-item">
                        <span class="rank-number">${index + 1}</span>
                        <span>${data.name}</span>
                        <span>${data.level} 關</span>
                        <span>${data.time} 秒</span>
                    </div>`;
        })
        .join("");
}
    
displayRanking();