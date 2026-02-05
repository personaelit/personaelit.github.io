/**
 * Modal Module
 * Reusable modal dialog with proper cleanup
 */

/** @type {HTMLElement|null} */
let modalElement = null;

/** @type {HTMLElement|null} */
let modalContent = null;

/** @type {HTMLElement|null} */
let modalBackdrop = null;

/** @type {Function|null} */
let onCloseCallback = null;

/**
 * Initialize modal elements
 * @param {HTMLElement} modal - Modal container element
 * @param {HTMLElement} content - Modal content container
 * @param {HTMLElement} backdrop - Modal backdrop/overlay
 */
export function initModal(modal, content, backdrop) {
    modalElement = modal;
    modalContent = content;
    modalBackdrop = backdrop;

    // Close on backdrop click
    if (backdrop) {
        backdrop.addEventListener('click', hideModal);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isModalVisible()) {
            hideModal();
        }
    });

    // Close button
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', hideModal);
    }
}

/**
 * Show the modal with content
 * @param {HTMLElement|string} content - Content to display
 * @param {Function} [onClose] - Callback when modal closes
 */
export function showModal(content, onClose = null) {
    if (!modalElement || !modalContent) {
        console.error('Modal not initialized');
        return;
    }

    // Clear previous content
    clearModalContent();

    // Set new content
    if (typeof content === 'string') {
        modalContent.innerHTML = content;
    } else {
        modalContent.appendChild(content);
    }

    onCloseCallback = onClose;

    // Show modal
    modalElement.classList.add('visible');
    if (modalBackdrop) {
        modalBackdrop.classList.add('visible');
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus first focusable element
    const focusable = modalContent.querySelector('button, input, textarea, select');
    if (focusable) {
        focusable.focus();
    }
}

/**
 * Hide the modal
 */
export function hideModal() {
    if (!modalElement) return;

    modalElement.classList.remove('visible');
    if (modalBackdrop) {
        modalBackdrop.classList.remove('visible');
    }

    // Restore body scroll
    document.body.style.overflow = '';

    // Call close callback
    if (onCloseCallback) {
        onCloseCallback();
        onCloseCallback = null;
    }

    // Clear content after animation
    setTimeout(clearModalContent, 300);
}

/**
 * Clear modal content
 */
export function clearModalContent() {
    if (modalContent) {
        modalContent.innerHTML = '';
    }
}

/**
 * Check if modal is visible
 * @returns {boolean}
 */
export function isModalVisible() {
    return modalElement?.classList.contains('visible') ?? false;
}

/**
 * Set modal content without showing
 * @param {HTMLElement|string} content
 */
export function setModalContent(content) {
    if (!modalContent) return;

    clearModalContent();

    if (typeof content === 'string') {
        modalContent.innerHTML = content;
    } else {
        modalContent.appendChild(content);
    }
}
