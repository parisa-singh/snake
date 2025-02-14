const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");

const box = 25;
let snake = [{ x: 100, y: 100 }];
let food = getRandomFoodPosition();
let direction = "RIGHT";
let nextDirection = "RIGHT";
let gameRunning = false;
let foodEaten = 0;
let gameLoop;

function resizeCanvas() {
    canvas.width = Math.floor(window.innerWidth / box) * box;
    canvas.height = Math.floor(window.innerHeight / box) * box;
}
resizeCanvas(); // Initial setup

window.addEventListener("resize", resizeCanvas);

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
    else if (event.key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
    else if (event.key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
    else if (event.key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
});

function startGame() {
    menu.style.display = "none";
    canvas.style.display = "block";
    resizeCanvas();
    resetGame();
}

function showLevels() {
    alert("Levels feature coming soon!");
}

function resetGame() {
    snake = [{ x: box * 5, y: box * 5 }];
    food = getRandomFoodPosition();
    direction = "RIGHT";
    nextDirection = "RIGHT";
    foodEaten = 0;
    gameRunning = true;
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(() => {
        if (gameRunning) {
            updateGame();
            drawGame();
        }
    }, 200); // Slower speed
}

function getRandomFoodPosition() {
    const maxBoxesX = canvas.width / box;
    const maxBoxesY = canvas.height / box;
    return {
        x: Math.floor(Math.random() * (maxBoxesX - 2) + 1) * box, // Avoid edges
        y: Math.floor(Math.random() * (maxBoxesY - 2) + 1) * box  // Avoid edges
    };
}

function updateGame() {
    if (!gameRunning) return;

    direction = nextDirection;
    
    let head = { x: snake[0].x, y: snake[0].y };
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame("Game Over!");
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        foodEaten++;
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    ctx.fillStyle = "lime";
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, box, box));

    ctx.fillStyle = "white";
    ctx.font = "20px Helvetica";
    ctx.fillText("Score: " + foodEaten, 10, 30);
}

function endGame(message) {
    gameRunning = false;
    clearInterval(gameLoop);
    alert(message + "\n" + "\nYou either hit a wall or yourself. Refresh the page to play again." + "\n" + "\nScore: " + foodEaten);

}
