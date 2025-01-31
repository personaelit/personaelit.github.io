import { initializeUI, canvas, ctx, updateDateLabel, updateDatePicker, drawMonths, drawSettingsIcon,drawReportIcon } from './ui.js';
import { initializeSettings } from './services.settings.js';
import { getCurrentDayOfYear } from './services.date.js';
import { drawStarfield, updateAndDrawShootingStars } from './ui.stars.js';
import { drawSun } from './ui.sun.js';
import { drawEarth, updateEarthPosition, initializeEarthPosition } from './ui.earth.js';

// Create a state object to hold shared values
export const state = {
    currentYear: new Date().getUTCFullYear(),
    currentDayOfYear: 1,
    time: 0,
    earthPosition: { x: 0, y: 0, radius: 20 },
    isDragging: false,
    dragStartAngle: 0,
    dragStartTime: 0
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStarfield(canvas, ctx);
    drawMonths(ctx, canvas, state);  // Pass state to drawMonths
    drawSun(ctx, canvas, state);
    drawEarth(ctx, canvas, state);
    drawSettingsIcon(ctx, canvas);
    drawReportIcon(ctx, canvas);  // Add this line
    updateAndDrawShootingStars(canvas, ctx);
}

function animate() {
    draw();
    requestAnimationFrame(animate);
}

function setupInitialEarthPosition() {
    const currentDayOfYear = initializeEarthPosition(state, getCurrentDayOfYear);
    document.getElementById('timeSlider').value = currentDayOfYear;
    updateDateLabel();
    updateDatePicker();
}

initializeUI();
initializeSettings();
setupInitialEarthPosition();
animate();

// Export necessary functions and variables
export { updateEarthPosition, draw };
