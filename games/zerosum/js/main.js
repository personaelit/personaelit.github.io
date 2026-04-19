import { LEVELS } from './levels.js';
import { generatePuzzle, isSolved } from './puzzle.js';
import { renderGrid } from './grid.js';
import { renderTray } from './tiles.js';
import { updateSums, showWin, hideWin } from './ui.js';

const gridEl    = document.getElementById('grid-container');
const trayEl    = document.getElementById('tile-tray');
const winOverlay = document.getElementById('win-overlay');

let state = null;
let activeLevel = LEVELS[0];

function startGame(level) {
  activeLevel = level;
  hideWin(winOverlay);
  state = generatePuzzle(level);
  render();
}

function render() {
  renderGrid(gridEl, state, { onDrop, onRemove });
  renderTray(trayEl, state.tray);
  updateSums(gridEl, state.board);
}

function onRemove(row, col) {
  const val = state.board[row][col];
  if (val === null) return;
  state.tray.push({ id: Date.now(), value: val });
  state.board[row][col] = null;
  render();
}

function onDrop(row, col, data) {
  if (data.type === 'tray') {
    const idx = state.tray.findIndex(t => t.id === data.id);
    if (idx === -1) return;

    // If target cell is already filled, return its occupant to the tray
    const displaced = state.board[row][col];
    if (displaced !== null) {
      state.tray.push({ id: Date.now(), value: displaced });
    }

    const [tile] = state.tray.splice(idx, 1);
    state.board[row][col] = tile.value;

  } else if (data.type === 'cell') {
    const { row: sr, col: sc } = data;
    if (sr === row && sc === col) return;

    // Swap source and target values (target may be null)
    const srcVal = state.board[sr][sc];
    const tgtVal = state.board[row][col];
    state.board[sr][sc] = tgtVal;
    state.board[row][col] = srcVal;
  }

  render();

  if (isSolved(state.board)) {
    setTimeout(() => showWin(winOverlay), 250);
  }
}

// Difficulty buttons
document.querySelectorAll('[data-level]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-level]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    startGame(LEVELS[+btn.dataset.level]);
  });
});

document.getElementById('play-again').addEventListener('click', () => {
  startGame(activeLevel);
});

// Boot
document.querySelector('[data-level="0"]').classList.add('active');
startGame(LEVELS[0]);
