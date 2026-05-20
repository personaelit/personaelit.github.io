const SYNC_FADE_DUR = 50;
let list = [];
let syncTimer = 600 + Math.floor(Math.random() * 600);
let syncFade = 0;

function mkFirefly() {
  return {
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
    opacity: 0, phase: 'dark', timer: Math.floor(Math.random() * 300),
    blinksLeft: 0,
    r: 2.5 + Math.random() * 2,
    hue: 55 + Math.floor(Math.random() * 55)
  };
}

function tickFirefly(f) {
  f.vx += (Math.random() - 0.5) * 0.04; f.vy += (Math.random() - 0.5) * 0.04;
  const s = Math.hypot(f.vx, f.vy);
  if (s > 0.7) { f.vx = f.vx/s*0.7; f.vy = f.vy/s*0.7; }
  if (f.phase === 'dark') {
    f.opacity = 0;
    if (--f.timer <= 0) { f.phase = 'rising'; f.blinksLeft = 1; }
  } else if (f.phase === 'rising') {
    f.opacity += 0.06;
    if (f.opacity >= 1) { f.opacity = 1; f.phase = 'lit'; f.timer = 6 + Math.floor(Math.random() * 12); }
  } else if (f.phase === 'lit') {
    if (--f.timer <= 0) { f.phase = 'falling'; }
  } else if (f.phase === 'falling') {
    f.opacity -= 0.04;
    if (f.opacity <= 0) {
      f.opacity = 0;
      if (f.blinksLeft > 0) { f.phase = 'pause'; f.timer = 8 + Math.floor(Math.random() * 10); f.blinksLeft--; }
      else { f.phase = 'dark'; f.timer = 150 + Math.floor(Math.random() * 250); }
    }
  } else {
    if (--f.timer <= 0) { f.phase = 'rising'; }
  }
  f.x += f.vx; f.y += f.vy;
  if (f.x < 0) f.x = innerWidth;  else if (f.x > innerWidth)  f.x = 0;
  if (f.y < 0) f.y = innerHeight; else if (f.y > innerHeight) f.y = 0;
}

function drawFirefly(ctx, f) {
  const op = syncFade > 0 ? f.opacity * (syncFade / SYNC_FADE_DUR) : f.opacity;
  ctx.save();
  const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5);
  g.addColorStop(0, `hsla(${f.hue},100%,78%,${op})`);
  g.addColorStop(1, `hsla(${f.hue},100%,60%,0)`);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 5, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = `hsla(${f.hue},100%,97%,${op})`;
  ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 0.45, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

export function init() {
  list = Array.from({length: 45}, mkFirefly);
  syncTimer = 600 + Math.floor(Math.random() * 600);
  syncFade = 0;
}

export function stop() { list = []; }

export function tickAll(ctx) {
  if (--syncTimer <= 0) {
    syncFade = SYNC_FADE_DUR;
    syncTimer = 600 + Math.floor(Math.random() * 600);
  }
  if (syncFade > 0) {
    if (--syncFade === 0) {
      for (const f of list) { f.phase = 'dark'; f.timer = 30; f.blinksLeft = 1; }
    }
  }
  for (const f of list) { tickFirefly(f); drawFirefly(ctx, f); }
}
