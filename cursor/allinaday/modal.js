const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close');
const modalHeader = document.getElementById('modalHeader');

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

}



closeModal.addEventListener('click', hideModal);

window.addEventListener('click', function(event) {
    if (event.target == modal) {
        hideModal();
    }
});


export { showModal, hideModal, updateModalContent };
