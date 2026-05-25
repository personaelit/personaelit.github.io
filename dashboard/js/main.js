import { mouse } from './state.js';
import { ensurePageFavicon } from './avatar.js';
import { loadLinks, renderRecentSearches, execSearch, openModal, closeModal, saveLink } from './quicklinks.js';
import { loadBlocks, createBlock } from './blocks.js';
import { toggle, restore } from './effects/manager.js';
import { ensure, setContext } from './effects/loop.js';
import { launchShootingStar } from './effects/stars.js';
import { addRipple, onResize } from './effects/pond.js';
import { grandFinale } from './effects/fireworks.js';
import { effects } from './state.js';

// Expose functions referenced by inline HTML event handlers
window.toggleEffect = toggle;
window.execSearch = execSearch;
window.openModal = openModal;
window.closeModal = closeModal;
window.saveLink = saveLink;
window.createBlock = createBlock;

const INTERACTIVE_SEL = 'button, a, input, textarea, .quick-link, .block, .modal-content, #effectsPanel, #controls, .search-box, #breathingGuide, #breathDim';

window.addEventListener('load', () => {
  const canvas = document.getElementById('particleCanvas');
  canvas.width  = innerWidth;
  canvas.height = innerHeight;
  setContext(canvas.getContext('2d'));

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('resize', () => {
    canvas.width  = innerWidth;
    canvas.height = innerHeight;
    if (effects.pond) onResize();
  });

  ensurePageFavicon();
  loadLinks();
  loadBlocks();
  renderRecentSearches();
  restore();

  document.addEventListener('click', (e) => {
    if (!e.target.closest(INTERACTIVE_SEL)) {
      if (effects.stars) { launchShootingStar(); ensure(); }
      if (effects.pond) addRipple(e.clientX, e.clientY);
      if (effects.fireworks) grandFinale(e.clientX, e.clientY);
      else if (!effects.stars && !effects.pond) grandFinale(e.clientX, e.clientY);
      ensure();
    }
  });
});
