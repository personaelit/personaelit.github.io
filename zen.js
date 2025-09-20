window.addEventListener('DOMContentLoaded', (event) => {

console.log("The Zen is upon us.");
    getRippled();
    blowItUp();
    isItBorked();
    lightsOut();
    hereComesTheSun();
    letItRain();
    cloudsComeRollingIn();
    glitterRainbowSheen();
    letItGrow();
    launchRocket();
    activateSpotlight();
    activateRandomCanvasIfNeeded();
    buyTheTicketTakeTheRide();
    
    // document.querySelectorAll('.zen-control').forEach(btn => {
    //     //btn.style.display = 'none';
    //     btn.click();
    // });

});

function activateSpotlight() {
    console.log("dark star rising");

    const canvas = createEffectCanvas({
        id: 'spotlight-canvas',
        zIndex: '3000',
        draw: (ctx, canvas) => {
            let mouseX = canvas.width / 2;
            let mouseY = canvas.height / 2;
            const spotlightRadius = Math.min(canvas.width, canvas.height) / 5; // Spotlight size

            function drawSpotlight() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Create a full-screen dark overlay
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Create the spotlight effect
                const gradient = ctx.createRadialGradient(mouseX, mouseY, spotlightRadius / 2, mouseX, mouseY, spotlightRadius);
                gradient.addColorStop(0, 'rgba(255, 255, 255, .01)'); // Bright center
                gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.8)'); // Soft fade-out
                gradient.addColorStop(1, 'rgba(0, 0, 0, 1)'); // Blends into darkness

                ctx.globalCompositeOperation = 'source-over';
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                requestAnimationFrame(drawSpotlight);
            }

            document.addEventListener('mousemove', (event) => {
                mouseX = event.clientX;
                mouseY = event.clientY;
            });

            document.addEventListener('touchmove', (event) => {
                if (event.touches.length > 0) {
                    mouseX = event.touches[0].clientX;
                    mouseY = event.touches[0].clientY;
                }
                if (canvas.style.display === 'block') { // Only prevent scrolling if the spotlight is active
                    event.preventDefault();
                }
            }, { passive: false });


            drawSpotlight();
        }
    });

    createToggleButton({
        icon: '🔦',
        className: 'spotlight-toggle',
        localStorageKey: 'spotlight-mode',
        canvas,
    });
}


function activateRandomCanvasIfNeeded() {
    const canvasEffects = [
        { key: 'rocket-mode', id: 'rocket-canvas' },
        { key: 'flower-mode', id: 'flower-canvas' },
        { key: 'sheen-mode', id: 'sheen-canvas' },
        { key: 'rain-mode', id: 'rain-canvas' },
        { key: 'sun-mode', id: 'sun-canvas' },
        { key: 'cloud-mode', id: 'cloud-canvas' }
    ];

    // Check if any canvas effect key exists in localStorage
    const hasCanvasKeys = canvasEffects.some(effect => localStorage.getItem(effect.key) !== null);

    if (!hasCanvasKeys) {
        // No keys exist, pick a random effect
        const randomEffect = canvasEffects[Math.floor(Math.random() * canvasEffects.length)];

        // Set the effect as enabled in localStorage
        localStorage.setItem(randomEffect.key, 'enabled');

        // Directly show the canvas without adding an extra button
        const canvas = document.getElementById(randomEffect.id);
        if (canvas) {
            canvas.style.display = 'block';
        }
    }
}

function createEffectCanvas({ id, zIndex, draw }) {
    const canvas = document.createElement('canvas');
    canvas.id = id;
    canvas.className = id;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = zIndex;
    canvas.style.pointerEvents = 'none';
    canvas.style.display = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = document.documentElement.scrollHeight;
        draw(ctx, canvas)
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return canvas;
}

function createZenContainer() {
    let zenContainer = document.querySelector('.zen-container');
    if (!zenContainer) {
        zenContainer = document.createElement('div');
        zenContainer.className = 'zen-container';
        document.body.appendChild(zenContainer);
    }
    return zenContainer;
}

function createToggleButton({ icon, className, localStorageKey, canvas }) {
    console.log(`Creating toggle button for ${localStorageKey}`);
    const button = document.createElement('button');
    button.innerText = icon;
    button.className = className;
    button.classList.add('zen-control');

    const zenContainer = createZenContainer();
    zenContainer.appendChild(button);

    function toggleCanvas() {
        const isActive = canvas.style.display === 'block';
        canvas.style.display = isActive ? 'none' : 'block';
        localStorage.setItem(localStorageKey, isActive ? 'disabled' : 'enabled');
    }

    button.addEventListener('click', toggleCanvas);

    if (localStorage.getItem(localStorageKey) === 'enabled') {
        canvas.style.display = 'block';
    }

}

