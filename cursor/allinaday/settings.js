import { loadFromLocalStorage, saveToLocalStorage } from './services/storageService.js';

let userName = loadFromLocalStorage('aiad_userName') || '';
let userDOB = loadFromLocalStorage('aiad_userDOB') || '';

const settingsPanel = document.getElementById('settingsPanel');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

function saveSettings() {
    userName = document.getElementById('userName').value;
    userDOB = document.getElementById('userDOB').value;
    
    // Save to local storage
    saveToLocalStorage('aiad_userName', userName);
    saveToLocalStorage('aiad_userDOB', userDOB);

    // Reload the page to reload the UI.
    location.reload();
}

function loadSavedSettings() {
    userName = loadFromLocalStorage('aiad_userName') || '';
    userDOB = loadFromLocalStorage('aiad_userDOB') || '';
    
    // Update the input fields with the loaded values
    document.getElementById('userName').value = userName;
    document.getElementById('userDOB').value = userDOB;
}

function toggleSettingsPanel() {
    settingsPanel.classList.toggle('open');
}

function openSettingsPanel() {

    settingsPanel.classList.add('open');
}

function closeSettingsPanel() {
    settingsPanel.classList.remove('open');
}

function initializeSettings() {
    loadSavedSettings(); // Call this to load and set the values
    saveSettingsBtn.addEventListener('click', saveSettings);


    // Load other settings from localStorage
    const savedSettings = JSON.parse(loadFromLocalStorage('aiad_settings')) || {};
    
    // Apply saved settings
    Object.keys(savedSettings).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = savedSettings[key];
            } else {
                input.value = savedSettings[key];
            }
            // Trigger change event to apply the setting
            input.dispatchEvent(new Event('change'));
        }
    });
}

export { initializeSettings, toggleSettingsPanel, openSettingsPanel, closeSettingsPanel };
