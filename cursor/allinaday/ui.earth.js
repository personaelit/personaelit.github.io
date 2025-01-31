export function drawEarth(ctx, canvas, state) {
    const radius = Math.min(canvas.width, canvas.height) * 0.3;
    const angle = state.time - Math.PI / 2;
    const x = canvas.width / 2 + Math.cos(angle) * radius;
    const y = canvas.height / 2 + Math.sin(angle) * radius;

    state.earthPosition = { x, y, radius: 20 };

    const angleToSun = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    
    const dayColor = 'rgb(0, 100, 255)';
    const nightColor = 'rgb(0, 10, 50)';

    const gradient = ctx.createLinearGradient(
        x - 20 * Math.cos(angleToSun),
        y - 20 * Math.sin(angleToSun),
        x + 20 * Math.cos(angleToSun),
        y + 20 * Math.sin(angleToSun)
    );
    gradient.addColorStop(0, nightColor);
    gradient.addColorStop(0.4, nightColor);
    gradient.addColorStop(0.5, 'rgb(0, 55, 152)');
    gradient.addColorStop(0.6, dayColor);
    gradient.addColorStop(1, dayColor);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${state.currentDayOfYear}`, x, y);

    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

export function updateEarthPosition(state, value) {
    state.currentDayOfYear = parseInt(value);
    state.currentDayOfYear = Math.max(1, Math.min(365, state.currentDayOfYear));
    state.time = ((state.currentDayOfYear - 1) / 365) * Math.PI * 2;
}

export function initializeEarthPosition(state, getCurrentDayOfYear) {
    const today = new Date();
    state.currentYear = today.getUTCFullYear();
    state.currentDayOfYear = getCurrentDayOfYear();
    state.time = ((state.currentDayOfYear) / 365) * Math.PI * 2;
    return state.currentDayOfYear;
}