function buyTheTicketTakeTheRide() {
    console.log("Buy the ticket, take the ride.");

    const magicMushroom = document.createElement('button');
    magicMushroom.innerText = '🍄';
    magicMushroom.className = "mushroom-toggle";
    magicMushroom.classList.add('zen-control');

    const zenContainer = createZenContainer(); // Ensure this function exists
    zenContainer.appendChild(magicMushroom);

    magicMushroom.addEventListener('click', () => {
        applyPsychedelicEffects();

        clearTimeout(magicMushroom.dataset.timeoutId);

        const timeoutId = setTimeout(() => {
            removePsychedelicEffects();
        }, 6900);
        magicMushroom.dataset.timeoutId = timeoutId;

    });

    function applyPsychedelicEffects() {
        document.querySelectorAll('*').forEach(element => {
            element.style.animation = `psychedelicPulse ${Math.random() * 3 + 1}s infinite ease-in`;
        });
    }

    function removePsychedelicEffects() {
        document.querySelectorAll('*').forEach(element => {
            element.style.animation = '';
        });
    }
}

function launchRocket() {
    console.log("Standing on the moon.");

    const canvas = createEffectCanvas({
        id: 'rocket-canvas',
        zIndex: '10',
        draw: (ctx, canvas) => {
            const rocket = '🚀';
            let x = canvas.width / 2;
            let y = canvas.height / 2;
            let velocityX = (Math.random() - 0.5) * 4;
            let velocityY = (Math.random() - 0.5) * 4;
            let acceleration = 0.05;
            let maxSpeed = 6;
            let margin = 80; // Allow slight off-screen movement before reversing

            function getNewTarget() {
                return {
                    x: Math.random() * (canvas.width - 2 * margin) + margin,
                    y: Math.random() * (canvas.height - 2 * margin) + margin,
                };
            }

            let { x: targetX, y: targetY } = getNewTarget();

            function drawRocket() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const shipSize = window.innerWidth < 600 ? 120 : 240;
                ctx.font = `${shipSize}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                let angle = Math.atan2(velocityY, velocityX) + Math.PI / 4; // Adjust for default emoji rotation

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.fillText(rocket, 0, 0);
                ctx.restore();
            }

            function moveRocket() {
                let dx = targetX - x;
                let dy = targetY - y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 20) {
                    ({ x: targetX, y: targetY } = getNewTarget()); // Pick a new target when close
                }

                velocityX += (dx / distance) * acceleration;
                velocityY += (dy / distance) * acceleration;

                velocityX = Math.max(-maxSpeed, Math.min(maxSpeed, velocityX));
                velocityY = Math.max(-maxSpeed, Math.min(maxSpeed, velocityY));

                x += velocityX;
                y += velocityY;

                // If it goes slightly off-screen, reverse its trajectory
                if (x < -margin || x > canvas.width + margin) {
                    velocityX *= -1;
                    targetX = Math.random() * (canvas.width - 2 * margin) + margin; // New target within bounds
                }
                if (y < -margin || y > canvas.height + margin) {
                    velocityY *= -1;
                    targetY = Math.random() * (canvas.height - 2 * margin) + margin; // New target within bounds
                }

                drawRocket();
                requestAnimationFrame(moveRocket);
            }

            drawRocket();
            moveRocket();
        }
    });

    createToggleButton({
        icon: '🚀',
        className: 'rocket-toggle',
        localStorageKey: 'rocket-mode',
        canvas,
    });
}

function letItGrow() {
    console.log('Keep on growing.');

    const canvas = createEffectCanvas({
        id: 'flower-canvas',
        zIndex: '0',
        draw: (ctx, canvas) => {
            const flowerEmojis = ['🌸', '🌼', '🌻', '🌺', '🌹', '🌷', '💐', '🌿', '🍀'];
            const flowers = [];
            // Initialize flowers
            for (let i = 0; i < 10; i++) {
                const flower = {
                    emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    baseX: Math.random() * canvas.width,
                    baseY: Math.random() * canvas.height,
                    angle: Math.random() * Math.PI * 2, // Initial rotation
                    size: 50 + Math.random() * 30,
                    swirlSpeed: 0.02 + Math.random() * 0.03, // Speed of swirling
                    rotationSpeed: 0.02 + Math.random() * 0.05, // Speed of rotation
                    driftSpeedX: (Math.random() - 0.5) * 0.3, // Small drift in X direction
                    driftSpeedY: (Math.random() - 0.5) * 0.3  // Small drift in Y direction
                };
                flowers.push(flower);
            }

            function drawFlowers() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                flowers.forEach(flower => {
                    // Update base position to create drifting effect
                    flower.baseX += flower.driftSpeedX;
                    flower.baseY += flower.driftSpeedY;

                    // Wrap flowers around when they drift out of bounds
                    if (flower.baseX > canvas.width) flower.baseX = 0;
                    if (flower.baseX < 0) flower.baseX = canvas.width;
                    if (flower.baseY > canvas.height) flower.baseY = 0;
                    if (flower.baseY < 0) flower.baseY = canvas.height;

                    // Swirling motion around drifting base position
                    flower.angle += flower.swirlSpeed;
                    flower.x = flower.baseX + Math.cos(flower.angle) * 50; // Adjust radius of swirling
                    flower.y = flower.baseY + Math.sin(flower.angle) * 50;

                    // Rotate emoji
                    ctx.save();
                    ctx.translate(flower.x, flower.y);
                    ctx.rotate(flower.angle * flower.rotationSpeed);

                    ctx.font = `${flower.size}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(flower.emoji, 0, 0);

                    ctx.restore();
                });
                requestAnimationFrame(drawFlowers);
            }

            drawFlowers();
        }
    })

    createToggleButton({
        icon: '🌷',
        className: 'flower-toggle',
        localStorageKey: 'flower-mode',
        canvas,
    });
}

