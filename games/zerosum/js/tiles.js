import { fmt } from './puzzle.js';

export function renderTray(container, tray) {
  container.innerHTML = '';
  for (const tile of tray) {
    const el = document.createElement('div');
    el.className = 'tile';
    el.dataset.id = tile.id;
    el.textContent = fmt(tile.value);
    el.draggable = true;
    el.addEventListener('dragstart', e => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('application/zerosum', JSON.stringify({ type: 'tray', id: tile.id }));
    });
    container.appendChild(el);
  }
}
