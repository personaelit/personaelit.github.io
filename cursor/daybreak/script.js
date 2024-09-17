// Create a canvas element
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Set canvas size to viewport size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Get the drawing context
const ctx = canvas.getContext('2d');

// Optional: Fill the canvas with a color (e.g., white)
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Declare gradient variable outside the event listener
let gradient;

// Create a radial gradient
gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
gradient.addColorStop(0, 'yellow'); // Center color
gradient.addColorStop(1, 'orange'); // Outer color

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Update gradient position based on mouse movement
document.addEventListener('mousemove', (event) => {

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Create a radial gradient based on mouse position
    gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, canvas.width / 2);
    gradient.addColorStop(0, 'yellow'); // Center color
    gradient.addColorStop(1, 'orange'); // Outer color

    // Fill the canvas with the updated gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath(); // Start a new path
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2); // Draw a circle
    ctx.fillStyle = 'yellow'; // Set fill color to yellow
    ctx.fill(); //

    // /drawRays();

});

// Draw a yellow circle in the center
ctx.beginPath(); // Start a new path
ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2); // Draw a circle
ctx.fillStyle = 'yellow'; // Set fill color to yellow
ctx.fill(); // Fill the circle

// Function to draw rays of light
function drawRays() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const rayCount = 420; // Number of rays

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for animation
    ctx.fillStyle = gradient; // Reapply the gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill with gradient

    for (let i = 0; i < rayCount; i++) {
        const angle = (i * Math.PI * 2) / rayCount; // Calculate angle for each ray
        const x = centerX + Math.cos(angle) * canvas.width; // End x position (full width)
        const y = centerY + Math.sin(angle) * canvas.width; // End y position (full width)

        ctx.beginPath(); // Start a new path
        ctx.moveTo(centerX, centerY); // Move to the center of the sun
        ctx.lineTo(x, y); // Draw line to the end position
        ctx.strokeStyle = 'yellow'; // Set stroke color to yellow
        ctx.lineWidth = 2; // Set line width
        ctx.stroke(); // Draw the ray
    }
}

// Generate clouds

// Update the animate function to include clouds
function animate() {
    drawRays(); // Draw rays in each frame
    requestAnimationFrame(animate); // Request next frame
}

// Start the animation
animate();


