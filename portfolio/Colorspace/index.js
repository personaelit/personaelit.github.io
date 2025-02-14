console.log("Hello from colorspace.");

String.prototype.convertToRGB = function () {
    if (!/^([A-Fa-f0-9]{6})$/.test(this)) {
        throw "Only six-digit hex colors are allowed.";
    }
    let aRgbHex = this.match(/.{1,2}/g);
    return aRgbHex.map(hex => parseInt(hex, 16));
};

function isHex(searchString) {
    return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(searchString);
}

function randomHex() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

window.addEventListener('DOMContentLoaded', () => {
    getRandom();
    paint();
});

window.addEventListener("hashchange", () => {
    paint();
});

function paint() {
    let hex = window.location.hash || randomHex();
    if (!isHex(hex)) {
        hex = "#000000"; // Default to black if invalid
    }
    document.body.style.background = hex;
    hexCode.innerText = hex;
    
    let rgb = hex.replace('#', '').convertToRGB();
    rgbCode.innerText = `rgb(${rgb.join(", ")})`;
    
    document.body.style.color = (rgb.reduce((a, b) => a + b, 0) > 382) ? "black" : "white";
}

function getRandom() {
    window.location.hash = randomHex();
}
