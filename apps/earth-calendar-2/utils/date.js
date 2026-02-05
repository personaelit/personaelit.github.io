/**
 * Date Utilities
 * Consolidated date formatting and calculations
 */

import { CALENDAR } from '../constants.js';
import { isLeapYear } from '../state.js';

/**
 * Format date for display (long format)
 * @param {Date} date
 * @returns {string} e.g., "Monday, January 1, 2024"
 */
export function formatDateLong(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format date for storage key (ISO format)
 * @param {Date} date
 * @returns {string} e.g., "2024-01-01"
 */
export function formatDateKey(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Format date for display (short format)
 * @param {Date} date
 * @returns {string} e.g., "Jan 1"
 */
export function formatDateShort(date) {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Get the day of year for a date
 * @param {Date} date
 * @returns {number} 1-365 or 1-366
 */
export function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Get current day of year
 * @returns {number}
 */
export function getCurrentDayOfYear() {
    return getDayOfYear(new Date());
}

/**
 * Convert day of year to Date object
 * @param {number} day - Day of year (1-365/366)
 * @param {number} year - Year
 * @returns {Date}
 */
export function dayOfYearToDate(day, year) {
    const date = new Date(year, 0, 1);
    date.setDate(day);
    return date;
}

/**
 * Check if date is today
 * @param {Date} date
 * @returns {boolean}
 */
export function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

/**
 * Check if date is in the past
 * @param {Date} date
 * @returns {boolean}
 */
export function isInPast(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
}

/**
 * Check if date is in the future
 * @param {Date} date
 * @returns {boolean}
 */
export function isInFuture(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate > today;
}

/**
 * Calculate days alive from birthdate
 * @param {string} dobString - Date of birth as ISO string
 * @returns {number|null} Days alive or null if invalid
 */
export function calculateDaysAlive(dobString) {
    if (!dobString) return null;

    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return null;

    const today = new Date();
    const diffTime = today - dob;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : null;
}

/**
 * Get time of day greeting
 * @param {Date} date
 * @returns {string} "Good morning", "Good afternoon", or "Good evening"
 */
export function getTimeOfDay(date = new Date()) {
    const hour = date.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

/**
 * Get days in a specific month
 * @param {number} month - Month (0-11)
 * @param {number} year - Year
 * @returns {number}
 */
export function getDaysInMonth(month, year) {
    if (month === 1 && isLeapYear(year)) {
        return 29;
    }
    return CALENDAR.MONTH_DAYS[month];
}

/**
 * Get the cumulative day of year for start of each month
 * @param {number} year
 * @returns {number[]} Array of 12 cumulative day values
 */
export function getMonthStartDays(year) {
    const days = [1];
    let cumulative = 1;

    for (let i = 0; i < 11; i++) {
        cumulative += getDaysInMonth(i, year);
        days.push(cumulative);
    }

    return days;
}
