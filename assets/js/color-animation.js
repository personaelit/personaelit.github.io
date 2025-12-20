/**
 * Color Animation Module
 * Accessible background color transitions with contrast checking
 */

import { ANIMATION_CONFIG } from './config.js';
import { clamp, hslToRgb } from './utils.js';

/**
 * Convert sRGB to linear RGB for luminance calculation
 * @param {number} v - RGB value (0-255)
 * @returns {number} - Linear RGB value
 */
function srgbToLinear(v) {
  v /= 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Calculate relative luminance of RGB color
 * @param {number[]} rgb - [r, g, b] values
 * @returns {number} - Relative luminance
 */
function relativeLuminance(rgb) {
  const [r, g, b] = rgb.map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * @param {number[]} rgb1 - First color [r, g, b]
 * @param {number[]} rgb2 - Second color [r, g, b]
 * @returns {number} - Contrast ratio
 */
function contrastRatio(rgb1, rgb2) {
  const L1 = relativeLuminance(rgb1);
  const L2 = relativeLuminance(rgb2);
  const [light, dark] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (light + 0.05) / (dark + 0.05);
}

/**
 * Pick best text color for given background
 * @param {number[]} bgRgb - Background color [r, g, b]
 * @returns {Object} - {rgb, hex} of chosen text color
 */
function pickTextColor(bgRgb) {
  const darkText = [15, 23, 42];      // #0f172a (slate-900)
  const lightText = [230, 237, 243];  // #e6edf3

  const cDark = contrastRatio(bgRgb, darkText);
  const cLight = contrastRatio(bgRgb, lightText);

  return cDark >= cLight
    ? { rgb: darkText, hex: '#0f172a' }
    : { rgb: lightText, hex: '#e6edf3' };
}

/**
 * Ensure color meets minimum contrast ratio by adjusting lightness
 * @param {Object} hsl - {h, s, l} color
 * @param {number} minRatio - Minimum contrast ratio (WCAG AA = 4.5)
 * @returns {Object} - Adjusted {h, s, l, bgRgb, textHex}
 */
function ensureContrast({ h, s, l }, minRatio) {
  let L = l;
  let tries = 0;
  const maxTries = 60;

  let bgRgb = hslToRgb(h, s, L);
  let { rgb: textRgb } = pickTextColor(bgRgb);

  // Adjust lightness until contrast is met
  while (contrastRatio(bgRgb, textRgb) < minRatio && tries++ < maxTries) {
    // If text is light, make bg darker; if text is dark, make bg lighter
    L += (textRgb[0] > 128) ? -1 : 1;
    L = clamp(L, 5, 95);
    bgRgb = hslToRgb(h, s, L);
  }

  const choice = pickTextColor(bgRgb);
  return { h, s, l: L, bgRgb, textHex: choice.hex };
}

/**
 * Start background color transition animation
 * @param {Object} options - Configuration options
 */
export function startColorTransition(options = {}) {
  const {
    intervalMs = ANIMATION_CONFIG.intervalMs,
    minContrast = ANIMATION_CONFIG.minContrast,
    hueStep = ANIMATION_CONFIG.hueStep,
    start = null
  } = options;

  // Respect user preferences
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  if (document.body?.dataset?.anim === 'off') return;

  // Initialize state
  let hue = start?.h ?? Math.floor(Math.random() * 360);
  let saturation = start?.s ?? 65;  // Keep vivid to avoid muddy grays
  let lightness = start?.l ?? 22;   // Start comfortably dark

  let satDir = 1;
  let lightDir = 1;

  function step() {
    hue = (hue + hueStep) % 360;

    // Gentle ping-pong for saturation and lightness
    if (saturation >= 80 || saturation <= 55) satDir *= -1;
    saturation = clamp(saturation + satDir, 55, 80);

    if (lightness >= 85 || lightness <= 15) lightDir *= -1;
    lightness = clamp(lightness + lightDir, 15, 85);

    // Ensure accessibility
    const proposed = { h: hue, s: saturation, l: lightness };
    const { l, textHex } = ensureContrast(proposed, minContrast);
    lightness = l;

    const bgCss = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    // Apply both colors in same frame to avoid illegible flash
    const root = document.documentElement;
    document.body.style.setProperty('--bg', bgCss);
    root.style.setProperty('--text', textHex);
    document.body.style.backgroundColor = bgCss;
    document.body.style.color = textHex;
  }

  // Pause when tab hidden (saves battery/CPU)
  function onVisibilityChange() {
    if (document.hidden && window.colorTransitionInterval) {
      clearInterval(window.colorTransitionInterval);
      window.colorTransitionInterval = null;
    } else if (!document.hidden && !window.colorTransitionInterval) {
      window.colorTransitionInterval = setInterval(step, intervalMs);
    }
  }
  document.addEventListener('visibilitychange', onVisibilityChange);

  // Clear any existing interval
  if (window.colorTransitionInterval) {
    clearInterval(window.colorTransitionInterval);
  }

  // First paint
  step();
  window.colorTransitionInterval = setInterval(step, intervalMs);
}
