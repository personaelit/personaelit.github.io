import { computeRowSum, computeColSum, fmt } from './puzzle.js';

export function updateSums(container, board) {
  const size = board.length;

  for (let r = 0; r < size; r++) {
    const el = container.querySelector(`.row-sum[data-row="${r}"]`);
    if (!el) continue;
    const sum = computeRowSum(board, r);
    el.textContent = sum === 0 ? '✓' : fmt(sum);
    el.classList.toggle('zero', sum === 0);
    el.classList.toggle('nonzero', sum !== 0);
  }

  for (let c = 0; c < size; c++) {
    const el = container.querySelector(`.col-sum[data-col="${c}"]`);
    if (!el) continue;
    const sum = computeColSum(board, c);
    el.textContent = sum === 0 ? '✓' : fmt(sum);
    el.classList.toggle('zero', sum === 0);
    el.classList.toggle('nonzero', sum !== 0);
  }
}

export function showWin(overlay) {
  overlay.classList.remove('hidden');
}

export function hideWin(overlay) {
  overlay.classList.add('hidden');
}
