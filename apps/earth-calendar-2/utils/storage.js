/**
 * LocalStorage Utilities
 * Type-safe wrapper with error handling
 */

/**
 * Save value to localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store (will be JSON stringified if object)
 * @returns {boolean} Success status
 */
export function save(key, value) {
    try {
        const serialized = typeof value === 'object'
            ? JSON.stringify(value)
            : String(value);
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.error(`Failed to save to localStorage: ${key}`, error);
        return false;
    }
}

/**
 * Load value from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Stored value or default
 */
export function load(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        if (value === null) return defaultValue;
        return value;
    } catch (error) {
        console.error(`Failed to load from localStorage: ${key}`, error);
        return defaultValue;
    }
}

/**
 * Load and parse JSON from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist or parse fails
 * @returns {*} Parsed value or default
 */
export function loadJSON(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        if (value === null) return defaultValue;
        return JSON.parse(value);
    } catch (error) {
        console.error(`Failed to parse JSON from localStorage: ${key}`, error);
        return defaultValue;
    }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export function remove(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Failed to remove from localStorage: ${key}`, error);
        return false;
    }
}

/**
 * Check if key exists in localStorage
 * @param {string} key - Storage key
 * @returns {boolean}
 */
export function exists(key) {
    try {
        return localStorage.getItem(key) !== null;
    } catch {
        return false;
    }
}

/**
 * Get all keys matching a prefix
 * @param {string} prefix - Key prefix to match
 * @returns {string[]} Matching keys
 */
export function getKeysWithPrefix(prefix) {
    const keys = [];
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                keys.push(key);
            }
        }
    } catch (error) {
        console.error('Failed to get keys from localStorage', error);
    }
    return keys;
}
