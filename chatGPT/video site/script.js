
const video = document.getElementById('videoElement');

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Something went wrong when accessing the camera!", error);
        });
} else {
    alert("Sorry, your browser does not support user media.");
}
