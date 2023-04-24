// Game settings
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 40;
const GAME_SPEED = 500;

// Game board
const board = [];
for (let i = 0; i < ROWS; i++) {
  board.push(Array(COLS).fill(0));
}

// Tetrominoes
const tetrominoes = {
  O: [
    [1, 1],
    [1, 1],
  ],
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

// Tetromino colors
const tetrominoColors = {
  O: "orange",
  I: "cyan",
  T: "purple",
  S: "green",
  Z: "red",
  J: "blue",
  L: "orange",
};

// Player scores
const playerScores = [0, 0];

// Current player index
let currentPlayer = 0;

// Game over flag
let gameOver = false;

// Get canvas elements
const gameBoard = document.getElementById("game-board");
const scoreBoard = document.getElementById("score-board");
const gameOverModal = document.getElementById("game-over");

// Set canvas dimensions
gameBoard.width = COLS * BLOCK_SIZE;
gameBoard.height = ROWS * BLOCK_SIZE;

// Get canvas context
const ctx = gameBoard.getContext("2d");

// Draw game board
function drawBoard() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      drawTile(j, i, board[i][j] ? tetrominoColors[board[i][j]] : "black");
    }
  }
}

// Draw game tile
function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  ctx.strokeStyle = "gray";
  ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Draw falling tetromino
function drawFallingTetromino() {
  const tetromino = tetrominoes[currentTetromino];
  for (let i = 0; i < tetromino.length; i++) {
    for (let j = 0; j < tetromino[i].length; j++) {
      if (tetromino[i][j]) {
        drawTile(
          currentTetrominoX + j,
          currentTetrominoY + i,
          tetrominoColors[currentTetromino]
        );
      }
    }
  }
}

// Check if tetromino collides with game board or other tetrominoes
function isCollision() {
  const tetromino = tetrominoes[currentTetromino];
  for (let i = 0; i < tetromino.length; i++) {
    for (let j = 0; j < tetromino[i].length; j++) {
      if (tetromino[i][j]) {
        const x = currentTetrominoX + j;
        const y = currentTetrominoY + i;
        if (y < 0 || y >= ROWS || x < 0 || x >= COLS || board[y][x]) {
          return true;
        }
      }
    }
  }
  return false;
}

// Lock tetromino in place and add it to the board
function lockTetromino() {
  const tetromino = tetrominoes[currentTetromino];
  for (let i = 0; i < tetromino.length; i++) {
    for (let j = 0; j < tetromino[i].length; j++) {
      if (tetromino[i][j]) {
        const x = currentTetrominoX + j;
        const y = currentTetrominoY + i;
        board[y][x] = currentTetromino;
      }
    }
  }
}

// Remove filled rows from board
function removeRows() {
  let numRemovedRows = 0;
  for (let i = ROWS - 1; i >= 0; i--) {
    if (board[i].every((value) => value !== 0)) {
      board.splice(i, 1);
      board.unshift(Array(COLS).fill(0));
      numRemovedRows++;
    }
  }
  return numRemovedRows;
}

// Draw score board
function drawScoreBoard() {
  scoreBoard.innerHTML = `Player 1 Score: ${playerScores[0]}<br>Player 2 Score: ${playerScores[1]}`;
}

// Handle game over
function handleGameOver() {
  gameOver = true;
  gameOverModal.style.display = "block";
}

// Get random tetromino
function getRandomTetromino() {
  const tetrominoKeys = Object.keys(tetrominoes);
  const randomKey =
    tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
  return randomKey;
}

// Start new game
function startNewGame() {
  board.forEach((row) => row.fill(0));
  playerScores[0] = 0;
  playerScores[1] = 0;
  gameOver = false;
  gameOverModal.style.display = "none";
  currentPlayer = 0;
  drawScoreBoard();
  startGameLoop();
}

// Game loop
let currentTetromino;
let currentTetrominoX;
let currentTetrominoY;
let currentRotation;
let currentGameLoop;
//   let currentPlayer = 0;
//   const playerScores = [0, 0];

