// 基本參數設定
let scene, camera, renderer;
let player, playerRadius = 1;
let trackWidth = playerRadius * 5; 
let playerScore = 0;
let playerPositionX = 0; // 主角的X位移量
let speed = 0.2;  // 前進速度
let maxGates = 5;
let currentGateIndex = 0;
let gates = [];
let finished = false;
let scoreCanvas, scoreContext, scoreTexture;

init();
animate();

function init() {
    // 建立場景、相機、渲染器
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);

    // 光源
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);
    const ambient = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambient);

    // 地面(跑道)
    const planeGeometry = new THREE.PlaneGeometry(trackWidth * 2, 1000);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // 白色跑道
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // 主角球體
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xadd8e6 }); // 淺藍色球
    const playerGeometry = new THREE.SphereGeometry(playerRadius, 32, 32);
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.set(0, playerRadius, 0);
    scene.add(player);

    // 動態分數顯示
    scoreCanvas = document.createElement('canvas');
    scoreCanvas.width = 256;
    scoreCanvas.height = 256;
    scoreContext = scoreCanvas.getContext('2d');
    updateScoreTexture();

    const scoreMaterial = new THREE.MeshStandardMaterial({ map: scoreTexture });
    player.material = scoreMaterial;

    // 產生閘門(5個)
    const gateSpacing = 50;
    for (let i = 0; i < maxGates; i++) {
        let gateZ = -30 - i * gateSpacing;
        let gateGroup = createGate(gateZ, i);
        gates.push(gateGroup);
        scene.add(gateGroup);
    }

    // 終點線(在最後一個閘門後面一段距離)
    let finishLineZ = gates[gates.length - 1].position.z - 50;
    const finishLineGeometry = new THREE.PlaneGeometry(trackWidth * 2, 0.5);
    const finishLineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00, side: THREE.DoubleSide });
    const finishLine = new THREE.Mesh(finishLineGeometry, finishLineMaterial);
    finishLine.rotation.x = -Math.PI / 2;
    finishLine.position.set(0, 0.01, finishLineZ);
    scene.add(finishLine);

    // 鍵盤事件
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onWindowResize);
}



function onKeyDown(e) {
    if (finished) return;
    // 左右鍵控制X方向移動
    if (e.key === 'ArrowLeft') {
        playerPositionX -= 1;
        if (playerPositionX < -2) playerPositionX = -2; // 範圍控制
    }
    if (e.key === 'ArrowRight') {
        playerPositionX += 1;
        if (playerPositionX > 2) playerPositionX = 2;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function createGate(zPos, gateIndex) {
    // gateGroup內包含2~3個柱狀物代表選項
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0,0,zPos);
    const numberOfOptions = Math.random() < 0.5 ? 2 : 3; 

    // 分數產生邏輯
    // 若玩家已經通過 n 個閘門，但目前分數 < n*200時，不產生負分
    let allowNegative = true;
    if (playerScore < gateIndex * 200) {
        allowNegative = false;
    }

    // 根據 numberOfOptions 分配位置
    // 將選項平均分佈在 trackWidth 內
    // x位置範例: 若2個選項: x = -1, x = 1; 若3個選項: x = -2, 0, 2
    let optionPositions;
    if (numberOfOptions === 2) {
        optionPositions = [-1, 1];
    } else {
        optionPositions = [-2, 0, 2];
    }

    for (let i = 0; i < numberOfOptions; i++) {
        const scoreChange = generateScoreChange(allowNegative);
        const barGeom = new THREE.BoxGeometry(0.5, 3, 0.5);
        const color = scoreChange >= 0 ? 0x00FF00 : 0xFF0000;
        const barMat = new THREE.MeshStandardMaterial({color: color});
        const bar = new THREE.Mesh(barGeom, barMat);
        bar.position.set(optionPositions[i], 1.5, 0);
        bar.userData = {scoreChange: scoreChange};
        gateGroup.add(bar);
    }

    return gateGroup;
}

function generateScoreChange(allowNegative) {
    // 分數介於 -300 到 +500
    // 若不允許負數則 0~500間
    let min = allowNegative ? -300 : 0;
    let max = 500;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateScoreTexture() {
    scoreContext.clearRect(0,0,256,256);
    scoreContext.fillStyle = "#ffffff";
    scoreContext.font = "50px Arial";
    scoreContext.textAlign = "center";
    scoreContext.textBaseline = "middle";
    scoreContext.fillText(playerScore.toString(), 128, 128);

    scoreTexture = new THREE.CanvasTexture(scoreCanvas);
    if (player.material) {
        player.material.map = scoreTexture;
        player.material.needsUpdate = true;
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (!finished) {
        // 球前進
        player.position.z -= speed;

        // X位置漸進移動(平滑)
        player.position.x += (playerPositionX - player.position.x)*0.1;

        // 更新攝影機位置(讓攝影機稍微跟著主角)
        camera.position.z = player.position.z + 10;
        camera.lookAt(player.position.x,0,player.position.z);

        // 偵測是否通過閘門
        checkGates();

        // 偵測是否到達終點線
        checkFinishLine();
    }

    renderer.render(scene, camera);
}

function checkGates() {
    if (currentGateIndex >= gates.length) return;

    // 若主角的z已通過當前閘門所在z (閘門z < player.z 代表主角已超過該z)
    let gateGroup = gates[currentGateIndex];
    if (player.position.z < gateGroup.position.z) {
        // 確認主角通過該閘門的哪個選項
        let chosenBar = null;
        let closestDist = Infinity;
        for (let bar of gateGroup.children) {
            let dx = player.position.x - (gateGroup.position.x + bar.position.x);
            let dist = Math.abs(dx);
            if (dist < closestDist) {
                closestDist = dist;
                chosenBar = bar;
            }
        }

        // 更新分數
        playerScore += chosenBar.userData.scoreChange;
        if (playerScore < 0) playerScore = 0;
        updateScoreTexture();

        currentGateIndex++;
    }
}

function checkFinishLine() {
    // 終點線位置為最後一閘門後50的地方
    let finishZ = gates[gates.length - 1].position.z - 50;
    if (player.position.z < finishZ && !finished) {
        finished = true;
        showFinalScore();
    }
}

function showFinalScore() {
    const overlay = document.getElementById('final-score-overlay');
    overlay.textContent = "通關！最終分數：" + playerScore;
    overlay.classList.remove('hidden');
}
