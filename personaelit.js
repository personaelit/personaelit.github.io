window.addEventListener('DOMContentLoaded', (event) => {
    startColorTransition();
    stylizeLinks();
    flagExternalLinks();
    activateSlidableCards();
    getRippled();
    blowItUp();
    isItBorked();
    lightsOut();
    hereComesTheSun();
    letItRain();
    cloudsComeRollingIn();
    glitterRainbowSheen();
    letItGrow();
    //reflect();
});

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

function createZenContainer(){
        let zenContainer = document.querySelector('.zen-container');
    if (!zenContainer) {
        zenContainer = document.createElement('div');
        zenContainer.className = 'zen-container';
        document.body.appendChild(zenContainer);
    }
    return zenContainer;
}

function createToggleButton({ icon, className, localStorageKey, canvas }) {
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

    button.addEventListener('click', toggleCanvas);
}

function reflect() {
    console.log("the Metamorphosis of Narcissus")

    const canvas = createEffectCanvas({
        id: 'reflect-canvas',
        zIndex: '1000',
        draw: (ctx, canvas) => {
            const video = document.createElement('video');
            video.autoplay = true;
            video.style.display = 'none';
            document.body.appendChild(video);

            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    video.srcObject = stream;
                    video.play();
                })
                .catch(err => {
                    console.error('Error accessing camera: ', err);
                });

            function drawVideo() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 0.2;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = 'color';
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = 'source-over';
                requestAnimationFrame(drawVideo);
            }

            drawVideo();
        }
    });

    createToggleButton({
        icon: '🪞',
        className: 'reflect-toggle',
        localStorageKey: 'reflect-mode',
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

function getRippled() {

    console.log("Ripple, on still water.")
    const rippleContainer = document.querySelector('body');

    document.addEventListener('click', (event) => {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.classList.add('zen-control');

        // Calculate the position based on scroll offset
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        ripple.style.left = `${event.clientX - 10 + scrollX}px`;  // Adjust ripple position to center
        ripple.style.top = `${event.clientY - 10 + scrollY}px`;   // Adjust ripple position to center

        rippleContainer.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });

    });

}

function activateSlidableCards() {
    console.log("Aces back to back.")

    const cards = document.querySelectorAll(".card");
    const patina = ['#f8f8f8', '#fafafa', '#f3f3f3'];

    let top = 1;

    cards.forEach(card => {
        let offsetX, offsetY, isDragging = false;

        card.style.position = 'absolute';

        const randomShade = patina[Math.floor(Math.random() * patina.length)];
        card.style.backgroundColor = randomShade;

        //scatter the cards
        card.style.left = `${Math.random() * (window.innerWidth - card.offsetWidth)}px`;
        card.style.top = `${Math.random() * (window.innerHeight - card.offsetHeight)}px`


        // Handle the start of dragging
        function handleDragStart(event) {

            if (event.target.tagName.toLowerCase() === 'a') {
                return; // Allow default behavior for hyperlinks
            }

            top += 1;

            isDragging = true;
            card.style.cursor = 'grabbing';
            card.style.zIndex = top; // Bring the card to the front while dragging


            if (event.type === "touchstart") {
                const touch = event.touches[0];
                offsetX = touch.clientX - card.getBoundingClientRect().left;
                offsetY = touch.clientY - card.getBoundingClientRect().top;
            } else {
                offsetX = event.offsetX;
                offsetY = event.offsetY;
            }

            event.preventDefault();
        }

        // Handle dragging
        function handleDrag(event) {
            if (!isDragging) return;

            let clientX, clientY;
            if (event.type === "touchmove") {
                const touch = event.touches[0];
                clientX = touch.clientX;
                clientY = touch.clientY;
            } else {
                clientX = event.clientX;
                clientY = event.clientY;
            }

            card.style.left = `${clientX - offsetX}px`;
            card.style.top = `${clientY - offsetY}px`;

            event.preventDefault();
        }

        // Handle end of dragging
        function handleDragEnd() {
            isDragging = false;
            card.style.cursor = 'grab';
        }

        // Touch events
        card.addEventListener("touchstart", handleDragStart);
        card.addEventListener("touchmove", handleDrag);
        card.addEventListener("touchend", handleDragEnd);
        card.addEventListener("touchcancel", handleDragEnd);

        // Mouse events
        card.addEventListener("mousedown", handleDragStart);
        document.addEventListener("mousemove", handleDrag);
        document.addEventListener("mouseup", handleDragEnd);
    });
}


function flagExternalLinks() {
    console.log("wave that flag.")
    const links = document.querySelectorAll("a");

    // Iterate through each link
    links.forEach(link => {
        // Check if the link is external
        if (link.hostname !== window.location.hostname) {
            // Add a class to the external link
            link.classList.add("external");
        }
    });
}

function stylizeLinks() {
    console.log("anchors away.")
    const anchors = document.querySelectorAll('a');

    anchors.forEach(anchor => {
        // Generate a random rotation angle between -5 and 5 degrees
        const randomAngle = Math.random() * 10 - 5;

        // Apply the rotation using a CSS transform
        anchor.style.transform += `rotate(${randomAngle}deg)`;
        anchor.classList.add('rotated');
    });
}

function startColorTransition() {
    console.log("transition init.");

    let hue = Math.floor(Math.random() * 360); // Random hue 0-359
    let saturation = Math.floor(Math.random() * 100); // Random saturation 0-99
    let lightness = Math.floor(Math.random() * 100); // Random lightness 0-99

    let saturationDirection = 1; // Control saturation changes
    let lightnessDirection = 1;  // Control lightness changes

    function updateColors() {
        hue = (hue + 1) % 360; // Cycle through 0-359 for the hue value

        // Reverse saturation direction at bounds
        if (saturation >= 100 || saturation <= 0) {
            saturationDirection *= -1;
        }
        saturation = Math.max(0, Math.min(100, saturation + saturationDirection));

        // Reverse lightness direction at bounds
        if (lightness >= 100 || lightness <= 0) {
            lightnessDirection *= -1;
        }
        lightness = Math.max(0, Math.min(100, lightness + lightnessDirection));

        let bgColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        let textColor = getTextColor(hue, saturation, lightness);
        document.body.style.setProperty('--bg-color', bgColor);
        document.body.style.setProperty('--text-color', textColor);
    }

    // Clear any existing interval before starting a new one
    if (window.colorTransitionInterval) {
        clearInterval(window.colorTransitionInterval);
    }
    window.colorTransitionInterval = setInterval(updateColors, 1000);

    // Initial update
    updateColors();
}

function getTextColor(hue, saturation, lightness) {
    // Calculate the brightness of the color and set text color accordingly
    let r, g, b;
    [r, g, b] = hslToRgb(hue / 360, saturation / 100, lightness / 100);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? '#000000' : '#ffffff';
}

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
