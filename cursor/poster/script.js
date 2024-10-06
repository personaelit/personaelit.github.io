const canvas = document.getElementById('poster');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; // Set canvas width to viewport width
canvas.height = window.innerHeight; // Set canvas height to viewport height
ctx.fillStyle = 'black'; // Set fill color to black
ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas

const colors = [
    'rgba(255, 0, 0, .4)',   // Red with 50% opacity
    'rgba(0, 255, 0, .4)',   // Green with 50% opacity
    'rgba(0, 0, 255, .4)',   // Blue with 50% opacity
    'rgba(255, 255, 0, .4)', // Yellow with 50% opacity
    'rgba(128, 0, 128, .1)'  // Purple with 50% opacity
]; // Define colors with opacity
const radius = 1; // Define radius for circles
const centerX = canvas.width / 2; // Calculate center X
const centerY = canvas.height / 2; // Calculate center Y

// Define positions for each circle
const positions = [
    { x: centerX, y: centerY - radius + (radius - 1) }, // Top
    { x: centerX - radius + (radius - 1), y: centerY }, // Left
    { x: centerX, y: centerY },          // Center
    { x: centerX + radius - (radius + 1), y: centerY }, // Right
    { x: centerX, y: centerY + radius - (radius - 1) }  // Bottom
];

let angleOffset = 0; // Initialize rotation angle offset

function draw() {
    ctx.fillStyle = 'black'; // Set fill color to black
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas again

    ctx.save(); // Save the current context state
    ctx.translate(centerX, centerY); // Move to the center of the canvas
    ctx.rotate(angleOffset); // Rotate the context
    ctx.scale(1 + Math.sin(angleOffset) * .2, 1 + Math.sin(angleOffset) * .2); // Zoom in and out

    // Draw each circle individually
    positions.forEach((pos, index) => {
        ctx.beginPath(); // Start a new path
        ctx.arc(pos.x - centerX, pos.y - centerY, radius, 0, Math.PI * 2); // Draw circle
        ctx.fillStyle = colors[index]; // Set fill color
        
        // Add shadow for blurry edge
        ctx.shadowBlur = 200; // Set blur amount
        ctx.shadowColor = 'black'; // Set shadow color
        
        ctx.fill(); // Fill the circle

        // Reset shadow properties
        ctx.shadowBlur = 0; // Reset blur
        ctx.shadowColor = 'transparent'; // Reset shadow color

        // Draw rays outward from the center of each circle
        for (let angle = 0; angle < 360; angle += 2) { // Adjust angle increment for more/less rays
            const radian = angle * (Math.PI / 180); // Convert angle to radians
            const rayLength = Math.max(canvas.width, canvas.height); // Length of the ray
            const endX = (pos.x - centerX) + rayLength * Math.cos(radian); // Calculate end X
            const endY = (pos.y - centerY) + rayLength * Math.sin(radian); // Calculate end Y

            ctx.beginPath(); // Start a new path for the ray
            ctx.moveTo(pos.x - centerX, pos.y - centerY); // Move to the center of the circle
            ctx.lineTo(endX, endY); // Draw line to the calculated endpoint
            ctx.strokeStyle = colors[index]; // Set stroke color to match circle
            ctx.stroke(); // Draw the ray
        }
    });

    ctx.restore(); // Restore the context to its original state
    angleOffset += 0.001; // Increment the rotation angle
    requestAnimationFrame(draw); // Request the next frame
}

// Start the drawing loop
draw();

// Draw each circle individually
positions.forEach((pos, index) => {
    ctx.beginPath(); // Start a new path
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2); // Draw circle
    ctx.fillStyle = colors[index]; // Set fill color
    ctx.fill(); // Fill the circle

    // Draw rays outward from the center of each circle
    for (let angle = 0; angle < 360; angle += 2) { // Adjust angle increment for more/less rays
        const radian = angle * (Math.PI / 180); // Convert angle to radians
        const rayLength = Math.max(canvas.width, canvas.height); // Length of the ray
        const endX = pos.x + rayLength * Math.cos(radian); // Calculate end X
        const endY = pos.y + rayLength * Math.sin(radian); // Calculate end Y

        ctx.beginPath(); // Start a new path for the ray
        ctx.moveTo(pos.x, pos.y); // Move to the center of the circle
        ctx.lineTo(endX, endY); // Draw line to the calculated endpoint
        ctx.strokeStyle = colors[index]; // Set stroke color to match circle
        ctx.stroke(); // Draw the ray
    }
});
