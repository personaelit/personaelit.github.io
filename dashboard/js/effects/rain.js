let drops = [];

function mkDrop(spreadY) {
  return {
    x: Math.random() * (innerWidth + 300) - 100,
    y: spreadY ? Math.random() * innerHeight : -20,
    len: 12 + Math.random() * 14,
    spd: 10 + Math.random() * 7,
    op: 0.22 + Math.random() * 0.32
  };
}

export function init() {
  drops = Array.from({length: 130}, () => mkDrop(true));
}

export function stop() { drops = []; }

export function tickAll(ctx) {
  for (let i = drops.length - 1; i >= 0; i--) {
    const r = drops[i];
    r.x -= 2.5; r.y += r.spd;
    ctx.beginPath();
    ctx.moveTo(r.x, r.y);
    ctx.lineTo(r.x - r.len * 0.25, r.y + r.len);
    ctx.strokeStyle = `rgba(174,210,240,${r.op})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    if (r.y > innerHeight + 20 || r.x < -60) drops.splice(i, 1, mkDrop(false));
  }
}
