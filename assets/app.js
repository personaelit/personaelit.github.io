// app.js
// --- config -------------------------------------------------
const BASE = ""; // if you publish under a subdir, set e.g. "/mysite"
const TEMPLATES = { header: "/templates/header.html", footer: "/templates/footer.html" };
const CONTENT_DIR = "/content";

const ROUTE_META = {
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


// --- tiny fetch helper with cache & error handling ----------
const cache = new Map();
async function html(url) {
    const key = new URL(url, location.origin).toString();
    if (cache.has(key)) return cache.get(key);
    const res = await fetch(key, { credentials: "same-origin", cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch ${url} -> ${res.status}`);
    const text = await res.text();
    cache.set(key, text);
    return text;
}

// --- template loader ----------------------------------------
async function mountTemplates() {
    const [h, f] = await Promise.all([
        html(TEMPLATES.header).catch(() => "<!-- missing header -->"),
        html(TEMPLATES.footer).catch(() => "<!-- missing footer -->"),
    ]);
    document.getElementById("header").innerHTML = h;
    document.getElementById("footer").innerHTML = f;
    wireInternalLinks();           // wire any links that appeared in header
    markActiveNav(currentRoute()); // set active class based on current route
}

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


// --- routing ------------------------------------------------
// Priority: hash route (#/about) → path route (/about) → "home"
function currentRoute() {
    const hash = location.hash.replace(/^#/, "").trim();
    if (hash.startsWith("/")) return clean(hash);
    if (hash) return clean(`/${hash}`);

    // derive from pathname if no hash
    let p = location.pathname.replace(BASE, "");
    if (!p || p === "/" || p.endsWith(".html")) return "/home";
    return clean(p);
}

function clean(path) {
    // normalize: "/about/" -> "/about"
    return ("/" + path.replace(/^\/*/, "").replace(/\/*$/, "")).toLowerCase() || "/home";
}

async function render(route) {
    const main = document.getElementById("main-content");
    main.innerHTML = `<div class="loading">Loading…</div>`;

    // map route to content file: "/about" -> "/content/about.html"
    const file = `${CONTENT_DIR}${route}.html`;
    try {
        const view = await html(file);
        main.innerHTML = view;
    } catch (e) {
        // try 404 fallback
        try {
            window.location.replace("/404.html");
        } catch {
            main.innerHTML = `<p>⚠️ Couldn’t load <code>${file}</code> and no 404.html found.</p>`;
        }
    }

    // any fresh links inside main need wiring too
    wireInternalLinks();
    markActiveNav(route);
    // optional: scroll restore to top for new views
    window.scrollTo({ top: 0, behavior: "instant" });
    stylizeLinks();     // safe to run here

    updateMeta(route);

}

// --- navigation wiring (opt-in via data-link) ---------------
function isInternal(href) {
    try {
        const u = new URL(href, location.origin);
        return u.origin === location.origin;
    } catch { return false; }
}

function wireInternalLinks(root = document) {
    root.querySelectorAll('a[data-link]').forEach(a => {
        a.addEventListener('click', (e) => {
            // allow ctrl/cmd click to open new tab
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const href = a.getAttribute('href');
            if (!href || !isInternal(href)) return;

            e.preventDefault();
            const route = href.startsWith("#") ? clean(href.replace(/^#/, "")) : clean(href);
            // Use hash so static hosts don’t 404 on refresh
            history.pushState({ route }, "", `#${route}`);
            render(route);
        });
    });
}

// --- active nav highlighting (optional) ---------------------
function markActiveNav(route) {
    console.log(route);
    document.querySelectorAll('[data-nav]').forEach(el => {
        const target = clean(el.getAttribute('data-nav') || "");
        el.classList.toggle('active', target === route);
    });
}

// --- boot & listeners --------------------------------------
window.addEventListener("hashchange", () => render(currentRoute()));
window.addEventListener("popstate", () => render(currentRoute()));

(async function boot() {
    await mountTemplates();
    await render(currentRoute());
})();


function onElement(selector, cb) {
    const found = document.querySelector(selector);
    if (found) return cb(found);
    const obs = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) { obs.disconnect(); cb(el); }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
}

window.addEventListener('DOMContentLoaded', async () => {
    startColorTransition();

    await mountTemplates();
    initThemeToggle();
    initHamburger();
    setYear();
});


