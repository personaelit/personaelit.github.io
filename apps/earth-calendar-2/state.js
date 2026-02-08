/**
 * Centralized State Management
 * Single source of truth for application state
 */

import { CALENDAR } from './constants.js';

/**
 * @typedef {Object} EarthPosition
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 * @property {number} radius - Earth radius
 */

/**
 * @typedef {Object} AppState
 * @property {number} currentYear - Current year being displayed
 * @property {number} currentDayOfYear - Day of year (1-365/366)
 * @property {number} time - Current time as radians (0 to 2π)
 * @property {EarthPosition} earthPosition - Earth's position on canvas
 * @property {boolean} isDragging - Whether earth is being dragged
 * @property {number} dragStartAngle - Angle when drag started
 * @property {number} dragStartTime - Time value when drag started
 * @property {boolean} isPaused - Whether animation is paused
 * @property {boolean} showMonthLabels - Whether to show month labels
 * @property {boolean} showSeasons - Whether to show season bands and markers
 * @property {boolean} showMoodTrail - Whether to show mood trail on orbit
 * @property {boolean} showMoon - Whether to show moon phase companion
 * @property {boolean} showZodiac - Whether to show zodiac constellation ring
 * @property {boolean} showNebula - Whether to show nebula background
 * @property {string|null} zodiacHoverSign - Zodiac sign currently hovered
 * @property {string|null} zodiacActiveSign - Zodiac sign selected/tapped
 */

/** @type {AppState} */
const state = {
    currentYear: new Date().getFullYear(),
    currentDayOfYear: 1,
    time: 0,
    earthPosition: { x: 0, y: 0, radius: 20 },
    isDragging: false,
    dragStartAngle: 0,
    dragStartTime: 0,
    isPaused: false,
    showMonthLabels: true,
    showSeasons: true,
    showMoodTrail: true,
    showMoon: true,
    showZodiac: true,
    showNebula: true,
    zodiacHoverSign: null,
    zodiacActiveSign: null,
};

/** @type {Set<Function>} */
const listeners = new Set();

/**
 * Subscribe to state changes
 * @param {Function} callback - Called when state changes
 * @returns {Function} Unsubscribe function
 */
export function subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

/**
 * Notify all listeners of state change
 * @param {string} key - Key that changed
 */
function notify(key) {
    listeners.forEach(fn => fn(key, state));
}

/**
 * Get current state (read-only copy)
 * @returns {AppState}
 */
export function getState() {
    return { ...state };
}

/**
 * Update state values
 * @param {Partial<AppState>} updates - State updates
 */
export function setState(updates) {
    const changedKeys = [];

    for (const [key, value] of Object.entries(updates)) {
        if (state[key] !== value) {
            state[key] = value;
            changedKeys.push(key);
        }
    }

    changedKeys.forEach(notify);
}

/**
 * Get internal state reference (for performance-critical render loops)
 * Warning: Do not mutate directly outside of setState
 * @returns {AppState}
 */
export function getStateRef() {
    return state;
}

/**
 * Check if a year is a leap year
 * @param {number} year
 * @returns {boolean}
 */
export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get days in the current year
 * @returns {number}
 */
export function getDaysInYear() {
    return isLeapYear(state.currentYear)
        ? CALENDAR.DAYS_IN_LEAP_YEAR
        : CALENDAR.DAYS_IN_YEAR;
}

/**
 * Convert day of year to radians
 * @param {number} day - Day of year
 * @returns {number} Radians (0 to 2π)
 */
export function dayToRadians(day) {
    const daysInYear = getDaysInYear();
    return ((day - 1) / daysInYear) * Math.PI * 2 - Math.PI / 2;
}

/**
 * Convert radians to day of year
 * @param {number} radians
 * @returns {number} Day of year (1 to 365/366)
 */
export function radiansToDay(radians) {
    const daysInYear = getDaysInYear();
    let normalized = radians + Math.PI / 2;
    if (normalized < 0) normalized += Math.PI * 2;
    if (normalized >= Math.PI * 2) normalized -= Math.PI * 2;
    return Math.floor((normalized / (Math.PI * 2)) * daysInYear) + 1;
}
