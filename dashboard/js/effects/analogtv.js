let canvas = null, ctx = null, raf = null, time = 0;
let noiseCanvas = null, noiseCW = 0, noiseCH = 0;
let bands = [];

function loop() {
  time += 0.016;
  const w = window.innerWidth, h = window.innerHeight;
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  ctx.clearRect(0, 0, w, h);

  const sw = 400, sh = Math.round(400 * h / w);
  if (noiseCW !== sw || noiseCH !== sh) {
    noiseCanvas.width = sw; noiseCanvas.height = sh;
    noiseCW = sw; noiseCH = sh;
  }
  const nctx = noiseCanvas.getContext('2d');
  const id = nctx.createImageData(sw, sh);
  const d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    if (Math.random() < 0.065) {
      const v = (Math.random() * 210) | 0;
      d[i] = v; d[i+1] = v; d[i+2] = v;
      d[i+3] = (55 + Math.random() * 110) | 0;
    }
  }
  nctx.putImageData(id, 0, 0);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha = 0.42;
  ctx.drawImage(noiseCanvas, 0, 0, w, h);
  ctx.restore();

  ctx.save();
  for (let y = 0; y < h; y += 3) {
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.fillRect(0, y, w, 1);
  }
  ctx.restore();

  if (Math.random() < 0.018) {
    bands.push({
      y: Math.random() * h,
      bh: 1 + Math.random() * 5,
      alpha: 0.35 + Math.random() * 0.45,
      life: 1.0,
      decay: 0.025 + Math.random() * 0.055,
      speed: 1.2 + Math.random() * 3.5
    });
  }
  for (let i = bands.length - 1; i >= 0; i--) {
    const b = bands[i];
    ctx.save();
    ctx.globalAlpha = b.life * b.alpha;
    ctx.fillStyle = 'rgba(210,220,255,0.7)';
    ctx.fillRect(0, b.y | 0, w, b.bh | 0);
    ctx.restore();
    b.y += b.speed; b.life -= b.decay;
    if (b.life <= 0 || b.y > h) bands.splice(i, 1);
  }

  ctx.save();
  const vg = ctx.createRadialGradient(w/2, h/2, h * 0.22, w/2, h/2, Math.max(w, h) * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.62)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  if (Math.random() < 0.045) {
    ctx.save();
    ctx.fillStyle = `rgba(255,255,255,${0.015 + Math.random() * 0.045})`;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  raf = requestAnimationFrame(loop);
}

export function init() {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:2;';
    document.body.appendChild(canvas);
  }
  if (!noiseCanvas) noiseCanvas = document.createElement('canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');
  bands = [];
  loop();
}

export function stop() {
  cancelAnimationFrame(raf); raf = null;
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
}
