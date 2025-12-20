// ================================================================
// Zen FX — the whole kit & kaboodle (perf-tuned)
// ================================================================

// --- tiny style injection (controls + mushroom keyframes)
(function ensureZenStyles() {
    if (document.getElementById('zen-style')) return;
    const css = `
    .zen-container{
      position:fixed;
      right:12px;
      bottom:12px;
      display:flex;
      flex-wrap:wrap;
      gap:8px;
      z-index:4000;
      max-width:calc(100vw - 24px);
    }
    .zen-control{
      font-size:18px;
      line-height:1;
      padding:8px 10px;
      border-radius:12px;
      border:1px solid rgba(255,255,255,.15);
      background:rgba(15,23,42,.65);
      color:#e5e7eb;
      cursor:pointer;
      backdrop-filter:blur(6px);
      flex:0 1 auto;
      min-width:44px; /* tappable target */
    }
    .zen-control:hover{
      transform:translateY(-1px);
    }
    .broken-link{
      outline:2px solid #ef4444;
      outline-offset:2px;
    }
    @keyframes psychedelicPulse {
      0%{filter:hue-rotate(0deg)saturate(100%)brightness(100%);}
      50%{filter:hue-rotate(120deg)saturate(160%)brightness(130%);}
      100%{filter:hue-rotate(360deg)saturate(100%)brightness(100%);}
    }
    @media (max-width:480px){
      .zen-container{
        left:12px;
        right:12px;
        justify-content:center;
      }
    }
    @media (max-height:520px){
      .zen-container{ bottom:8px; }
    }
  `;
    const style = document.createElement('style');
    style.id = 'zen-style';
    style.textContent = css;
    document.head.appendChild(style);
})();

// ================================================================
// Effect Manager (single loop per effect; start/stop controlled)
// ================================================================
const Effects = new Map();
/**
 * registerEffect({ id, zIndex, init(ctx, canvas), frame(dt, ctx, canvas), resize(ctx, canvas), cleanup(ctx, canvas) })
 * Returns { start(), stop(), canvas }
 */
function registerEffect({ id, zIndex = '0', init, frame, resize, cleanup }) {
    const canvas = document.createElement('canvas');
    canvas.id = id;
    canvas.className = id;
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.zIndex = String(zIndex);
    canvas.style.pointerEvents = 'none';
    canvas.style.display = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function size() {
        const dprRaw = window.devicePixelRatio || 1;
        const dpr = Math.max(1, Math.min(2, dprRaw));
        const cssW = Math.ceil(window.innerWidth);
        const cssH = Math.ceil(Math.max(window.innerHeight, document.documentElement.clientHeight));

        // store CSS-space dims on the canvas
        canvas._cssW = cssW;
        canvas._cssH = cssH;
        canvas._dpr = dpr;

        canvas.width = Math.floor(cssW * dpr);
        canvas.height = Math.floor(cssH * dpr);
        canvas.style.width = cssW + 'px';
        canvas.style.height = cssH + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (resize) resize(ctx, canvas);
    }
    size();
    window.addEventListener('resize', throttle(size, 150), { passive: true });

    let raf = 0;
    let running = false;
    let last = performance.now();

    function loop(now) {
        if (!running) return;
        const dt = Math.min(0.05, (now - last) / 1000); // cap dt
        last = now;
        frame && frame(dt, ctx, canvas);
        raf = requestAnimationFrame(loop);
    }

    function start() {
        if (running) return;
        running = true;
        canvas.style.display = 'block';
        last = performance.now();
        init && init(ctx, canvas);
        raf = requestAnimationFrame(loop);
    }
    function stop() {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        canvas.style.display = 'none';
        cleanup && cleanup(ctx, canvas);
    }

    const api = { start, stop, canvas };
    Effects.set(id, api);
    return api;
}

function throttle(fn, wait) {
    let t = 0, saved, to;
    return function (...args) {
        const now = Date.now();
        if (now - t >= wait) { t = now; fn.apply(this, args); }
        else {
            saved = args; clearTimeout(to);
            to = setTimeout(() => { t = Date.now(); fn.apply(this, saved || []); }, wait - (now - t));
        }
    };
}

function createZenContainer() {
    let el = document.querySelector('.zen-container');
    if (!el) {
        el = document.createElement('div');
        el.className = 'zen-container';
        document.body.appendChild(el);
    }
    return el;
}

