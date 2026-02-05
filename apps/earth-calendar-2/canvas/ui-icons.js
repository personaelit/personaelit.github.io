/**
 * UI Icons Module
 * Settings and report icons drawn on canvas
 */

import { ICONS } from '../constants.js';

/**
 * @typedef {Object} IconBounds
 * @property {number} x - Left position
 * @property {number} y - Top position
 * @property {number} width - Icon width
 * @property {number} height - Icon height
 */

/** @type {IconBounds} */
let settingsIconBounds = { x: 0, y: 0, width: 0, height: 0 };

/** @type {IconBounds} */
let reportIconBounds = { x: 0, y: 0, width: 0, height: 0 };

/**
 * Draw settings gear icon
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ width: number, height: number }} dimensions
 */
export function drawSettingsIcon(ctx, dimensions) {
    const x = ICONS.PADDING;
    const y = ICONS.PADDING;
    const size = ICONS.SIZE;

    // Update bounds for hit detection
    settingsIconBounds = { x, y, width: size, height: size };

    ctx.strokeStyle = ICONS.COLOR;
    ctx.lineWidth = 2;

    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const outerRadius = size / 2 - 2;
    const innerRadius = size / 4;

    // Draw gear teeth
    ctx.beginPath();
    const teeth = 8;
    for (let i = 0; i < teeth; i++) {
        const angle = (i / teeth) * Math.PI * 2;
        const nextAngle = ((i + 0.5) / teeth) * Math.PI * 2;

        const outerX = centerX + Math.cos(angle) * outerRadius;
        const outerY = centerY + Math.sin(angle) * outerRadius;
        const innerX = centerX + Math.cos(nextAngle) * (outerRadius - 4);
        const innerY = centerY + Math.sin(nextAngle) * (outerRadius - 4);

        if (i === 0) {
            ctx.moveTo(outerX, outerY);
        } else {
            ctx.lineTo(outerX, outerY);
        }
        ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();
    ctx.stroke();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.stroke();
}

/**
 * Draw report/chart icon
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ width: number, height: number }} dimensions
 */
export function drawReportIcon(ctx, dimensions) {
    const x = dimensions.width - ICONS.PADDING - ICONS.SIZE;
    const y = ICONS.PADDING;
    const size = ICONS.SIZE;

    // Update bounds for hit detection
    reportIconBounds = { x, y, width: size, height: size };

    ctx.strokeStyle = ICONS.COLOR;
    ctx.lineWidth = 2;

    // Draw bar chart icon
    const barWidth = size / 5;
    const bars = [
        { height: size * 0.4 },
        { height: size * 0.7 },
        { height: size * 0.5 },
    ];

    bars.forEach((bar, i) => {
        const barX = x + (i * barWidth * 1.5) + barWidth / 2;
        const barY = y + size - bar.height;

        ctx.fillStyle = ICONS.COLOR;
        ctx.fillRect(barX, barY, barWidth, bar.height);
    });
}

/**
 * Check if point is on settings icon
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
export function isPointOnSettingsIcon(x, y) {
    return x >= settingsIconBounds.x &&
           x <= settingsIconBounds.x + settingsIconBounds.width &&
           y >= settingsIconBounds.y &&
           y <= settingsIconBounds.y + settingsIconBounds.height;
}

/**
 * Check if point is on report icon
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
export function isPointOnReportIcon(x, y) {
    return x >= reportIconBounds.x &&
           x <= reportIconBounds.x + reportIconBounds.width &&
           y >= reportIconBounds.y &&
           y <= reportIconBounds.y + reportIconBounds.height;
}
