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
    today.setUTCHours(0, 0, 0, 0);
    date.setUTCHours(0, 0, 0, 0);

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
        futureMessage.textContent = "What will the future hold?";
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
    const hour = date.getHours(); // Use local time instead of UTC

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
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const date = new Date(datestamp);
    
    if (date < today) {
        notesTextarea.placeholder = 'Thoughts about this day? Events? Notes? Feelings?';
    } else {
        notesTextarea.placeholder = 'How are you feeling?';
    }
    
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

export function showReportModal() {
    const modal = document.getElementById('modal');
    const modalContent = document.querySelector('.modal-content');
    
    // Clear previous content
    modalContent.innerHTML = '';
    
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

function getMoodData() {
    const moodData = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 30; i++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        const datestamp = date.toISOString().split('T')[0];
        const mood = loadFromLocalStorage(`aiad_mood_${datestamp}`);
        
        if (mood) {
            moodData.unshift({ date: datestamp, mood: parseInt(mood) });
        }
    }
    
    return moodData;
}

function createMoodChart(moodData) {
    const ctx = document.getElementById('moodChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: moodData.map(data => data.date),
            datasets: [{
                label: 'Mood',
                data: moodData.map(data => data.mood),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function displayMoodStats(moodData) {
    const moodStats = document.getElementById('moodStats');
    const averageMood = moodData.reduce((sum, data) => sum + data.mood, 0) / moodData.length;
    const moodCounts = moodData.reduce((counts, data) => {
        counts[data.mood] = (counts[data.mood] || 0) + 1;
        return counts;
    }, {});
    
    moodStats.innerHTML = `
        <h3>Mood Statistics (Last 30 days)</h3>
        <p>Average Mood: ${averageMood.toFixed(2)}</p>
        <p>Mood Distribution:</p>
        <ul>
            ${Object.entries(moodCounts).map(([mood, count]) => 
                `<li>${getMoodEmoji(mood)}: ${count} day${count !== 1 ? 's' : ''}</li>`
            ).join('')}
        </ul>
    `;
}
