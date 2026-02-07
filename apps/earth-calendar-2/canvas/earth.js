/**
 * Earth Module
 * Earth orbiting the sun with day display
 */

import { EARTH, CALENDAR } from '../constants.js';
import { setState, getDaysInYear, dayToRadians } from '../state.js';

/**
 * Calculate orbit radius based on canvas size
 * @param {{ width: number, height: number }} dimensions
 * @returns {number}
 */
function getOrbitRadius(dimensions) {
    return Math.min(dimensions.width, dimensions.height) * 0.35;
}

/**
 * Draw the earth and orbit
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ width: number, height: number }} dimensions
 * @param {number} deltaTime
 * @param {Object} state
 */
export function drawEarth(ctx, dimensions, deltaTime, state) {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const orbitRadius = getOrbitRadius(dimensions);

    // Calculate earth position from time
    const earthX = centerX + Math.cos(state.time) * orbitRadius;
    const earthY = centerY + Math.sin(state.time) * orbitRadius;

    // Update state with position
    setState({
        earthPosition: { x: earthX, y: earthY, radius: EARTH.RADIUS }
    });

    // Draw earth shadow (atmosphere)
    const shadowGradient = ctx.createRadialGradient(
        earthX, earthY, EARTH.RADIUS * 0.8,
        earthX, earthY, EARTH.RADIUS * 1.3
    );
    shadowGradient.addColorStop(0, 'rgba(74, 144, 217, 0.3)');
    shadowGradient.addColorStop(1, 'rgba(74, 144, 217, 0)');

    ctx.fillStyle = shadowGradient;
    ctx.beginPath();
    ctx.arc(earthX, earthY, EARTH.RADIUS * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Draw earth body
    const earthGradient = ctx.createRadialGradient(
        earthX - EARTH.RADIUS * 0.3,
        earthY - EARTH.RADIUS * 0.3,
        0,
        earthX,
        earthY,
        EARTH.RADIUS
    );
    earthGradient.addColorStop(0, '#87CEEB');
    earthGradient.addColorStop(0.5, EARTH.COLOR);
    earthGradient.addColorStop(1, '#1E5A8A');

    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(earthX, earthY, EARTH.RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Draw simple land masses
    ctx.fillStyle = EARTH.LAND_COLOR;
    const landAngle = state.time * 2; // Rotate land with orbit

    // Draw a couple of "continent" shapes
    for (let i = 0; i < 3; i++) {
        const angle = landAngle + (i * Math.PI * 2 / 3);
        const landX = earthX + Math.cos(angle) * EARTH.RADIUS * 0.4;
        const landY = earthY + Math.sin(angle) * EARTH.RADIUS * 0.3;

        ctx.beginPath();
        ctx.ellipse(landX, landY, EARTH.RADIUS * 0.25, EARTH.RADIUS * 0.15, angle, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw day number
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(state.currentDayOfYear), earthX, earthY);
}

/**
 * Draw month labels around the orbit
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ width: number, height: number }} dimensions
 * @param {Object} state
 */
export function drawMonthLabels(ctx, dimensions, state) {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const orbitRadius = getOrbitRadius(dimensions);
    const labelRadius = orbitRadius + 30;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const daysInYear = getDaysInYear();
    let cumulativeDay = 1;

    for (let i = 0; i < 12; i++) {
        // Calculate angle for middle of month
        const monthDays = CALENDAR.MONTH_DAYS[i];
        const midDay = cumulativeDay + monthDays / 2;
        const angle = dayToRadians(midDay);

        const labelX = centerX + Math.cos(angle) * labelRadius;
        const labelY = centerY + Math.sin(angle) * labelRadius;

        ctx.fillText(CALENDAR.MONTHS[i], labelX, labelY);

        cumulativeDay += monthDays;
    }
}

/**
 * Check if a point is within the earth
 * @param {number} x
 * @param {number} y
 * @param {Object} state
 * @returns {boolean}
 */
export function isPointOnEarth(x, y, state) {
    const dx = x - state.earthPosition.x;
    const dy = y - state.earthPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= EARTH.RADIUS + 10; // Small tolerance for easier clicking
}

/**
 * Calculate angle from center to point
 * @param {number} x
 * @param {number} y
 * @param {{ width: number, height: number }} dimensions
 * @returns {number} Angle in radians
 */
export function getAngleFromCenter(x, y, dimensions) {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    return Math.atan2(y - centerY, x - centerX);
}

/**
 * Initialize earth position for current day
 * @param {number} dayOfYear
 */
export function initEarthPosition(dayOfYear) {
    const time = dayToRadians(dayOfYear);
    setState({
        currentDayOfYear: dayOfYear,
        time: time
    });
}
