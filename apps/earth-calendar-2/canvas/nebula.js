/**
 * Nebula Background
 * Procedurally generated nebula clouds on an offscreen canvas
 * with barely perceptible drift animation
 */

import { NEBULA } from '../constants.js';
import { fbm, seedNoise } from '../utils/noise.js';

/** @type {HTMLCanvasElement|null} */
let nebulaCanvas = null;

/** @type {{ width: number, height: number }} */
let lastDimensions = { width: 0, height: 0 };

/** @type {{ x: number, y: number }} */
const driftOffset = { x: 0, y: 0 };

/** @type {boolean} */
let needsRegeneration = true;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Generate nebula texture onto offscreen canvas
 * @param {{ width: number, height: number }} dimensions
 */
function generateNebula(dimensions) {
    seedNoise(NEBULA.SEED);

    const texW = Math.ceil(dimensions.width * NEBULA.OVERSCAN / NEBULA.SCALE_FACTOR);
    const texH = Math.ceil(dimensions.height * NEBULA.OVERSCAN / NEBULA.SCALE_FACTOR);

    if (!nebulaCanvas) {
        nebulaCanvas = document.createElement('canvas');
    }
    nebulaCanvas.width = texW;
    nebulaCanvas.height = texH;

    const ctx = nebulaCanvas.getContext('2d');
    const imageData = ctx.createImageData(texW, texH);
    const data = imageData.data;

    const centerX = texW / 2;
    const centerY = texH / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let y = 0; y < texH; y++) {
        for (let x = 0; x < texW; x++) {
            const idx = (y * texW + x) * 4;

            // Vignette: darken edges
            const dx = x - centerX;
            const dy = y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy) / maxDist;
            const vignette = 1 - dist * dist * NEBULA.VIGNETTE_STRENGTH;

            let r = 0, g = 0, b = 0;

            for (const layer of NEBULA.LAYERS) {
                const n = fbm(
                    x * layer.frequency,
                    y * layer.frequency,
                    layer.octaves,
                    NEBULA.LACUNARITY,
                    NEBULA.PERSISTENCE
                );

                // Shape the noise: boost mid-values, suppress lows
                const shaped = n * n * 2;
                const intensity = shaped * layer.opacity * vignette;

                r += layer.r * intensity;
                g += layer.g * intensity;
                b += layer.b * intensity;
            }

            data[idx]     = Math.min(255, r);
            data[idx + 1] = Math.min(255, g);
            data[idx + 2] = Math.min(255, b);
            data[idx + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    // Reset drift on regeneration
    driftOffset.x = 0;
    driftOffset.y = 0;
}

/**
 * Draw nebula background (render callback)
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ width: number, height: number }} dimensions
 * @param {number} deltaTime
 * @param {Object} state
 */
export function drawNebula(ctx, dimensions, deltaTime, state) {
    if (!state.showNebula) return;

    // Check for resize
    if (Math.abs(dimensions.width - lastDimensions.width) > NEBULA.RESIZE_THRESHOLD ||
        Math.abs(dimensions.height - lastDimensions.height) > NEBULA.RESIZE_THRESHOLD) {
        needsRegeneration = true;
    }

    if (needsRegeneration || !nebulaCanvas) {
        generateNebula(dimensions);
        lastDimensions = { width: dimensions.width, height: dimensions.height };
        needsRegeneration = false;
    }

    // Update drift
    if (!prefersReducedMotion) {
        const seconds = deltaTime / 1000;
        driftOffset.x += NEBULA.DRIFT_X * seconds;
        driftOffset.y += NEBULA.DRIFT_Y * seconds;

        // Wrap when reaching overscan boundary
        const viewW = dimensions.width / NEBULA.SCALE_FACTOR;
        const viewH = dimensions.height / NEBULA.SCALE_FACTOR;
        const maxDriftX = (nebulaCanvas.width - viewW) / 2;
        const maxDriftY = (nebulaCanvas.height - viewH) / 2;
        if (Math.abs(driftOffset.x) > maxDriftX) driftOffset.x = 0;
        if (Math.abs(driftOffset.y) > maxDriftY) driftOffset.y = 0;
    }

    // Source rectangle from the oversized texture
    const viewW = dimensions.width / NEBULA.SCALE_FACTOR;
    const viewH = dimensions.height / NEBULA.SCALE_FACTOR;
    const sx = (nebulaCanvas.width - viewW) / 2 + driftOffset.x;
    const sy = (nebulaCanvas.height - viewH) / 2 + driftOffset.y;

    ctx.drawImage(nebulaCanvas, sx, sy, viewW, viewH, 0, 0, dimensions.width, dimensions.height);
}

/**
 * Handle resize
 */
export function onNebulaResize() {
    needsRegeneration = true;
}