// Toggle buttons now start/stop effects instead of only flipping display
function createToggleButton({ icon, className, localStorageKey, effectId }) {
    const btn = document.createElement('button');
    btn.innerText = icon;
    btn.className = `${className} zen-control`;
    createZenContainer().appendChild(btn);

    const eff = Effects.get(effectId);
    if (!eff) return;

    function set(enabled) {
        localStorage.setItem(localStorageKey, enabled ? 'enabled' : 'disabled');
        enabled ? eff.start() : eff.stop();
    }
    btn.addEventListener('click', () => {
        const on = localStorage.getItem(localStorageKey) !== 'enabled';
        set(on);
    });

    if (localStorage.getItem(localStorageKey) === 'enabled') eff.start();
}

// ================================================================
// Non-canvas utilities (💡 dark mode, 🍄 pulse, 💣 blow up, 404 checker)
// ================================================================
function createLightSwitch() {
    const btn = document.createElement('button');
    btn.innerText = '💡';
    btn.className = 'light-toggle zen-control';
    createZenContainer().appendChild(btn);

    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.body.style.backgroundColor = '#111';
        document.body.style.color = '#eee';
        document.body.style.filter = 'grayscale(100%)';
    }

    btn.addEventListener('click', () => {
        document.body.style.transition = 'background-color 1s, color 1s';
        const dark = document.body.classList.toggle('dark-mode');
        if (dark) {
            document.body.style.backgroundColor = '#111';
            document.body.style.color = '#eee';
            document.body.style.filter = 'grayscale(100%)';
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            document.body.style.filter = 'grayscale(0%)';
            localStorage.setItem('dark-mode', 'disabled');
        }
    });
}

function createMushroomPulse() {
    const btn = document.createElement('button');
    btn.innerText = '🍄';
    btn.className = 'mushroom-toggle zen-control';
    createZenContainer().appendChild(btn);

    btn.addEventListener('click', () => {
        applyPsychedelicEffects();
        clearTimeout(+btn.dataset.timeoutId || 0);
        const timeoutId = setTimeout(removePsychedelicEffects, 6900);
        btn.dataset.timeoutId = String(timeoutId);
    });

    function applyPsychedelicEffects() {
        document.querySelectorAll('*').forEach(el => {
            el.style.animation = `psychedelicPulse ${1 + Math.random() * 2.2}s infinite ease-in-out`;
        });
    }
    function removePsychedelicEffects() {
        document.querySelectorAll('*').forEach(el => { el.style.animation = ''; });
    }
}

function createSelfDestruct() {
    const btn = document.createElement('button');
    btn.id = 'selfDestructButton';
    btn.innerText = '💣';
    btn.className = 'deconstruct zen-control';
    createZenContainer().appendChild(btn);

    btn.addEventListener('click', () => {
        const stack = [document.body];
        const all = [];
        while (stack.length) {
            const cur = stack.pop();
            all.push(cur);
            for (let i = 0; i < cur.children.length; i++) stack.push(cur.children[i]);
        }
        all.forEach(el => {
            el.style.transition = 'transform 2s ease-in, opacity 2s ease-in';
            el.style.transform = `translate(${Math.random() * window.innerWidth - window.innerWidth / 2}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`;
        });
        setTimeout(() => location.reload(), 6900);
    });
}

// ================================================================
// Effects (Spotlight, Rain, Clouds, Rocket, Flowers, Sheen, Sun)
// ================================================================

// Spotlight — idle unless mouse moved recently
(function activateSpotlight() {
    let mouseX = 0, mouseY = 0, dirty = true, lastMove = 0, radius = 100;

    registerEffect({
        id: 'spotlight-canvas',
        zIndex: '3000',
        init(ctx, canvas) { radius = Math.min(canvas.clientWidth, canvas.clientHeight) / 5; },
        frame(_, ctx, canvas) {
            if (!dirty && performance.now() - lastMove > 150) return;
            dirty = false;

            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            ctx.fillStyle = 'rgba(0,0,0,0.08)';
            ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

            const g = ctx.createRadialGradient(mouseX, mouseY, radius * 0.5, mouseX, mouseY, radius);
            g.addColorStop(0, 'rgba(255,255,255,0.02)');
            g.addColorStop(0.6, 'rgba(255,255,255,0.5)');
            g.addColorStop(1, 'rgba(0,0,0,1)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        },
        resize(_, canvas) { radius = Math.min(canvas.clientWidth, canvas.clientHeight) / 5; }
    });

    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; dirty = true; lastMove = performance.now(); }, { passive: true });
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length) { mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; dirty = true; lastMove = performance.now(); }
    }, { passive: true });

    createToggleButton({ icon: '🔦', className: 'spotlight-toggle', localStorageKey: 'spotlight-mode', effectId: 'spotlight-canvas' });
})();

