/**
 * UI Components Module
 * Interactive UI elements and navigation
 */

import { isInternal } from './utils.js';

/**
 * Normalize route path
 * @param {string} path - Raw path
 * @returns {string} - Cleaned path
 */
function clean(path) {
  return ("/" + path.replace(/^\/*/, "").replace(/\/*$/, "")).toLowerCase() || "/home";
}

/**
 * Wire internal links for SPA navigation
 * @param {HTMLElement} root - Root element to search within
 */
export function wireInternalLinks(root = document) {
  root.querySelectorAll('a[data-link]').forEach(a => {
    a.addEventListener('click', (e) => {
      // Allow ctrl/cmd click to open new tab
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const href = a.getAttribute('href');
      if (!href || !isInternal(href)) return;

      e.preventDefault();
      const route = href.startsWith("#")
        ? clean(href.replace(/^#/, ""))
        : clean(href);

      // Use hash so static hosts don't 404 on refresh
      history.pushState({ route }, "", `#${route}`);

      // Trigger render (imported dynamically to avoid circular dependency)
      import('./router.js').then(({ render }) => render(route));
    });
  });
}

/**
 * Mark active navigation item based on current route
 * @param {string} route - Current route
 */
export function markActiveNav(route) {
  document.querySelectorAll('[data-nav]').forEach(el => {
    const target = clean(el.getAttribute('data-nav') || "");
    el.classList.toggle('active', target === route);
  });
}

/**
 * Add classes to links based on their type
 */
export function stylizeLinks() {
  const links = document.querySelectorAll("a");

  links.forEach(link => {
    if (link.href.includes("mailto")) {
      link.classList.add("mailto");
    } else if (link.hostname !== window.location.hostname) {
      link.classList.add("external");
    }
  });
}

/**
 * Set current year in footer
 */
export function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Initialize hamburger menu functionality
 */
export function initHamburger() {
  // Measure and set header height as CSS variable
  const headerEl = document.querySelector('.site-header');
  if (headerEl) {
    const setHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--header-h',
        `${headerEl.getBoundingClientRect().height}px`
      );
    };
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight, { passive: true });
  }

  const hamburgerBtn = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-nav');

  if (!hamburgerBtn || !menu) return;

  /**
   * Set menu open/closed state
   * @param {boolean} open - Whether menu should be open
   */
  function setOpen(open) {
    hamburgerBtn.setAttribute('aria-expanded', String(open));
    hamburgerBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

    if (open) {
      menu.removeAttribute('hidden');
      document.body.setAttribute('data-menu-open', 'true');
    } else {
      document.body.removeAttribute('data-menu-open');
      menu.setAttribute('hidden', '');
    }
  }

  // Toggle on click
  hamburgerBtn.addEventListener('click', () => {
    const open = hamburgerBtn.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburgerBtn.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (hamburgerBtn.getAttribute('aria-expanded') !== 'true') return;
    if (!menu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      setOpen(false);
    }
  });

  // Close on nav link click
  menu.addEventListener('click', (e) => {
    const target = e.target;
    if (target instanceof HTMLElement &&
        (target.tagName === 'A' || target.classList.contains('theme-toggle'))) {
      setOpen(false);
    }
  });
}
