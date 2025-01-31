import { saveToLocalStorage, loadFromLocalStorage } from './services.storage.js';

export function saveNotes(dateStamp, notes) {
    saveToLocalStorage(`aiad_notes_${dateStamp}`, notes);
}

export function loadNotes(dateStamp) {
    return loadFromLocalStorage(`aiad_notes_${dateStamp}`);
}

export function addNotesSection(dateStamp, modalContent) {
    const notesTextarea = document.createElement('textarea');
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const date = new Date(dateStamp);

    if (date < today) {
        notesTextarea.placeholder = 'Thoughts about this day? Events? Notes? Feelings?';
    } else {
        notesTextarea.placeholder = 'How are you feeling?';
    }

    notesTextarea.value = loadNotes(dateStamp);
    notesTextarea.addEventListener('input', () => saveNotes(dateStamp, notesTextarea.value));
    modalContent.appendChild(notesTextarea);
}