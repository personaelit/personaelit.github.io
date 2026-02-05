/**
 * Mood Feature
 * Track daily mood with emoji selector
 */

import { MOOD, STORAGE_KEYS, CALENDAR } from '../constants.js';
import { save, load } from '../utils/storage.js';
import { formatDateKey } from '../utils/date.js';

/**
 * Save mood for a date
 * @param {string} dateKey - ISO date string (YYYY-MM-DD)
 * @param {number|string} mood - Mood value (1-5)
 */
export function saveMood(dateKey, mood) {
    save(STORAGE_KEYS.MOOD(dateKey), String(mood));
}

/**
 * Load mood for a date
 * @param {string} dateKey - ISO date string
 * @returns {string|null} Mood value or null
 */
export function loadMood(dateKey) {
    return load(STORAGE_KEYS.MOOD(dateKey));
}

/**
 * Get emoji for mood value
 * @param {number|string} mood
 * @returns {string} Emoji
 */
export function getMoodEmoji(mood) {
    return MOOD.EMOJIS[mood] || MOOD.EMOJIS[MOOD.DEFAULT];
}

/**
 * Create mood selector element
 * @param {string} dateKey - Date key for saving
 * @param {Function} onChange - Callback when mood changes
 * @returns {HTMLElement}
 */
export function createMoodSelector(dateKey, onChange) {
    const container = document.createElement('div');
    container.className = 'mood-selector';

    const savedMood = loadMood(dateKey);

    for (let i = MOOD.MIN; i <= MOOD.MAX; i++) {
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'mood';
        input.value = i;
        input.id = `mood${i}`;
        if (savedMood === String(i)) {
            input.checked = true;
        }

        const label = document.createElement('label');
        label.htmlFor = `mood${i}`;
        label.textContent = MOOD.EMOJIS[i];

        container.appendChild(input);
        container.appendChild(label);
    }

    container.addEventListener('change', (e) => {
        if (e.target.name === 'mood') {
            saveMood(dateKey, e.target.value);
            if (onChange) onChange(e.target.value);
        }
    });

    return container;
}

/**
 * Create jumbo emoji display
 * @param {number|string} mood
 * @returns {HTMLElement}
 */
export function createJumboEmoji(mood) {
    const element = document.createElement('div');
    element.className = 'jumbo-emoji';
    element.textContent = getMoodEmoji(mood);
    return element;
}

/**
 * Get mood data for the last N days
 * @param {number} days - Number of days to fetch
 * @returns {Array<{date: string, mood: number}>}
 */
export function getMoodHistory(days = CALENDAR.HISTORY_DAYS) {
    const moodData = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = formatDateKey(date);
        const mood = loadMood(dateKey);

        if (mood) {
            moodData.unshift({
                date: dateKey,
                mood: parseInt(mood, 10)
            });
        }
    }

    return moodData;
}

/**
 * Calculate mood statistics
 * @param {Array<{date: string, mood: number}>} moodData
 * @returns {{average: number, distribution: Object<number, number>, total: number}}
 */
export function calculateMoodStats(moodData) {
    if (moodData.length === 0) {
        return { average: 0, distribution: {}, total: 0 };
    }

    const total = moodData.length;
    const sum = moodData.reduce((acc, d) => acc + d.mood, 0);
    const average = sum / total;

    const distribution = moodData.reduce((acc, d) => {
        acc[d.mood] = (acc[d.mood] || 0) + 1;
        return acc;
    }, {});

    return { average, distribution, total };
}
