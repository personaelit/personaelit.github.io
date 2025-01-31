import { saveToLocalStorage, loadFromLocalStorage } from './services.storage.js';
import { isToday, isInFuture, isInPast, calculateDaysAlive, getTimeOfDay } from './services.date.js';
import { addNotesSection } from './services.notes.js';
import { addModalContent, showModal } from './ui.modal.js';

function saveMood(dateStamp, mood) {
    saveToLocalStorage(`aiad_mood_${dateStamp}`, mood);
}

function loadMood(dateStamp) {
    return loadFromLocalStorage(`aiad_mood_${dateStamp}`);
}

function addMoodSelector(dateStamp, modalContent) {
    const moodSelector = document.createElement('div');
    moodSelector.className = 'mood-selector';
    moodSelector.innerHTML = `
        <input type="radio" name="mood" value="1" id="mood1"><label for="mood1">😢</label>
        <input type="radio" name="mood" value="2" id="mood2"><label for="mood2">😕</label>
        <input type="radio" name="mood" value="3" id="mood3"><label for="mood3">😐</label>
        <input type="radio" name="mood" value="4" id="mood4"><label for="mood4">🙂</label>
        <input type="radio" name="mood" value="5" id="mood5"><label for="mood5">😄</label>
    `;
    const savedMood = loadMood(dateStamp);
    if (savedMood) {
        moodSelector.querySelector(`input[value="${savedMood}"]`).checked = true;
    }
    moodSelector.addEventListener('change', (e) => {
        saveMood(dateStamp, e.target.value);
        updateJumboMoodEmoji(e.target.value, modalContent);
    });
    modalContent.appendChild(moodSelector);
}

function addJumboMoodEmoji(dateStamp, modalContent) {
    const savedMood = loadMood(dateStamp);
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

function updateJumboMoodEmoji(mood, modalContent) {
    const jumboEmoji = modalContent.querySelector('.jumbo-emoji');
    if (jumboEmoji) {
        jumboEmoji.textContent = getMoodEmoji(mood);
    }
}

export function getMoodData() {
    const moodData = [];
    const currentDate = new Date();

    for (let i = 0; i < 30; i++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        const dateStamp = date.toISOString().split('T')[0];
        const mood = loadFromLocalStorage(`aiad_mood_${dateStamp}`);

        if (mood) {
            moodData.unshift({ date: dateStamp, mood: parseInt(mood) });
        }
    }

    return moodData;
}

export function createMoodChart(moodData) {
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

export function displayMoodStats(moodData) {
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

export function updateDailyModalContent(date) {

    // clearModalContent();

    const modalContent = document.createElement('div');
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

    addModalContent(modalContent);
    showModal();

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