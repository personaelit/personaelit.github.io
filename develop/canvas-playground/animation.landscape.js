export function landscapeAnimation(ctx, width, height) {
    let offset = 0; // Tracks landscape movement
    const speed = 0.2; // Slow horizontal scrolling

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Draw the ground
        ctx.fillStyle = '#2e8b57'; // Dark green for foreground
        ctx.fillRect(0, height - 100, width, 100);

        // Draw rolling hills
        ctx.fillStyle = '#3cb371'; // Lighter green for hills
        ctx.beginPath();
        for (let i = 0; i < width; i += 100) {
            let hillHeight = Math.sin((i + offset) * 0.02) * 40 + 60;
            ctx.arc(i, height - 50, hillHeight, 0, Math.PI * 2);
        }
        ctx.fill();

        // Draw a distant mountain range
        ctx.fillStyle = '#228B22'; // Darker green for depth
        ctx.beginPath();
        for (let i = 0; i < width; i += 150) {
            let mountainHeight = Math.sin((i + offset) * 0.01) * 60 + 80;
            ctx.moveTo(i, height - 50);
            ctx.lineTo(i + 75, height - mountainHeight);
            ctx.lineTo(i + 150, height - 50);
        }
        ctx.fill();
    }

    function update() {
        offset += speed; // Move landscape slowly
        if (offset > width) offset = 0; // Reset offset
    }

    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }

    animate();
}