function setYear() {
    document.getElementById('year').textContent = new Date().getFullYear();

}

function initThemeToggle() {
    const KEY = 'theme';
    const el = document.documentElement;
    const btn = document.getElementById('themeToggle');
    const metaEl = document.querySelector('.mantra');
    if (!btn || btn.dataset.bound) return;
    btn.dataset.bound = '1';

    // figure starting theme
    const saved = localStorage.getItem(KEY);
    const system = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const current = (el.getAttribute('data-theme') || saved || system);

    // apply starting state
    el.setAttribute('data-theme', current);
    const isDark = current === 'dark';
    btn.classList.toggle('is-dark', isDark);
    btn.setAttribute('aria-pressed', String(isDark));
    if (metaEl) {
        metaEl.innerHTML = isDark
            ? metaEl.innerHTML.replace(/🖤/g, '🤍')
            : metaEl.innerHTML.replace(/🤍/g, '🖤');
    }

    // toggle click
    btn.addEventListener('click', () => {
        const next = el.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        el.setAttribute('data-theme', next);
        localStorage.setItem(KEY, next);

        const darkNow = next === 'dark';
        btn.classList.toggle('is-dark', darkNow);
        btn.setAttribute('aria-pressed', String(darkNow));

        if (metaEl) {
            metaEl.innerHTML = darkNow
                ? metaEl.innerHTML.replace(/🖤/g, '🤍')
                : metaEl.innerHTML.replace(/🤍/g, '🖤');
        }
    });

    // follow system changes only if user hasn't explicitly chosen
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(KEY)) {
            const next = e.matches ? 'dark' : 'light';
            el.setAttribute('data-theme', next);

            const darkNow = next === 'dark';
            btn.classList.toggle('is-dark', darkNow);
            btn.setAttribute('aria-pressed', String(darkNow));

            if (metaEl) {
                metaEl.innerHTML = darkNow
                    ? metaEl.innerHTML.replace(/🖤/g, '🤍')
                    : metaEl.innerHTML.replace(/🤍/g, '🖤');
            }
        }
    });
}