function glitterRainbowSheen() {
    console.log("...reaching from a rainbow.");

    const canvas = createEffectCanvas({
        id: 'sheen-canvas',
        zIndex: '-5',
        draw: (ctx, canvas) => {
            let hueShift = 0;
            function drawSheen() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, `hsl(${hueShift}, 100%, 75%)`);
                gradient.addColorStop(0.5, `hsl(${(hueShift + 60) % 360}, 100%, 75%)`);
                gradient.addColorStop(1, `hsl(${(hueShift + 120) % 360}, 100%, 75%)`);

                ctx.fillStyle = gradient;
                ctx.globalAlpha = 0.6;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                hueShift = (hueShift + 1) % 360;
                requestAnimationFrame(drawSheen);
            }
            drawSheen();
        }
    })


    createToggleButton({
        icon: '🌈',
        className: 'sheen-toggle',
        localStorageKey: 'sheen-mode',
        canvas,
    });




}

function letItRain() {
    console.log("Just a box of rain. 🌧️");

    const canvas = createEffectCanvas({
        id: 'rain-canvas',
        zIndex: '-2',
        draw: (ctx, canvas) => {
            let raindrops = [];
            const dropCount = Math.max(6969, window.innerWidth / 10);

            function createRaindrop() {
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    speed: 2 + Math.random() * 5,
                    length: 10 + Math.random() * 20,
                    opacity: 0.2 + Math.random() * 0.5
                };
            }

            function initRain() {
                raindrops = Array.from({ length: dropCount }, createRaindrop);
            }
            initRain();

            function drawRain() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = "rgba(173, 216, 230, 0.6)";
                ctx.lineWidth = 1.5;
                ctx.lineCap = "round";

                raindrops.forEach(drop => {
                    ctx.globalAlpha = drop.opacity;
                    ctx.beginPath();
                    ctx.moveTo(drop.x, drop.y);
                    ctx.lineTo(drop.x, drop.y + drop.length);
                    ctx.stroke();

                    drop.y += drop.speed;
                    if (drop.y > canvas.height) {
                        drop.y = -drop.length;
                        drop.x = Math.random() * canvas.width;
                        drop.speed = 2 + Math.random() * 5;
                    }
                });

                requestAnimationFrame(drawRain);
            }

            drawRain();
        }
    });

    createToggleButton({
        icon: '☔',
        className: 'rain-toggle',
        localStorageKey: 'rain-mode',
        canvas,
    });
}

function hereComesTheSun() {
    console.log("Sometimes the lights all shining on me. ☀️");

    const canvas = createEffectCanvas({
        id: "sun-canvas",
        zIndex: "-2",
        draw: (ctx, canvas) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const sunX = canvas.width - 120;
            const sunY = 120;
            const sunRadius = 80;
            const rayCount = 420;

            ctx.fillStyle = '#FFFFE0';
            ctx.beginPath();
            ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#FFFFE0';
            ctx.lineWidth = 1;
            for (let i = 0; i < rayCount; i++) {
                let angle = (Math.PI * 2 * i) / rayCount;
                let startX = sunX + Math.cos(angle) * sunRadius;
                let startY = sunY + Math.sin(angle) * sunRadius;
                let rayLength = 100 + Math.random() * 400;
                let endX = sunX + Math.cos(angle) * rayLength;
                let endY = sunY + Math.sin(angle) * rayLength;

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
        }
    });

    createToggleButton({
        icon: '☀️',
        className: 'sun-toggle',
        localStorageKey: 'sun-mode',
        canvas,
    });
}

