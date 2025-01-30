import { createRock } from './rocks.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fill the viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Dimensions of the stack grid
const gridCellSize = 40; // Each cell is 20x20 pixels
const cols = Math.floor(canvas.width / gridCellSize);
const rows = Math.floor(canvas.height / gridCellSize);

// Track the grid where rocks will stack (2D array)
const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
let fallingRocks = [];
let gameOver = false;

canvas.addEventListener('click', handleClick);

function updateFallingRocks() {
  if (gameOver) return;

  // Add new rocks at a steady rate
  if (Math.random() < 0.3) {
    fallingRocks.push(createAlignedRock());
  }

  for (const rock of fallingRocks) {
    rock.y += rock.speed * 4; // Rocks fall faster

    const gridRow = Math.floor((rock.y + gridCellSize) / gridCellSize);
    const gridCol = Math.floor(rock.x / gridCellSize);

    if (gridRow >= rows) {
      placeRockOnGrid(rock, rows - 1, gridCol);
    } else if (grid[gridRow]?.[gridCol]) {
      placeRockOnGrid(rock, gridRow - 1, gridCol);
    }
  }

  // Remove rocks that are no longer falling
  fallingRocks = fallingRocks.filter((rock) => !rock.stacked);
}

function createAlignedRock() {
  const size = gridCellSize;
  const col = Math.floor(Math.random() * cols);
  const rock = createRock();
  rock.x = col * gridCellSize;
  rock.y = -gridCellSize;
  rock.size = size;
  rock.speed = Math.random() * 2 + 4;
  return rock;
}

function placeRockOnGrid(rock, row, col) {
  rock.x = col * gridCellSize;
  rock.y = row * gridCellSize;
  rock.stacked = true;
  grid[row][col] = rock;

  if (row === 0) triggerGameOver();
}

function drawRocks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const rock = grid[row][col];
      if (rock) {
        ctx.drawImage(rock.sprite, rock.x, rock.y, gridCellSize, gridCellSize);
      }
    }
  }

  for (const rock of fallingRocks) {
    ctx.drawImage(rock.sprite, rock.x, rock.y, gridCellSize, gridCellSize);
  }

  if (gameOver) drawGameOver();
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
}

function triggerGameOver() {
  gameOver = true;
}

function handleClick(event) {
  if (gameOver) return;

  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  const col = Math.floor(clickX / gridCellSize);
  const row = Math.floor(clickY / gridCellSize);

  if (grid[row]?.[col]) {
    const matchedRocks = matchAdjacentRocks(row, col);

    if (matchedRocks.length >= 3) {
      createPowderKeg(matchedRocks);
    }

    removeRocks(matchedRocks);
  }
}

function matchAdjacentRocks(row, col) {
  const rock = grid[row]?.[col];
  if (!rock) return [];

  const shade = rock.shade; // Match based on shade
  const visited = new Set();
  const queue = [{ row, col }];
  const matched = [];

  while (queue.length > 0) {
    const { row, col } = queue.shift();
    const key = `${row},${col}`;

    if (visited.has(key)) continue;
    visited.add(key);

    const currentRock = grid[row]?.[col];
    if (currentRock && currentRock.shade === shade) {
      matched.push({ row, col });

      // Add adjacent cells to the queue
      queue.push({ row: row - 1, col }); // Up
      queue.push({ row: row + 1, col }); // Down
      queue.push({ row, col: col - 1 }); // Left
      queue.push({ row, col: col + 1 }); // Right
    }
  }

  return matched;
}

function createPowderKeg(matchedRocks) {
  const { row, col } = matchedRocks[Math.floor(matchedRocks.length / 2)];
  const powderKeg = createRock();
  powderKeg.isPowderKeg = true;
  powderKeg.x = col * gridCellSize;
  powderKeg.y = row * gridCellSize;
  powderKeg.size = gridCellSize;

  grid[row][col] = powderKeg;
}

function removeRocks(rocks) {
  for (const { row, col } of rocks) {
    grid[row][col] = null;
  }
}

function animate() {
  if (!gameOver) {
    updateFallingRocks();
  }
  drawRocks();
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const newCols = Math.floor(canvas.width / gridCellSize);
  const newRows = Math.floor(canvas.height / gridCellSize);
  grid.length = 0;
  for (let i = 0; i < newRows; i++) {
    grid.push(new Array(newCols).fill(null));
  }
  fallingRocks = [];
  gameOver = false;
});

animate();
