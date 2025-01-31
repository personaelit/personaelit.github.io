import { state, updateEarthPosition } from './script.js';
import { hideModal } from './ui.modal.js';
import { toggleSettingsPanel } from './services.settings.js';
import { createShootingStar } from './ui.stars.js';
import { updateDateLabel, updateDatePicker } from './ui.js';
import { updateDailyModalContent } from './services.mood.js';
import { showReportModal } from './services.reports.js';

const CLICK_TIME_THRESHOLD = 200; // milliseconds
let lastTouchEnd = 0;

export function handleSliderInput(event) {
    updateEarthPosition(state, event.target.value);
    updateDateLabel();
    updateDatePicker();
}

export function handleDatePickerChange(event) {
    const selectedDate = new Date(event.target.value);
    state.currentYear = selectedDate.getUTCFullYear();
    const start = new Date(Date.UTC(state.currentYear, 0, 0));
    const diff = selectedDate - start;
    const oneDay = 1000 * 60 * 60 * 24;
    state.currentDayOfYear = Math.floor(diff / oneDay) + 1;
    
    updateEarthPosition(state, state.currentDayOfYear);
    document.getElementById('timeSlider').value = state.currentDayOfYear;
}

export function handleDragStart(event) {
    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const distance = Math.sqrt((x - state.earthPosition.x) ** 2 + (y - state.earthPosition.y) ** 2);
    if (distance <= state.earthPosition.radius) {
        state.isDragging = true;
        state.dragStartAngle = Math.atan2(y - event.target.height / 2, x - event.target.width / 2);
        state.dragStartTime = new Date().getTime();
    }
}

export function handleDragMove(event) {
    if (!state.isDragging) return;
    event.preventDefault();

    const rect = event.target.getBoundingClientRect();
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const currentAngle = Math.atan2(y - event.target.height / 2, x - event.target.width / 2);
    let angleDiff = currentAngle - state.dragStartAngle;

    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    state.time += angleDiff;
    state.dragStartAngle = currentAngle;

    const totalDays = Math.floor((state.time / (Math.PI * 2)) * 365);
    state.currentYear = Math.floor(totalDays / 365) + new Date().getUTCFullYear();
    state.currentDayOfYear = (totalDays % 365) + 1;

    updateDateLabel();
    updateDatePicker();
    document.getElementById('timeSlider').value = state.currentDayOfYear;
}

export function handleDragEnd(event) {
    if (!state.isDragging) return;
    
    const dragEndTime = new Date().getTime();
    const dragDuration = dragEndTime - state.dragStartTime;

    if (dragDuration < CLICK_TIME_THRESHOLD) {
        const date = new Date();
        date.setFullYear(state.currentYear);
        date.setMonth(0); // January is 0-based
        date.setUTCDate(state.currentDayOfYear);
        updateDailyModalContent(date);
    }

    state.isDragging = false;
}

export function handleCanvasInteraction(event) {
    
    if (event.type === 'touchend') {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
            return;
        }
        lastTouchEnd = now;
    }

    const rect = event.target.getBoundingClientRect();
    const x = (event.clientX || event.changedTouches[0].clientX) - rect.left;
    const y = (event.clientY || event.changedTouches[0].clientY) - rect.top;

    const iconSize = 30;
    const padding = 20;
    const settingsIconX = event.target.width - iconSize - padding;
    const settingsIconY = event.target.height - iconSize - padding;
    const reportIconX = padding;
    const reportIconY = event.target.height - iconSize - padding;

    if (x >= settingsIconX && x <= settingsIconX + iconSize && y >= settingsIconY && y <= settingsIconY + iconSize) {
        toggleSettingsPanel();
    } else if (x >= reportIconX && x <= reportIconX + iconSize && y >= reportIconY && y <= reportIconY + iconSize) {
        showReportModal();
    }
}

export function handleKeyDown(event) {
    if (event.key === 's' || event.key === 'S') {
        const canvas = document.querySelector('canvas'); // Get the canvas element
        createShootingStar(canvas.width, canvas.height);
    }
}

export function preventDefaultTouch(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
    }
}

export function handleCloseButtonClick() {
    hideModal();
}