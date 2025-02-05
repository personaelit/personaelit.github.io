// Update script.js to track the sun's position and pass it to other animations
import { CanvasLayer } from './canvasLayer.js';
import { starAnimation } from './animation.stars.js';
import { earthAnimation } from './animation.earth.js';
import { landscapeAnimation } from './animation.landscape.js';
import { sunAnimation } from './animation.sun.js';



new CanvasLayer('background', starAnimation, 1);
new CanvasLayer('midground', landscapeAnimation, 2);
new CanvasLayer('foreground', sunAnimation, 3);
