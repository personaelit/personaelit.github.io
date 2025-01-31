import { calculateDaysAlive, isToday, isInFuture, isInPast, getTimeOfDay, getDayOfYear } from './services.date.js';
import { saveToLocalStorage, loadFromLocalStorage } from './services.storage.js';
import { saveMood, loadMood, addMoodSelector, addJumboMoodEmoji, getMoodEmoji, updateJumboMoodEmoji, getMoodData, createMoodChart, displayMoodStats } from './services.mood.js';
import { saveNotes, loadNotes, addNotesSection } from './services.notes.js';

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

function updateDailyModalContent(date) {

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
        addNotesSection(dateStamp, modalContent);
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
        addNotesSection(dateStamp, modalContent);
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





closeModal.addEventListener('click', hideModal);

window.addEventListener('click', function (event) {
    if (event.target == modal) {
        hideModal();
    }
});

export { showModal, hideModal, updateDailyModalContent };

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