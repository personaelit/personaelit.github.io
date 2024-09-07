import { state } from './script.js';
import { handleSliderInput, handleDatePickerChange, handleCanvasInteraction, preventDefaultTouch, handleDragStart, handleDragMove, handleDragEnd, handleKeyDown } from './eventHandlers.js';
import { toggleSettingsPanel } from './settings.js';
import { createStars } from './stars.js';
import { calculateDaysAlive } from './utils.js';

export const canvas = document.getElementById('solarSystem');
export const ctx = canvas.getContext('2d');
export const slider = document.getElementById('timeSlider');
export const clockElement = document.getElementById('clock');
export const datePicker = document.getElementById('datePicker');
export const daysAliveElement = document.getElementById('daysAlive');

export function initializeUI() {
    resizeCanvas();
    setupEventListeners();
    createStars(canvas);
    initializeDaysAlive();
    setInterval(updateClock, 1000);
    updateClock();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars(canvas);
}

export function drawMonths(ctx, canvas, state) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.4;

    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    months.forEach((month, index) => {
        const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Highlight the current month
        if (index === new Date(Date.UTC(state.currentYear, 0, state.currentDayOfYear)).getUTCMonth()) {
            ctx.fillStyle = 'yellow';
        } else {
            ctx.fillStyle = 'white';
        }

        ctx.fillText(month, x, y);
    });
}

export function drawSettingsIcon(ctx, canvas) {
    // ... (keep the existing drawSettingsIcon function)
}

export function updateDateLabel() {
    const date = new Date(Date.UTC(state.currentYear, 0, state.currentDayOfYear));
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
    document.getElementById('dateLabel').textContent = date.toLocaleDateString('en-US', options);
}

export function updateDatePicker() {
    const date = new Date(Date.UTC(state.currentYear, 0, state.currentDayOfYear));
    datePicker.value = date.toISOString().split('T')[0];
}

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

export function updateDaysAliveLabel() {
    const daysAlive = calculateDaysAlive();
    if (daysAlive !== null) {
        daysAliveElement.textContent = `Day #: ${daysAlive}`;
    } else {
        daysAliveElement.textContent = '';
    }
}

function initializeDaysAlive() {
    updateDaysAliveLabel();
}

function setupEventListeners() {
    window.addEventListener('resize', resizeCanvas);
    slider.addEventListener('input', handleSliderInput);
    slider.addEventListener('change', handleSliderInput);
    datePicker.addEventListener('change', handleDatePickerChange);
    canvas.addEventListener('click', handleCanvasInteraction);
    canvas.addEventListener('touchend', handleCanvasInteraction);
    canvas.addEventListener('touchstart', preventDefaultTouch, { passive: false });
    canvas.addEventListener('mousedown', handleDragStart);
    canvas.addEventListener('touchstart', handleDragStart);
    canvas.addEventListener('mousemove', handleDragMove);
    canvas.addEventListener('touchmove', handleDragMove);
    canvas.addEventListener('mouseup', handleDragEnd);
    canvas.addEventListener('touchend', handleDragEnd);
    document.addEventListener('keydown', handleKeyDown);
}
