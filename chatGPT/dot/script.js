function createControlPanel(circle) {
    const panel = document.createElement('div');
    panel.className = 'control-panel';

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'control-btn';
    deleteBtn.onclick = function () {
        deleteCircle(circle); // Here, 'circle' correctly references the parent circle of the delete button
    };

    panel.appendChild(deleteBtn);
    // If the circle itself is not directly container-like, you might need to append the panel to its parent or another structure
    if (circle.appendChild) {
        circle.appendChild(panel);
    } else {
        console.error("The circle does not support appendChild. Ensure it's a DOM element.");
    }
    return panel;
}

function saveCircles() {
    const circles = document.querySelectorAll('.circle');
    const circlesData = [];
    circles.forEach(circle => {
        circlesData.push({
            left: circle.style.left,
            top: circle.style.top,
            width: circle.style.width,
            height: circle.style.height,
            backgroundColor: circle.style.backgroundColor,
            color: circle.style.color, // Save the text color
            content: circle.innerHTML,
        });
    });
    localStorage.setItem('circles', JSON.stringify(circlesData));
}

function deleteCircle(circle) {
    circle.remove(); // Removes the circle from the DOM
    saveCircles(); // Updates localStorage after the circle is removed
}

function loadCircles() {
    const circlesData = JSON.parse(localStorage.getItem('circles'));
    if (circlesData) {
        circlesData.forEach(data => {
            const circle = document.createElement('div');
            circle.className = 'circle';
            circle.contentEditable = true;
            circle.style.left = data.left;
            circle.style.top = data.top;
            circle.style.width = data.width;
            circle.style.height = data.height;
            circle.style.backgroundColor = data.backgroundColor;
            circle.style.color = data.color; // Apply the saved text color
            circle.innerHTML = data.content;
            createControlPanel(circle);
            container.appendChild(circle);

            // Make sure to attach the input event listener for saving changes
            circle.addEventListener('input', saveCircles);
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadCircles();
    document.querySelectorAll('.circle').forEach(circle => {
        circle.addEventListener('input', saveCircles); // For text changes in existing circles
    });
});



let circle = null;
let isDrawing = false;
let isMoving = false;
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;

const container = document.getElementById('circleContainer');

// Function to generate a random RGB color
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return { r, g, b, colorString: `rgb(${r},${g},${b})` };
}

// Function to determine if color is light or dark
function isColorLight(r, g, b) {
    // Using the luminance formula to calculate perceived brightness
    return ((r * 0.299 + g * 0.587 + b * 0.114) > 186);
}

container.onmousedown = function (e) {
    if (e.target !== container) return;

    startX = e.clientX;
    startY = e.clientY;
    isDrawing = true;

    const { r, g, b, colorString } = getRandomColor();
    const textColor = isColorLight(r, g, b) ? 'black' : 'white';

    circle = document.createElement('div');
    circle.className = 'circle';
    circle.style.left = `${startX}px`;
    circle.style.top = `${startY}px`;
    circle.style.backgroundColor = colorString;
    circle.style.color = textColor;
    circle.contentEditable = true;
    circle.innerText = "Text"; // Example text
    container.appendChild(circle);

    document.onmousemove = function (e) {
        if (!isDrawing) return;
        let size = Math.max(Math.abs(e.clientX - startX), Math.abs(e.clientY - startY));
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.left = `${Math.min(e.clientX, startX)}px`;
        circle.style.top = `${Math.min(e.clientY, startY)}px`;
        createControlPanel(circle);
    };

    document.onmouseup = function () {
        if (isDrawing) {
            document.onmousemove = null;
            isDrawing = false;
            circle.addEventListener('input', saveCircles); // For text changes
            saveCircles();
        }
    };

};



function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1 - container.getBoundingClientRect().left, y1 - container.getBoundingClientRect().top); // Adjust for container position
    ctx.lineTo(x2 - container.getBoundingClientRect().left, y2 - container.getBoundingClientRect().top);
    ctx.strokeStyle = "#000"; // Line color
    ctx.lineWidth = 2; // Line width
    ctx.stroke();
}

document.addEventListener('mousedown', function (e) {
    if (e.target.className === 'circle') {
        isMoving = true;
        offsetX = e.clientX - e.target.offsetLeft;
        offsetY = e.clientY - e.target.offsetTop;
        circle = e.target;

        document.onmousemove = function (e) {
            if (!isMoving) return;
            circle.style.left = `${e.clientX - offsetX}px`;
            circle.style.top = `${e.clientY - offsetY}px`;
        };

        document.onmouseup = function () {
            isMoving = false;
            document.onmousemove = document.onmouseup = null;
        };
    }
}, false);


// Initialize canvas
const canvas = document.getElementById('circleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function updateLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    const circles = document.querySelectorAll('.circle');
    const points = []; // To store the center points of circles

    circles.forEach(circle => {
        const rect = circle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        points.push({ centerX, centerY });
    });

    // Example: Draw lines between each circle in sequence
    for (let i = 0; i < points.length - 1; i++) {
        drawLine(points[i].centerX, points[i].centerY, points[i + 1].centerX, points[i + 1].centerY);
    }

    // Optionally, draw lines based on your specific logic (e.g., connecting specific circles)
}

// Call updateLines whenever you need to redraw the connections
// For instance, after adding, moving, or deleting a circle:
updateLines();
