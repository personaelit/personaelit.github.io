import { showModal, updateModalContent } from './modal.js';
import { initializeSettings, toggleSettingsPanel, openSettingsPanel, closeSettingsPanel } from './settings.js';
import { getCurrentDayOfYear, calculateDaysAlive } from './utils.js';

const canvas = document.getElementById('solarSystem');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('timeSlider');
const clockElement = document.getElementById('clock');
const datePicker = document.getElementById('datePicker');
const daysAliveElement = document.getElementById('daysAlive');

let time = 0;
let stars = [];
let currentDayOfYear;
let earthPosition = { x: 0, y: 0, radius: 20 };
let currentYear;
let isDragging = false;
let dragStartAngle = 0;
let dragStartTime = 0;
const CLICK_TIME_THRESHOLD = 200; // milliseconds

let sunPulsate = 0;

let lastTouchEnd = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
}

function createStars() {
    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5
        });
    }
}

function drawBackground() {
    // Create a radial gradient for the space background
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(0, '#1a2a6c');
    gradient.addColorStop(1, '#000000');

    // Fill the background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = 'white';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawSun() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Update pulsate value
    sunPulsate = (sunPulsate + 0.05) % (Math.PI * 2);
    
    // Calculate pulsating radius
    const baseRadius = 50;
    const pulsateAmount = 3; // Reduced from 5 to 3 for a smaller effect
    const sunRadius = baseRadius + Math.sin(sunPulsate) * pulsateAmount;

    // Create radial gradient for the sun
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sunRadius);
    gradient.addColorStop(0, '#FFF700');  // Bright yellow core
    gradient.addColorStop(0.7, '#FFA500');  // Orange
    gradient.addColorStop(1, '#FF8C00');  // Dark orange edge

    // Draw the sun
    ctx.beginPath();
    ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Add a glow effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // Use the current year from the date picker
    const date = new Date(currentYear, 0, currentDayOfYear);
    const options = { month: 'short', day: 'numeric' };

    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Draw the year string
    ctx.fillText(currentYear, centerX, centerY); // Adjust y position for line break
}

