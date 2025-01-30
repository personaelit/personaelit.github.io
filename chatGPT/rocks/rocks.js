// rocks.js

// Define 10 shades of gray
const shadesOfGray = [
    'rgb(50, 50, 50)',  // Dark gray
    'rgb(80, 80, 80)',  // Slightly lighter gray
    'rgb(110, 110, 110)',
    'rgb(140, 140, 140)',
    'rgb(170, 170, 170)',
    'rgb(200, 200, 200)', // Neutral gray
    'rgb(220, 220, 220)',
    'rgb(240, 240, 240)', // Light gray
    'rgb(250, 250, 250)', // Very light gray
    'rgb(30, 30, 30)',    // Almost black
  ];
  
  // Generate a rock sprite
  function generateRock(size, shadeIndex) {
    // Create a canvas for the rock sprite
    const rockCanvas = document.createElement('canvas');
    const ctx = rockCanvas.getContext('2d');
  
    // Set canvas size
    rockCanvas.width = size;
    rockCanvas.height = size;
  
    // Fill the canvas with the selected shade
    ctx.fillStyle = shadesOfGray[shadeIndex];
    ctx.fillRect(0, 0, size, size);
  
    // Add jagged edges for a rocky appearance
    const numPoints = Math.floor(size / 4);
    ctx.fillStyle = 'black';
    for (let i = 0; i < numPoints; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const jaggedSize = Math.random() * (size / 6);
      ctx.clearRect(x, y, jaggedSize, jaggedSize);
    }
  
    return rockCanvas;
  }
  
  // Create a rock with a randomized shade
  function createRock() {
    const size = 20; // Fixed size for alignment to the grid
    const shadeIndex = Math.floor(Math.random() * shadesOfGray.length); // Random shade index
    const sprite = generateRock(size, shadeIndex);
  
    return {
      x: 0, // Initial position (to be set later)
      y: 0, // Initial position (to be set later)
      size,
      shade: shadeIndex, // Use shade index for matching
      sprite,
      speed: Math.random() * 2 + 1, // Random falling speed
      stacked: false,
    };
  }
  
  // Export the createRock function
  export { createRock };
  