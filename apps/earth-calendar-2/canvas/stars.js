/**
 * Stars Module
 * Static starfield with shooting star effects using object pooling
 */

import { STARS } from '../constants.js';

/**
 * @typedef {Object} Star
 * @property {number} x - X position
 * @property {number} y - Y position
 * @property {number} radius - Star radius
 * @property {number} alpha - Opacity
 */

/**
 * @typedef {Object} ShootingStar
 * @property {number} x - Current X position
 * @property {number} y - Current Y position
 * @property {number} vx - X velocity
 * @property {number} vy - Y velocity
 * @property {number} length - Trail length
 * @property {number} alpha - Opacity
 * @property {boolean} active - Whether star is active
 */

/** @type {Star[]} */
let stars = [];

/** @type {ShootingStar[]} */
const shootingStarPool = [];

/** @type {ShootingStar[]} */
const activeShootingStars = [];

/** @type {{ width: number, height: number }} */
let lastDimensions = { width: 0, height: 0 };

/**
 * Initialize starfield for given dimensions
 * @param {{ width: number, height: number }} dimensions
 */
export function initStars(dimensions) {
    lastDimensions = dimensions;
    stars = [];

    for (let i = 0; i < STARS.COUNT; i++) {
        stars.push(createStar(dimensions));
    }

    // Pre-allocate shooting star pool
    for (let i = 0; i < STARS.MAX_SHOOTING_STARS * 2; i++) {
        shootingStarPool.push(createShootingStar());
    }
}

/**
 * Create a static star
 * @param {{ width: number, height: number }} dimensions
 * @returns {Star}
 */
function createStar(dimensions) {
    return {
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        radius: STARS.MIN_RADIUS + Math.random() * (STARS.MAX_RADIUS - STARS.MIN_RADIUS),
        alpha: 0.3 + Math.random() * 0.7,
    };
}

/**
 * Create a shooting star (for pool)
 * @returns {ShootingStar}
 */
function createShootingStar() {
    return {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        length: STARS.SHOOTING_STAR_LENGTH,
        alpha: 1,
        active: false,
    };
}

/**
 * Get a shooting star from pool or create new one
 * @param {{ width: number, height: number }} dimensions
 * @returns {ShootingStar|null}
 */
function getShootingStar(dimensions) {
    // Limit active shooting stars
    if (activeShootingStars.length >= STARS.MAX_SHOOTING_STARS) {
        return null;
    }

    // Find inactive star in pool
    let star = shootingStarPool.find(s => !s.active);

    if (!star) {
        star = createShootingStar();
        shootingStarPool.push(star);
    }

    // Initialize shooting star
    star.x = Math.random() * dimensions.width;
    star.y = Math.random() * dimensions.height * 0.5; // Upper half
    star.vx = (Math.random() - 0.5) * STARS.SHOOTING_STAR_SPEED * 2;
    star.vy = STARS.SHOOTING_STAR_SPEED + Math.random() * 3;
    star.alpha = 1;
    star.active = true;

    activeShootingStars.push(star);
    return star;
}

/**
 * Update and draw stars
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ width: number, height: number }} dimensions
 * @param {number} deltaTime
 */
export function drawStars(ctx, dimensions, deltaTime) {
    // Regenerate stars if canvas size changed significantly
    if (Math.abs(dimensions.width - lastDimensions.width) > 50 ||
        Math.abs(dimensions.height - lastDimensions.height) > 50) {
        initStars(dimensions);
    }

    // Draw static stars
    ctx.fillStyle = '#FFFFFF';
    for (const star of stars) {
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;

    // Maybe spawn shooting star
    if (Math.random() < STARS.SHOOTING_STAR_CHANCE) {
        getShootingStar(dimensions);
    }

    // Update and draw shooting stars
    updateShootingStars(ctx, dimensions, deltaTime);
}

/**
 * Update and draw active shooting stars
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ width: number, height: number }} dimensions
 * @param {number} deltaTime
 */
function updateShootingStars(ctx, dimensions, deltaTime) {
    const speed = deltaTime / 16; // Normalize to ~60fps

    for (let i = activeShootingStars.length - 1; i >= 0; i--) {
        const star = activeShootingStars[i];

        // Update position
        star.x += star.vx * speed;
        star.y += star.vy * speed;
        star.alpha -= 0.015 * speed;

        // Check if out of bounds or faded
        if (star.alpha <= 0 ||
            star.x < -star.length ||
            star.x > dimensions.width + star.length ||
            star.y > dimensions.height + star.length) {
            star.active = false;
            activeShootingStars.splice(i, 1);
            continue;
        }

        // Draw shooting star trail
        const gradient = ctx.createLinearGradient(
            star.x - star.vx * 5,
            star.y - star.vy * 5,
            star.x,
            star.y
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${star.alpha})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(star.x - star.vx * 5, star.y - star.vy * 5);
        ctx.lineTo(star.x, star.y);
        ctx.stroke();
    }
}

/**
 * Handle canvas resize
 * @param {{ width: number, height: number }} dimensions
 */
export function onStarsResize(dimensions) {
    initStars(dimensions);
}
