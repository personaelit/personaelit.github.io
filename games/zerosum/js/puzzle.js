function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function fmt(n) {
  return n > 0 ? `+${n}` : String(n);
}

export function generatePuzzle(level) {
  const { size, range, keepRatio } = level;
  const solution = buildSolution(size, range);
  const { givens, board, tray } = extractTiles(solution, keepRatio);
  return { size, solution, givens, board, tray };
}

function buildSolution(size, [min, max]) {
  const g = Array.from({ length: size }, () => new Array(size).fill(0));

  // Fill top-left (size-1)×(size-1) with random values
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      g[r][c] = randInt(min, max);
    }
    // Last cell in row negates row sum — guarantees row sums to zero
    g[r][size - 1] = -g[r].slice(0, size - 1).reduce((a, b) => a + b, 0);
  }

  // Last row: negate each column's partial sum
  for (let c = 0; c < size - 1; c++) {
    let sum = 0;
    for (let r = 0; r < size - 1; r++) sum += g[r][c];
    g[size - 1][c] = -sum;
  }

  // Bottom-right corner is forced by both constraints (they agree — see README plan)
  g[size - 1][size - 1] = -g[size - 1].slice(0, size - 1).reduce((a, b) => a + b, 0);

  return g;
}

function extractTiles(solution, keepRatio) {
  const size = solution.length;
  const allCells = [];
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      allCells.push([r, c]);

  shuffle(allCells);
  const keepCount = Math.max(1, Math.round(allCells.length * keepRatio));
  const givens = new Set(allCells.slice(0, keepCount).map(([r, c]) => `${r},${c}`));

  const board = solution.map(row => [...row]);
  const tray = [];
  let nextId = 0;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!givens.has(`${r},${c}`)) {
        tray.push({ id: nextId++, value: solution[r][c] });
        board[r][c] = null;
      }
    }
  }

  shuffle(tray);
  return { givens, board, tray };
}

export function computeRowSum(board, row) {
  return board[row].reduce((a, v) => a + (v ?? 0), 0);
}

export function computeColSum(board, col) {
  return board.reduce((a, row) => a + (row[col] ?? 0), 0);
}

export function isSolved(board) {
  const size = board.length;
  for (let r = 0; r < size; r++) {
    if (board[r].some(v => v === null)) return false;
    if (computeRowSum(board, r) !== 0) return false;
  }
  for (let c = 0; c < size; c++) {
    if (computeColSum(board, c) !== 0) return false;
  }
  return true;
}
