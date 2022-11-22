const filters = {}

function updateBlur(value) {
    //filter: blur(5px);
    filters.blur = "blur(" + value + "px)";
    ApplyValues();
}

function updateContrast(value) {
    //filter: contrast(200%);
    filters.conrast = "contrast(" + value + "%)";
    ApplyValues();
}

function updateBrightness(value){
    //filter: brightness(0.4);
    value = value /10;
    filters.brightness = "brightness(" + value + ")";
    ApplyValues();
}

function updateGrayscale(value){
    filters.grayscale = "grayscale(" + value + "%)";
    ApplyValues();
}

function updateHueRotate(value){
    filters.huerotate = "hue-rotate(" + value + "deg)";
    ApplyValues();
}

function updateInvert(value){
    filters.invert = "invert("+ value + "%)";
    ApplyValues();
}

function updateOpacity(value){
    filters.opacity = "opacity("+ value + "%)";
    ApplyValues();
}

function updateSaturate(value){
    filters.saturate = "saturate("+ value + "%)";
    ApplyValues();
}
// function updateSepia(60%);
// function updateDrop-shadow(16px 16px 20px blue);






function ApplyValues() {

    try {
        let values = '';
        Object.keys(filters).forEach(key => {
            values += filters[key] + " ";
          });
    
        document.getElementById("canvas").style.filter = values; 
        
    } catch (error) {
        alert(error);
    }
}