// Variables
let blocks = [];
let paddle;
let ball;
let score;
let scoreValue = 0;
let lives;
let livesValue = 3;
let winTextDisplay = null;
let loseTextDisplay = null;
let gameStarted = false;
let paddleListenerAdded = false;
let paddleDirection = 0;
let gameWon = false;
let countdownActive = false;
let countdownValue = 3;
let countdownInterval = null;
let countdownDisplay = null;
let bounceAudio = null;
let winAudio = null;
let loseAudio = null;
let audioMuted = false;


// Displays all components
function startGame() {
    myGameArea.init();
    Blocks();
    Paddle();
    Ball();
    Score();
    Lives();
}

// Updates the game area 
function updateGameArea() {
    myGameArea.clear();
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].update();
    }
    paddle.speedX = paddleDirection * 5;
    paddle.x += paddle.speedX;
    paddle.x = Math.max(0, Math.min(paddle.x, myGameArea.canvas.width - paddle.width));
    paddle.update();
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    ball.update();
    score.update();
    lives.update();
    ballHitDetection();
    winGame();
    loseGame();
    if (countdownActive && countdownDisplay) {
        countdownDisplay.update();
    }
    if (winTextDisplay) {
        winTextDisplay.update();
    }
    if (loseTextDisplay) {
        loseTextDisplay.update();
    }
}

// Game area handler
var myGameArea = {
    canvas: document.createElement("canvas"),
    init: function () {
        this.canvas.height = 570;
        this.canvas.width = 520;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Drawing blocks and paddle
function drawBlockPaddle(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.closePath();
    }
}

// Drawing the ball
function drawBall(x, y, r, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

// Displays the score
function showScoreText(x, y, font, color) {
    this.update = function () {
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText("Score: " + scoreValue, x, y);
        ctx.closePath();
    }
}

// Displays the lives
function showLivesText(x, y, font, color) {
    this.update = function () {
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText("Lives: " + livesValue, x, y);
        ctx.closePath();
    }
}

// The grid of blocks
function Blocks() {
    const blockWidth = 60;
    const blockHeight = 20;
    const padding = 10;
    const offsetTop = 35;
    const offsetLeft = 20;

    const blockRowCount = 5;
    const blockColCount = 7;

    const rowColors = [
        "#fddddd", // light red
        "#d1f2eb", // mint
        "#fff7c0", // baby yellow
        "#fddde6", // baby pink
        "#e6ccf2" // lilac
    ];

    for (let row = 0; row < blockRowCount; row++) {
        for (let col = 0; col < blockColCount; col++) {
            const x = offsetLeft + col * (blockWidth + padding);
            const y = offsetTop + row * (blockHeight + padding);
            const block = new drawBlockPaddle(blockWidth, blockHeight, rowColors[row], x, y);
            blocks.push(block);
        }
    }
}

// Paddle component
function Paddle() {
    const paddleWidth = 100;
    const paddleHeight = 15;
    let paddleX = (myGameArea.canvas.width - paddleWidth) / 2;
    let paddleY = 540;
    paddle = new drawBlockPaddle(paddleWidth, paddleHeight, "#c2f0f7", paddleX, paddleY);
}

// Ball component
function Ball() {
    const x = 260;
    const y = 300;
    const r = 10;
    ball = new drawBall(x, y, r, "lavender");
}

// Score component
function Score() {
    const font = "18px Arial";
    const x = 10;
    const y = 23;
    score = new showScoreText(x, y, font, "#7a6e87");
}

// Lives component
function Lives() {
    const font = "18px Arial";
    const x = 446;
    const y = 23;
    lives = new showLivesText(x, y, font, "#7a6e87");
}

// Displays youwin text or gameover text 
function showStatusText(x, y, font, color, text) {
    this.font = font;
    this.x = x;
    this.y = y;
    this.color = color;
    this.text = text;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        const textWidth = ctx.measureText(this.text).width;
        const centerX = (myGameArea.canvas.width - textWidth) / 2;
        ctx.fillText(this.text, centerX, this.y);
        ctx.closePath();
    }
}

// Displays the countdown timer
function showCountdownText(x, y, font, color) {
    this.font = font;
    this.x = x;
    this.y = y;
    this.color = color;
    this.alpha = 1.0;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.font = this.font;
        ctx.fillStyle = `rgba(255, 255, 0, ${this.alpha})`; // yellow with fade
        const textWidth = ctx.measureText("Continue in.. " + countdownValue).width;
        const centerX = (myGameArea.canvas.width - textWidth) / 2;
        ctx.fillText("Continue in.. " + countdownValue, centerX, this.y);
        ctx.closePath();
        if (this.alpha > 0) {
            this.alpha -= 0.02; // smoother fading
        }
    }
}

