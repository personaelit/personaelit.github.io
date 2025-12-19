import { getMoodData, createMoodChart, displayMoodStats } from './services.mood.js';
import { addModalContent, showModal } from './ui.modal.js';

export function showReportModal() {
    //clearModalContent();
    //const modal = document.getElementById('modal');
    const modalContent = document.createElement('div');

    // Add report content
    const reportContent = document.createElement('div');
    reportContent.id = 'report-content';
    reportContent.innerHTML = `
        <h2>Mood Report</h2>
        <canvas id="moodChart"></canvas>
        <div id="moodStats"></div>
    `;

    modalContent.appendChild(reportContent);
    addModalContent(modalContent);
    showModal();
    // Show the modal
    //modal.style.display = 'block';

    // Generate the mood report
    generateMoodReport();




}

function generateMoodReport() {
    const moodData = getMoodData();
    createMoodChart(moodData);
    displayMoodStats(moodData);
}