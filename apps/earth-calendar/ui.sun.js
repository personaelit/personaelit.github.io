let sunPulsate = 0;

export function drawSun(ctx, canvas, state) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Update pulsate value
    sunPulsate = (sunPulsate + 0.02) % (Math.PI * 2);

    // Calculate pulsating radius
    const baseRadius = 50;
    const pulsateAmount = 3;
    const sunRadius = baseRadius + Math.sin(sunPulsate) * pulsateAmount;

    // Create radial gradient for the sun
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sunRadius);
    gradient.addColorStop(0, '#FFF700');
    gradient.addColorStop(0.7, '#FFA500');
    gradient.addColorStop(1, '#FF8C00');

    // Draw the sun
    ctx.beginPath();
    ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Add a glow effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw the year string
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.currentYear, centerX, centerY);
}
