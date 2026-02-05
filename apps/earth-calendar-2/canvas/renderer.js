/**
 * Canvas Renderer
 * Optimized render loop with delta time and visibility handling
 */

import { getStateRef } from '../state.js';
import { ANIMATION } from '../constants.js';

/** @type {HTMLCanvasElement|null} */
let canvas = null;

/** @type {CanvasRenderingContext2D|null} */
let ctx = null;

/** @type {number} */
let lastFrameTime = 0;

/** @type {number|null} */
let animationId = null;

/** @type {boolean} */
let isVisible = true;

/** @type {Function[]} */
const renderCallbacks = [];

/**
 * Initialize the renderer
 * @param {HTMLCanvasElement} canvasElement
 * @returns {{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }}
 */
export function initRenderer(canvasElement) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');

    resizeCanvas();
    setupVisibilityHandling();
    window.addEventListener('resize', resizeCanvas);

    return { canvas, ctx };
}

/**
 * Resize canvas to fit container
 */
function resizeCanvas() {
    if (!canvas) return;

    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;

    // Set display size
    canvas.style.width = `${container.clientWidth}px`;
    canvas.style.height = `${container.clientHeight}px`;

    // Set actual size in memory (scaled for retina)
    canvas.width = container.clientWidth * dpr;
    canvas.height = container.clientHeight * dpr;

    // Scale context to match
    ctx.scale(dpr, dpr);

    // Notify callbacks of resize
    renderCallbacks.forEach(cb => {
        if (cb.onResize) cb.onResize(canvas, ctx);
    });
}

/**
 * Handle page visibility changes (pause when tab is hidden)
 */
function setupVisibilityHandling() {
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        if (isVisible && !animationId) {
            lastFrameTime = performance.now();
            startRenderLoop();
        }
    });
}

/**
 * Register a render callback
 * @param {Function} callback - Called each frame with (ctx, canvas, deltaTime, state)
 * @param {Function} [onResize] - Called on canvas resize
 */
export function onRender(callback, onResize = null) {
    callback.onResize = onResize;
    renderCallbacks.push(callback);
}

/**
 * Main render loop
 * @param {number} timestamp
 */
function render(timestamp) {
    if (!isVisible || !ctx || !canvas) {
        animationId = null;
        return;
    }

    // Calculate delta time
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    // Get canvas dimensions (accounting for DPR)
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get current state
    const state = getStateRef();

    // Call all render callbacks
    renderCallbacks.forEach(callback => {
        callback(ctx, { width, height }, deltaTime, state);
    });

    // Continue loop
    animationId = requestAnimationFrame(render);
}

/**
 * Start the render loop
 */
export function startRenderLoop() {
    if (animationId) return;
    lastFrameTime = performance.now();
    animationId = requestAnimationFrame(render);
}

/**
 * Stop the render loop
 */
export function stopRenderLoop() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

/**
 * Get canvas reference
 * @returns {HTMLCanvasElement|null}
 */
export function getCanvas() {
    return canvas;
}

/**
 * Get context reference
 * @returns {CanvasRenderingContext2D|null}
 */
export function getContext() {
    return ctx;
}

/**
 * Get canvas dimensions
 * @returns {{ width: number, height: number }}
 */
export function getDimensions() {
    if (!canvas) return { width: 0, height: 0 };
    const dpr = window.devicePixelRatio || 1;
    return {
        width: canvas.width / dpr,
        height: canvas.height / dpr
    };
}

/**
 * Get canvas center point
 * @returns {{ x: number, y: number }}
 */
export function getCenter() {
    const { width, height } = getDimensions();
    return { x: width / 2, y: height / 2 };
}

/**
 * Clean up renderer
 */
export function destroyRenderer() {
    stopRenderLoop();
    window.removeEventListener('resize', resizeCanvas);
    renderCallbacks.length = 0;
    canvas = null;
    ctx = null;
}
