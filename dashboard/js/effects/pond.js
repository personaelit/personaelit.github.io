let ripples = [], drops = [], shimmers = [];
let dropTimer = 0;

function initShimmers() {
  shimmers = Array.from({length: 8}, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    rx: 55 + Math.random() * 95,
    ry: 22 + Math.random() * 38,
    phase: Math.random() * Math.PI * 2,
    speed: 0.004 + Math.random() * 0.009,
    maxAlpha: 0.018 + Math.random() * 0.028,
    dx: (Math.random() - 0.5) * 0.1,
    dy: (Math.random() - 0.5) * 0.06
  }));
}

function mkDrop() {
  const landX = 30 + Math.random() * (innerWidth - 60);
  const landY = 40 + Math.random() * (innerHeight - 80);
  const vy = 9 + Math.random() * 7;
  const vx = (Math.random() - 0.5) * 2.5;
  const frames = 6 + Math.floor(Math.random() * 10);
  return { x: landX - vx * frames, y: landY - vy * frames, vx, vy, landX, landY, len: 15 + Math.random() * 10 };
}

export function mkRipple(x, y) {
  const rings = 3 + (Math.random() < 0.3 ? 1 : 0);
  return {
    x, y,
    rings: Array.from({length: rings}, (_, i) => ({
      r: 0, delay: i * 14,
      maxR: 60 + Math.random() * 50 + i * 20,
      spd: 0.9 + Math.random() * 0.7
    })),
    splash: Array.from({length: 6 + Math.floor(Math.random() * 4)}, (_, i) => {
      const n = 6 + Math.floor(Math.random() * 4);
      return { angle: (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.6,
        r: 0, spd: 1.5 + Math.random() * 2.2, maxR: 6 + Math.random() * 8,
        life: 1.0, size: 0.9 + Math.random() * 1.1 };
    }),
    age: 0, maxAge: 200 + Math.floor(Math.random() * 100)
  };
}

export function addRipple(x, y) { ripples.push(mkRipple(x, y)); }

export function init() {
  initShimmers(); drops = []; ripples = []; dropTimer = 0;
  document.body.style.background = 'linear-gradient(180deg, #0c2a42 0%, #0f3554 50%, #072034 100%)';
}

export function stop() {
  drops = []; ripples = [];
  document.body.style.background = '';
}

export function onResize() { initShimmers(); }

export function tickAll(ctx) {
  for (const s of shimmers) {
    s.phase += s.speed; s.x += s.dx; s.y += s.dy;
    if (s.x < -160) s.x = innerWidth + 50; else if (s.x > innerWidth + 160) s.x = -50;
    if (s.y < -110) s.y = innerHeight + 50; else if (s.y > innerHeight + 110) s.y = -50;
    const a = s.maxAlpha * (0.4 + 0.6 * Math.abs(Math.sin(s.phase)));
    const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.rx);
    sg.addColorStop(0, `rgba(100, 185, 235, ${a})`);
    sg.addColorStop(1, `rgba(100, 185, 235, 0)`);
    ctx.save(); ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.ellipse(s.x, s.y, s.rx, s.ry, s.phase * 0.04, 0, Math.PI * 2);
    ctx.fill(); ctx.restore();
  }

  if (--dropTimer <= 0) {
    drops.push(mkDrop());
    dropTimer = 4 + Math.floor(Math.random() * 7);
  }

  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i];
    const spd = Math.hypot(d.vx, d.vy);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x - (d.vx / spd) * d.len, d.y - (d.vy / spd) * d.len);
    ctx.strokeStyle = 'rgba(180, 225, 255, 0.52)';
    ctx.lineWidth = 1; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
    d.x += d.vx; d.y += d.vy;
    if (d.y >= d.landY) { ripples.push(mkRipple(d.landX, d.landY)); drops.splice(i, 1); }
  }

  for (let i = ripples.length - 1; i >= 0; i--) {
    const rp = ripples[i];
    rp.age++;
    if (rp.age > rp.maxAge) { ripples.splice(i, 1); continue; }
    const fade = 1 - rp.age / rp.maxAge;
    for (const ring of rp.rings) {
      if (rp.age < ring.delay) continue;
      ring.r += ring.spd;
      if (ring.r > ring.maxR) continue;
      const prog = ring.r / ring.maxR;
      const alpha = fade * (1 - prog) * 0.7;
      ctx.save();
      ctx.strokeStyle = `rgba(175, 228, 255, ${alpha})`;
      ctx.lineWidth = Math.max(0.2, 1.8 * (1 - prog) * fade);
      ctx.beginPath(); ctx.ellipse(rp.x, rp.y, ring.r, ring.r * 0.38, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = `rgba(230, 250, 255, ${alpha * 0.5})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.ellipse(rp.x, rp.y, Math.max(1, ring.r - 1), Math.max(0.4, (ring.r - 1) * 0.38), 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    for (const sp of rp.splash) {
      sp.r += sp.spd; sp.life -= 0.055;
      if (sp.life <= 0 || sp.r >= sp.maxR) continue;
      ctx.save();
      ctx.fillStyle = `rgba(210, 245, 255, ${sp.life * 0.8})`;
      ctx.beginPath();
      ctx.arc(rp.x + Math.cos(sp.angle) * sp.r, rp.y + Math.sin(sp.angle) * sp.r * 0.38,
        Math.max(0.3, sp.size * sp.life), 0, Math.PI * 2);
      ctx.fill(); ctx.restore();
    }
    if (rp.age < 10) {
      ctx.save();
      ctx.fillStyle = `rgba(235, 252, 255, ${(1 - rp.age / 10) * 0.9})`;
      ctx.beginPath(); ctx.arc(rp.x, rp.y, 2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
  }
}