// Play button handler
function playButton() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    document.querySelector(".buttons").style.display = "block";   // Show Start & New Game
    startGame();   // Navigate to the game UI
}

// Start button handler
function startButton() {
    // Disabling the start button when..
    if (gameStarted || countdownActive || winTextDisplay || loseTextDisplay) {
        return;
    }
    if (!gameStarted) {
        ball.speedX = 0;
        ball.speedY = 4;                // Making the ball hit the paddle first
        myGameArea.interval = setInterval(updateGameArea, 20);
        gameStarted = true;
    }
    else if (livesValue > 0 && (ball.speedX === 0 && ball.speedY === 0)) {
        clearInterval(myGameArea.interval);         // To keep the ball's speed as it is
        myGameArea.interval = setInterval(updateGameArea, 20);
    }

    if (!paddleListenerAdded) {
        document.addEventListener("keydown", paddleKeyDownHandler);
        document.addEventListener("keyup", paddleKeyUpHandler);
        paddleListenerAdded = true;
    }
}

function paddleKeyDownHandler(e) {
    if (e.keyCode === 37) {
        paddleDirection = -1;
    }
    if (e.keyCode === 39) {
        paddleDirection = 1;
    }
}
function paddleKeyUpHandler(e) {
    if (e.keyCode === 37 || e.keyCode === 39) {
        paddleDirection = 0;
    }
}

// Countdown handler
function startRespawnCountdown() {
    countdownActive = true;
    countdownValue = 3;
    countdownDisplay = new showCountdownText(100, 260, "30px Arial", "#fff7c0");
    countdownInterval = setInterval(() => {
        countdownValue--;
        if (countdownValue <= 0) {
            clearInterval(countdownInterval);
            countdownActive = false;
            countdownDisplay = null;
            paddle.x = (myGameArea.canvas.width - paddle.width) / 2;      // Reset paddle position to the center
            ball.speedX = 0;
            ball.speedY = 4;
            if (!paddleListenerAdded) {
                document.addEventListener("keydown", paddleKeyDownHandler);
                document.addEventListener("keyup", paddleKeyUpHandler);
                paddleListenerAdded = true;
            }
            myGameArea.interval = setInterval(updateGameArea, 20);
        }
        else {
            countdownDisplay.alpha = 1.0;  // Reset alpha to 1 for each new countdown number
        }
    }, 1000);
}

