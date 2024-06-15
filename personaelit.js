window.addEventListener('DOMContentLoaded', (event) => {
    setLastUpdated();
    startColorTransition();
    stylizeLinks();
    flagExternalLinks();
});

function flagExternalLinks() {
  // Select all anchor tags
  const links = document.querySelectorAll("a");

  // Iterate through each link
  links.forEach(link => {
    // Check if the link is external
    if (link.hostname !== window.location.hostname) {
      // Add a class to the external link
      link.classList.add("external");
      // Add an emoji after the link text
    //   const emoji = document.createElement("span");
    //   emoji.textContent = "\u1F30E"; // You can change the emoji to anything you prefer
    //   link.appendChild(emoji);
      
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
        document.documentElement.style.setProperty('--bg-color', bgColor);
        document.documentElement.style.setProperty('--text-color', textColor);
    }, 100); // Adjust the interval for smoothness
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
