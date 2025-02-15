const filters = {
    blur: "blur(0px)",
    contrast: "contrast(100%)",
    brightness: "brightness(1)",
    grayscale: "grayscale(0%)",
    huerotate: "hue-rotate(0deg)",
    invert: "invert(0%)",
    opacity: "opacity(100%)",
    saturate: "saturate(100%)"
};

function updateFilter(type, value) {
    if (type === "brightness") {
        value = (value / 10).toFixed(1); // Convert to a valid range (0.0 - 2.0)
        filters[type] = `brightness(${value})`; // No unit needed
    } else {
        const unit = type === "huerotate" ? "deg" : type === "blur" ? "px" : "%";
        filters[type] = `${type === "huerotate" ? "hue-rotate" : type}(${value}${unit})`;
    }
    ApplyValues();
}


function resetFilters() {
    Object.assign(filters, {
        blur: "blur(0px)",
        contrast: "contrast(100%)",
        brightness: "brightness(1)",
        grayscale: "grayscale(0%)",
        huerotate: "hue-rotate(0deg)",
        invert: "invert(0%)",
        opacity: "opacity(100%)",
        saturate: "saturate(100%)"
    });

    ApplyValues();

    // Reset UI values
    const defaults = {
        blur: 0, contrast: 100, brightness: 1, grayscale: 0,
        huerotate: 0, invert: 0, opacity: 100, saturate: 100
    };
    
    Object.keys(defaults).forEach(id => {
        let el = document.getElementById(id);
        if (el) el.value = defaults[id];
    });
}

function ApplyValues() {
    const img = document.getElementById("img");
    if (img) {
        img.style.filter = Object.values(filters).join(" ");
    }
}

document.getElementById("upload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.querySelector("#canvas img");
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("save-btn").addEventListener("click", function() {
    const img = document.querySelector("#canvas img");
    const canvas = document.getElementById("hiddenCanvas");
    const ctx = canvas.getContext("2d");

    // Ensure the canvas matches the image size
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Apply CSS filters before drawing
    const computedStyle = window.getComputedStyle(img);
    ctx.filter = computedStyle.filter;

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert to a downloadable image
    const link = document.createElement("a");
    link.download = "edited-image.png"; // Change to .jpg if needed
    link.href = canvas.toDataURL("image/png"); // Change format if needed
    link.click();
});


