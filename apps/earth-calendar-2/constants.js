/**
 * Earth Calendar Constants
 * Centralized configuration values to avoid magic numbers
 */

// Canvas & Layout
export const CANVAS = {
    MIN_WIDTH: 300,
    MIN_HEIGHT: 300,
};

// Sun configuration
export const SUN = {
    RADIUS: 50,
    COLOR: '#FFD700',
    GLOW_COLOR: 'rgba(255, 215, 0, 0.3)',
    PULSE_SPEED: 0.02,
    PULSE_AMOUNT: 5,
};

// Earth configuration
export const EARTH = {
    RADIUS: 20,
    COLOR: '#4A90D9',
    LAND_COLOR: '#2E7D32',
    ORBIT_COLOR: 'rgba(255, 255, 255, 0.1)',
};

// Star configuration
export const STARS = {
    COUNT: 200,
    MIN_RADIUS: 0.5,
    MAX_RADIUS: 2,
    SHOOTING_STAR_CHANCE: 0.005,
    SHOOTING_STAR_SPEED: 8,
    SHOOTING_STAR_LENGTH: 80,
    MAX_SHOOTING_STARS: 3,
};

// Time & Calendar
export const CALENDAR = {
    DAYS_IN_YEAR: 365,
    DAYS_IN_LEAP_YEAR: 366,
    MONTHS: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    MONTH_DAYS: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    HISTORY_DAYS: 30,
};

// UI Icons
export const ICONS = {
    SIZE: 24,
    PADDING: 20,
    COLOR: 'rgba(255, 255, 255, 0.7)',
    HOVER_COLOR: 'rgba(255, 255, 255, 1)',
};

// Mood configuration
export const MOOD = {
    EMOJIS: {
        1: '😢',
        2: '😕',
        3: '😐',
        4: '🙂',
        5: '😄',
    },
    DEFAULT: 3,
    MIN: 1,
    MAX: 5,
};

// Storage keys (namespace prefix)
export const STORAGE_PREFIX = 'earth_calendar_';
export const STORAGE_KEYS = {
    MOOD: (date) => `${STORAGE_PREFIX}mood_${date}`,
    NOTES: (date) => `${STORAGE_PREFIX}notes_${date}`,
    USER_NAME: `${STORAGE_PREFIX}userName`,
    USER_DOB: `${STORAGE_PREFIX}userDOB`,
};

// Mood trail (colored orbit segments)
export const MOOD_TRAIL = {
    COLORS: {
        1: '#7c3aed', // violet (sad)
        2: '#6366f1', // indigo (uneasy)
        3: '#94a3b8', // slate (neutral)
        4: '#fbbf24', // amber (pleasant)
        5: '#34d399', // emerald (joyful)
    },
    DEFAULT_COLOR: 'rgba(255, 255, 255, 0.1)',
    LINE_WIDTH: 3,
    GLOW_WIDTH: 7,
    GLOW_ALPHA: 0.3,
};

// Animation
export const ANIMATION = {
    TARGET_FPS: 60,
    FRAME_DURATION: 1000 / 60,
};
