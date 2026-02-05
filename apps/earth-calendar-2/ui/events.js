/**
 * Event Handlers Module
 * Consolidated event handling for canvas and UI interactions
 */

import { getStateRef, setState, radiansToDay, dayToRadians, getDaysInYear } from '../state.js';
import { getDimensions, getCenter } from '../canvas/renderer.js';
import { isPointOnEarth, getAngleFromCenter } from '../canvas/earth.js';
import { isPointOnSettingsIcon, isPointOnReportIcon } from '../canvas/ui-icons.js';
import { dayOfYearToDate, formatDateKey, formatDateLong, isToday, isInPast, isInFuture } from '../utils/date.js';
import { showModal, hideModal } from './modal.js';
import { createMoodSelector, createJumboEmoji, loadMood, getMoodEmoji } from '../features/mood.js';
import { createNotesSection } from '../features/notes.js';
import { createSettingsForm, createGreeting } from '../features/settings.js';
import { createReportContent, initMoodChart, destroyMoodChart } from '../features/reports.js';

/** @type {HTMLCanvasElement|null} */
let canvas = null;

/** @type {HTMLInputElement|null} */
let timeSlider = null;

/** @type {HTMLInputElement|null} */
let datePicker = null;

/** @type {HTMLElement|null} */
let dateLabel = null;

/**
 * Initialize event handlers
 * @param {Object} elements - DOM element references
 */
export function initEvents(elements) {
    canvas = elements.canvas;
    timeSlider = elements.timeSlider;
    datePicker = elements.datePicker;
    dateLabel = elements.dateLabel;

    setupCanvasEvents();
    setupSliderEvents();
    setupDatePickerEvents();
    setupKeyboardEvents();
}

/**
 * Setup canvas mouse and touch events
 */
function setupCanvasEvents() {
    if (!canvas) return;

    // Mouse events
    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('mouseup', handlePointerUp);
    canvas.addEventListener('mouseleave', handlePointerUp);
    canvas.addEventListener('click', handleCanvasClick);

    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handlePointerUp);

    // Cursor style
    canvas.addEventListener('mousemove', updateCursor);
}

/**
 * Get pointer position from event
 * @param {MouseEvent|Touch} e
 * @returns {{ x: number, y: number }}
 */
function getPointerPosition(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

/**
 * Handle pointer down (mouse or touch)
 * @param {MouseEvent} e
 */
function handlePointerDown(e) {
    const pos = getPointerPosition(e);
    const state = getStateRef();

    if (isPointOnEarth(pos.x, pos.y, state)) {
        const dimensions = getDimensions();
        const angle = getAngleFromCenter(pos.x, pos.y, dimensions);

        setState({
            isDragging: true,
            dragStartAngle: angle,
            dragStartTime: state.time
        });
    }
}

/**
 * Handle touch start
 * @param {TouchEvent} e
 */
function handleTouchStart(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
        handlePointerDown(e.touches[0]);
    }
}

/**
 * Handle pointer move
 * @param {MouseEvent} e
 */
function handlePointerMove(e) {
    const state = getStateRef();
    if (!state.isDragging) return;

    const pos = getPointerPosition(e);
    const dimensions = getDimensions();
    const currentAngle = getAngleFromCenter(pos.x, pos.y, dimensions);

    // Calculate angle difference
    let angleDiff = currentAngle - state.dragStartAngle;

    // Handle wrap-around
    if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    // Update time
    let newTime = state.dragStartTime + angleDiff;

    // Normalize to 0-2π
    while (newTime < -Math.PI / 2) newTime += Math.PI * 2;
    while (newTime >= Math.PI * 1.5) newTime -= Math.PI * 2;

    const newDay = radiansToDay(newTime);

    setState({
        time: newTime,
        currentDayOfYear: newDay
    });

    updateUIFromState();
}

/**
 * Handle touch move
 * @param {TouchEvent} e
 */
function handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
        handlePointerMove(e.touches[0]);
    }
}

/**
 * Handle pointer up
 */
function handlePointerUp() {
    setState({ isDragging: false });
}

/**
 * Handle canvas click
 * @param {MouseEvent} e
 */
function handleCanvasClick(e) {
    const state = getStateRef();
    if (state.isDragging) return;

    const pos = getPointerPosition(e);

    // Check icon clicks
    if (isPointOnSettingsIcon(pos.x, pos.y)) {
        showSettingsModal();
        return;
    }

    if (isPointOnReportIcon(pos.x, pos.y)) {
        showReportModal();
        return;
    }

    // Check earth click
    if (isPointOnEarth(pos.x, pos.y, state)) {
        showDayModal();
    }
}

/**
 * Update cursor based on hover
 * @param {MouseEvent} e
 */
function updateCursor(e) {
    const pos = getPointerPosition(e);
    const state = getStateRef();

    const isOverClickable =
        isPointOnEarth(pos.x, pos.y, state) ||
        isPointOnSettingsIcon(pos.x, pos.y) ||
        isPointOnReportIcon(pos.x, pos.y);

    canvas.style.cursor = isOverClickable ? 'pointer' : 'default';
}