// Rain — capped drops, dt-scaled
(function letItRain() {
    const MAX_DROPS = 1800;
    let drops = [];

    registerEffect({
        id: 'rain-canvas',
        zIndex: '10000',
        init(_, canvas) {
            const target = Math.min(MAX_DROPS, Math.floor(window.innerWidth * 1.2));
            drops = Array.from({ length: target }, () => makeDrop(canvas));
        },
        frame(dt, ctx, canvas) {
            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            ctx.strokeStyle = 'rgba(173,216,230,0.6)';
            ctx.lineWidth = 1.25;
            ctx.lineCap = 'round';

            const s = dt * 60;
            for (let i = 0; i < drops.length; i++) {
                const d = drops[i];
                ctx.globalAlpha = d.o;
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x, d.y + d.len);
                ctx.stroke();

                d.y += d.v * s;
                if (d.y > canvas.height) resetDrop(d, canvas);
            }
            ctx.globalAlpha = 1;
        },
        resize(_, canvas) {
            for (let i = 0; i < drops.length; i++) {
                if (drops[i].x > canvas.clientWidth) drops[i].x = Math.random() * canvas.clientWidth;
            }
        }
    });

    createToggleButton({ icon: '☔', className: 'rain-toggle', localStorageKey: 'rain-mode', effectId: 'rain-canvas' });

    function makeDrop(canvas) {
        return { x: Math.random() * canvas.width, y: Math.random() * canvas.height, v: 4 + Math.random() * 6, len: 8 + Math.random() * 22, o: 0.2 + Math.random() * 0.5 };
    }
    function resetDrop(d, canvas) {
        d.y = -d.len;
        d.x = Math.random() * canvas.width;
        d.v = 4 + Math.random() * 6;
    }
})();

