console.log("Hello from colorspace.");

String.prototype.convertToRGB = function () {
    //https://javascript.plainenglish.io/convert-hex-to-rgb-with-javascript-4984d16219c3
    if (this.length != 6) {
        throw "Only six-digit hex colors are allowed.";
    }

    var aRgbHex = this.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];
    return aRgb;
}

function isHex(searchString) {
    var noHash = searchString.replace("#", "");
    if ((noHash.length !== 6 && noHash.length !== 3) || noHash.match(/[0-9A-Fa-f]/g).length < noHash.length) {
        return false;
    }
    return true;
}

function randomHex() {
    //https://www.paulirish.com/2009/random-hex-color-code-snippets/
    let hex = Math.floor(Math.random()*16777215).toString(16);
    if (hex.length === 5){
        hex = "0" + hex;
    }
    return '#'+ hex;
}

    window.addEventListener('DOMContentLoaded', (event) => {
        paint();
    })

    window.addEventListener("hashchange", (event) => {
        paint();
    })

    function paint() {
        let hex = window.location.hash;

        if (!isHex(hex) && window.location.hash !== "") {
            window.location = "404.html?" + hex.replace("#","");
        }
        console.log(hex);
        document.body.style.background = hex;
        hexCode.value = hex;
        rgbCode.value = hex.replace('#', '').convertToRGB();
    }

    function getRandom() {
        window.location = window.location.pathname + randomHex();
        
    }

