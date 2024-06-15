window.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('video-grid');
    
    // Create 100 video elements
    for (let i = 0; i < 100; i++) {
      const video = document.createElement('video');
      video.setAttribute('autoplay', '');
      video.setAttribute('muted', ''); // Mute to avoid feedback loop
      video.setAttribute('playsinline', '');
      grid.appendChild(video);
    }
  
    // Request access to the camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        // Assign the video stream to all video elements
        grid.querySelectorAll('video').forEach(video => {
          video.srcObject = stream;
        });
      }).catch(error => {
        console.error("Error accessing the camera: ", error);
      });
    }
  });
  