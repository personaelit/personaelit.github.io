/**
 * Mood Trail Module
 * Colors the orbit path based on daily mood data
 */

import { MOOD_TRAIL } from '../constants.js';
import { getDaysInYear, dayToRadians } from '../state.js';
import { loadMood } from '../features/mood.js';
import { dayOfYearToDate, formatDateKey } from '../utils/date.js';

/** @type {(number|null)[]|null} */
let moodCache = null;

/** @type {number|null} */
let cacheYear = null;

/**
 * Build mood cache for the given year
 * @param {number} year
 */
function buildMoodCache(year) {
    const daysInYear = getDaysInYear();
    moodCache = new Array(daysInYear + 1).fill(null);
    cacheYear = year;

    for (let day = 1; day <= daysInYear; day++) {
        const date = dayOfYearToDate(day, year);
        const dateKey = formatDateKey(date);
        const mood = loadMood(dateKey);
        moodCache[day] = mood ? parseInt(mood, 10) : null;
    }
}

/**
 * Invalidate the mood cache (call after saving a mood)
 */
export function invalidateMoodCache() {
    moodCache = null;
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
 * Draw the mood-colored orbit trail
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ width: number, height: number }} dimensions
 * @param {number} deltaTime
 * @param {Object} state
 */
export function drawMoodTrail(ctx, dimensions, deltaTime, state) {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const orbitRadius = getOrbitRadius(dimensions);
    const daysInYear = getDaysInYear();

    // Rebuild cache if needed
    if (!moodCache || cacheYear !== state.currentYear) {
        buildMoodCache(state.currentYear);
    }

    // Small overlap to prevent gaps between segments
    const overlap = 0.005;

    for (let day = 1; day <= daysInYear; day++) {
        const startAngle = dayToRadians(day);
        const endAngle = day < daysInYear
            ? dayToRadians(day + 1)
            : dayToRadians(1) + Math.PI * 2;

        const mood = moodCache[day];

        if (mood && MOOD_TRAIL.COLORS[mood]) {
            const color = MOOD_TRAIL.COLORS[mood];

            // Draw glow layer
            ctx.strokeStyle = color;
            ctx.globalAlpha = MOOD_TRAIL.GLOW_ALPHA;
            ctx.lineWidth = MOOD_TRAIL.GLOW_WIDTH;
            ctx.beginPath();
            ctx.arc(centerX, centerY, orbitRadius, startAngle, endAngle + overlap);
            ctx.stroke();

            // Draw solid layer
            ctx.globalAlpha = 1;
            ctx.lineWidth = MOOD_TRAIL.LINE_WIDTH;
            ctx.beginPath();
            ctx.arc(centerX, centerY, orbitRadius, startAngle, endAngle + overlap);
            ctx.stroke();
        } else {
            // No mood - draw default faint orbit segment
            ctx.strokeStyle = MOOD_TRAIL.DEFAULT_COLOR;
            ctx.globalAlpha = 1;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, orbitRadius, startAngle, endAngle + overlap);
            ctx.stroke();
        }
    }

    // Reset alpha
    ctx.globalAlpha = 1;
}