// Detects ball hits
function ballHitDetection() {
    // Ball edges
    const ballCenterX = ball.x;
    const ballCenterY = ball.y;
    const ballTop = ball.y - ball.r;
    const ballBottom = ball.y + ball.r;
    const ballRight = ball.x + ball.r;
    const ballLeft = ball.x - ball.r;

    // Paddle edges
    const paddleTop = paddle.y;
    const paddleBottom = paddle.y + paddle.height;
    const paddleRight = paddle.x + paddle.width;
    const paddleLeft = paddle.x;

    let hitBlockY = false;
    let hitBlockX = false;

    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];

        // Block edges 
        const blockTop = block.y;
        const blockBottom = block.y + block.height;
        const blockRight = block.x + block.width;
        const blockLeft = block.x;

        if (ballRight >= blockLeft && ballLeft <= blockRight && ballBottom >= blockTop && ballTop <= blockBottom) {
            hitBlockY = true;
            blocks.splice(i, 1);
            scoreValue++;
            playAudio("assets/audio/sharp-pop-328170.mp3");
            i--;              // To stay at the same index

            // Revert speedX if the ball hits block's left edge
            if (ballRight >= blockLeft && ballCenterX < blockLeft && ball.speedX > 0) {
                hitBlockX = true;
                //ball.speedY *= -1;
                ball.speedX *= -1;
            }
            // Revert speedX if the ball hits block's right edge
            if (ballLeft <= blockRight && ballCenterX > blockRight && ball.speedX < 0) {
                hitBlockX = true;
                //ball.speedY *= -1;
                ball.speedX *= -1;

            }
        }
    }
    // Bounces upon hitting a block
    if (hitBlockY || hitBlockX) {
        ball.speedY *= -1;
    }

    // Detecting when the ball hits both the left and the right walls of the canvas
    // Ball hits left wall
    if (ballLeft <= 0) {
        ball.x = ball.r;
        ball.speedX *= -1;
    }
    // Ball hits right wall
    else if (ballRight >= myGameArea.canvas.width) {
        ball.x = myGameArea.canvas.width - ball.r;
        ball.speedX *= -1;
    }

    // Detecting when the ball's top side hits the top wall of the canvas
    if (ballTop <= 0) {
        ball.speedY *= -1;
    }

    // Detecting hit angle
    if (ballBottom >= paddleTop && ballBottom <= paddleBottom && ballRight >= paddleLeft && ballLeft <= paddleRight && ball.speedY > 0) {
        // Get the paddle's center
        const paddleCenter = paddle.x + paddle.width / 2;

        // Calculating hit position: -1 (left), +1 (right)
        const hitPosition = (ball.x - paddleCenter) / (paddle.width / 2);

        // Maximum bounce angle (in radians)
        const maxBounceAngle = (60 * Math.PI) / 180; // 60 degrees

        // Calculating the bounce angle
        const bounceAngle = hitPosition * maxBounceAngle;

        // Keeping constant speed
        const speed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);

        // Updating the ball's speed based on the bounce angle
        ball.speedX = speed * Math.sin(bounceAngle);
        ball.speedY = -Math.abs(speed * Math.cos(bounceAngle));
    }

    // Detecting when the ball hits the left or right side of the paddle
    if (ballBottom >= paddleTop && ballBottom <= paddleBottom) {
        // Left side of the paddle
        if (ballRight >= paddleLeft && ballCenterX < paddleLeft && ball.speedX > 0) {
            ball.speedX *= -1;
        }
        // Right side of the paddle
        else if (ballLeft <= paddleRight && ballCenterX > paddleRight && ball.speedX < 0) {
            ball.speedX *= -1;
        }
    }
}

// Win game handler
function winGame() {
    // Win upon hitting all blocks
    if (blocks.length === 0 && !gameWon) {
        gameWon = true;
        ball.speedX = 0;
        ball.speedY = 0;
        document.removeEventListener("keydown", paddleKeyDownHandler);
        winTextDisplay = new showStatusText(100, 260, "30px Arial", "#6ab04c", "YOU WIN");
        playAudio("assets/audio/marimba-win-e-3-209687.mp3");
        return;
    }
}

// Game loss handler
function loseGame() {
    // If the ball passes the paddle indicating a loss
    if (ball.y - ball.r > paddle.y) {
        ball.x = 260;
        ball.y = 300;
        ball.speedX = 0;
        ball.speedY = 0;
        livesValue--;
        clearInterval(myGameArea.interval); // Pause the game loop
        document.removeEventListener("keydown", paddleKeyDownHandler);
        paddleListenerAdded = false;
        if (livesValue === 0) {
            loseTextDisplay = new showStatusText(100, 260, "30px Arial", "#eb4d4b", "GAME OVER");
            playAudio("assets/audio/marimba-lose-250960.mp3");
            return;
        }
        startRespawnCountdown();
    }
}

// Audios handler 
function playAudio(path) {
    const audio = new Audio(path);
    audio.muted = audioMuted;
    audio.play();
}

// Mute/Unmute button handler
function audioButton() {
    audioMuted = !audioMuted;
    if (bounceAudio) bounceAudio.muted = audioMuted;
    if (winAudio) winAudio.muted = audioMuted;
    if (loseAudio) loseAudio.muted = audioMuted;
    document.getElementById("mute-btn").textContent = audioMuted ? "Unmute" : "Mute";
}

// Restart button handler
function restartButton() {
    if (gameStarted) {
        clearInterval(myGameArea.interval);
        document.removeEventListener("keydown", paddleKeyDownHandler);

        if (countdownInterval !== null) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        countdownActive = false;
        countdownDisplay = null;

        blocks = [];
        Blocks();
        Paddle();
        Ball();
        Score();

        scoreValue = 0;
        livesValue = 3;
        winTextDisplay = null;
        loseTextDisplay = null;
        gameStarted = false;
        paddleListenerAdded = false;
        gameWon = false;

        ball.speedX = 0;
        ball.speedY = 0;

        myGameArea.clear();
        updateGameArea();
    }
}
