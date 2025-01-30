import { calculateDaysAlive, isToday, isInFuture, isInPast } from './services/dateService.js';
import { saveToLocalStorage, loadFromLocalStorage } from './services/storageService.js';
import { saveMood, loadMood, addMoodSelector, addJumboMoodEmoji, getMoodEmoji, updateJumboMoodEmoji, getMoodData, createMoodChart, displayMoodStats } from './services/moodService.js';

const modal = document.getElementById('modal');
const modalContent = modal.querySelector('.modal-content');
const closeModal = document.querySelector('.close');
const modalHeader = document.getElementById('modalHeader');

function showModal() {
    modal.style.display = 'block';
}

function hideModal() {
    modal.style.display = 'none';
}

function updateModalContent(date) {

    const closeButton = modalContent.querySelector('.close');
    modalContent.innerHTML = '';
    if (closeButton) {
        modalContent.appendChild(closeButton);
    }

    const dateStamp = date.toISOString().split('T')[0];

    let header = document.createElement('h2');
    header.className = 'modal-date-header';
    modalContent.appendChild(header);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    header.textContent = date.toLocaleDateString('en-US', options);

    if (isToday(date)) {
        const greeting = createPersonalizedGreeting(date);
        const greetingElement = document.createElement('p');
        greetingElement.textContent = greeting;
        greetingElement.className = 'personalized-greeting';
        modalContent.appendChild(greetingElement);

        // Add mood selector and notes for today
        addMoodSelector(dateStamp, modalContent);
        addNotesSection(dateStamp);
    }
    else if (isInPast(date)) {
        const pastMessage = document.createElement('p');

        pastMessage.className = 'past-message';
        modalContent.appendChild(pastMessage);

        // Add mood selector if no mood is saved
        const savedMood = loadMood(dateStamp);
        if (!savedMood) {
            addMoodSelector(dateStamp, modalContent);
        } else {
            // Add jumbo emoji based on saved mood
            addJumboMoodEmoji(dateStamp, modalContent);
        }

        // Add notes section for past dates (editable)
        addNotesSection(dateStamp, true);
    }
    else if (isInFuture(date)) {
        const futureMessage = document.createElement('p');
        futureMessage.textContent = "What will the future hold?";
        futureMessage.className = 'future-message';
        modalContent.appendChild(futureMessage);
    }
    else {
        console.error(`Unexpected condition occurred: ${date} appears to be outside of the time continuum.`)
    }
}

function createPersonalizedGreeting(date) {
    const name = loadFromLocalStorage('aiad_userName') || 'friend';
    const daysAlive = calculateDaysAlive(date) || 0;
    const timeOfDay = getTimeOfDay(new Date());  // Use current time

    if (daysAlive > 0) {
        return `${timeOfDay}, ${name}! This is day ${daysAlive} of your journey. Make. it. count.`;
    }
    else {
        return `${timeOfDay}, ${name}!`
    }
}

function getTimeOfDay(date) {
    const hour = date.getHours();

    if (hour < 12) return "Good morning";
    if (hour >= 12 && hour < 18) return "Good afternoon";
    return "Good evening";
}

function getDayOfYear(date) {
    const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

function saveNotes(dateStamp, notes) {
    saveToLocalStorage(`aiad_notes_${dateStamp}`, notes);
}

function loadNotes(dateStamp) {
    return loadFromLocalStorage(`aiad_notes_${dateStamp}`);
}

function addNotesSection(dateStamp) {
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

closeModal.addEventListener('click', hideModal);

window.addEventListener('click', function (event) {
    if (event.target == modal) {
        hideModal();
    }
});

export { showModal, hideModal, updateModalContent };

export function showReportModal() {
    const modal = document.getElementById('modal');
    const modalContent = document.querySelector('.modal-content');

    const closeButton = modalContent.querySelector('.close');
    modalContent.innerHTML = '';
    if (closeButton) {
        modalContent.appendChild(closeButton);
    }

    // Add report content
    const reportContent = document.createElement('div');
    reportContent.innerHTML = `
        <h2>Mood Report</h2>
        <canvas id="moodChart"></canvas>
        <div id="moodStats"></div>
    `;

    modalContent.appendChild(reportContent);

    // Show the modal
    modal.style.display = 'block';

    // Generate the mood report
    generateMoodReport();
}

function generateMoodReport() {
    const moodData = getMoodData();
    createMoodChart(moodData);
    displayMoodStats(moodData);
}