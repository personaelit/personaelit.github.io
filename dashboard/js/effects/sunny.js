import { isDarkMode } from '../theme.js';

let sunTime = 0;
let clouds = [];

function mkCloud(spreadX) {
  return {
    x: spreadX !== undefined ? spreadX : -220,
    y: 40 + Math.random() * innerHeight * 0.28,
    speed: 0.15 + Math.random() * 0.25,
    scale: 0.7 + Math.random() * 0.9,
    opacity: 0.75 + Math.random() * 0.2,
    dir: 1
  };
}

function drawCloud(ctx, c) {
  ctx.save();
  ctx.globalAlpha = c.opacity;
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  const s = c.scale;
  ctx.beginPath();
  ctx.arc(c.x,          c.y,          s * 28, 0, Math.PI * 2);
  ctx.arc(c.x + s * 40, c.y - s * 12, s * 38, 0, Math.PI * 2);
  ctx.arc(c.x + s * 82, c.y,          s * 28, 0, Math.PI * 2);
  ctx.arc(c.x + s * 44, c.y + s * 14, s * 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSun(ctx) {
  sunTime += 0.001;
  const sx = innerWidth - 110, sy = 95, r = 48;
  const numRays = 10, halfWidth = 0.055;
  const maxDist = Math.hypot(innerWidth, innerHeight) * 1.5;

  for (let i = 0; i < numRays; i++) {
    const angle = (i / numRays) * Math.PI * 2 + sunTime;
    const la = angle - halfWidth, ra = angle + halfWidth;
    const ex = sx + Math.cos(angle) * maxDist;
    const ey = sy + Math.sin(angle) * maxDist;
    const grad = ctx.createLinearGradient(sx, sy, ex, ey);
    grad.addColorStop(0,    'rgba(255,235,80,0.32)');
    grad.addColorStop(0.12, 'rgba(255,220,60,0.15)');
    grad.addColorStop(0.45, 'rgba(255,200,40,0.06)');
    grad.addColorStop(1,    'rgba(255,180,0,0)');
    ctx.save();
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(sx + Math.cos(la) * r, sy + Math.sin(la) * r);
    ctx.lineTo(sx + Math.cos(la) * maxDist, sy + Math.sin(la) * maxDist);
    ctx.lineTo(sx + Math.cos(ra) * maxDist, sy + Math.sin(ra) * maxDist);
    ctx.lineTo(sx + Math.cos(ra) * r, sy + Math.sin(ra) * r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3);
  glow.addColorStop(0,   'rgba(255,240,80,0.35)');
  glow.addColorStop(0.5, 'rgba(255,200,0,0.12)');
  glow.addColorStop(1,   'rgba(255,180,0,0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(sx, sy, r * 3, 0, Math.PI * 2); ctx.fill();

  const sunGrad = ctx.createRadialGradient(sx - 12, sy - 12, 0, sx, sy, r);
  sunGrad.addColorStop(0,    '#fffde0');
  sunGrad.addColorStop(0.35, '#ffe030');
  sunGrad.addColorStop(1,    '#ff8c00');
  ctx.fillStyle = sunGrad;
  ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
}

export function drawRainbow(ctx) {
  const cx = innerWidth / 2;
  const cy = innerHeight * 1.05;
  const outerR = innerWidth * 0.62;
  const bandW = 18;
  const bands = [
    [255,  20,  20], [255, 110,   0], [255, 220,   0],
    [  0, 195,  50], [  0, 105, 255], [ 75,   0, 195], [170,   0, 215]
  ];
  ctx.save();
  for (let i = 0; i < bands.length; i++) {
    const [r, g, b] = bands[i];
    const radius = outerR - i * bandW;
    if (radius <= 0) continue;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, 0);
    ctx.strokeStyle = `rgba(${r},${g},${b},0.45)`;
    ctx.lineWidth = bandW + 2;
    ctx.stroke();
  }
  ctx.restore();
}

export function init() {
  clouds = Array.from({length: 5}, () => mkCloud(Math.random() * innerWidth));
  sunTime = 0;
  if (isDarkMode()) {
    document.body.style.background = 'radial-gradient(ellipse at 85% 12%, rgba(255,210,60,0.18) 0%, transparent 45%), radial-gradient(1200px 800px at 70% 20%, #101827 0%, #0b1426 55%, #070b14 100%)';
  } else {
    document.body.style.background = 'linear-gradient(180deg, #87ceeb 0%, #b8e4f7 30%, #dff0f8 65%, #f0f8ff 100%)';
  }
}

export function stop() {
  clouds = [];
  document.body.style.background = '';
}

export function tickAll(ctx) {
  drawSun(ctx);
  for (let i = clouds.length - 1; i >= 0; i--) {
    const c = clouds[i];
    c.x += c.speed * c.dir;
    drawCloud(ctx, c);
    if (c.x > innerWidth + 220) clouds.splice(i, 1, mkCloud());
  }
}
