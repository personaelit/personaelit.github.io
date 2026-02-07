/**
 * Sun Module
 * Central sun with pulsating glow effect
 */

import { SUN } from '../constants.js';
import { isSpecialDay, getSpecialDayInfo } from './seasons.js';

/** @type {number} */
let pulsePhase = 0;

/**
 * Draw the sun at canvas center
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ width: number, height: number }} dimensions
 * @param {number} deltaTime
 * @param {Object} state
 */
export function drawSun(ctx, dimensions, deltaTime, state) {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Update pulse phase
    const speed = deltaTime / 16;
    pulsePhase += SUN.PULSE_SPEED * speed;
    if (pulsePhase > Math.PI * 2) pulsePhase -= Math.PI * 2;

    const pulseOffset = Math.sin(pulsePhase) * SUN.PULSE_AMOUNT;
    const currentRadius = SUN.RADIUS + pulseOffset;

    // Draw outer glow
    const glowGradient = ctx.createRadialGradient(
        centerX, centerY, currentRadius * 0.5,
        centerX, centerY, currentRadius * 2
    );
    glowGradient.addColorStop(0, SUN.GLOW_COLOR);
    glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, currentRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw sun body
    const sunGradient = ctx.createRadialGradient(
        centerX - currentRadius * 0.3,
        centerY - currentRadius * 0.3,
        0,
        centerX,
        centerY,
        currentRadius
    );
    sunGradient.addColorStop(0, '#FFFACD');
    sunGradient.addColorStop(0.5, SUN.COLOR);
    sunGradient.addColorStop(1, '#FFA500');

    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
    ctx.fill();

    // Solstice/equinox flare
    const specialInfo = getSpecialDayInfo(state.currentDayOfYear);
    if (specialInfo) {
        const flareRadius = currentRadius * 2.8 + Math.sin(pulsePhase * 1.5) * 8;
        const flareGradient = ctx.createRadialGradient(
            centerX, centerY, currentRadius,
            centerX, centerY, flareRadius
        );
        flareGradient.addColorStop(0, specialInfo.color + '44');
        flareGradient.addColorStop(0.5, specialInfo.color + '18');
        flareGradient.addColorStop(1, specialInfo.color + '00');

        ctx.fillStyle = flareGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, flareRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw year text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(state.currentYear), centerX, centerY);
}

/**
 * Reset pulse phase
 */
export function resetSunPulse() {
    pulsePhase = 0;
}
