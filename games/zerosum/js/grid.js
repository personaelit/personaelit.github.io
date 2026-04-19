import { fmt } from './puzzle.js';

const CELL_SIZE = 64;
const SUM_SIZE  = 48;
const GAP       = 4;

export function renderGrid(container, state, callbacks) {
  const { board, givens, size } = state;
  container.innerHTML = '';

  const totalCols = size + 1;
  const px = n => `${n}px`;
  container.style.display = 'grid';
  container.style.gridTemplateColumns =
    `repeat(${size}, ${px(CELL_SIZE)}) ${px(SUM_SIZE)}`;
  container.style.gridTemplateRows =
    `repeat(${size}, ${px(CELL_SIZE)}) ${px(SUM_SIZE)}`;
  container.style.gap = px(GAP);

  // Game cells + row sum indicators
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      container.appendChild(makeCell(r, c, board, givens, callbacks));
    }
    const rowSum = document.createElement('div');
    rowSum.className = 'sum-indicator row-sum';
    rowSum.dataset.row = r;
    container.appendChild(rowSum);
  }

  // Col sum indicators + corner
  for (let c = 0; c < size; c++) {
    const colSum = document.createElement('div');
    colSum.className = 'sum-indicator col-sum';
    colSum.dataset.col = c;
    container.appendChild(colSum);
  }
  container.appendChild(document.createElement('div')); // corner spacer
}

function makeCell(r, c, board, givens, callbacks) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.dataset.row = r;
  cell.dataset.col = c;

  const key = `${r},${c}`;
  const val = board[r][c];

  if (givens.has(key)) {
    cell.classList.add('given');
    cell.textContent = fmt(val);
    return cell;
  }

  if (val !== null) {
    cell.classList.add('filled');
    cell.textContent = fmt(val);
    cell.draggable = true;
    cell.addEventListener('click', () => callbacks.onRemove(r, c));
    cell.addEventListener('dragstart', e => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('application/zerosum', JSON.stringify({ type: 'cell', row: r, col: c }));
    });
  } else {
    cell.classList.add('empty');
  }

  cell.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    cell.classList.add('drag-over');
  });
  cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
  cell.addEventListener('drop', e => {
    e.preventDefault();
    cell.classList.remove('drag-over');
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/zerosum'));
      callbacks.onDrop(r, c, data);
    } catch {}
  });

  return cell;
}
