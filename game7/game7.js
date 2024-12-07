// 遊戲核心變數
let secretNumber = [];
let gameActive = true;
let attempts = 0;

// 初始化遊戲
function initializeGame() {
    secretNumber = generateSecretNumber();
    gameActive = true;
    attempts = 0;  // 重置嘗試次數
    document.getElementById("guessList").innerHTML = "";
    document.getElementById("guessInput").value = "";
    document.getElementById("attemptsCount").textContent = attempts;  // 顯示嘗試次數
    console.log("隱藏數字（測試用）:", secretNumber.join(""));
}

// 產生不重複的4位數
function generateSecretNumber() {
    const digits = Array.from({ length: 10 }, (_, i) => i);
    const number = [];
    while (number.length < 4) {
        const index = Math.floor(Math.random() * digits.length);
        number.push(digits.splice(index, 1)[0]);
    }
    return number;
}

// 處理猜測
function handleGuess() {
    if (!gameActive) {
        alert("遊戲已結束，請按重新開始！");
        return;
    }

    const guessInput = document.getElementById("guessInput").value;
    if (!/^\d{4}$/.test(guessInput)) {
        alert("請輸入4位不重複的數字！");
        return;
    }

    const guess = guessInput.split("").map(Number);
    if (new Set(guess).size !== 4) {
        alert("數字不能重複！");
        return;
    }

    attempts++;  // 每次猜測增加一次
    document.getElementById("attemptsCount").textContent = attempts;  // 更新顯示的嘗試次數

    const { a, b } = calculateAB(guess);
    const resultText = `${guessInput} → ${a}A${b}B`;

    const guessList = document.getElementById("guessList");
    const listItem = document.createElement("li");
    listItem.textContent = resultText;
    guessList.appendChild(listItem);

    if (a === 4) {
        gameActive = false;
        alert("恭喜你猜對了！答案是：" + secretNumber.join("") + "。總共猜了 " + attempts + " 次！");
    }
}

// 計算幾A幾B
function calculateAB(guess) {
    let a = 0;
    let b = 0;

    guess.forEach((digit, index) => {
        if (digit === secretNumber[index]) {
            a++;
        } else if (secretNumber.includes(digit)) {
            b++;
        }
    });

    return { a, b };
}

// 重新開始遊戲
document.getElementById("resetGame").addEventListener("click", initializeGame);

// 提交猜測
document.getElementById("submitGuess").addEventListener("click", handleGuess);

// 初始化
initializeGame();
