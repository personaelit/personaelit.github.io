let raf = null, time = 0;

function loop() {
  time += 0.003;
  const x1 = 50 + Math.sin(time * 0.7) * 30;
  const y1 = 20 + Math.cos(time * 0.5) * 15;
  const x2 = 65 + Math.sin(time * 0.4 + 1.2) * 28;
  const y2 = 55 + Math.cos(time * 0.6 + 2.1) * 22;
  const x3 = 35 + Math.sin(time * 0.3 + 2.5) * 20;
  const y3 = 40 + Math.cos(time * 0.8 + 0.8) * 18;
  document.body.style.background = `
    radial-gradient(ellipse 90% 55% at ${x1}% ${y1}%, rgba(0,255,150,0.09) 0%, transparent 65%),
    radial-gradient(ellipse 65% 75% at ${x2}% ${y2}%, rgba(90,40,255,0.09) 0%, transparent 65%),
    radial-gradient(ellipse 70% 50% at ${x3}% ${y3}%, rgba(0,200,255,0.07) 0%, transparent 60%),
    radial-gradient(1200px 800px at 70% 20%, #101827 0%, #0b1426 55%, #070b14 100%)`;
  raf = requestAnimationFrame(loop);
}

export function init() {
  time = 0;
  loop();
}

export function stop() {
  cancelAnimationFrame(raf); raf = null;
  document.body.style.background = '';
}
