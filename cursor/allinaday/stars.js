let shootingStars = [];
let stars = [];

export function createStars(canvas) {
    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5
        });
    }
}

export function createShootingStar() {
    const star = {
        x: 0,
        y: Math.random() * canvas.height,
        length: Math.random() * 80 + 20,
        speed: Math.random() * 50 + 5,
        angle: 45
    };
    shootingStars.push(star);
}

export function updateAndDrawShootingStars(canvas, ctx) {
    shootingStars = shootingStars.filter(star => 
        star.x >= 0 && star.x <= canvas.width && 
        star.y >= 0 && star.y <= canvas.height
    );
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    
    shootingStars.forEach(star => {
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.length * Math.cos(star.angle), 
                   star.y - star.length * Math.sin(star.angle));
        ctx.stroke();
        
        star.x += star.speed * Math.cos(star.angle);
        star.y += star.speed * Math.sin(star.angle);
    });
}

export function drawStarfield(canvas, ctx) {
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
