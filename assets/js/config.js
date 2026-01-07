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
    title: "I'm so vain, I probably think this site is about me.",
    desc: "This is a place for me to post real stuff that is important to me as a person, not as a cog in the machine."
  },
  "/digital-craft": {
    title: "Stuff I made.",
    desc: "Stuff I made using LLMs and other digital tools."
  }
};

export const THEME_KEY = 'theme';

export const ANIMATION_CONFIG = {
  intervalMs: 2500,
  minContrast: 4.5,
  hueStep: 0.3
};
