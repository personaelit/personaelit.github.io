const modal = document.getElementById('modal');
const modalContent = modal.querySelector('.modal-content');

function showModal() {
    modal.style.display = 'block';
}

function hideModal() {
    modal.style.display = 'none';
}

function clearModalContent() {
    const closeButton = modalContent.querySelector('.close');
    modalContent.innerHTML = '';
    if (closeButton) {
        modalContent.appendChild(closeButton);
    }
}

function addModalContent(content) {
    clearModalContent();
    modalContent.appendChild(content);
}

export { showModal, hideModal, addModalContent };
