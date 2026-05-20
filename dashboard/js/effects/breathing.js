const BREATH = {
  inhale: { dur: 4000, next: 'hold',   label: 'Inhale' },
  hold:   { dur: 2000, next: 'exhale', label: 'Hold'   },
  exhale: { dur: 6000, next: 'pause',  label: 'Exhale' },
  pause:  { dur: 2000, next: 'inhale', label: 'Pause'  }
};

let phase = 'inhale', start = 0, raf = null;

function loop() {
  while (Date.now() - start >= BREATH[phase].dur) {
    start += BREATH[phase].dur;
    phase = BREATH[phase].next;
  }
  const t = (Date.now() - start) / BREATH[phase].dur;
  document.getElementById('breathLabel').textContent = BREATH[phase].label;
  let scale;
  if      (phase === 'inhale') scale = 0.5 + t * 0.5;
  else if (phase === 'hold')   scale = 1.0;
  else if (phase === 'exhale') scale = 1.0 - t * 0.5;
  else                         scale = 0.5;
  const circle = document.getElementById('breathCircle');
  circle.style.transform = `scale(${scale})`;
  circle.style.opacity = 0.3 + scale * 0.7;
  raf = requestAnimationFrame(loop);
}

export function init() {
  const guide = document.getElementById('breathingGuide');
  const dim   = document.getElementById('breathDim');
  dim.style.display = 'block';
  guide.style.display = 'block';
  phase = 'inhale'; start = Date.now();
  loop();
}

export function stop() {
  const guide = document.getElementById('breathingGuide');
  const dim   = document.getElementById('breathDim');
  dim.style.display = 'none';
  guide.style.display = 'none';
  cancelAnimationFrame(raf); raf = null;
}
