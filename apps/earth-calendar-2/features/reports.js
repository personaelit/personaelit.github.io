/**
 * Reports Feature
 * Mood statistics and charts
 */

import { getMoodHistory, calculateMoodStats, getMoodEmoji } from './mood.js';
import { CALENDAR } from '../constants.js';

/** @type {Chart|null} */
let chartInstance = null;

/**
 * Create mood report content
 * @returns {HTMLElement}
 */
export function createReportContent() {
    const container = document.createElement('div');
    container.className = 'report-content';

    container.innerHTML = `
        <h2>Mood Report</h2>
        <div class="chart-container">
            <canvas id="moodChart"></canvas>
        </div>
        <div id="moodStats" class="mood-stats"></div>
    `;

    return container;
}

/**
 * Initialize the mood chart
 * Must be called after the canvas is in the DOM
 */
export function initMoodChart() {
    const moodData = getMoodHistory(CALENDAR.HISTORY_DAYS);

    // Destroy existing chart to prevent memory leak
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    const canvas = document.getElementById('moodChart');
    if (!canvas) {
        console.error('Mood chart canvas not found');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: moodData.map(d => d.date),
            datasets: [{
                label: 'Mood',
                data: moodData.map(d => d.mood),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const mood = context.raw;
                            return `Mood: ${getMoodEmoji(mood)} (${mood}/5)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: (value) => getMoodEmoji(value)
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });

    // Display stats
    displayMoodStats(moodData);
}

/**
 * Display mood statistics
 * @param {Array<{date: string, mood: number}>} moodData
 */
function displayMoodStats(moodData) {
    const statsContainer = document.getElementById('moodStats');
    if (!statsContainer) return;

    if (moodData.length === 0) {
        statsContainer.innerHTML = '<p>No mood data recorded yet. Start tracking your mood!</p>';
        return;
    }

    const stats = calculateMoodStats(moodData);

    const distributionHTML = Object.entries(stats.distribution)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([mood, count]) => {
            const percent = ((count / stats.total) * 100).toFixed(0);
            return `<li>${getMoodEmoji(mood)}: ${count} day${count !== 1 ? 's' : ''} (${percent}%)</li>`;
        })
        .join('');

    statsContainer.innerHTML = `
        <h3>Statistics (Last ${CALENDAR.HISTORY_DAYS} days)</h3>
        <p><strong>Days tracked:</strong> ${stats.total}</p>
        <p><strong>Average mood:</strong> ${stats.average.toFixed(1)} ${getMoodEmoji(Math.round(stats.average))}</p>
        <p><strong>Distribution:</strong></p>
        <ul class="mood-distribution">${distributionHTML}</ul>
    `;
}

/**
 * Destroy the chart instance
 */
export function destroyMoodChart() {
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
}
