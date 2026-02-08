/**
 * Earth Calendar 2 - Main Entry Point
 * Clean bootstrap with proper initialization order
 */

import { setState } from './state.js';
import { getCurrentDayOfYear } from './utils/date.js';
import { initRenderer, onRender, startRenderLoop, getDimensions } from './canvas/renderer.js';
import { initStars, drawStars, onStarsResize } from './canvas/stars.js';
import { drawSun } from './canvas/sun.js';
import { drawEarth, drawMonthLabels, initEarthPosition } from './canvas/earth.js';
import { drawMoodTrail } from './canvas/mood-trail.js';
import { drawSeasonBands } from './canvas/seasons.js';
import { drawMoon } from './canvas/moon.js';
import { drawSettingsIcon, drawReportIcon } from './canvas/ui-icons.js';
import { initModal } from './ui/modal.js';
import { initEvents, updateUIFromState } from './ui/events.js';
import { getSavedToggles } from './features/settings.js';

/**
 * Initialize the application
 */
function init() {
    // Get DOM elements
    const canvas = document.getElementById('canvas');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const timeSlider = document.getElementById('timeSlider');
    const datePicker = document.getElementById('datePicker');
    const dateLabel = document.getElementById('dateLabel');

    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    // Initialize renderer
    initRenderer(canvas);

    // Initialize stars with current dimensions
    const dimensions = getDimensions();
    initStars(dimensions);

    // Initialize earth position to current day
    const today = getCurrentDayOfYear();
    initEarthPosition(today);

    // Set current year and saved toggle preferences in state
    setState({
        currentYear: new Date().getFullYear(),
        ...getSavedToggles(),
    });

    // Register render callbacks (order matters for layering)
    onRender(drawStars, onStarsResize);
    onRender(drawMonthLabels);
    onRender(drawSeasonBands);
    onRender(drawMoodTrail);
    onRender(drawSun);
    onRender(drawEarth);
    onRender(drawMoon);
    onRender(drawSettingsIcon);
    onRender(drawReportIcon);

    // Initialize modal
    initModal(modal, modalContent, modalBackdrop);

    // Initialize event handlers
    initEvents({
        canvas,
        timeSlider,
        datePicker,
        dateLabel
    });

    // Update UI with initial state
    updateUIFromState();

    // Start render loop
    startRenderLoop();

    console.log('Earth Calendar 2 initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
