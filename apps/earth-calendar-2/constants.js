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

// Moon configuration
export const MOON = {
    RADIUS: 5,
    ORBIT_RADIUS_FACTOR: 4.8,
    COLOR: '#E8E8E8',
    SHADOW_COLOR: '#1a1a2e',
    GLOW_COLOR: 'rgba(232, 232, 232, 0.3)',
    GLOW_RADIUS_FACTOR: 2.5,
    FULL_MOON_THRESHOLD: 0.05,
    SYNODIC_PERIOD: 29.53059,
    /** Reference new moon: December 30, 2024 at 22:27 UTC */
    REFERENCE_NEW_MOON: Date.UTC(2024, 11, 30, 22, 27) / (1000 * 60 * 60 * 24),
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
    SHOW_MONTH_LABELS: `${STORAGE_PREFIX}showMonthLabels`,
    SHOW_SEASONS: `${STORAGE_PREFIX}showSeasons`,
    SHOW_MOOD_TRAIL: `${STORAGE_PREFIX}showMoodTrail`,
    SHOW_MOON: `${STORAGE_PREFIX}showMoon`,
    SHOW_ZODIAC: `${STORAGE_PREFIX}showZodiac`,
    SHOW_NEBULA: `${STORAGE_PREFIX}showNebula`,
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

// Seasons & Solstice/Equinox
export const SEASONS = {
    BAND_OFFSET: -6,       // pixels inside the orbit radius
    BAND_WIDTH: 3,
    BAND_ALPHA: 0.45,
    MARKER_SIZE: 5,
    MARKER_GLOW: 10,
    PARTICLE_COUNT: 12,
    PARTICLE_LIFETIME: 1500, // ms
    PARTICLE_SPEED: 0.04,
    LIST: [
        { name: 'spring', color: '#4ade80', startDay: 80, endDay: 172 },
        { name: 'summer', color: '#facc15', startDay: 172, endDay: 266 },
        { name: 'autumn', color: '#f59e0b', startDay: 266, endDay: 356 },
        { name: 'winter', color: '#60a5fa', startDay: 356, endDay: 80 },
    ],
    /** Day-of-year values for solstices/equinoxes */
    SPECIAL_DAYS: [80, 172, 266, 356],
};

// Zodiac Constellations
export const ZODIAC = {
    RING_OFFSET: 30,
    ICON_SIZE: 48,
    ACTIVE_SCALE: 1.15,
    ALPHA: 0.55,
    ACTIVE_ALPHA: 0.95,
    COLOR: 'rgba(255, 255, 255, 0.85)',
    ACTIVE_COLOR: 'rgba(255, 255, 255, 1)',
    ACTIVE_GLOW_COLOR: 'rgba(255, 255, 255, 0.45)',
    ACTIVE_GLOW_BLUR: 12,
    LABEL_OFFSET: 38,
    LABEL_FONT: '10px Arial',
    LABEL_COLOR: 'rgba(255, 255, 255, 0.65)',
    ACTIVE_LABEL_COLOR: 'rgba(255, 255, 255, 0.95)',
    SIGNS: [
        {
            name: 'Aries',
            start: { month: 2, day: 21 },
            end: { month: 3, day: 19 },
            asset: 'aries.svg',
        },
        {
            name: 'Taurus',
            start: { month: 3, day: 20 },
            end: { month: 4, day: 20 },
            asset: 'taurus.svg',
        },
        {
            name: 'Gemini',
            start: { month: 4, day: 21 },
            end: { month: 5, day: 20 },
            asset: 'gemini.svg',
        },
        {
            name: 'Cancer',
            start: { month: 5, day: 21 },
            end: { month: 6, day: 22 },
            asset: 'cancer.svg',
        },
        {
            name: 'Leo',
            start: { month: 6, day: 23 },
            end: { month: 7, day: 22 },
            asset: 'leo.svg',
        },
        {
            name: 'Virgo',
            start: { month: 7, day: 23 },
            end: { month: 8, day: 22 },
            asset: 'virgo.svg',
        },
        {
            name: 'Libra',
            start: { month: 8, day: 23 },
            end: { month: 9, day: 22 },
            asset: 'libra.svg',
        },
        {
            name: 'Scorpio',
            start: { month: 9, day: 23 },
            end: { month: 10, day: 21 },
            asset: 'scorpio.svg',
        },
        {
            name: 'Sagittarius',
            start: { month: 10, day: 22 },
            end: { month: 11, day: 21 },
            asset: 'sagittarius.svg',
        },
        {
            name: 'Capricorn',
            start: { month: 11, day: 22 },
            end: { month: 0, day: 19 },
            asset: 'capricorn.svg',
        },
        {
            name: 'Aquarius',
            start: { month: 0, day: 20 },
            end: { month: 1, day: 18 },
            asset: 'aquarius.svg',
        },
        {
            name: 'Pisces',
            start: { month: 1, day: 19 },
            end: { month: 2, day: 20 },
            asset: 'pisces.svg',
        },
    ],
};


// Nebula Background
export const NEBULA = {
    SEED: 42,
    SCALE_FACTOR: 2,
    OVERSCAN: 1.2,
    DRIFT_X: 0.4,
    DRIFT_Y: 0.15,
    RESIZE_THRESHOLD: 50,
    LACUNARITY: 2.0,
    PERSISTENCE: 0.5,
    VIGNETTE_STRENGTH: 0.4,
    LAYERS: [
        // Big structure (slow, bold)
        { r: 120, g: 60, b: 180, frequency: 0.0018, octaves: 5, opacity: 0.22 },

        // Mid structure (definition)
        { r: 60, g: 120, b: 160, frequency: 0.0045, octaves: 4, opacity: 0.14 },

        // Fine detail (sparkle / wisps)
        { r: 160, g: 90, b: 120, frequency: 0.012, octaves: 3, opacity: 0.08 },
    ],

};

// Animation
export const ANIMATION = {
    TARGET_FPS: 60,
    FRAME_DURATION: 1000 / 60,
};
