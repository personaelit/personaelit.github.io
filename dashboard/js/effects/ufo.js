export let list = [];
let spawnTimer = 0;

export function resetTimer() {
  spawnTimer = 900 + Math.floor(Math.random() * 1800);
}

export function maybeSpawn() {
  if (--spawnTimer <= 0) { spawn(); resetTimer(); }
}

export function spawn() {
  const fromLeft = Math.random() < 0.5;
  const startY = innerHeight * (0.12 + Math.random() * 0.5);
  const entrySpeed = 9 + Math.random() * 5;
  list.push({
    x: fromLeft ? -110 : innerWidth + 110,
    y: startY,
    hoverX: innerWidth  * (0.25 + Math.random() * 0.5),
    hoverY: innerHeight * (0.15 + Math.random() * 0.5),
    vx: fromLeft ? entrySpeed : -entrySpeed,
    vy: 0,
    state: 'entering',
    hoverTimer: 0,
    wobblePhase: 0,
    lightPhase: Math.random() * Math.PI * 2,
    hue: Math.floor(Math.random() * 360)
  });
}

export function tickDraw(ctx, u) {
  u.lightPhase += 0.07;

  if (u.state === 'entering') {
    const dx = u.hoverX - u.x, dy = u.hoverY - u.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 6) {
      u.x = u.hoverX; u.y = u.hoverY;
      u.vx = 0; u.vy = 0;
      u.state = 'hovering';
      u.hoverTimer = 90 + Math.floor(Math.random() * 120);
    } else {
      const spd = Math.min(dist * 0.15, 13);
      u.vx = (dx / dist) * spd; u.vy = (dy / dist) * spd;
      u.x += u.vx; u.y += u.vy;
    }
  } else if (u.state === 'hovering') {
    u.wobblePhase += 0.045;
    u.y = u.hoverY + Math.sin(u.wobblePhase) * 9;
    if (--u.hoverTimer <= 0) {
      const exitAngle = Math.random() * Math.PI * 2;
      const exitSpd = 11 + Math.random() * 6;
      u.vx = Math.cos(exitAngle) * exitSpd;
      u.vy = Math.sin(exitAngle) * exitSpd;
      u.state = 'leaving';
    }
  } else {
    u.x += u.vx; u.y += u.vy;
  }

  ctx.save();
  ctx.translate(u.x, u.y);

  const bOp = 0.09 + Math.abs(Math.sin(u.lightPhase * 0.5)) * 0.07;
  const beam = ctx.createLinearGradient(0, 10, 0, 95);
  beam.addColorStop(0, `rgba(160,255,160,${bOp * 3})`);
  beam.addColorStop(1, `rgba(160,255,160,0)`);
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(-10, 10); ctx.lineTo(-38, 95); ctx.lineTo(38, 95); ctx.lineTo(10, 10);
  ctx.closePath(); ctx.fill();

  const glow = ctx.createRadialGradient(0, 0, 10, 0, 0, 68);
  glow.addColorStop(0, `hsla(${u.hue},90%,65%,0.13)`);
  glow.addColorStop(1, `hsla(${u.hue},90%,65%,0)`);
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(0, 0, 68, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#6b7a8d';
  ctx.beginPath(); ctx.ellipse(0, 2, 46, 13, 0, 0, Math.PI * 2); ctx.fill();

  const sheen = ctx.createLinearGradient(0, -11, 0, 15);
  sheen.addColorStop(0, 'rgba(255,255,255,0.2)');
  sheen.addColorStop(1, 'rgba(0,0,0,0.08)');
  ctx.fillStyle = sheen;
  ctx.beginPath(); ctx.ellipse(0, 2, 46, 13, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = 'rgba(140,215,255,0.68)';
  ctx.beginPath(); ctx.ellipse(0, -4, 22, 15, 0, Math.PI, 0); ctx.fill();

  ctx.fillStyle = 'rgba(220,248,255,0.28)';
  ctx.beginPath(); ctx.ellipse(-5, -9, 10, 6, -0.3, Math.PI, 0); ctx.fill();

  const rimCount = 6;
  for (let i = 0; i < rimCount; i++) {
    const lx = -30 + (i / (rimCount - 1)) * 60;
    const phase = u.lightPhase + i * (Math.PI * 2 / rimCount);
    const op = Math.max(0.05, 0.45 + Math.sin(phase) * 0.45);
    ctx.fillStyle = `hsla(${(u.hue + i * 55) % 360},100%,72%,${op})`;
    ctx.beginPath(); ctx.arc(lx, 10, 3.5, 0, Math.PI * 2); ctx.fill();
  }

  ctx.restore();
}
