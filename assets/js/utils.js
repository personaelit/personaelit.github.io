/**
 * Shared Utilities
 * Common helper functions used across modules
 */

/**
 * Simple fetch cache to avoid redundant network requests
 */
const cache = new Map();

/**
 * Fetch HTML content with caching and error handling
 * @param {string} url - URL to fetch
 * @returns {Promise<string>} - HTML content
 */
export async function fetchHTML(url) {
  const key = new URL(url, location.origin).toString();
  if (cache.has(key)) return cache.get(key);

  const res = await fetch(key, { credentials: "same-origin", cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch ${url} -> ${res.status}`);

  const text = await res.text();
  cache.set(key, text);
  return text;
}

/**
 * Wait for an element to appear in the DOM
 * @param {string} selector - CSS selector
 * @param {Function} callback - Called when element is found
 */
export function onElement(selector, callback) {
  const found = document.querySelector(selector);
  if (found) return callback(found);

  const obs = new MutationObserver(() => {
    const el = document.querySelector(selector);
    if (el) {
      obs.disconnect();
      callback(el);
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
}

/**
 * Check if a URL is internal to the current site
 * @param {string} href - URL to check
 * @returns {boolean}
 */
export function isInternal(href) {
  try {
    const u = new URL(href, location.origin);
    return u.origin === location.origin;
  } catch {
    return false;
  }
}

/**
 * Clamp a number between min and max
 * @param {number} n - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

/**
 * Convert HSL to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {number[]} - [r, g, b] values (0-255)
 */
export function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h / 360 + 1 / 3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, h / 360 - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
