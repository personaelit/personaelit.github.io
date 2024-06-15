const phrase = "The quick brown fox jumped over the lazy dog.";
let container = document.getElementById("text");
let i = 0;

function typeCharacter() {
  if (i < phrase.length) {
    container.innerHTML += phrase.charAt(i);
    i++;
    
    let randomTimeout = Math.floor(Math.random() * 90) + 10; // Random time between 10 and 100ms
    if (phrase.charAt(i-1) === ' ') {
      randomTimeout += 150; // Add extra delay for space characters
    }
    
    setTimeout(typeCharacter, randomTimeout);
  }
}

typeCharacter(); // Start typing