function drawEarth() {
    const radius = Math.min(canvas.width, canvas.height) * 0.3;
    // Adjust the angle calculation to start from the top (subtract PI/2)
    const angle = time - Math.PI / 2;
    const x = canvas.width / 2 + Math.cos(angle) * radius;
    const y = canvas.height / 2 + Math.sin(angle) * radius;

    // Update earth position
    earthPosition = { x, y, radius: 20 };

    // Determine the angle between the sun and Earth
    const angleToSun = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    
    // Set day and night colors
    const dayColor = 'rgb(0, 100, 255)';
    const nightColor = 'rgb(0, 10, 50)';

    // Create a gradient for the transition
    const gradient = ctx.createLinearGradient(
        x - 20 * Math.cos(angleToSun),
        y - 20 * Math.sin(angleToSun),
        x + 20 * Math.cos(angleToSun),
        y + 20 * Math.sin(angleToSun)
    );
    gradient.addColorStop(0, nightColor);
    gradient.addColorStop(0.4, nightColor);
    gradient.addColorStop(0.5, 'rgb(0, 55, 152)'); // Transition color
    gradient.addColorStop(0.6, dayColor);
    gradient.addColorStop(1, dayColor);

    // Draw the Earth using the gradient
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Add label in the center of the Earth
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial'; // Reduced font size to fit inside Earth
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${currentDayOfYear}`, x, y);

    // Add visual cue for draggability
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawMonths() {
    const radius = Math.min(canvas.width, canvas.height) * 0.4; // Slightly larger than Earth's orbit
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct', 'Nov', 'Dec'];
    
    months.forEach((month, index) => {
        // Adjust the angle calculation to start from the top
        const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.fillText(month, x, y);
    });
}

function drawSettingsIcon() {
    const iconSize = 30;
    const padding = 20;
    const x = canvas.width - iconSize - padding;
    const y = canvas.height - iconSize - padding;

    ctx.fillStyle = 'white';
    ctx.font = `${iconSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚙️', x + iconSize / 2, y + iconSize / 2);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawMonths();
    drawSun();
    drawEarth();
    drawSettingsIcon();
}

function animate() {
    draw();
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        updateDaysAliveLabel();
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function updateEarthPosition(value) {
    currentDayOfYear = parseInt(value);
    // Ensure the day stays between 1 and 365
    currentDayOfYear = Math.max(1, Math.min(365, currentDayOfYear));
    time = ((currentDayOfYear - 1) / 365) * Math.PI * 2;
    updateDateLabel();
    updateDatePicker(); // Add this line to update the date picker
}

slider.addEventListener('input', function() {
    updateEarthPosition(this.value);
});

slider.addEventListener('change', function() {
    updateEarthPosition(this.value);
});

function updateDateLabel() {
    // Create a new Date object for the current year
    const currentYear = new Date().getFullYear();
    // Create a date object for the selected day
    const date = new Date(currentYear, 0, currentDayOfYear);
    
    const options = { month: 'short', day: 'numeric' };
    document.getElementById('dateLabel').textContent = date.toLocaleDateString('en-US', options);
}

function initializeEarthPosition() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentDayOfYear = getCurrentDayOfYear();
    time = ((currentDayOfYear - 1) / 365) * Math.PI * 2;
    slider.value = currentDayOfYear;
    updateDateLabel();
    updateDatePicker();
}

function updateDatePicker() {
    const date = new Date(currentYear, 0, currentDayOfYear);
    datePicker.value = date.toISOString().split('T')[0];
}

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

function updateDaysAliveLabel() {
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

initializeDaysAlive();

setInterval(updateClock, 1000);
updateClock(); // Initial call to avoid delay

datePicker.addEventListener('change', function() {
    const selectedDate = new Date(this.value);
    currentYear = selectedDate.getFullYear();
    const start = new Date(currentYear, 0, 0);
    const diff = selectedDate - start;
    const oneDay = 1000 * 60 * 60 * 24;
    currentDayOfYear = Math.floor(diff / oneDay) + 1; // Add 1 to account for day 1
    
    updateEarthPosition(currentDayOfYear);
    slider.value = currentDayOfYear;
});

createStars();
initializeEarthPosition();
animate();

function handleDragStart(event) {
    event.preventDefault(); // Prevent default touch behavior
    const rect = canvas.getBoundingClientRect();
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const distance = Math.sqrt((x - earthPosition.x) ** 2 + (y - earthPosition.y) ** 2);
    if (distance <= earthPosition.radius) {
        isDragging = true;
        dragStartAngle = Math.atan2(y - canvas.height / 2, x - canvas.width / 2);
        dragStartTime = new Date().getTime();
    }
}

function handleDragMove(event) {
    if (!isDragging) return;
    event.preventDefault(); // Prevent default touch behavior

    const rect = canvas.getBoundingClientRect();
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const currentAngle = Math.atan2(y - canvas.height / 2, x - canvas.width / 2);
    let angleDiff = currentAngle - dragStartAngle;

    // Ensure the angle difference is between -PI and PI
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    time += angleDiff;
    dragStartAngle = currentAngle;

    // Update currentDayOfYear based on the new time
    currentDayOfYear = Math.floor((time / (Math.PI * 2) * 365) + 1) % 365 || 365;
    updateDateLabel();
    updateDatePicker();
    slider.value = currentDayOfYear;
}

function handleDragEnd(event) {
    if (!isDragging) return;
    
    const dragEndTime = new Date().getTime();
    const dragDuration = dragEndTime - dragStartTime;

    if (dragDuration < CLICK_TIME_THRESHOLD) {
        // This was a quick tap/click, so open the modal
        const selectedDate = new Date(currentYear, 0, 1);
        selectedDate.setDate(currentDayOfYear);
        console.log("Selected date:", selectedDate); // Add this for debugging
        updateModalContent(selectedDate);
        showModal();
    }

    isDragging = false;
}

function handleCanvasInteraction(event) {
    console.log("Canvas interaction");

    // Prevent ghost clicks on mobile
    if (event.type === 'touchend') {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
            return;
        }
        lastTouchEnd = now;
    }

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX || event.changedTouches[0].clientX) - rect.left;
    const y = (event.clientY || event.changedTouches[0].clientY) - rect.top;

    // Check if the interaction is on the settings icon
    const iconSize = 30;
    const padding = 20;
    const iconX = canvas.width - iconSize - padding;
    const iconY = canvas.height - iconSize - padding;
    if (x >= iconX && x <= iconX + iconSize && y >= iconY && y <= iconY + iconSize) {
        toggleSettingsPanel();
    }
}

// Remove previous click event listener
//canvas.removeEventListener('click', handleCanvasClick);

// Add new event listeners
canvas.addEventListener('click', handleCanvasInteraction);
canvas.addEventListener('touchend', handleCanvasInteraction);

// Prevent default touch behavior to avoid unwanted scrolling or zooming
canvas.addEventListener('touchstart', function(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
    }
}, { passive: false });

// Update event listeners
canvas.addEventListener('mousedown', handleDragStart);
canvas.addEventListener('touchstart', handleDragStart);

canvas.addEventListener('mousemove', handleDragMove);
canvas.addEventListener('touchmove', handleDragMove);

canvas.addEventListener('mouseup', handleDragEnd);
canvas.addEventListener('touchend', handleDragEnd);

document.body.addEventListener('click', function() {
    console.log("Body clicked");
});

initializeSettings();
