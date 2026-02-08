/**
 * Zodiac Constellation Ring
 * Render zodiac constellations aligned to their date ranges
 */

import { ZODIAC } from '../constants.js';
import { dayToRadians, getDaysInYear } from '../state.js';
import { getDayOfYear } from '../utils/date.js';

/** @type {Map<string, HTMLImageElement>} */
const zodiacImages = new Map();
const zodiacTintedCache = new Map();
const zodiacLoading = new Set();

/** @type {boolean} */
let zodiacAssetsLoaded = false;

/**
 * Calculate orbit radius (matches earth.js)
 * @param {{ width: number, height: number }} dimensions
 * @returns {number}
 */
function getOrbitRadius(dimensions) {
    return Math.min(dimensions.width, dimensions.height) * 0.35;
}

/**
 * Convert month/day to day-of-year for the given year
 * @param {number} month
 * @param {number} day
 * @param {number} year
 * @returns {number}
 */
function getDayOfYearFor(month, day, year) {
    return getDayOfYear(new Date(year, month, day));
}

/**
 * Check if a day is within a zodiac range (inclusive)
 * @param {number} day
 * @param {number} startDay
 * @param {number} endDay
 * @param {number} daysInYear
 * @returns {boolean}
 */
function isDayInRange(day, startDay, endDay, daysInYear) {
    if (startDay <= endDay) {
        return day >= startDay && day <= endDay;
    }
    return day >= startDay || day <= endDay;
}

/**
 * Load zodiac SVG assets once
 */
function loadZodiacAssets() {
    if (zodiacAssetsLoaded) return;
    zodiacAssetsLoaded = true;

    for (const sign of ZODIAC.SIGNS) {
        if (!sign.asset) continue;
        if (zodiacImages.has(sign.name) || zodiacLoading.has(sign.name)) continue;
        zodiacLoading.add(sign.name);

        const assetPath = `assets/zodiac/${sign.asset}`;
        fetch(assetPath)
            .then((res) => res.text())
            .then((svgText) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(svgText, 'image/svg+xml');
                const svg = doc.querySelector('svg');
                if (!svg) return null;

                const cleaned = new XMLSerializer().serializeToString(svg);
                const blob = new Blob([cleaned], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);

                const img = new Image();
                img.onload = () => {
                    URL.revokeObjectURL(url);
                };
                img.src = url;
                zodiacImages.set(sign.name, img);
                return null;
            })
            .catch(() => null)
            .finally(() => {
                zodiacLoading.delete(sign.name);
            });
    }
}

/**
 * Get a tinted canvas for a zodiac asset
 * @param {HTMLImageElement} img
 * @param {string} key
 * @param {number} width
 * @param {number} height
 * @param {string} color
 * @returns {HTMLCanvasElement}
 */
function getTintedCanvas(img, key, width, height, color) {
    const cached = zodiacTintedCache.get(key);
    if (cached) return cached;

    const offscreen = document.createElement('canvas');
    offscreen.width = Math.max(1, Math.round(width));
    offscreen.height = Math.max(1, Math.round(height));
    const offCtx = offscreen.getContext('2d');

    offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
    offCtx.drawImage(img, 0, 0, offscreen.width, offscreen.height);
    offCtx.globalCompositeOperation = 'source-in';
    offCtx.fillStyle = color;
    offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
    offCtx.globalCompositeOperation = 'source-over';

    zodiacTintedCache.set(key, offscreen);
    return offscreen;
}

/**
 * Draw a single zodiac asset
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} ringRadius
 * @param {Object} sign
 * @param {number} angle
 * @param {boolean} isActive
 */
function drawZodiacAsset(ctx, centerX, centerY, ringRadius, sign, angle, isActive) {
    const img = zodiacImages.get(sign.name);
    if (!img || !img.complete) return;

    const x = centerX + Math.cos(angle) * ringRadius;
    const y = centerY + Math.sin(angle) * ringRadius;

    const baseSize = ZODIAC.ICON_SIZE;
    const size = isActive ? baseSize * ZODIAC.ACTIVE_SCALE : baseSize;
    const aspect = img.naturalWidth && img.naturalHeight
        ? img.naturalWidth / img.naturalHeight
        : 1;
    const width = size * aspect;
    const height = size;
    const tintColor = isActive ? ZODIAC.ACTIVE_COLOR : ZODIAC.COLOR;
    const cacheKey = `${sign.name}|${Math.round(width)}x${Math.round(height)}|${tintColor}`;
    const tinted = getTintedCanvas(img, cacheKey, width, height, tintColor);

    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = isActive ? ZODIAC.ACTIVE_ALPHA : ZODIAC.ALPHA;

    if (isActive) {
        ctx.shadowColor = ZODIAC.ACTIVE_GLOW_COLOR;
        ctx.shadowBlur = ZODIAC.ACTIVE_GLOW_BLUR;
    }

    ctx.drawImage(tinted, -width / 2, -height / 2, width, height);
    ctx.restore();
}