function cloudsComeRollingIn() {
    console.log("Cloud hands...");

    const canvas = createEffectCanvas({
        id: "cloud-canvas",
        zIndex: "-1",
        draw: (ctx, canvas) => {
            function getContrastingColor() {
                const bodyBg = window.getComputedStyle(document.body).backgroundColor;
                const rgb = bodyBg.match(/\d+/g).map(Number);
                const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
                return brightness > 128 ? 'black' : 'white';
            }

            let clouds = Array.from({ length: Math.max(5, Math.floor(window.innerWidth / 250)) }, () => ({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight / 2,
                speed: 0.01 + Math.random() * .5,
                size: 50 + Math.random() * 70,
            }));

            function drawClouds() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = `180px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const cloudColor = getContrastingColor();

                clouds.forEach(cloud => {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                    ctx.fillText('☁️', cloud.x + 3, cloud.y + 3);
                    ctx.fillStyle = cloudColor;
                    ctx.fillText('☁️', cloud.x, cloud.y);
                    cloud.x += cloud.speed;
                    if (cloud.x > canvas.width + 60) cloud.x = -60;
                });
                requestAnimationFrame(drawClouds);
            }
            drawClouds();
        }
    });

    createToggleButton({
        icon: '☁️',
        className: 'cloud-toggle',
        localStorageKey: 'cloud-mode',
        canvas,
    });
}

function lightsOut() {
    console.log("Once in a while you can get shown the light");

    const lightSwitch = document.createElement('button');
    lightSwitch.innerText = '💡';
    lightSwitch.className = 'light-toggle';
    lightSwitch.classList.add('zen-control');
    const zenContainer = createZenContainer();
    zenContainer.appendChild(lightSwitch);

    // Check localStorage for mode state
    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.body.style.backgroundColor = '#111';
        document.body.style.color = '#eee';
        document.body.style.filter = 'grayscale(100%)';

    }

    lightSwitch.addEventListener('click', () => {
        document.body.style.transition = 'background-color 1s, color 1s';
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            document.body.style.filter = 'grayscale(0%)';
            localStorage.setItem('dark-mode', 'disabled');
        } else {
            document.body.classList.add('dark-mode');
            document.body.style.backgroundColor = '#111';
            document.body.style.color = '#eee';
            document.body.style.filter = 'grayscale(100%)';
            localStorage.setItem('dark-mode', 'enabled');
        }
    });
}

function isItBorked() {
    console.log("Brokedown palace.");
    const links = document.querySelectorAll("a");

    links.forEach(link => {
        if (link.hostname === window.location.hostname) {
            fetch(link.href, { method: 'HEAD' })
                .then(response => {
                    if (response.status === 404) {
                        link.classList.add("broken-link");
                    }
                })
                .catch(error => {
                    console.error('Error checking link:', error);
                    link.classList.add("broken-link");
                });
        }
    });
}

function blowItUp() {
    console.log("In 5... 4... 3... 2... 1...");

    const selfDestructButton = document.createElement('button');
    selfDestructButton.id = 'selfDestructButton';
    selfDestructButton.innerText = '💣';
    selfDestructButton.className = 'deconstruct';
    selfDestructButton.classList.add('zen-control');

    const zenContainer = createZenContainer();
    zenContainer.appendChild(selfDestructButton)
        ;
    selfDestructButton.addEventListener('click', () => {
        const getAllDescendants = (element) => {
            const descendants = [];
            const stack = [element];

            while (stack.length > 0) {
                const current = stack.pop();
                descendants.push(current);
                for (let i = 0; i < current.children.length; i++) {
                    stack.push(current.children[i]);
                }
            }

            return descendants;
        };

        const allDescendants = getAllDescendants(document.body);
        allDescendants.forEach(element => {
            element.style.transition = 'transform 2s ease-in, opacity 2s ease-in';
            element.style.transform = `translate(${Math.random() * window.innerWidth - window.innerWidth / 2}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`;
        });

        setTimeout(() => {
            location.reload();
        }, 6900);
    });
}
