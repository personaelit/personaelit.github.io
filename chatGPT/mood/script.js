let color = { r: 100, g: 150, b: 200 }; // initial color
let increment = { r: 1, g: 1, b: 1 }; // how much each color part changes

function updateColor() {
    // Update the color
    for (let key in color) {
        if (color[key] >= 255 || color[key] <= 0) {
            increment[key] *= -1; // reverse the increment if it reaches the bounds
        }
        color[key] += increment[key];
    }

    // Apply the color
    document.body.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
}

// Change color every 100 milliseconds
setInterval(updateColor, 100);
