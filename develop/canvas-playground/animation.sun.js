export function sunAnimation(ctx, width, height) {
    const sun = {
        radius: 50,
        color: 'yellow',
        angle: 0,
        speed: 0.01, // Slow rotation
        orbitRadius: Math.min(width, height) * 0.8, // Distance from the center
        pivotX: width / 2, // Center horizontally
        pivotY: height + 100, // Off-screen pivot point (below screen)
    };

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Draw the sun
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
        ctx.fillStyle = sun.color;
        ctx.fill();
        ctx.closePath();
    }

    function update() {
        sun.angle += sun.speed;
        sun.x = sun.pivotX + Math.cos(sun.angle) * sun.orbitRadius;
        sun.y = sun.pivotY + Math.sin(sun.angle) * sun.orbitRadius;
    }

    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }

    animate();
}
