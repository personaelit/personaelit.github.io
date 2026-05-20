import { mouse } from '../state.js';

const EVASION_RADIUS = 120, EVASION_FORCE = 4, MAX_SPEED = 5, CRUISE_SPEED = 2;
let list = [];
let landTimer = 600 + Math.random() * 400;

function mkButterfly() {
  const heading = Math.random() * Math.PI * 2;
  const vx = Math.cos(heading) * 1.5, vy = Math.sin(heading) * 1.5;
  return { x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx, vy, cvx: vx, cvy: vy,
           wingPhase: Math.random() * Math.PI * 2, wingSpeed: 0.18 + Math.random() * 0.12,
           heading, turnRate: (Math.random() * 0.018 + 0.006) * (Math.random() < 0.5 ? 1 : -1),
           turnTimer: 80 + Math.random() * 160,
           state: 'flying', landX: 0, landY: 0 };
}

function wake(b) {
  b.state = 'flying';
  const a = Math.random() * Math.PI * 2;
  b.heading = a;
  b.vx = Math.cos(a) * MAX_SPEED; b.vy = Math.sin(a) * MAX_SPEED;
}

function landAll() {
  const cx = 150 + Math.random() * (innerWidth  - 300);
  const cy = 150 + Math.random() * (innerHeight - 300);
  for (const b of list) {
    if (b.state !== 'flying') continue;
    b.state = 'landing';
    b.landX = cx + (Math.random() - 0.5) * 80;
    b.landY = cy + (Math.random() - 0.5) * 60;
  }
}

function tick(b) {
  if (b.state === 'landed') {
    const dx = b.x - mouse.x, dy = b.y - mouse.y;
    if (Math.hypot(dx, dy) < EVASION_RADIUS) wake(b);
    b.wingPhase += b.wingSpeed * 0.08;
    return;
  }
  if (b.state === 'landing') {
    const dx = b.x - mouse.x, dy = b.y - mouse.y;
    if (Math.hypot(dx, dy) < EVASION_RADIUS) { wake(b); return; }
    const tx = b.landX - b.x, ty = b.landY - b.y, td = Math.hypot(tx, ty);
    if (td < 3) { b.x = b.landX; b.y = b.landY; b.vx = 0; b.vy = 0; b.state = 'landed'; return; }
    const accel = Math.min(0.6, 0.15 + td * 0.004);
    b.vx += (tx / td) * accel; b.vy += (ty / td) * accel;
    b.vx *= 0.88; b.vy *= 0.88;
    b.x += b.vx; b.y += b.vy;
    b.wingPhase += b.wingSpeed;
    return;
  }
  // flying
  if (--b.turnTimer <= 0) {
    b.turnRate = (Math.random() * 0.018 + 0.006) * (Math.random() < 0.5 ? 1 : -1);
    b.turnTimer = 80 + Math.random() * 160;
  }
  b.heading += b.turnRate;
  b.cvx = Math.cos(b.heading) * CRUISE_SPEED;
  b.cvy = Math.sin(b.heading) * CRUISE_SPEED;
  const dx = b.x - mouse.x, dy = b.y - mouse.y, dist = Math.hypot(dx, dy);
  if (dist < EVASION_RADIUS && dist > 0) {
    const f = (EVASION_RADIUS - dist) / EVASION_RADIUS * EVASION_FORCE;
    b.vx += dx/dist*f; b.vy += dy/dist*f;
  }
  b.vx += (b.cvx - b.vx) * 0.03; b.vy += (b.cvy - b.vy) * 0.03;
  const s = Math.hypot(b.vx, b.vy);
  if (s > MAX_SPEED) { b.vx = b.vx/s*MAX_SPEED; b.vy = b.vy/s*MAX_SPEED; }
  const sp = Math.hypot(b.vx, b.vy);
  if (sp > 0) {
    const px = -b.vy / sp, py = b.vx / sp;
    const zig = Math.sin(b.wingPhase) * 0.25;
    b.vx += px * zig; b.vy += py * zig;
  }
  b.x += b.vx; b.y += b.vy;
  if (b.x < 0 || b.x > innerWidth)  { b.vx *= -1; b.heading = Math.PI - b.heading; }
  if (b.y < 0 || b.y > innerHeight) { b.vy *= -1; b.heading = -b.heading; }
  b.wingPhase += b.wingSpeed;
}

export function init() {
  list = Array.from({length: 20}, mkButterfly);
  landTimer = 600 + Math.random() * 400;
}

export function stop() { list = []; }

export function tickAll(ctx) {
  if (--landTimer <= 0) { landAll(); landTimer = 700 + Math.random() * 500; }
  for (const b of list) {
    tick(b);
    const flutterAmt = b.state === 'landed' ? 0.32 : 1;
    const scaleX = Math.abs(Math.sin(b.wingPhase)) * (0.85 * flutterAmt) + (1 - 0.85 * flutterAmt);
    ctx.save();
    ctx.font = '24px serif';
    ctx.translate(b.x + 12, b.y - 12);
    ctx.scale(scaleX, 1);
    ctx.fillText('\u{1F98B}', -12, 12);
    ctx.restore();
  }
}
