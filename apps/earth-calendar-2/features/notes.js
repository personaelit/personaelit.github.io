/**
 * Notes Feature
 * Daily notes with auto-save
 */

import { STORAGE_KEYS } from '../constants.js';
import { save, load } from '../utils/storage.js';

/** @type {number|null} */
let saveTimeout = null;

/** @type {number} */
const SAVE_DELAY = 500; // Debounce delay in ms

/**
 * Save notes for a date
 * @param {string} dateKey - ISO date string
 * @param {string} notes - Notes content
 */
export function saveNotes(dateKey, notes) {
    save(STORAGE_KEYS.NOTES(dateKey), notes);
}

/**
 * Load notes for a date
 * @param {string} dateKey - ISO date string
 * @returns {string} Notes content or empty string
 */
export function loadNotes(dateKey) {
    return load(STORAGE_KEYS.NOTES(dateKey), '');
}

/**
 * Create notes section element
 * @param {string} dateKey - Date key for saving
 * @param {boolean} readonly - Whether notes are read-only
 * @returns {HTMLElement}
 */
export function createNotesSection(dateKey, readonly = false) {
    const container = document.createElement('div');
    container.className = 'notes-section';

    const label = document.createElement('label');
    label.htmlFor = 'daily-notes';
    label.textContent = 'Notes';
    label.className = 'notes-label';

    const textarea = document.createElement('textarea');
    textarea.id = 'daily-notes';
    textarea.className = 'notes-textarea';
    textarea.placeholder = readonly
        ? 'No notes for this day'
        : 'Write your thoughts...';
    textarea.value = loadNotes(dateKey);
    textarea.readOnly = readonly;

    if (!readonly) {
        // Auto-save with debounce
        textarea.addEventListener('input', () => {
            if (saveTimeout) {
                clearTimeout(saveTimeout);
            }
            saveTimeout = setTimeout(() => {
                saveNotes(dateKey, textarea.value);
            }, SAVE_DELAY);
        });

        // Save immediately on blur
        textarea.addEventListener('blur', () => {
            if (saveTimeout) {
                clearTimeout(saveTimeout);
                saveTimeout = null;
            }
            saveNotes(dateKey, textarea.value);
        });
    }

    container.appendChild(label);
    container.appendChild(textarea);

    return container;
}

/**
 * Check if notes exist for a date
 * @param {string} dateKey - ISO date string
 * @returns {boolean}
 */
export function hasNotes(dateKey) {
    const notes = loadNotes(dateKey);
    return notes && notes.trim().length > 0;
}
