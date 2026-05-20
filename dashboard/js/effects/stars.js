import * as ufo from './ufo.js';

let starsList = [];
let shootingStars = [];

function mkStar() {
  return {
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: 0.4 + Math.random() * 1.3,
    phase: Math.random() * Math.PI * 2,
    speed: 0.007 + Math.random() * 0.015,
    hue: 210 + Math.floor(Math.random() * 55)
  };
}

function drawStarField(ctx) {
  for (const s of starsList) {
    s.phase += s.speed;
    const op = 0.3 + Math.abs(Math.sin(s.phase)) * 0.65;
    ctx.save();
    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4.5);
    g.addColorStop(0, `hsla(${s.hue},70%,98%,${op})`);
    g.addColorStop(1, `hsla(${s.hue},70%,95%,0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `hsla(${s.hue},50%,100%,${Math.min(1, op * 1.5)})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

export function launchShootingStar() {
  const dir = Math.random() < 0.5 ? 1 : -1;
  const speed = 22 + Math.random() * 14;
  const pitch = 0.22 + Math.random() * 0.22;
  shootingStars.push({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight * 0.7,
    vx: dir * speed,
    vy: pitch * speed,
    trail: [],
    life: 1.0,
    decay: 0.015 + Math.random() * 0.008
  });
}

export function hasPendingShooting() { return shootingStars.length > 0; }

function drawShootingStars(ctx) {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    s.trail.push({ x: s.x, y: s.y });
    if (s.trail.length > 34) s.trail.shift();
    s.x += s.vx; s.y += s.vy;
    s.life -= s.decay;
    if (s.life <= 0) { shootingStars.splice(i, 1); continue; }
    for (let t = 1; t < s.trail.length; t++) {
      const frac = t / s.trail.length;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(s.trail[t - 1].x, s.trail[t - 1].y);
      ctx.lineTo(s.trail[t].x, s.trail[t].y);
      ctx.strokeStyle = `rgba(255,255,245,${frac * s.life * 0.88})`;
      ctx.lineWidth = frac * 3 * s.life;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    }
    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 10);
    g.addColorStop(0,    `rgba(255,255,252,${s.life})`);
    g.addColorStop(0.45, `rgba(180,220,255,${s.life * 0.5})`);
    g.addColorStop(1,    `rgba(100,160,255,0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(s.x, s.y, 10, 0, Math.PI * 2); ctx.fill();
  }
}

export function init() {
  starsList = Array.from({length: 180}, mkStar);
  ufo.list.length = 0;
  ufo.resetTimer();  // prime the spawn timer
}

export function stop() {
  starsList = [];
  shootingStars = [];
  ufo.list.length = 0;
}

export function tickAll(ctx) {
  drawStarField(ctx);
  ufo.maybeSpawn();
  for (let i = ufo.list.length - 1; i >= 0; i--) {
    const u = ufo.list[i];
    ufo.tickDraw(ctx, u);
    if (u.state === 'leaving' && (u.x < -150 || u.x > innerWidth + 150 || u.y < -150 || u.y > innerHeight + 150)) {
      ufo.list.splice(i, 1);
    }
  }
  if (shootingStars.length > 0) drawShootingStars(ctx);
}

export function tickShootingOnly(ctx) {
  if (shootingStars.length > 0) drawShootingStars(ctx);
}
