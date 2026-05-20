import { effects } from '../state.js';
import * as butterflies from './butterflies.js';
import * as fireflies   from './fireflies.js';
import * as leaves      from './leaves.js';
import * as rain        from './rain.js';
import * as sunny       from './sunny.js';
import * as fireworks   from './fireworks.js';
import * as stars       from './stars.js';
import * as pond        from './pond.js';
import * as aurora      from './aurora.js';
import * as analogtv    from './analogtv.js';
import * as lavalamp    from './lavalamp.js';
import * as breathing   from './breathing.js';
import * as matrix      from './matrix.js';
import { ensure } from './loop.js';

const EFFECT_KEYS = {
  matrix:      'soDashboard.matrix',
  butterflies: 'soDashboard.butterflies',
  fireflies:   'soDashboard.fireflies',
  leaves:      'soDashboard.leaves',
  rain:        'soDashboard.rain',
  breathe:     'soDashboard.breathe',
  aurora:      'soDashboard.aurora',
  sunny:       'soDashboard.sunny',
  analogtv:    'soDashboard.analogtv',
  fireworks:   'soDashboard.fireworks',
  stars:       'soDashboard.stars',
  pond:        'soDashboard.pond',
  lavalamp:    'soDashboard.lavalamp'
};

const EFFECT_LABELS = {
  matrix:      '🟩 Matrix',
  butterflies: '\u{1F98B} Butterflies',
  fireflies:   '✨ Fireflies',
  leaves:      '\u{1F342} Leaves',
  rain:        '\u{1F327} Rain',
  breathe:     '\u{1FAC1} Breathe',
  aurora:      '\u{1F30C} Aurora',
  sunny:       '☀️ Sunny Day',
  analogtv:    '\u{1F4FA} Analog TV',
  fireworks:   '\u{1F386} Fireworks',
  stars:       '\u{1F320} Starry Night',
  pond:        '\u{1F4A7} Pond',
  lavalamp:    '\u{1F9EA} Lava Lamp'
};

export function updateBtn(name) {
  const btn = document.getElementById('btn-' + name);
  btn.textContent = `${EFFECT_LABELS[name]}: ${effects[name] ? 'On' : 'Off'}`;
  btn.dataset.active = effects[name] ? 'true' : 'false';
}

export function toggle(name) {
  effects[name] = !effects[name];
  localStorage.setItem(EFFECT_KEYS[name], effects[name] ? 'on' : 'off');
  updateBtn(name);

  switch (name) {
    case 'butterflies':
      effects.butterflies ? butterflies.init() : butterflies.stop();
      break;
    case 'fireflies':
      effects.fireflies ? fireflies.init() : fireflies.stop();
      break;
    case 'leaves':
      effects.leaves ? leaves.init() : leaves.stop();
      break;
    case 'rain':
      effects.rain ? rain.init() : rain.stop();
      break;
    case 'breathe':
      effects.breathe ? breathing.init() : breathing.stop();
      break;
    case 'aurora':
      effects.aurora ? aurora.init() : aurora.stop();
      break;
    case 'analogtv':
      effects.analogtv ? analogtv.init() : analogtv.stop();
      break;
    case 'fireworks':
      if (!effects.fireworks) fireworks.stop();
      else fireworks.init();
      break;
    case 'sunny':
      effects.sunny ? sunny.init() : sunny.stop();
      break;
    case 'stars':
      effects.stars ? stars.init() : stars.stop();
      break;
    case 'pond':
      effects.pond ? pond.init() : pond.stop();
      break;
    case 'lavalamp':
      effects.lavalamp ? lavalamp.init() : lavalamp.stop();
      break;
    case 'matrix':
      effects.matrix ? matrix.init() : matrix.stop();
      break;
  }

  if (effects.butterflies || effects.fireflies || effects.leaves || effects.rain
      || effects.sunny || effects.fireworks || effects.stars || effects.pond) {
    ensure();
  }
}

export function restore() {
  for (const name of Object.keys(effects)) {
    if (localStorage.getItem(EFFECT_KEYS[name]) === 'on') toggle(name);
  }
}