/**
 * Setup slider events
 */
function setupSliderEvents() {
    if (!timeSlider) return;

    timeSlider.addEventListener('input', () => {
        const day = parseInt(timeSlider.value, 10);
        const time = dayToRadians(day);

        setState({
            currentDayOfYear: day,
            time: time
        });

        updateUIFromState();
    });
}

/**
 * Setup date picker events
 */
function setupDatePickerEvents() {
    if (!datePicker) return;

    datePicker.addEventListener('change', () => {
        const date = new Date(datePicker.value + 'T12:00:00');
        const year = date.getFullYear();
        const dayOfYear = Math.ceil(
            (date - new Date(year, 0, 1)) / (1000 * 60 * 60 * 24)
        ) + 1;

        setState({
            currentYear: year,
            currentDayOfYear: dayOfYear,
            time: dayToRadians(dayOfYear)
        });

        updateUIFromState();
    });
}

/**
 * Setup keyboard events
 */
function setupKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
        const state = getStateRef();

        switch (e.key) {
            case 'ArrowLeft':
                navigateDay(-1);
                break;
            case 'ArrowRight':
                navigateDay(1);
                break;
            case 'Home':
                navigateToToday();
                break;
        }
    });
}

/**
 * Navigate by a number of days
 * @param {number} delta
 */
function navigateDay(delta) {
    const state = getStateRef();
    const daysInYear = getDaysInYear();
    let newDay = state.currentDayOfYear + delta;

    // Clamp to year
    if (newDay < 1) newDay = 1;
    if (newDay > daysInYear) newDay = daysInYear;

    setState({
        currentDayOfYear: newDay,
        time: dayToRadians(newDay)
    });

    updateUIFromState();
}

/**
 * Navigate to today
 */
function navigateToToday() {
    const today = new Date();
    const year = today.getFullYear();
    const dayOfYear = Math.ceil(
        (today - new Date(year, 0, 1)) / (1000 * 60 * 60 * 24)
    ) + 1;

    setState({
        currentYear: year,
        currentDayOfYear: dayOfYear,
        time: dayToRadians(dayOfYear)
    });

    updateUIFromState();
}

/**
 * Update UI elements from state
 */
export function updateUIFromState() {
    const state = getStateRef();
    const date = dayOfYearToDate(state.currentDayOfYear, state.currentYear);

    // Update slider
    if (timeSlider) {
        timeSlider.value = state.currentDayOfYear;
        timeSlider.max = getDaysInYear();
    }

    // Update date picker
    if (datePicker) {
        datePicker.value = formatDateKey(date);
    }

    // Update date label
    if (dateLabel) {
        dateLabel.textContent = formatDateLong(date);
    }
}

/**
 * Show modal for current day
 */
function showDayModal() {
    const state = getStateRef();
    const date = dayOfYearToDate(state.currentDayOfYear, state.currentYear);
    const dateKey = formatDateKey(date);

    const container = document.createElement('div');
    container.className = 'day-modal-content';

    // Header
    const header = document.createElement('h2');
    header.className = 'modal-date-header';
    header.textContent = formatDateLong(date);
    container.appendChild(header);

    if (isToday(date)) {
        // Today's greeting
        const greeting = document.createElement('p');
        greeting.className = 'personalized-greeting';
        greeting.textContent = createGreeting();
        container.appendChild(greeting);

        // Mood selector
        container.appendChild(createMoodSelector(dateKey, (mood) => {
            updateJumboEmoji(container, mood);
        }));

        // Notes
        container.appendChild(createNotesSection(dateKey));

    } else if (isInPast(date)) {
        // Past date
        const savedMood = loadMood(dateKey);

        if (savedMood) {
            container.appendChild(createJumboEmoji(savedMood));
        } else {
            container.appendChild(createMoodSelector(dateKey, (mood) => {
                updateJumboEmoji(container, mood);
            }));
        }

        container.appendChild(createNotesSection(dateKey));

    } else {
        // Future date
        const message = document.createElement('p');
        message.className = 'future-message';
        message.textContent = 'What will the future hold?';
        container.appendChild(message);
    }

    showModal(container);
}

/**
 * Update jumbo emoji in container
 * @param {HTMLElement} container
 * @param {string|number} mood
 */
function updateJumboEmoji(container, mood) {
    let jumbo = container.querySelector('.jumbo-emoji');
    if (jumbo) {
        jumbo.textContent = getMoodEmoji(mood);
    }
}

/**
 * Show settings modal
 */
function showSettingsModal() {
    const form = createSettingsForm(() => {
        hideModal();
    });
    showModal(form);
}

/**
 * Show report modal
 */
function showReportModal() {
    const content = createReportContent();
    showModal(content, destroyMoodChart);

    // Initialize chart after content is in DOM
    requestAnimationFrame(() => {
        initMoodChart();
    });
}
