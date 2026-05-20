import { effects } from '../state.js';
import * as butterflies from './butterflies.js';
import * as fireflies   from './fireflies.js';
import * as leaves      from './leaves.js';
import * as rain        from './rain.js';
import * as sunny       from './sunny.js';
import * as fireworks   from './fireworks.js';
import * as stars       from './stars.js';
import * as pond        from './pond.js';

let raf = null;
let pctx = null;

export function setContext(ctx) { pctx = ctx; }

function tick() {
  pctx.clearRect(0, 0, innerWidth, innerHeight);

  if (effects.stars) stars.tickAll(pctx);
  else if (stars.hasPendingShooting()) stars.tickShootingOnly(pctx);

  if (effects.butterflies) butterflies.tickAll(pctx);
  if (effects.fireflies)   fireflies.tickAll(pctx);
  if (effects.leaves)      leaves.tickAll(pctx);

  if (effects.sunny && effects.rain) sunny.drawRainbow(pctx);
  if (effects.rain)  rain.tickAll(pctx);
  if (effects.sunny) sunny.tickAll(pctx);

  if (effects.fireworks || fireworks.hasPending()) fireworks.tickAll(pctx, effects.fireworks);
  if (effects.pond) pond.tickAll(pctx);

  const anyActive = effects.butterflies || effects.fireflies || effects.leaves || effects.rain
    || effects.sunny || effects.fireworks || effects.stars || effects.pond;

  if (anyActive || fireworks.hasPending() || stars.hasPendingShooting()) {
    raf = requestAnimationFrame(tick);
  } else {
    raf = null;
    pctx.clearRect(0, 0, innerWidth, innerHeight);
  }
}

export function ensure() {
  if (!raf) tick();
}
