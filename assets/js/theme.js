/**
 * Theme Management Module
 * Handles light/dark theme toggling with system preference support
 */

import { THEME_KEY } from './config.js';

/**
 * Update theme UI state
 * @param {boolean} isDark - Whether dark theme is active
 * @param {HTMLElement} btn - Theme toggle button
 */
function updateThemeUI(isDark, btn) {
  const el = document.documentElement;
  const metaEl = document.querySelector('.mantra');
  const theme = isDark ? 'dark' : 'light';

  // Update DOM attributes
  el.setAttribute('data-theme', theme);
  btn.classList.toggle('is-dark', isDark);
  btn.setAttribute('aria-pressed', String(isDark));

  // Toggle emoji in mantra if it exists
  if (metaEl) {
    metaEl.innerHTML = isDark
      ? metaEl.innerHTML.replace(/🖤/g, '🤍')
      : metaEl.innerHTML.replace(/🤍/g, '🖤');
  }
}

/**
 * Initialize theme toggle functionality
 */
export function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn || btn.dataset.bound) return;
  btn.dataset.bound = '1';

  // Determine starting theme
  const saved = localStorage.getItem(THEME_KEY);
  const systemPrefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = saved || (systemPrefersDark ? 'dark' : 'light');
  const isDark = currentTheme === 'dark';

  // Apply initial state
  updateThemeUI(isDark, btn);

  // Toggle click handler
  btn.addEventListener('click', () => {
    const el = document.documentElement;
    const nextIsDark = el.getAttribute('data-theme') !== 'dark';
    const nextTheme = nextIsDark ? 'dark' : 'light';

    updateThemeUI(nextIsDark, btn);
    localStorage.setItem(THEME_KEY, nextTheme);
  });

  // Follow system changes only if user hasn't explicitly chosen
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      updateThemeUI(e.matches, btn);
    }
  });
}
