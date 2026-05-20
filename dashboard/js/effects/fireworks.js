let rockets = [], particles = [];
let launchTimer = 0;

function mkRocket(x, y, vx, vy, hue) {
  return { x, y, vx, vy, hue, trail: [] };
}

function explode(r) {
  const count = 70 + Math.floor(Math.random() * 40);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const speed = Math.random() * 5 + 1;
    particles.push({
      x: r.x, y: r.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      decay: 0.012 + Math.random() * 0.018,
      hue: r.hue + (Math.random() - 0.5) * 40,
      size: 2 + Math.random() * 2
    });
  }
}

export function hasPending() { return rockets.length > 0 || particles.length > 0; }

export function grandFinale(clickX, clickY) {
  const dist = Math.max(window.innerHeight - clickY, 100);
  const baseVy = -Math.sqrt(0.4 * dist);
  const count = 8 + Math.floor(Math.random() * 5);
  for (let i = 0; i < count; i++) {
    const startX = clickX + (Math.random() - 0.5) * 200;
    const targetX = clickX + (Math.random() - 0.5) * 150;
    const frames = Math.abs(baseVy) / 0.2;
    rockets.push(mkRocket(
      startX, window.innerHeight,
      (targetX - startX) / frames,
      baseVy * (0.88 + Math.random() * 0.24),
      Math.random() * 360
    ));
  }
}

export function init() { launchTimer = 0; }

export function stop() { rockets = []; particles = []; }

export function tickAll(ctx, isActive) {
  if (isActive && --launchTimer <= 0) {
    rockets.push(mkRocket(
      Math.random() * window.innerWidth, window.innerHeight,
      (Math.random() - 0.5) * 3, -(Math.random() * 5 + 10),
      Math.random() * 360
    ));
    launchTimer = 45 + Math.floor(Math.random() * 55);
  }
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    r.trail.push({ x: r.x, y: r.y });
    if (r.trail.length > 8) r.trail.shift();
    r.x += r.vx; r.y += r.vy; r.vy += 0.2;
    for (let t = 0; t < r.trail.length; t++) {
      ctx.beginPath();
      ctx.arc(r.trail[t].x, r.trail[t].y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${r.hue},100%,70%,${(t / r.trail.length) * 0.6})`;
      ctx.fill();
    }
    if (r.vy >= 0) { explode(r); rockets.splice(i, 1); }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.07; p.vx *= 0.97; p.vy *= 0.97;
    p.life -= p.decay;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue},100%,65%,${p.life})`;
    ctx.fill();
  }
}
