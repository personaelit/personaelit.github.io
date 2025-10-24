

export function sunnyDay(canvas, ctx, weather) {


    let rays = [];
    const numRays = 420;
    const sunX = canvas.width / 2;
    const sunY = canvas.height / 2;
    const sunRadius = 50;

    for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2;
        rays.push({
            x: sunX + Math.cos(angle) * sunRadius,
            y: sunY + Math.sin(angle) * sunRadius,
            angle: angle,
            length: 0
        });
    }



    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // drawSun(ctx, canvas, { currentYear: new Date().getFullYear() });

    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 1;

    rays.forEach(ray => {
        ray.length += 1000;
        const endX = ray.x + Math.cos(ray.angle) * ray.length;
        const endY = ray.y + Math.sin(ray.angle) * ray.length;

        ctx.beginPath();
        ctx.moveTo(ray.x, ray.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    });

}
