const WIDTH = 15;
const HEIGHT = 21;
const CELL_SIZE = 20;
const SNAKE_LENGTH = 5;

let snake = [];
let snakeSpeed = 100;
let snakeSpeedIncrement = 10;
let snakeDirections = [
    {x: 0, y: -1}
]

let apple = [1, 1];

let lastDrawTime;
let gameIsOver = false;

const canvas = document.getElementById('canvas');
canvas.height = HEIGHT * CELL_SIZE + 1;
canvas.width = WIDTH * CELL_SIZE + 1;

const ctx = canvas.getContext('2d');

function initSnake() {
    for (let i = 0; i < SNAKE_LENGTH; i++) {
        snake.push([Math.floor(WIDTH/2), Math.floor(HEIGHT/2) + i]);
    }
}

function drawField() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i <= canvas.width; i += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i + 0.5, 0);
        ctx.lineTo(i + 0.5, canvas.height);
        ctx.stroke();
    }

    for (let i = 0; i <= canvas.height; i += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, i + 0.5);
        ctx.lineTo(canvas.width, i + 0.5);
        ctx.stroke();
    }
}

function drawSnake() {
    for (let point of snake) {
        const x = point[0];
        const y = point[1];

        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
}

function drawApple() {
    ctx.fillRect(apple[0] * CELL_SIZE, apple[1] * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function clearSnake() {
    for (let point of snake) {
        const x = point[0];
        const y = point[1];

        ctx.clearRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
}

function isGameOver() {
    const [x, y] = snake[0];

    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
        gameIsOver = true;
        console.log('Game Over');
        return;
    }

    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        const point = snake[i];

        if (head[0] === point[0] && head[1] === point[1]) {
            gameIsOver = true;
            console.log('Game Over');
            return;
        }
    }
}

function keyDown(event) {
    const snakeDirection = snakeDirections[0];
    let newSnakeDirection;

    switch (event.key) {
        case 'ArrowUp':
            if (snakeDirection.y === 0) newSnakeDirection = {x: 0, y: -1};
            break;
        case 'ArrowDown':
            if (snakeDirection.y === 0) newSnakeDirection = {x: 0, y: 1};
            break;
        case 'ArrowLeft':
            if (snakeDirection.x === 0) newSnakeDirection = {x: -1, y: 0};
            break;
        case 'ArrowRight':
            if (snakeDirection.x === 0) newSnakeDirection = {x: 1, y: 0};
            break;
    }

    if (newSnakeDirection) {
        if (snakeDirections.length > 1 || !snakeDirections[0].isUsed) {
            snakeDirections.unshift(newSnakeDirection);
        } else if (snakeDirections[0].isUsed) {
            snakeDirections = [newSnakeDirection]
        }
    }
}

function game(timestamp) {
    if (!lastDrawTime) {
        lastDrawTime = timestamp;
    }

    const elapsed = timestamp - lastDrawTime;

    if (elapsed > snakeSpeed) {
        clearSnake();

        const snakeDirection = snakeDirections.length > 1
            ? snakeDirections.pop()
            : snakeDirections[0];
        const head = snake[0];
        const newHead = [head[0] + snakeDirection.x, head[1] + snakeDirection.y];
        snakeDirection.isUsed = true;

        snake.unshift(newHead);
        if (newHead[0] === apple[0] && newHead[1] === apple[1]) {
            apple = [Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT)];
            if (snakeSpeedIncrement > 5) {
                snakeSpeedIncrement *= 0.5
            }
            if (snakeSpeed > 60) {
                snakeSpeed -= snakeSpeedIncrement;
            }

            console.log(snakeSpeed);
        } else {
            snake.pop();
        }

        isGameOver();

        drawField();
        drawApple();
        drawSnake();

        lastDrawTime = timestamp;
    }

    if (!gameIsOver) {
        window.requestAnimationFrame(game);
    }
}

initSnake();
drawField();
drawApple();
drawSnake();

document.addEventListener('keydown', keyDown);

window.requestAnimationFrame(game);