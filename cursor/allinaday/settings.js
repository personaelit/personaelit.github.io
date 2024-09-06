let userName = localStorage.getItem('aiad_userName') || '';
let userDOB = localStorage.getItem('aiad_userDOB') || '';

const settingsPanel = document.getElementById('settingsPanel');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const closeSettingsPanelBtn = document.getElementById('closeSettingsPanelBtn');

function saveSettings() {
    userName = document.getElementById('userName').value;
    userDOB = document.getElementById('userDOB').value;
    
    // Save to local storage
    localStorage.setItem('aiad_userName', userName);
    localStorage.setItem('aiad_userDOB', userDOB);

    calculateDaysAlive();
    closeSettingsPanel();
}

function loadSavedSettings() {
    userName = localStorage.getItem('aiad_userName') || '';
    userDOB = localStorage.getItem('aiad_userDOB') || '';
}



function toggleSettingsPanel() {
    settingsPanel.classList.toggle('open');
}

function openSettingsPanel() {
    document.getElementById('userName').value = userName;
    document.getElementById('userDOB').value = userDOB;
    settingsPanel.classList.add('open');
}

function closeSettingsPanel() {
    settingsPanel.classList.remove('open');
}

function initializeSettings() {
    loadSavedSettings();
    saveSettingsBtn.addEventListener('click', saveSettings);
    closeSettingsPanelBtn.addEventListener('click', closeSettingsPanel);
}

export { initializeSettings, toggleSettingsPanel, openSettingsPanel, closeSettingsPanel };
