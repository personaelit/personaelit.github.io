import { saveToLocalStorage, loadFromLocalStorage } from './storageService.js';

export function saveMood(dateStamp, mood) {
    saveToLocalStorage(`aiad_mood_${dateStamp}`, mood);
}

export function loadMood(dateStamp) {
    return loadFromLocalStorage(`aiad_mood_${dateStamp}`);
}

export function addMoodSelector(dateStamp, modalContent) {
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

export function addJumboMoodEmoji(dateStamp, modalContent) {
    const savedMood = loadMood(dateStamp);
    if (savedMood) {
        const jumboEmoji = document.createElement('div');
        jumboEmoji.className = 'jumbo-emoji';
        jumboEmoji.textContent = getMoodEmoji(savedMood);
        modalContent.appendChild(jumboEmoji);
    }
}

export function getMoodEmoji(mood) {
    const moodEmojis = {
        '1': '😢',
        '2': '😕',
        '3': '😐',
        '4': '🙂',
        '5': '😄'
    };
    return moodEmojis[mood] || '😐';
}

export function updateJumboMoodEmoji(mood, modalContent) {
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