function startGameLoop() {
  currentTetromino = getRandomTetromino();
  currentTetrominoX =
    Math.floor(COLS / 2) -
    Math.floor(tetrominoes[currentTetromino][0].length / 2);
  currentTetrominoY = 0;
  currentRotation = 0;

  if (currentGameLoop) {
    clearInterval(currentGameLoop);
  }
  currentGameLoop = setInterval(() => {
    moveTetrominoDown();
  }, 1000 / gameSpeed);
}

// Handle player input
document.addEventListener("keydown", (event) => {
  if (gameOver) {
    return;
  }
  switch (event.code) {
    case "ArrowLeft":
      moveTetrominoLeft();
      break;
    case "ArrowRight":
      moveTetrominoRight();
      break;
    case "ArrowDown":
      moveTetrominoDown();
      break;
    case "KeyZ":
      rotateTetrominoCounterClockwise();
      break;
    case "KeyX":
      rotateTetrominoClockwise();
      break;
    case "Space":
      dropTetromino();
      break;
  }
});

// Move tetromino left
function moveTetrominoLeft() {
  currentTetrominoX--;
  if (isCollision()) {
    currentTetrominoX++;
  }
}

// Move tetromino right
function moveTetrominoRight() {
  currentTetrominoX++;
  if (isCollision()) {
    currentTetrominoX--;
  }
}

// Move tetromino down
function moveTetrominoDown() {
  currentTetrominoY++;
  if (isCollision()) {
    currentTetrominoY--;
    lockTetromino();
    const numRemovedRows = removeRows();
    playerScores[currentPlayer] += SCORES[numRemovedRows];
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    drawScoreBoard();
    startGameLoop();
    if (isCollision()) {
      handleGameOver();
    }
  }
}

// Rotate tetromino clockwise
function rotateTetrominoClockwise() {
  currentRotation = (currentRotation + 1) % 4;
  const tetromino = tetrominoes[currentTetromino][currentRotation];
  const tetrominoWidth = tetromino.length;
  const tetrominoHeight = tetromino[0].length;
  const x = currentTetrominoX;
  const y = currentTetrominoY;
  if (x + tetrominoWidth > COLS) {
    currentTetrominoX = COLS - tetrominoWidth;
  }
  if (y + tetrominoHeight > ROWS) {
    currentTetrominoY = ROWS - tetrominoHeight;
  }
  if (isCollision()) {
    currentRotation = (currentRotation - 1 + 4) % 4;
  }
}

// Rotate tetromino counter-clockwise
function rotateTetrominoCounterClockwise() {
  currentRotation = (currentRotation - 1 + 4) % 4;
  const tetromino = tetrominoes[currentTetromino][currentRotation];
  const tetrominoWidth = tetromino.length;
  const tetrominoHeight = tetromino[0].length;
  const x = currentTetrominoX;
  const y = currentTetrominoY;
  if (x + tetrominoWidth > COLS) {
    currentTetrominoX = COLS - tetrominoWidth;
  }
  if (y + tetrominoHeight > ROWS) {
    currentTetrominoY = ROWS - tetrominoHeight;
  }
  if (isCollision()) {
    currentRotation = (currentRotation + 1) % 4;
  }
}

// Check for collision
function isCollision() {
  const tetromino = tetrominoes[currentTetromino][currentRotation];
  for (let y = 0; y < tetromino.length; y++) {
    for (let x = 0; x < tetromino[y].length; x++) {
      if (
        tetromino[y][x] &&
        (grid[currentTetrominoY + y] === undefined ||
          grid[currentTetrominoY + y][currentTetrominoX + x] === undefined ||
          grid[currentTetrominoY + y][currentTetrominoX + x])
      ) {
        return true;
      }
    }
  }
  return false;
}

// Lock tetromino in place
function lockTetromino() {
  const tetromino = tetrominoes[currentTetromino][currentRotation];
  for (let y = 0; y < tetromino.length; y++) {
    for (let x = 0; x < tetromino[y].length; x++) {
      if (tetromino[y][x]) {
        grid[currentTetrominoY + y][currentTetrominoX + x] =
          currentTetromino + 1;
      }
    }
  }
}
