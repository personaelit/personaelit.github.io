# AGENTS.md

## Overview
- This is a static GitHub Pages-style site with no build system or package manager.
- The root site is a small SPA that loads shared templates and page content at runtime.
- Games, apps, and visuals live in their own folders as standalone HTML/CSS/JS pages.

## Key Paths
- `index.html`: SPA entry; loads global CSS and `assets/js/main.js`.
- `assets/js/`: SPA modules (router, templates, theme, UI helpers, utils).
- `assets/styles/`: global design tokens and base/component styles.
- `templates/`: shared header/footer HTML fragments injected by the SPA.
- `content/`: SPA page fragments. Routes map to `/content/<route>.html`.
- `games/`, `apps/`, `visuals/`: standalone experiences with their own `index.html`.

## SPA Routing + Content
- Routes are hash-based to avoid static host 404s. Prefer links like `#/about`.
- `assets/js/router.js` maps a route to `content/<route>.html` and swaps `#main-content`.
- If you add a new route:
  - Create `content/<route>.html`.
  - Add metadata in `assets/js/config.js` under `ROUTE_META`.
  - Add a nav link with `data-link` so `wireInternalLinks()` handles SPA navigation.

## Templates + UI
- `templates/header.html` and `templates/footer.html` are fetched and mounted at runtime.
- Any links in templates should use `data-link` if they should route via the SPA.
- `assets/js/ui.js` handles nav activation and link styling; keep selectors consistent.

## Styling
- Global styles are in `assets/styles/tokens.css`, `base.css`, and `components.css`.
- Keep new global styles in those files; page-specific styles should stay local to their app/game/visual.

## Local Dev
- There are no tests or build steps.
- Use a simple static server if needed (for example `python -m http.server`) so ES modules and fetches work.

