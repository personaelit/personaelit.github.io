const THEME_KEY = 'soDashboard.theme';
const rootEl = document.documentElement;

export function getSystemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function isDarkMode() {
  return rootEl.getAttribute('data-theme') === 'dark' ||
    (!rootEl.getAttribute('data-theme') && getSystemPrefersDark());
}

export function applyTheme(theme) {
  if (!theme) { rootEl.removeAttribute('data-theme'); localStorage.removeItem(THEME_KEY); return; }
  rootEl.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

let _onThemeChange = null;
export function setThemeChangeCallback(fn) { _onThemeChange = fn; }

export function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') applyTheme(saved);
  else applyTheme(null);

  themeToggleBtn.addEventListener('click', () => {
    const current = rootEl.getAttribute('data-theme');
    if (!current) applyTheme(getSystemPrefersDark() ? 'light' : 'dark');
    else if (current === 'light') applyTheme('dark');
    else if (current === 'dark') applyTheme(null);
    themeToggleBtn.blur();
    if (_onThemeChange) _onThemeChange();
  });

  if (!rootEl.getAttribute('data-theme') && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (!localStorage.getItem(THEME_KEY)) applyTheme(null);
    });
  }
}
