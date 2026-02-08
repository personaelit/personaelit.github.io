/**
 * Moon Phase Companion
 * Small moon orbiting Earth that shows the real lunar phase
 */

import { MOON, EARTH } from '../constants.js';
import { dayOfYearToDate } from '../utils/date.js';

/**
 * Calculate moon phase for a given day of year and year
 * Uses synodic period method with a known new moon reference date
 * @param {number} dayOfYear - Day of year (1-365/366)
 * @param {number} year - Year
 * @returns {number} Phase 0-1 (0 = new moon, 0.5 = full moon)
 */
export function getMoonPhase(dayOfYear, year) {
    const date = dayOfYearToDate(dayOfYear, year);
    const daysSinceEpoch = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        / (1000 * 60 * 60 * 24);
    const daysSinceRef = daysSinceEpoch - MOON.REFERENCE_NEW_MOON;
    let phase = (daysSinceRef % MOON.SYNODIC_PERIOD) / MOON.SYNODIC_PERIOD;
    if (phase < 0) phase += 1;
    return phase;
}

/**
 * Draw the moon with its current phase
 * Draws bright base, then overlays the shadow shape.
 * Shadow = one semicircle (dark hemisphere edge) + one terminator ellipse.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} mx - Moon center X
 * @param {number} my - Moon center Y
 * @param {number} phase - Phase 0-1 (0 = new moon, 0.5 = full moon)
 */
function drawMoonPhase(ctx, mx, my, phase) {
    const r = MOON.RADIUS;

    // Illumination: 0 = new moon (dark), 1 = full moon (bright)
    let illumination, rightSideLit;
    if (phase <= 0.5) {
        illumination = phase * 2;       // 0 to 1
        rightSideLit = true;
    } else {
        illumination = (1 - phase) * 2; // 1 to 0
        rightSideLit = false;
    }

    // 1. Dark base (full circle in shadow)
    ctx.fillStyle = MOON.SHADOW_COLOR;
    ctx.beginPath();
    ctx.arc(mx, my, r, 0, Math.PI * 2);
    ctx.fill();

    // Near new moon — dark base is sufficient
    if (illumination <= 0.01) return;

    // Terminator ellipse x-radius: r at new/full, 0 at quarter
    const tXR = r * Math.abs(Math.cos(illumination * Math.PI));

    // 2. Lit semicircle (the half that is always fully lit)
    ctx.fillStyle = MOON.COLOR;
    ctx.beginPath();
    if (rightSideLit) {
        ctx.arc(mx, my, r, -Math.PI / 2, Math.PI / 2, false); // right half
    } else {
        ctx.arc(mx, my, r, -Math.PI / 2, Math.PI / 2, true);  // left half
    }
    ctx.fill();

    // 3. Terminator adjustment (separate fill avoids winding-rule issues)
    if (illumination < 0.5) {
        // Crescent: shadow eats into the lit semicircle
        ctx.fillStyle = MOON.SHADOW_COLOR;
        ctx.beginPath();
        ctx.ellipse(mx, my, tXR, r, 0, -Math.PI / 2, Math.PI / 2,
            rightSideLit ? false : true);
        ctx.fill();
    } else if (illumination > 0.5) {
        // Gibbous: lit extends past center into the dark side
        ctx.fillStyle = MOON.COLOR;
        ctx.beginPath();
        ctx.ellipse(mx, my, tXR, r, 0, -Math.PI / 2, Math.PI / 2,
            rightSideLit ? true : false);
        ctx.fill();
    }
    // At illumination = 0.5 (quarter): semicircle alone is correct
}

/**
 * Draw moon orbiting earth with phase visualization
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ width: number, height: number }} dimensions
 * @param {number} deltaTime
 * @param {Object} state
 */
export function drawMoon(ctx, dimensions, deltaTime, state) {
    if (!state.showMoon) return;

    const { x: earthX, y: earthY } = state.earthPosition;
    if (!earthX && !earthY) return;

    const phase = getMoonPhase(state.currentDayOfYear, state.currentYear);
    const moonOrbitRadius = EARTH.RADIUS * MOON.ORBIT_RADIUS_FACTOR;

    // Moon orbits Earth: angle derived from phase (one full orbit per synodic cycle)
    const moonAngle = phase * Math.PI * 2 - Math.PI / 2;
    const mx = earthX + Math.cos(moonAngle) * moonOrbitRadius;
    const my = earthY + Math.sin(moonAngle) * moonOrbitRadius;

    // Full moon glow
    const distFromFull = Math.abs(phase - 0.5);
    if (distFromFull < MOON.FULL_MOON_THRESHOLD) {
        const glowRadius = MOON.RADIUS * MOON.GLOW_RADIUS_FACTOR;
        const glowIntensity = 1 - (distFromFull / MOON.FULL_MOON_THRESHOLD);
        const gradient = ctx.createRadialGradient(mx, my, MOON.RADIUS * 0.5, mx, my, glowRadius);
        gradient.addColorStop(0, `rgba(232, 232, 232, ${0.4 * glowIntensity})`);
        gradient.addColorStop(1, 'rgba(232, 232, 232, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mx, my, glowRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    drawMoonPhase(ctx, mx, my, phase);
}
