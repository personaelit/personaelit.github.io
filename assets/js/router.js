/**
 * Router Module
 * Hash-based routing for SPA navigation
 */

import { BASE, CONTENT_DIR, ROUTE_META } from './config.js';
import { fetchHTML } from './utils.js';
import { wireInternalLinks, markActiveNav, stylizeLinks } from './ui.js';

/**
 * Normalize and clean route paths
 * @param {string} path - Raw path
 * @returns {string} - Cleaned path
 */
function clean(path) {
  return ("/" + path.replace(/^\/*/, "").replace(/\/*$/, "")).toLowerCase() || "/home";
}

/**
 * Get current route from URL
 * Priority: hash route (#/about) → path route (/about) → "home"
 * @returns {string} - Current route
 */
export function currentRoute() {
  const hash = location.hash.replace(/^#/, "").trim();
  if (hash.startsWith("/")) return clean(hash);
  if (hash) return clean(`/${hash}`);

  // derive from pathname if no hash
  let p = location.pathname.replace(BASE, "");
  if (!p || p === "/" || p.endsWith(".html")) return "/home";
  return clean(p);
}

/**
 * Update page meta tags based on route
 * @param {string} route - Current route
 */
function updateMeta(route) {
  const meta = ROUTE_META[route] || ROUTE_META["/"];
  document.title = meta.title;

  let descTag = document.querySelector('meta[name="description"]');
  if (!descTag) {
    descTag = document.createElement("meta");
    descTag.name = "description";
    document.head.appendChild(descTag);
  }
  descTag.setAttribute("content", meta.desc);
}

/**
 * Render content for a given route
 * @param {string} route - Route to render
 */
export async function render(route) {
  const main = document.getElementById("main-content");
  main.innerHTML = `<div class="loading">Loading…</div>`;

  // map route to content file: "/about" -> "/content/about.html"
  const file = `${CONTENT_DIR}${route}.html`;
  try {
    const view = await fetchHTML(file);
    main.innerHTML = view;
  } catch (e) {
    // try 404 fallback
    try {
      window.location.replace("/404.html");
    } catch {
      main.innerHTML = `<p>⚠️ Couldn't load <code>${file}</code> and no 404.html found.</p>`;
    }
  }

  // Wire up any new links and update UI
  wireInternalLinks();
  markActiveNav(route);
  stylizeLinks();
  updateMeta(route);

  // Scroll to top for new views
  window.scrollTo({ top: 0, behavior: "instant" });
}

/**
 * Initialize router event listeners
 */
export function initRouter() {
  window.addEventListener("hashchange", () => render(currentRoute()));
  window.addEventListener("popstate", () => render(currentRoute()));
}
