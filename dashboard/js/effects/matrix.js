const FONT_SIZE = 12;
const LINE_H = 15;
const LINES_PER_FRAME = 4;

// Binary garbage: printable ASCII + box-drawing + block + symbols
const CHARS =
  '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~' +
  '░▒▓█▌▐▀▄■□▪▫▲▶▼◀◆○●' +
  '┌┐└┘├┤┬┴┼─│╔╗╚╝╠╣╦╩╬═║' +
  '☺☻♥♦♣♠•◘♪♫☼►◄↕↑↓→←↔▲▼' +
  'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑ';

let canvas = null, ctx = null, raf = null;
let lines = [];
let cols = 0;

function randChar() { return CHARS[Math.floor(Math.random() * CHARS.length)]; }

function makeLine() {
  // Occasional readable-looking "word" fragments mixed in
  const arr = Array.from({length: cols}, randChar);
  return arr.join('');
}

function loop() {
  const w = canvas.width, h = canvas.height;
  const maxLines = Math.ceil(h / LINE_H) + 2;

  // Add new lines at the top
  for (let i = 0; i < LINES_PER_FRAME; i++) {
    lines.unshift(makeLine());
    if (lines.length > maxLines) lines.pop();
  }

  ctx.fillStyle = '#010d01';
  ctx.fillRect(0, 0, w, h);
  ctx.font = `${FONT_SIZE}px "Consolas","Cascadia Code","Courier New",monospace`;

  for (let i = 0; i < lines.length; i++) {
    const y = i * LINE_H + FONT_SIZE;
    // Newest lines (top) bright green, older lines fade to dark green
    const age = i / lines.length;
    const bright = Math.round(255 * (1 - age * 0.88));
    ctx.fillStyle = `rgb(0, ${bright}, ${Math.round(bright * 0.25)})`;
    ctx.fillText(lines[i], 2, y);
  }

  raf = requestAnimationFrame(loop);
}

export function init() {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:2;';
    document.body.appendChild(canvas);
  }
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');
  ctx.font = `${FONT_SIZE}px "Consolas","Cascadia Code","Courier New",monospace`;
  const charW = ctx.measureText('M').width;
  cols = Math.floor(canvas.width / charW);
  lines = [];
  document.body.style.background = '#010d01';
  loop();
}

export function stop() {
  cancelAnimationFrame(raf); raf = null;
  if (canvas) { canvas.remove(); canvas = null; ctx = null; }
  lines = [];
  document.body.style.background = '';
}
