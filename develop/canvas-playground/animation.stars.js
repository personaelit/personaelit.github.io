export function starAnimation(ctx, width, height) {
    const velocityScale = 4.2; // SUPER SLOW drift speed

    let stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3,
        dx: (Math.random() * 0.2 + 0.02) * velocityScale, // Very slow drift
    }));

    function draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height); // Clear the canvas
        ctx.fillStyle = 'white';
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function update() {
        stars.forEach(star => {
            star.x += star.dx; // Move super slow
            if (star.x > width) star.x = 0; // Reset when offscreen
        });
    }

    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }

    animate();
}
