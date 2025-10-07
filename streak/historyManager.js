import { getTodayDate } from "./util.js";
const STORAGE_PREFIX = 'streak_';
const streakDisplay = document.getElementById('streak-display');
const historyChartCtx = document.getElementById('history-chart').getContext('2d');
let historyChart;

export function loadHistory() {
    let history = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}history`));
    if (!history) {
        // Initialize history with today's date if not set
        history = [{ date: getTodayDate(), tasksCompleted: 0, totalTasks: 0 }];
        localStorage.setItem(`${STORAGE_PREFIX}history`, JSON.stringify(history));
    }

    const dates = history.map(entry => entry.date);
    const tasksCompleted = history.map(entry => entry.tasksCompleted);
    const totalTasks = history.map(entry => entry.totalTasks);

    if (historyChart) {
        historyChart.destroy();
    }

    historyChart = new Chart(historyChartCtx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Tasks Completed',
                data: tasksCompleted,
                borderColor: '#00bfa5',
                backgroundColor: 'rgba(0, 191, 165, 0.2)',
                fill: true,
            }, {
                label: 'Total Tasks',
                data: totalTasks,
                borderColor: '#ff5722',
                backgroundColor: 'rgba(255, 87, 34, 0.2)',
                fill: true,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Tasks'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

export function saveHistory(date, tasksCompleted, totalTasks) {
    const history = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}history`));
    history.push({ date, tasksCompleted, totalTasks });
    localStorage.setItem(`${STORAGE_PREFIX}history`, JSON.stringify(history));
}

export function updateTaskGraph() {
    const completedTasks = document.querySelectorAll('#task-list li .task-text.completed').length;
    const totalTasks = document.querySelectorAll('#task-list li').length;
    const today = getTodayDate();

    // Get the current history
    let history = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}history`)) || [];

    // Find today's entry in the history
    let todayEntry = history.find(entry => entry.date === today);

    if (todayEntry) {
        // Update today's entry
        todayEntry.tasksCompleted = completedTasks;
        todayEntry.totalTasks = totalTasks;
    } else {
        // Add a new entry for today
        history.push({ date: today, tasksCompleted: completedTasks, totalTasks: totalTasks });
    }

    // Save the updated history
    localStorage.setItem(`${STORAGE_PREFIX}history`, JSON.stringify(history));

    // Update the chart
    if (historyChart) {
        const dates = history.map(entry => entry.date);
        const tasksCompleted = history.map(entry => entry.tasksCompleted);
        const totalTasks = history.map(entry => entry.totalTasks);

        historyChart.data.labels = dates;
        historyChart.data.datasets[0].data = tasksCompleted;
        historyChart.data.datasets[1].data = totalTasks;
        historyChart.update();
    } else {
        // If the chart doesn't exist, create it
        loadHistory();
    }
}

export function updateStreak() {
    let streak = parseInt(localStorage.getItem(`${STORAGE_PREFIX}streak`)) || 0;
    const lastResetDate = localStorage.getItem(`${STORAGE_PREFIX}lastReset`);
    const today = getTodayDate();

    const completedTasks = document.querySelectorAll('#task-list li .task-text.completed').length;
    const totalTasks = document.querySelectorAll('#task-list li').length;

    // Check if there are any tasks and if any are completed
    if (totalTasks > 0 && completedTasks > 0) {
        // If it's a new day or there was no streak before, start/continue the streak
        if (lastResetDate !== today || streak === 0) {
            streak++;
            localStorage.setItem(`${STORAGE_PREFIX}lastReset`, today);
        }
    } else {
        // If no tasks are completed, reset the streak
        streak = 0;
    }

    // Update the streak in localStorage
    localStorage.setItem(`${STORAGE_PREFIX}streak`, streak);

    // Update the streak display
    //const streakDisplay = document.getElementById('streak-display');
    if (streakDisplay) {
        streakDisplay.textContent = `Current Streak: ${streak} day${streak !== 1 ? 's' : ''}`;
    }
}
