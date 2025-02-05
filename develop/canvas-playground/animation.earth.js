export function earthAnimation(ctx, width, height) {
    const earth = {
        x: width / 2,
        y: height / 2,
        radius: Math.min(width, height) * 0.2,
        angle: 0
    };

    function draw() {
        ctx.clearRect(0, 0, width, height); // Clear previous frame

        // Draw the full Earth as a circle
        ctx.beginPath();
        ctx.arc(earth.x, earth.y, earth.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();

        // Create the shading effect for day/night
        let shadingAngle = Math.PI * (earth.angle / 180); // Convert to radians
        let shadingX = earth.x + Math.cos(shadingAngle) * earth.radius;

        // Draw the night half (shadow)
        ctx.beginPath();
        ctx.arc(shadingX, earth.y, earth.radius, -Math.PI / 2, Math.PI / 2, false);
        ctx.lineTo(earth.x, earth.y - earth.radius);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Darker for night side
        ctx.fill();

        // Draw the landmasses (appearing to rotate)
        ctx.fillStyle = 'green';
        for (let i = 0; i < 5; i++) {
            let landX = earth.x + Math.cos(shadingAngle + i) * earth.radius * 0.6;
            let landY = earth.y + Math.sin(shadingAngle + i) * earth.radius * 0.6;
            ctx.beginPath();
            ctx.arc(landX, landY, earth.radius * 0.15, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function update() {
        earth.angle += 0.5; // Slow rotation effect
        if (earth.angle >= 360) earth.angle = 0; // Reset after full rotation
    }

    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }

    animate();
}
