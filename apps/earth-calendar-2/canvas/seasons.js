/**
 * Seasons Module
 * Colored orbit arcs for seasons, solstice/equinox markers, and particle effects
 */

import { SEASONS } from '../constants.js';
import { getDaysInYear, dayToRadians } from '../state.js';

/** @type {{ x: number, y: number, vx: number, vy: number, life: number, maxLife: number, color: string }[]} */
let particles = [];

/** @type {number|null} - track which special day we last spawned for */
let lastSpawnedDay = null;

/**
 * Get the season object for a given day of year
 * @param {number} day
 * @returns {{ name: string, color: string, startDay: number, endDay: number }}
 */
export function getSeasonForDay(day) {
    for (const season of SEASONS.LIST) {
        if (season.name === 'winter') {
            // Winter wraps around year boundary
            if (day >= season.startDay || day < season.endDay) return season;
        } else {
            if (day >= season.startDay && day < season.endDay) return season;
        }
    }
    return SEASONS.LIST[3]; // fallback to winter
}

/**
 * Check if a day is a solstice or equinox
 * @param {number} dayOfYear
 * @returns {boolean}
 */
export function isSpecialDay(dayOfYear) {
    return SEASONS.SPECIAL_DAYS.includes(dayOfYear);
}

/**
 * Get season info for a special day
 * @param {number} dayOfYear
 * @returns {{ name: string, color: string } | null}
 */
export function getSpecialDayInfo(dayOfYear) {
    if (!isSpecialDay(dayOfYear)) return null;
    return getSeasonForDay(dayOfYear);
}

/**
 * Calculate orbit radius (matches earth.js)
 * @param {{ width: number, height: number }} dimensions
 * @returns {number}
 */
function getOrbitRadius(dimensions) {
    return Math.min(dimensions.width, dimensions.height) * 0.35;
}

/**
 * Spawn particles at earth's position
 * @param {Object} state
 */
function spawnParticles(state) {
    const { x, y } = state.earthPosition;
    const season = getSeasonForDay(state.currentDayOfYear);

    for (let i = 0; i < SEASONS.PARTICLE_COUNT; i++) {
        const angle = (Math.PI * 2 / SEASONS.PARTICLE_COUNT) * i + Math.random() * 0.3;
        particles.push({
            x,
            y,
            vx: Math.cos(angle) * SEASONS.PARTICLE_SPEED * (0.8 + Math.random() * 0.4),
            vy: Math.sin(angle) * SEASONS.PARTICLE_SPEED * (0.8 + Math.random() * 0.4),
            life: SEASONS.PARTICLE_LIFETIME,
            maxLife: SEASONS.PARTICLE_LIFETIME,
            color: season.color,
        });
    }
}

/**
 * Update and draw particles
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} deltaTime
 */
function updateParticles(ctx, deltaTime) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= deltaTime;

        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        p.x += p.vx * deltaTime;
        p.y += p.vy * deltaTime;

        const alpha = p.life / p.maxLife;
        const radius = 2 * (1 - alpha) + 1; // grows as it fades

        ctx.globalAlpha = alpha * 0.8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;
}

/**
 * Draw season bands, markers, and particles
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ width: number, height: number }} dimensions
 * @param {number} deltaTime
 * @param {Object} state
 */
export function drawSeasonBands(ctx, dimensions, deltaTime, state) {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const orbitRadius = getOrbitRadius(dimensions);
    const bandRadius = orbitRadius + SEASONS.BAND_OFFSET;
    const daysInYear = getDaysInYear();

    // Draw four season arcs
    for (const season of SEASONS.LIST) {
        const startAngle = dayToRadians(season.startDay);
        let endAngle;

        if (season.name === 'winter') {
            // Winter wraps: draw from startDay to end of year, then start of year to endDay
            endAngle = dayToRadians(daysInYear) + (dayToRadians(1) - dayToRadians(daysInYear)) + dayToRadians(season.endDay) + Math.PI / 2;
            // Simpler: draw two arcs
            const yearEndAngle = dayToRadians(1) + Math.PI * 2;
            const springStartAngle = dayToRadians(season.endDay);

            ctx.strokeStyle = season.color;
            ctx.globalAlpha = SEASONS.BAND_ALPHA;
            ctx.lineWidth = SEASONS.BAND_WIDTH;

            // Arc from winter start to year end
            ctx.beginPath();
            ctx.arc(centerX, centerY, bandRadius, startAngle, yearEndAngle);
            ctx.stroke();

            // Arc from year start to spring start
            ctx.beginPath();
            ctx.arc(centerX, centerY, bandRadius, dayToRadians(1), springStartAngle);
            ctx.stroke();

            continue;
        }

        endAngle = dayToRadians(season.endDay);

        ctx.strokeStyle = season.color;
        ctx.globalAlpha = SEASONS.BAND_ALPHA;
        ctx.lineWidth = SEASONS.BAND_WIDTH;
        ctx.beginPath();
        ctx.arc(centerX, centerY, bandRadius, startAngle, endAngle);
        ctx.stroke();
    }

    // Draw solstice/equinox markers
    ctx.globalAlpha = 1;
    for (const day of SEASONS.SPECIAL_DAYS) {
        const angle = dayToRadians(day);
        const mx = centerX + Math.cos(angle) * bandRadius;
        const my = centerY + Math.sin(angle) * bandRadius;
        const season = getSeasonForDay(day);

        // Glow
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = season.color;
        ctx.beginPath();
        ctx.arc(mx, my, SEASONS.MARKER_GLOW, 0, Math.PI * 2);
        ctx.fill();

        // Diamond marker
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = season.color;
        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(
            -SEASONS.MARKER_SIZE / 2,
            -SEASONS.MARKER_SIZE / 2,
            SEASONS.MARKER_SIZE,
            SEASONS.MARKER_SIZE
        );
        ctx.restore();
    }

    ctx.globalAlpha = 1;

    // Spawn particles on solstice/equinox days
    if (isSpecialDay(state.currentDayOfYear)) {
        if (lastSpawnedDay !== state.currentDayOfYear) {
            lastSpawnedDay = state.currentDayOfYear;
            spawnParticles(state);
        }
    } else {
        lastSpawnedDay = null;
    }

    // Update and draw particles
    updateParticles(ctx, deltaTime);
}
