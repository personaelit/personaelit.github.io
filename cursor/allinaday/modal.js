const modal = document.getElementById('modal');
const modalContent = modal.querySelector('.modal-content');
const closeModal = document.querySelector('.close');
const modalHeader = document.getElementById('modalHeader');
const notesTextarea = document.createElement('textarea');
const moodSelector = document.createElement('div');

function showModal() {
    modal.style.display = 'block';
}

function hideModal() {
    modal.style.display = 'none';
}

function updateModalContent(currentDayOfYear) {
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, 0, currentDayOfYear);
    const options = { month: 'short', day: 'numeric' };
    const dateString = date.toLocaleDateString('en-US', options);
    const datestamp = date.toISOString().split('T')[0]; // Add this line

    modalHeader.textContent = `Date: ${dateString}, Day: ${currentDayOfYear}`;

    // Update these lines


    // Add mood selector
    moodSelector.className = 'mood-selector';
    moodSelector.innerHTML = `
        <input type="radio" name="mood" value="1" id="mood1"><label for="mood1">😢</label>
        <input type="radio" name="mood" value="2" id="mood2"><label for="mood2">😕</label>
        <input type="radio" name="mood" value="3" id="mood3"><label for="mood3">😐</label>
        <input type="radio" name="mood" value="4" id="mood4"><label for="mood4">🙂</label>
        <input type="radio" name="mood" value="5" id="mood5"><label for="mood5">😄</label>
    `;
    const savedMood = loadMood(datestamp);
    if (savedMood) {
        moodSelector.querySelector(`input[value="${savedMood}"]`).checked = true;
    }
    moodSelector.addEventListener('change', (e) => saveMood(datestamp, e.target.value));
    modalContent.appendChild(moodSelector);

    // Add notes section
    notesTextarea.placeholder = 'Enter your notes for the day...';
    notesTextarea.value = loadNotes(datestamp);
    notesTextarea.addEventListener('input', () => saveNotes(datestamp, notesTextarea.value));
    modalContent.appendChild(notesTextarea);

}

function saveNotes(datestamp, notes) {
    localStorage.setItem(`aiad_notes_${datestamp}`, notes);
}

function loadNotes(datestamp) {
    return localStorage.getItem(`aiad_notes_${datestamp}`) || '';
}

function saveMood(datestamp, mood) {
    localStorage.setItem(`aiad_mood_${datestamp}`, mood);
}

function loadMood(datestamp) {
    return localStorage.getItem(`aiad_mood_${datestamp}`);
}

closeModal.addEventListener('click', hideModal);

window.addEventListener('click', function(event) {
    if (event.target == modal) {
        hideModal();
    }
});

export { showModal, hideModal, updateModalContent };
