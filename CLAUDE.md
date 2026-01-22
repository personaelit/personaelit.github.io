# CLAUDE.md

This file provides guidance for Claude Code and other AI assistants working on this codebase.

## Project Summary

**Personaelit** is a personal portfolio and creative hub at https://personaelit.com. It showcases hobby games, applications, and visual experiments. The site uses vanilla HTML, CSS, and JavaScript with no build system or package manager.

**Creator:** Jim Smits

## Architecture

### Main Site (SPA)
- Entry point: `index.html` loads `assets/js/main.js`
- Hash-based routing (`#/route`) via `assets/js/router.js`
- Content fragments loaded from `/content/<route>.html`
- Templates (header/footer) fetched and mounted at runtime

### Standalone Experiences
- `games/` - Cellular automata, puzzle games, zero-player games
- `apps/` - Streak tracker, weight tracker, calendar, framework workbook
- `visuals/` - Sacred geometry, dimensional art, meditative visuals

Each standalone experience is completely self-contained with its own HTML, CSS, and JS.

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - CSS Variables, Grid, Flexbox, modern color functions
- **JavaScript (ES6 Modules)** - Native modules, no transpilation
- **Canvas API** - Used extensively in games and visuals
- **Third-party libs** (apps only): Chart.js, canvas-confetti, Sortable.js, Font Awesome

## Key Modules

| Module | Purpose |
|--------|---------|
| `assets/js/main.js` | Bootstrap and initialization |
| `assets/js/router.js` | Hash routing, content loading |
| `assets/js/config.js` | Routes, theme keys, constants |
| `assets/js/templates.js` | Header/footer mounting |
| `assets/js/ui.js` | Navigation, link wiring, menus |
| `assets/js/theme.js` | Dark/light theme toggle |
| `assets/js/utils.js` | Fetch caching, color utilities |
| `assets/js/color-animation.js` | Accessible color transitions |

## CSS Architecture

- `assets/styles/tokens.css` - Design tokens and CSS variables
- `assets/styles/base.css` - Reset, typography, layout primitives
- `assets/styles/components.css` - Header, nav, cards, buttons

**Key variables:** `--bg`, `--surface`, `--text`, `--link`, `--accent`

## Common Tasks

### Adding a New SPA Route
1. Create `content/<route>.html`
2. Add metadata to `ROUTE_META` in `assets/js/config.js`
3. Add nav link with `data-link` attribute

### Adding Internal Links
Use `data-link` attribute for SPA navigation:
```html
<a href="#/digital-craft" data-link>Digital Craft</a>
```

### Working with Themes
- System preference detected automatically
- Manual toggle stored in localStorage under key `theme`
- Values: `light` or `dark`

### Adding a New Game/App/Visual
1. Create folder under `games/`, `apps/`, or `visuals/`
2. Add complete `index.html` (full page, not SPA fragment)
3. Include all CSS and JS locally or inline
4. Link from `content/digital-craft.html` or relevant page

## Development

```bash
# Start local server (required for ES modules)
python -m http.server
# Visit http://localhost:8000
```

No build steps, tests, or npm scripts exist. Changes are live immediately.

## Coding Conventions

**JavaScript:**
- ES6 modules with explicit imports/exports
- Functional style over classes
- camelCase functions, UPPER_CASE constants
- JSDoc comments for parameters

**CSS:**
- Use existing design tokens from `tokens.css`
- Global styles in `assets/styles/`
- Local styles stay with their game/app/visual
- Mobile-first responsive design

**HTML:**
- Semantic markup (`<section>`, `<nav>`, `<main>`)
- Data attributes for behavior (`data-link`, `data-nav`, `data-theme`)
- ARIA labels for accessibility

## Accessibility

- WCAG AA contrast ratios enforced in color-animation.js
- Respects `prefers-reduced-motion: reduce`
- Focus visible outlines
- Keyboard navigation support

## Performance Notes

- Fetch caching in `utils.js` prevents redundant requests
- Color animations pause when tab is hidden
- Games use Canvas API for minimal DOM overhead
- No heavy frameworks or libraries in core site

## File References

When discussing code locations, use the format:
- [router.js](assets/js/router.js)
- [tokens.css](assets/styles/tokens.css)
- [home.html](content/home.html)

## What NOT to Do

- Don't add a build system unless explicitly requested
- Don't create package.json or node_modules
- Don't minify or transpile - raw code is intentional
- Don't add heavy frameworks to the core site
- Don't put shared code in standalone games/apps/visuals
