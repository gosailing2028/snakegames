import './style.css';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const speedControl = document.getElementById('speed-control');
const upButton = document.getElementById('up-button');
const downButton = document.getElementById('down-button');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let direction = 'right';
let score = 0;
let isGameOver = false;
let isPaused = false;
let gameInterval;
let gameSpeed = speedControl.value;

function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize)),
  };
  // Ensure food doesn't spawn on snake
  while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    food = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)),
      y: Math.floor(Math.random() * (canvas.height / gridSize)),
    };
  }
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
  });

  // Draw food
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.arc(
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    gridSize / 2 - 1,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function update() {
  if (isPaused || isGameOver) return;

  const head = { ...snake[0] };

  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  if (
    head.x < 0 ||
    head.x >= canvas.width / gridSize ||
    head.y < 0 ||
    head.y >= canvas.height / gridSize ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    isGameOver = true;
    alert('Game Over! Your score: ' + score);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }

  draw();
}

function handleKeyPress(event) {
  switch (event.key) {
    case 'ArrowUp':
      if (direction !== 'down') direction = 'up';
      break;
    case 'ArrowDown':
      if (direction !== 'up') direction = 'down';
      break;
    case 'ArrowLeft':
      if (direction !== 'right') direction = 'left';
      break;
    case 'ArrowRight':
      if (direction !== 'left') direction = 'right';
      break;
  }
}

function startGame() {
  snake = [{ x: 10, y: 10 }];
  direction = 'right';
  score = 0;
  scoreElement.textContent = score;
  isGameOver = false;
  isPaused = false;
  pauseButton.textContent = 'Pause';
  generateFood();
  
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  gameInterval = setInterval(update, 300 - gameSpeed);
}

function pauseGame() {
  isPaused = !isPaused;
  pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
}

function updateGameSpeed() {
  gameSpeed = speedControl.value;
  if (!isGameOver && !isPaused && gameInterval) {
    clearInterval(gameInterval);
    gameInterval = setInterval(update, 300 - gameSpeed);
  }
}

startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
document.addEventListener('keydown', handleKeyPress);
speedControl.addEventListener('input', updateGameSpeed);

upButton.addEventListener('click', () => {
  if (direction !== 'down') direction = 'up';
});
downButton.addEventListener('click', () => {
  if (direction !== 'up') direction = 'down';
});
leftButton.addEventListener('click', () => {
  if (direction !== 'right') direction = 'left';
});
rightButton.addEventListener('click', () => {
  if (direction !== 'left') direction = 'right';
});

draw();
