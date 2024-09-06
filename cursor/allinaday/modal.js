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

    modalHeader.textContent = `Date: ${dateString}, Day: ${currentDayOfYear}`;

    // Add notes section
    notesTextarea.placeholder = 'Enter your notes for the day...';
    notesTextarea.value = loadNotes(currentDayOfYear);
    notesTextarea.addEventListener('input', () => saveNotes(currentDayOfYear, notesTextarea.value));
    modalContent.appendChild(notesTextarea);

    // Add mood selector
    moodSelector.innerHTML = `
        <label><input type="radio" name="mood" value="1"> 😢</label>
        <label><input type="radio" name="mood" value="2"> 😐</label>
        <label><input type="radio" name="mood" value="3"> 😄</label>
    `;
    const savedMood = loadMood(currentDayOfYear);
    if (savedMood) {
        moodSelector.querySelector(`input[value="${savedMood}"]`).checked = true;
    }
    moodSelector.addEventListener('change', (e) => saveMood(currentDayOfYear, e.target.value));
    modalContent.appendChild(moodSelector);
}

function saveNotes(day, notes) {
    localStorage.setItem(`aiad_notes_${day}`, notes);
}

function loadNotes(day) {
    return localStorage.getItem(`aiad_notes_${day}`) || '';
}

function saveMood(day, mood) {
    localStorage.setItem(`aiad_mood_${day}`, mood);
}

function loadMood(day) {
    return localStorage.getItem(`aiad_mood_${day}`);
}

closeModal.addEventListener('click', hideModal);

window.addEventListener('click', function(event) {
    if (event.target == modal) {
        hideModal();
    }
});

export { showModal, hideModal, updateModalContent };