// Clouds — cached color, light drift
(function cloudsComeRollingIn() {
    const clouds = [];
    let cloudColor = 'white';

    registerEffect({
        id: 'cloud-canvas',
        zIndex: '-1',
        init(ctx, canvas) {
            const n = Math.max(5, Math.floor(window.innerWidth / 250));
            clouds.length = 0;
            for (let i = 0; i < n; i++) {
                clouds.push({ x: Math.random() * canvas.clientWidth, y: Math.random() * (canvas.clientHeight / 2), v: 0.05 + Math.random() * 0.35 });
            }
            cloudColor = pickContrasting(document.body);
            ctx.font = `180px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
        },
        frame(dt, ctx, canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const s = dt * 60;
            for (const c of clouds) {
                ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillText('☁️', c.x + 3, c.y + 3);
                ctx.fillStyle = cloudColor; ctx.fillText('☁️', c.x, c.y);
                c.x += c.v * s;
                if (c.x > canvas.clientWidth + 60) c.x = -60;
            }
        },
        resize(ctx) { ctx.font = `180px Arial`; }
    });

    createToggleButton({ icon: '☁️', className: 'cloud-toggle', localStorageKey: 'cloud-mode', effectId: 'cloud-canvas' });

    function pickContrasting(el) {
        const rgb = getComputedStyle(el).backgroundColor.match(/\d+/g)?.map(Number) || [11, 17, 33];
        const b = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
        return b > 128 ? 'black' : 'white';
    }
})();

// Rocket — target seeking, dt-scaled
// === ROCKET (CSS-size aware) ===================================
(function launchRocket() {
  const rocket = '🚀';
  let x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0;
  let margin = 80, accel = 0.08, maxSpeed = 6, size = 200;

  registerEffect({
    id: 'rocket-canvas',
    zIndex: '101', // sits above sun; adjust to taste
    init(ctx, canvas) {
      const W = canvas.clientWidth, H = canvas.clientHeight;
      size = W < 600 ? 120 : 200;
      x = W / 2; y = H / 2;
      ({ x: tx, y: ty } = pickTarget(canvas));
      vx = (Math.random() - 0.5) * 2;
      vy = (Math.random() - 0.5) * 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${size}px sans-serif`;
    },
    frame(dt, ctx, canvas) {
      const W = canvas.clientWidth, H = canvas.clientHeight;
      ctx.clearRect(0, 0, W, H);

      const s = dt * 60;
      const dx = tx - x, dy = ty - y;
      const dist = Math.hypot(dx, dy) || 1;

      vx += (dx / dist) * accel * s;
      vy += (dy / dist) * accel * s;

      const sp = Math.hypot(vx, vy);
      if (sp > maxSpeed) { vx *= maxSpeed / sp; vy *= maxSpeed / sp; }

      x += vx * s; y += vy * s;

      if (dist < 20) ({ x: tx, y: ty } = pickTarget(canvas));

      if (x < -margin || x > W + margin) {
        vx *= -1;
        tx = clamp(Math.random() * W, margin, W - margin);
      }
      if (y < -margin || y > H + margin) {
        vy *= -1;
        ty = clamp(Math.random() * H, margin, H - margin);
      }

      const angle = Math.atan2(vy, vx) + Math.PI / 4;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(rocket, 0, 0);
      ctx.restore();
    },
    resize(ctx, canvas) {
      const W = canvas.clientWidth, H = canvas.clientHeight;
      size = W < 600 ? 120 : 200;
      ctx.font = `${size}px sans-serif`;
      x = clamp(x, 0, W);
      y = clamp(y, 0, H);
      // Optional: retarget to keep motion interesting after a big resize
      ({ x: tx, y: ty } = pickTarget(canvas));
    }
  });

  createToggleButton({
    icon: '🚀',
    className: 'rocket-toggle',
    localStorageKey: 'rocket-mode',
    effectId: 'rocket-canvas'
  });

  function pickTarget(canvas) {
    const W = canvas.clientWidth, H = canvas.clientHeight;
    return {
      x: Math.random() * (W - 2 * margin) + margin,
      y: Math.random() * (H - 2 * margin) + margin
    };
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
})();


// Flowers — limited count, object reuse
(function letItGrow() {
    const EMO = ['🌸', '🌼', '🌻', '🌺', '🌹', '🌷', '💐', '🌿', '🍀'];
    const flowers = [];
    const MAX_FLOWERS = 20;

    registerEffect({
        id: 'flower-canvas',
        zIndex: '0',
        init(ctx, canvas) {
            flowers.length = 0;
            const n = Math.min(MAX_FLOWERS, 14 + Math.floor(window.innerWidth / 160));
            for (let i = 0; i < n; i++) {
                flowers.push({
                    e: EMO[(Math.random() * EMO.length) | 0],
                    bx: Math.random() * canvas.clientWidth,
                    by: Math.random() * canvas.clientHeight,
                    ang: Math.random() * Math.PI * 2,
                    size: 44 + Math.random() * 28,
                    swirl: 0.015 + Math.random() * 0.03,
                    spin: 0.3 + Math.random() * 0.7,
                    driftX: (Math.random() - 0.5) * 0.25,
                    driftY: (Math.random() - 0.5) * 0.25
                });
            }
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
        },
        frame(dt, ctx, canvas) {
            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            const s = dt * 60;
            for (const f of flowers) {
                f.bx += f.driftX * s;
                f.by += f.driftY * s;
                if (f.bx > canvas.clientWidth) f.bx = 0;
                if (f.bx < 0) f.bx = canvas.clientWidth;
                if (f.by > canvas.height) f.by = 0;
                if (f.by < 0) f.by = canvas.clientHeight;

                f.ang += f.swirl * s;
                const x = f.bx + Math.cos(f.ang) * 50;
                const y = f.by + Math.sin(f.ang) * 50;

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(f.ang * f.spin);
                ctx.font = `${f.size}px Arial`;
                ctx.fillText(f.e, 0, 0);
                ctx.restore();
            }
        },
        resize() { }
    });

    createToggleButton({ icon: '🌷', className: 'flower-toggle', localStorageKey: 'flower-mode', effectId: 'flower-canvas' });
})();

// Sheen — low overdraw, half-rate hue updates
(function glitterRainbowSheen() {
    let hue = 0, tick = 0;

    registerEffect({
        id: 'sheen-canvas',
        zIndex: '-5',
        init() { hue = 0; tick = 0; },
        frame(_, ctx, canvas) {
            if ((tick++ & 1) === 0) hue = (hue + 1) % 360;
            const g = ctx.createLinearGradient(0, 0, canvas.clientWidth, canvas.clientHeight);
            g.addColorStop(0, `hsl(${hue}, 100%, 76%)`);
            g.addColorStop(0.5, `hsl(${(hue + 60) % 360}, 100%, 76%)`);
            g.addColorStop(1, `hsl(${(hue + 120) % 360}, 100%, 76%)`);
            ctx.globalAlpha = 0.45;
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            ctx.globalAlpha = 1.0;
        },
        resize() { }
    });

    createToggleButton({ icon: '🌈', className: 'sheen-toggle', localStorageKey: 'sheen-mode', effectId: 'sheen-canvas' });
})();

// === SUN (CSS-size aware; shines again) =========================
(function hereComesTheSun() {
    const BASE_RAYS = 120;
    let rays = [], sunX = 0, sunY = 0, sunR = 80;

    registerEffect({
        id: 'sun-canvas',
        zIndex: '100', // keep high so it isn't hidden by page content
        init(ctx, canvas) {
            const W = canvas.clientWidth;   // CSS pixels
            const H = canvas.clientHeight;  // CSS pixels

            sunX = W - 140;
            sunY = 140;
            sunR = Math.min(90, Math.max(60, Math.floor(Math.min(W, H) * 0.08)));

            const n = Math.min(BASE_RAYS, 80 + Math.floor(W / 20));
            rays = [];
            for (let i = 0; i < n; i++) {
                const ang = (Math.PI * 2 * i) / n;
                const jitter = Math.random() * 60;
                rays.push({ ang, len: 140 + jitter });
            }

            ctx.lineWidth = 1;
            ctx.strokeStyle = '#FFFFE0';
        },
        frame(dt, ctx, canvas) {
            const W = canvas.clientWidth;
            const H = canvas.clientHeight;

            // Clear in CSS space (ctx transform already accounts for DPR)
            ctx.clearRect(0, 0, W, H);

            // Sun disk
            ctx.fillStyle = '#FFFFE0';
            ctx.beginPath();
            ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
            ctx.fill();

            // Subtle shimmer
            const rot = (dt * 60) * 0.0025;
            for (const r of rays) r.ang += rot;

            // Rays
            for (const r of rays) {
                const sx = sunX + Math.cos(r.ang) * sunR;
                const sy = sunY + Math.sin(r.ang) * sunR;
                const ex = sunX + Math.cos(r.ang) * (sunR + r.len);
                const ey = sunY + Math.sin(r.ang) * (sunR + r.len);
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(ex, ey);
                ctx.stroke();
            }
        },
        resize(ctx, canvas) {
            const W = canvas.clientWidth;
            const H = canvas.clientHeight;

            sunX = W - 140;
            sunY = 140;
            sunR = Math.min(90, Math.max(60, Math.floor(Math.min(W, H) * 0.08)));

            ctx.lineWidth = 1;
        }
    });

    createToggleButton({
        icon: '☀️',
        className: 'sun-toggle',
        localStorageKey: 'sun-mode',
        effectId: 'sun-canvas'
    });
})();


// ================================================================
// Boot — controls + optional random effect (respect reduced motion)
// ================================================================
function activateRandomEffectIfNeeded() {
    const effects = [
        { key: 'rocket-mode', id: 'rocket-canvas' },
        { key: 'flower-mode', id: 'flower-canvas' },
        { key: 'sheen-mode', id: 'sheen-canvas' },
        { key: 'rain-mode', id: 'rain-canvas' },
        { key: 'sun-mode', id: 'sun-canvas' },
        { key: 'cloud-mode', id: 'cloud-canvas' }
    ];
    const hasAny = effects.some(e => localStorage.getItem(e.key) !== null);
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hasAny || prefersReduced) return;
    const pick = effects[Math.floor(Math.random() * effects.length)];
    localStorage.setItem(pick.key, 'enabled');
    const eff = Effects.get(pick.id);
    if (eff) eff.start();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("The Zen is upon us.");

    // Non-canvas UI
    createLightSwitch();
    createMushroomPulse();
    createSelfDestruct();

    // Start one random effect if the user hasn't chosen any (and motion allowed)
    activateRandomEffectIfNeeded();
});
