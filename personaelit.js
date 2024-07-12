window.addEventListener('DOMContentLoaded', (event) => {
    setLastUpdated();
    startColorTransition();
    stylizeLinks();
    flagExternalLinks();
    activateSlidableCards();
    getRippled();
});

function getRippled() {

    console.log("Ripple, on still water.")
    const rippleContainer = document.querySelector('body');

    document.addEventListener('click', (event) => {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';

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
    const cards = document.querySelectorAll(".card");

    console.log("keep your eye on the card.");

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

            // Optional: Add an attribute or other annotation
            link.setAttribute("rel", "noopener noreferrer");
            link.setAttribute("target", "_blank");
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
        anchor.style.transform = `rotate(${randomAngle}deg)`;
        anchor.classList.add('rotated');
    });
}

function setLastUpdated() {
    let lastUpdated = document.getElementsByClassName("last-updated")[0];
    if (lastUpdated != null) {
        lastUpdated.innerHTML = "Last updated: " + document.lastModified;
        lastUpdated.setAttribute('datetime', document.lastModified);
    }
    console.log("updated updated.")
}

function startColorTransition() {
    console.log("transition init.")
    let hue = Math.floor(Math.random() * 360); // Initialize with a random hue value between 0 and 359

    setInterval(() => {
        hue = (hue + 1) % 360; // Cycle through 0-359 for the hue value
        const bgColor = `hsl(${hue}, 100%, 50%)`;
        const textColor = getTextColor(hue);
        document.body.style.setProperty('--bg-color', bgColor);
        document.body.style.setProperty('--text-color', textColor);
    }, 300); // Adjust the interval for smoothness
}

function getTextColor(hue) {
    // Calculate the brightness of the color and set text color accordingly
    let r, g, b;
    [r, g, b] = hslToRgb(hue / 360, 1, 0.5);
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
