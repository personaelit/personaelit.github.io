/**
 * Application Configuration
 * All constants and route metadata
 */

export const BASE = ""; // if you publish under a subdir, set e.g. "/mysite"

export const TEMPLATES = {
  header: "/templates/header.html",
  footer: "/templates/footer.html"
};

export const CONTENT_DIR = "/content";

export const ROUTE_META = {
  "/": {
    title: "Jim Smits — Thinker • Doer • Leader",
    desc: "Director of E-commerce, software developer, and builder. Welcome to my online home."
  },
  "/contact": {
    title: "Contact — Jim Smits",
    desc: "Get in touch with Jim — Director of E-commerce, software developer, and builder."
  },
  "/digital-playground": {
    title: "Digital Playground — Jim Smits",
    desc: "Fun projects that I do in my spare time.."
  }
};

export const THEME_KEY = 'theme';

export const ANIMATION_CONFIG = {
  intervalMs: 2500,
  minContrast: 4.5,
  hueStep: 0.3
};
