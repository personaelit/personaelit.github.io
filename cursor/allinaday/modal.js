import { calculateDaysAlive, saveToLocalStorage, loadFromLocalStorage } from './utils.js';

const modal = document.getElementById('modal');
const modalContent = modal.querySelector('.modal-content');
const closeModal = document.querySelector('.close');
const modalHeader = document.getElementById('modalHeader');
const moodSelector = document.createElement('div');

function showModal() {
    modal.style.display = 'block';
}

function hideModal() {
    modal.style.display = 'none';
}

function updateModalContent(date) {
    const currentDayOfYear = getDayOfYear(date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = date.toLocaleDateString('en-US', options);
    const datestamp = date.toISOString().split('T')[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    // Clear previous content while preserving the close icon and header
    const closeButton = modalContent.querySelector('.close');
    const existingHeader = modalContent.querySelector('.modal-date-header');
    modalContent.innerHTML = '';
    if (closeButton) {
        modalContent.appendChild(closeButton);
    }
    
    // Create and add the header if it doesn't exist
    let header;
    if (existingHeader) {
        header = existingHeader;
        modalContent.appendChild(header);
    } else {
        header = document.createElement('h2');
        header.className = 'modal-date-header';
        modalContent.appendChild(header);
    }
    
    // Update header content
    header.textContent = dateString;

    // Update the existing modalHeader
    modalHeader.textContent = `Day of Year: ${currentDayOfYear}`;

    if (date.getTime() === today.getTime()) {
        // Today's date
        const greeting = createPersonalizedGreeting(date);
        const greetingElement = document.createElement('p');
        greetingElement.textContent = greeting;
        greetingElement.className = 'personalized-greeting';
        modalContent.appendChild(greetingElement);

        // Add mood selector and notes for today
        addMoodSelector(datestamp);
        addNotesSection(datestamp);
    } else if (date.getTime() > today.getTime()) {
        // Future date
        const futureMessage = document.createElement('p');
        futureMessage.textContent = "This date is in the future. You can't add entries for future dates.";
        futureMessage.className = 'future-message';
        modalContent.appendChild(futureMessage);
    } else {
        // Past date
        const pastMessage = document.createElement('p');
        
        pastMessage.className = 'past-message';
        modalContent.appendChild(pastMessage);

        // Add mood selector if no mood is saved
        const savedMood = loadMood(datestamp);
        if (!savedMood) {
            addMoodSelector(datestamp);
        } else {
            // Add jumbo emoji based on saved mood
            addJumboMoodEmoji(datestamp);
        }

        // Add notes section for past dates (editable)
        addNotesSection(datestamp, true);
    }
}

function createPersonalizedGreeting(date) {
    const name = loadFromLocalStorage('aiad_userName') || 'friend';
    const daysAlive = calculateDaysAlive(date);
    const timeOfDay = getTimeOfDay(new Date());  // Use current time

    return `${timeOfDay}, ${name}! This is day ${daysAlive} of your life. What will you make of it?`;
}

function getTimeOfDay(date) {
    const hour = date.getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

function saveNotes(datestamp, notes) {
    saveToLocalStorage(`aiad_notes_${datestamp}`, notes);
}

function loadNotes(datestamp) {
    return loadFromLocalStorage(`aiad_notes_${datestamp}`);
}

function saveMood(datestamp, mood) {
    saveToLocalStorage(`aiad_mood_${datestamp}`, mood);
}

function loadMood(datestamp) {
    return loadFromLocalStorage(`aiad_mood_${datestamp}`);
}

function addMoodSelector(datestamp) {
    moodSelector.className = 'mood-selector';
    moodSelector.innerHTML = `
        <input type="radio" name="mood" value="1" id="mood1"><label for="mood1">😢</label>
        <input type="radio" name="mood" value="2" id="mood2"><label for="mood2">😕</label>
        <input type="radio" name="mood" value="3" id="mood3"><label for="mood3">😐</label>
        <input type="radio" name="mood" value="4" id="mood4"><label for="mood4">🙂</label>
        <input type="radio" name="mood" value="5" id="mood5"><label for="mood5">😄</label>
    `;
    const savedMood = loadMood(datestamp);
    if (savedMood) {
        moodSelector.querySelector(`input[value="${savedMood}"]`).checked = true;
    }
    moodSelector.addEventListener('change', (e) => {
        saveMood(datestamp, e.target.value);
        updateJumboMoodEmoji(e.target.value);
    });
    modalContent.appendChild(moodSelector);
}

function addNotesSection(datestamp) {
    const notesTextarea = document.createElement('textarea');
    notesTextarea.placeholder = 'How are you feeling?';
    notesTextarea.value = loadNotes(datestamp);
    notesTextarea.addEventListener('input', () => saveNotes(datestamp, notesTextarea.value));
    modalContent.appendChild(notesTextarea);
}

function addJumboMoodEmoji(datestamp) {
    const savedMood = loadMood(datestamp);
    if (savedMood) {
        const jumboEmoji = document.createElement('div');
        jumboEmoji.className = 'jumbo-emoji';
        jumboEmoji.textContent = getMoodEmoji(savedMood);
        modalContent.appendChild(jumboEmoji);
    }
}

function getMoodEmoji(mood) {
    const moodEmojis = {
        '1': '😢',
        '2': '😕',
        '3': '😐',
        '4': '🙂',
        '5': '😄'
    };
    return moodEmojis[mood] || '😐';
}

function updateJumboMoodEmoji(mood) {
    const jumboEmoji = modalContent.querySelector('.jumbo-emoji');
    if (jumboEmoji) {
        jumboEmoji.textContent = getMoodEmoji(mood);
    }
}

closeModal.addEventListener('click', hideModal);

window.addEventListener('click', function(event) {
    if (event.target == modal) {
        hideModal();
    }
});

export { showModal, hideModal, updateModalContent };
