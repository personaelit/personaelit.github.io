import { isDarkMode } from '../theme.js';

let canvas = null, ctx = null, raf = null;
let blobs = [];

function mkBlob() {
  return {
    x: innerWidth  * (0.1 + Math.random() * 0.8),
    y: innerHeight * (0.1 + Math.random() * 0.8),
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.8,
    baseR: 65 + Math.random() * 85,
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: 0.007 + Math.random() * 0.006,
    driftPhase: Math.random() * Math.PI * 2,
    driftSpeed: 0.002 + Math.random() * 0.004,
    hue: 10 + Math.random() * 45
  };
}

export function applyStyle() {
  if (!canvas) return;
  if (isDarkMode()) {
    canvas.style.filter = 'blur(12px) contrast(18)';
    canvas.style.mixBlendMode = 'screen';
    document.body.style.background = '#050508';
  } else {
    canvas.style.filter = 'blur(12px) contrast(15)';
    canvas.style.mixBlendMode = 'multiply';
    document.body.style.background = '#f5ede4';
  }
}

function loop() {
  const w = window.innerWidth, h = window.innerHeight;
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const dark = isDarkMode();
  ctx.fillStyle = dark ? '#000005' : '#ffffff';
  ctx.fillRect(0, 0, w, h);

  for (const b of blobs) {
    b.pulsePhase += b.pulseSpeed;
    b.driftPhase += b.driftSpeed;
    const pulse = 0.5 + 0.5 * Math.sin(b.pulsePhase);
    const r = b.baseR * (0.7 + 0.3 * pulse);
    const buoyancyTarget = (pulse - 0.5) * -1.4;
    b.vy += (buoyancyTarget - b.vy) * 0.01;
    b.vy = Math.max(-1.8, Math.min(1.8, b.vy));
    b.vx += Math.sin(b.driftPhase) * 0.015;
    b.vx = Math.max(-0.9, Math.min(0.9, b.vx));
    b.x += b.vx; b.y += b.vy;
    b.hue = (b.hue + 0.05) % 360;
    const margin = r * 0.5;
    if (b.x < margin)     { b.x = margin;     b.vx =  Math.abs(b.vx); }
    if (b.x > w - margin) { b.x = w - margin; b.vx = -Math.abs(b.vx); }
    if (b.y < margin)     { b.y = margin;     b.vy =  Math.abs(b.vy) * 0.6; }
    if (b.y > h - margin) { b.y = h - margin; b.vy = -Math.abs(b.vy) * 0.6; }
    ctx.beginPath();
    ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${b.hue}, 85%, ${dark ? 60 : 50}%)`;
    ctx.fill();
  }

  raf = requestAnimationFrame(loop);
}

export function init() {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:2;';
    document.body.appendChild(canvas);
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');
  blobs = Array.from({length: 9}, mkBlob);
  applyStyle();
  loop();
}

export function stop() {
  cancelAnimationFrame(raf); raf = null;
  if (canvas) { canvas.remove(); canvas = null; ctx = null; }
  blobs = [];
  document.body.style.background = '';
}
