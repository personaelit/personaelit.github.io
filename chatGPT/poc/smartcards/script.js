document.addEventListener('DOMContentLoaded', function() {
    var addButton = document.getElementById('add-button');
    var smartcardForm = document.getElementById('smartcard-form');

    addButton.addEventListener('click', function() {
        smartcardForm.style.display = 'block';
    });

    smartcardForm.addEventListener('submit', function(event) {
        event.preventDefault();  // prevent the form from being submitted normally

        var smartcard = {
            goal: document.getElementById('goal').value,
            reason: document.getElementById('reason').value,
            deadline: document.getElementById('deadline').value,
            progress: document.getElementById('progress').value
        };

        console.log(smartcard);
        
        // Reset form
        smartcardForm.style.display = 'none';
        smartcardForm.reset();
    });
});