/**
 * Draw zodiac constellation ring
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ width: number, height: number }} dimensions
 * @param {number} deltaTime
 * @param {Object} state
 */
export function drawZodiacRing(ctx, dimensions, deltaTime, state) {
    if (!state.showZodiac) return;

    loadZodiacAssets();

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const orbitRadius = getOrbitRadius(dimensions);
    const ringRadius = orbitRadius + ZODIAC.RING_OFFSET;
    const daysInYear = getDaysInYear();

    for (const sign of ZODIAC.SIGNS) {
        const startDay = getDayOfYearFor(sign.start.month, sign.start.day, state.currentYear);
        const endDay = getDayOfYearFor(sign.end.month, sign.end.day, state.currentYear);
        const wraps = startDay > endDay;
        let midDay = (startDay + endDay) / 2;

        if (wraps) {
            midDay = (startDay + endDay + daysInYear) / 2;
            if (midDay > daysInYear) midDay -= daysInYear;
        }

        const isActive = isDayInRange(state.currentDayOfYear, startDay, endDay, daysInYear);
        const midAngle = dayToRadians(midDay);
        const isHovered = state.zodiacHoverSign === sign.name;
        const isSelected = state.zodiacActiveSign === sign.name;

        drawZodiacAsset(ctx, centerX, centerY, ringRadius, sign, midAngle, isActive);

        if (isHovered || isSelected) {
            const labelRadius = ringRadius + ZODIAC.LABEL_OFFSET;
            const lx = centerX + Math.cos(midAngle) * labelRadius;
            const ly = centerY + Math.sin(midAngle) * labelRadius;

            ctx.save();
            ctx.font = ZODIAC.LABEL_FONT;
            ctx.fillStyle = isActive ? ZODIAC.ACTIVE_LABEL_COLOR : ZODIAC.LABEL_COLOR;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(sign.name, lx, ly);
            ctx.restore();
        }
    }
}

/**
 * Hit-test zodiac icons by point
 * @param {number} x
 * @param {number} y
 * @param {{ width: number, height: number }} dimensions
 * @param {Object} state
 * @returns {string|null}
 */
export function getZodiacSignAtPoint(x, y, dimensions, state) {
    if (!state.showZodiac) return null;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const orbitRadius = getOrbitRadius(dimensions);
    const ringRadius = orbitRadius + ZODIAC.RING_OFFSET;
    const daysInYear = getDaysInYear();

    for (const sign of ZODIAC.SIGNS) {
        const startDay = getDayOfYearFor(sign.start.month, sign.start.day, state.currentYear);
        const endDay = getDayOfYearFor(sign.end.month, sign.end.day, state.currentYear);
        const wraps = startDay > endDay;
        let midDay = (startDay + endDay) / 2;

        if (wraps) {
            midDay = (startDay + endDay + daysInYear) / 2;
            if (midDay > daysInYear) midDay -= daysInYear;
        }

        const angle = dayToRadians(midDay);
        const cx = centerX + Math.cos(angle) * ringRadius;
        const cy = centerY + Math.sin(angle) * ringRadius;

        const img = zodiacImages.get(sign.name);
        const baseSize = ZODIAC.ICON_SIZE * ZODIAC.ACTIVE_SCALE * 1.2;
        const aspect = img && img.naturalWidth && img.naturalHeight
            ? img.naturalWidth / img.naturalHeight
            : 1;
        const halfW = (baseSize * aspect) / 2;
        const halfH = baseSize / 2;

        if (x >= cx - halfW && x <= cx + halfW && y >= cy - halfH && y <= cy + halfH) {
            return sign.name;
        }
    }

    return null;
}
