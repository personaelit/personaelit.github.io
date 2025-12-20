/**
 * Main Application Bootstrap
 * Entry point that coordinates all modules
 */

import { mountTemplates } from './templates.js';
import { initRouter, currentRoute, render } from './router.js';
import { initThemeToggle } from './theme.js';
import { initHamburger, setYear } from './ui.js';
import { startColorTransition } from './color-animation.js';

/**
 * Initialize the application
 */
async function init() {
  // Load templates first
  await mountTemplates();

  // Initialize all modules
  initRouter();
  initThemeToggle();
  initHamburger();
  setYear();
  startColorTransition();

  // Render initial route
  await render(currentRoute());
}

// Start the application when DOM is ready
window.addEventListener('DOMContentLoaded', init);