function startColorTransition({
  intervalMs = 2500,
  minContrast = 4.5,          // WCAG AA
  hueStep = 0.3,
  start = null                // optional: {h,s,l} to seed
} = {}) {
  // Respect user preferences & opt-out switch
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  if (document.body?.dataset?.anim === 'off') return;

  // Utilities ------------- //
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function hslToRgb(h, s, l) {
    // h: 0-360, s/l: 0-100
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0), f(8), f(4)].map(v => Math.round(v * 255));
  }

  const srgbToLinear = v => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };

  function relativeLuminance(rgb) {
    const [r, g, b] = rgb.map(srgbToLinear);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function contrastRatio(rgb1, rgb2) {
    const L1 = relativeLuminance(rgb1);
    const L2 = relativeLuminance(rgb2);
    const [light, dark] = L1 > L2 ? [L1, L2] : [L2, L1];
    return (light + 0.05) / (dark + 0.05);
  }

  function pickTextColor(bgRgb) {
    // Compare against near-black and near-white used in your theme
    const darkText = [15, 23, 42];   // ~ #0f172a (slate-900)
    const lightText = [230, 237, 243]; // ~ #e6edf3
    const cDark = contrastRatio(bgRgb, darkText);
    const cLight = contrastRatio(bgRgb, lightText);
    return cDark >= cLight ? { rgb: darkText, hex: '#0f172a' } : { rgb: lightText, hex: '#e6edf3' };
  }

  function ensureContrast({ h, s, l }, minRatio) {
    // Try current bg; if under target, nudge lightness toward a better contrast
    let L = l;
    let tries = 0;
    const maxTries = 60;

    // Decide target text first for direction
    let bgRgb = hslToRgb(h, s, L);
    let { rgb: textRgb } = pickTextColor(bgRgb);

    // If contrast is low, walk lightness up/down depending on which text we picked
    while (contrastRatio(bgRgb, textRgb) < minRatio && tries++ < maxTries) {
      // If text is light, make bg darker; if text is dark, make bg lighter
      L += (textRgb === '#e6edf3' || textRgb[0] > 128) ? -1 : 1;
      L = clamp(L, 5, 95);
      bgRgb = hslToRgb(h, s, L);
    }

    // After adjustment, re-pick the better text color (in case direction flipped)
    const choice = pickTextColor(bgRgb);
    return { h, s, l: L, bgRgb, textHex: choice.hex };
  }

  // Init random-ish state ------- //
  let hue = start?.h ?? Math.floor(Math.random() * 360);
  let saturation = start?.s ?? 65;          // keep fairly vivid to avoid muddy grays
  let lightness = start?.l ?? 22;           // start comfortably dark

  let satDir = 1;
  let lightDir = 1;

  function step() {
    hue = (hue + hueStep) % 360;

    // Gentle ping-pong for saturation and lightness (kept in safe bands)
    if (saturation >= 80 || saturation <= 55) satDir *= -1;
    saturation = clamp(saturation + satDir, 55, 80);

    if (lightness >= 85 || lightness <= 15) lightDir *= -1;
    lightness = clamp(lightness + lightDir, 15, 85);

    // Propose a bg
    const proposed = { h: hue, s: saturation, l: lightness };
    // Adjust to meet contrast and pick matching text color
    const { l, bgRgb, textHex } = ensureContrast(proposed, minContrast);
    lightness = l; // keep the adjusted L as the new baseline

    const bgCss = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    // Apply both in same frame to avoid illegible flash
    const root = document.documentElement;
    document.body.style.setProperty('--bg', bgCss);
    root.style.setProperty('--text', textHex);

    // If your CSS uses body background-color directly, set it too:
    document.body.style.backgroundColor = bgCss;
    document.body.style.color = textHex;
  }

  // Pause when tab hidden (saves battery/CPU)
  function onVis() {
    if (document.hidden && window.colorTransitionInterval) {
      clearInterval(window.colorTransitionInterval);
      window.colorTransitionInterval = null;
    } else if (!document.hidden && !window.colorTransitionInterval) {
      window.colorTransitionInterval = setInterval(step, intervalMs);
    }
  }
  document.addEventListener('visibilitychange', onVis);

  // Clear any existing interval before starting a new one
  if (window.colorTransitionInterval) {
    clearInterval(window.colorTransitionInterval);
  }

  // First paint is safe (no flash)
  step();
  window.colorTransitionInterval = setInterval(step, intervalMs);
}

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function initHamburger() {

    // measure header height → CSS var
    const headerEl = document.querySelector('.site-header');
    if (headerEl) {
        const setHeaderH = () =>
            document.documentElement.style.setProperty('--header-h', `${headerEl.getBoundingClientRect().height}px`);
        setHeaderH();
        window.addEventListener('resize', setHeaderH, { passive: true });
    }


    const hambugerBtn = document.querySelector('.nav-toggle');
    const menu = document.getElementById('primary-nav');

    if (!hambugerBtn || !menu) return;

    function setOpen(open) {
        const btn = document.querySelector('.nav-toggle');
        const menu = document.getElementById('primary-nav');

        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

        if (open) {
            menu.removeAttribute('hidden');            // render so it can slide in
            document.body.setAttribute('data-menu-open', 'true');
        } else {
            document.body.removeAttribute('data-menu-open');
            menu.setAttribute('hidden', '');           // hide from a11y/focus
        }
    }


    hambugerBtn.addEventListener('click', () => {

        const open = hambugerBtn.getAttribute('aria-expanded') !== 'true';

        setOpen(open);
    });

    // Close on Escape and when clicking outside
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hambugerBtn.getAttribute('aria-expanded') === 'true') setOpen(false);
    });
    document.addEventListener('click', (e) => {
        if (hambugerBtn.getAttribute('aria-expanded') !== 'true') return;
        if (!menu.contains(e.target) && !hambugerBtn.contains(e.target)) setOpen(false);
    });

    // Optional: close on nav link click
    menu.addEventListener('click', (e) => {
        const t = e.target;
        if (t instanceof HTMLElement && (t.tagName === 'A' || t.classList.contains('theme-toggle'))) {
            setOpen(false);
        }
    });
}

function stylizeLinks() {

    const links = document.querySelectorAll("a");

    // Iterate through each link
    links.forEach(link => {
        // Check if the link is external
        if (link.href.includes("mailto")) {
            link.classList.add("mailto");
        }
        else if (link.hostname !== window.location.hostname) {
            // Add a class to the external link
            link.classList.add("external");
        }
    });
}

