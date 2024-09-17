import { resetTasksDaily } from './historyManager.js'
const STORAGE_PREFIX = 'streak_';


const dateDisplay = document.getElementById('date-display');
const countdownDisplay = document.getElementById('countdown-display');


// Display today's date
const today = new Date().toLocaleDateString();
dateDisplay.textContent = `${today}`;

// Check for the 'clear' query parameter
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('clear') === '1') {
    // Clear only Streakr-related items
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
            localStorage.removeItem(key);
        }
    });
    location.href = window.location.pathname; // Reload the page without query parameters
}

export function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

function updateCountdown() {
    const now = new Date();
    const nextReset = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    nextReset.setHours(0, 0, 0, 0);

    const timeRemaining = nextReset - now;

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    countdownDisplay.textContent = `${hours} hours ${minutes} minutes and ${seconds} seconds remaining.`;

    if (timeRemaining <= 0) {
        resetTasksDaily();
    }
}

setInterval(updateCountdown, 1000);

updateCountdown(); // Initial call to display immediately
