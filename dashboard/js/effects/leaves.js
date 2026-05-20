const LEAF_EMOJIS = ['\u{1F342}', '\u{1F341}', '\u{1F343}'];
let list = [];

function mkLeaf(startY) {
  return {
    x: Math.random() * innerWidth,
    y: startY !== undefined ? startY : -30,
    vy: 0.8 + Math.random() * 1.2,
    rot: Math.random() * Math.PI * 2,
    rotSpd: (Math.random() - 0.5) * 0.04,
    swayA: Math.random() * Math.PI * 2,
    swaySpd: 0.018 + Math.random() * 0.02,
    swayAmp: 0.4 + Math.random() * 0.9,
    size: 16 + Math.floor(Math.random() * 12),
    emoji: LEAF_EMOJIS[Math.floor(Math.random() * 3)]
  };
}

export function init() {
  list = Array.from({length: 20}, () => mkLeaf(Math.random() * innerHeight));
}

export function stop() { list = []; }

export function tickAll(ctx) {
  for (let i = list.length - 1; i >= 0; i--) {
    const l = list[i];
    l.swayA += l.swaySpd;
    l.rot += l.rotSpd;
    l.x += Math.sin(l.swayA) * l.swayAmp;
    l.y += l.vy;
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rot);
    ctx.font = `${l.size}px serif`;
    ctx.fillText(l.emoji, -l.size/2, l.size/2);
    ctx.restore();
    if (l.y > innerHeight + 30) list.splice(i, 1, mkLeaf());
  }
}
