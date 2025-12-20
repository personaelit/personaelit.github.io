/**
 * Template Management Module
 * Loads and mounts header/footer templates
 */

import { TEMPLATES } from './config.js';
import { fetchHTML } from './utils.js';
import { wireInternalLinks, markActiveNav } from './ui.js';
import { currentRoute } from './router.js';

/**
 * Load and mount header and footer templates
 */
export async function mountTemplates() {
  const [header, footer] = await Promise.all([
    fetchHTML(TEMPLATES.header).catch(() => "<!-- missing header -->"),
    fetchHTML(TEMPLATES.footer).catch(() => "<!-- missing footer -->"),
  ]);

  document.getElementById("header").innerHTML = header;
  document.getElementById("footer").innerHTML = footer;

  // Wire any links that appeared in templates
  wireInternalLinks();
  markActiveNav(currentRoute());
}
