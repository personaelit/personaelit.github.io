const canvas = document.getElementById('solarSystem');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('timeSlider');

let time = 0;
let stars = [];
let currentDayOfYear;

function getCurrentDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

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
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
    ctx.fill();
}

function drawEarth() {
    const radius = Math.min(canvas.width, canvas.height) * 0.4;
    const x = canvas.width / 2 + Math.cos(time) * radius;
    const y = canvas.height / 2 + Math.sin(time) * radius;

    // Determine the angle between the sun and Earth
    const angleToSun = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    
    // Set day and night colors
    const dayColor = 'rgb(0, 100, 255)';
    const nightColor = 'rgb(0, 10, 50)';

    // Draw the night side (full circle)
    ctx.fillStyle = nightColor;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw the day side (half circle)
    ctx.fillStyle = dayColor;
    ctx.beginPath();
    ctx.arc(x, y, 20, angleToSun - Math.PI / 2, angleToSun + Math.PI / 2);
    ctx.fill();

    // Add label
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Day ${currentDayOfYear}`, x, y + 40);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawSun();
    drawEarth();
}

function animate() {
    draw();
    requestAnimationFrame(animate);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

slider.addEventListener('input', function() {
    currentDayOfYear = Math.floor((slider.value / 100) * 365) + 1;
    time = (currentDayOfYear / 365) * Math.PI * 2;
    updateDateLabel();
});

function updateDateLabel() {
    const date = new Date(new Date().getFullYear(), 0, currentDayOfYear);
    const options = { month: 'short', day: 'numeric' };
    document.getElementById('dateLabel').textContent = date.toLocaleDateString('en-US', options);
}

function initializeEarthPosition() {
    currentDayOfYear = getCurrentDayOfYear();
    time = (currentDayOfYear / 365) * Math.PI * 2;
    slider.value = (currentDayOfYear / 365) * 100;
    updateDateLabel();
}

createStars();
initializeEarthPosition();
animate();
