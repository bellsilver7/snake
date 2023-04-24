// Initialize the canvas and game variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const width = canvas.width / gridSize;
const height = canvas.height / gridSize;
let snake = [{ x: 10, y: 10 }];
let direction = "right";
let food = getRandomFood();
var score = 0;

// Event listener for key presses
document.addEventListener("keydown", (event) => {
  switch (event.keyCode) {
    case 37:
      direction = "left";
      break;
    case 38:
      direction = "up";
      break;
    case 39:
      direction = "right";
      break;
    case 40:
      direction = "down";
      break;
  }
});

// Main game loop
function gameLoop() {
  // Move the snake
  const head = { x: snake[0].x, y: snake[0].y };
  switch (direction) {
    case "left":
      head.x--;
      break;
    case "up":
      head.y--;
      break;
    case "right":
      head.x++;
      break;
    case "down":
      head.y++;
      break;
  }
  snake.unshift(head);

  // Check for collision with food
  if (head.x === food.x && head.y === food.y) {
    food = getRandomFood();
    updateScoreDisplay();
  } else {
    snake.pop();
  }

  // Check for collision with walls or self
  if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
    clearInterval(intervalId);
    alert("Game over!");
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      clearInterval(intervalId);
      alert("Game over!");
    }
  }

  // Draw the game
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "green";
  snake.forEach((segment) => {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Helper function to update the score display
function updateScoreDisplay() {
  const scoreDisplay = document.getElementById("score");
  scoreDisplay.innerText = score.toString();
}

// Helper function to get random food coordinates
function getRandomFood() {
  const food = {
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
  };
  score++;
  return food;
}

// Start the game loop
const intervalId = setInterval(gameLoop, 200);
