document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_PREFIX = 'streakr_';

    // Check for the 'clear' query parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('clear') === '1') {
        // Clear only Streakr-related items
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(STORAGE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
        location.href = window.location.pathname; // Reload the page without query parameters
    }

    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const dateDisplay = document.getElementById('date-display');
    const percentageDisplay = document.getElementById('percentage-display');
    const progressBar = document.getElementById('progress-bar');
    const streakDisplay = document.getElementById('streak-display');
    const historyGrid = document.getElementById('history-grid');
    const countdownDisplay = document.getElementById('countdown-display');
    const historyChartCtx = document.getElementById('history-chart').getContext('2d');
    let historyChart;

    // Display today's date
    const today = new Date().toLocaleDateString();
    dateDisplay.textContent = `Today's Date: ${today}`;

    // Load tasks and history from localStorage
    loadTasks();
    loadHistory();
    updatePercentage();
    updateStreak();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
            saveTasks();
            updatePercentage();
        }
    });

    function addTask(task, completed = false) {
        const li = document.createElement('li');

        const taskText = document.createElement('span');
        taskText.textContent = task;
        taskText.classList.add('task-text');
        if (completed) {
            taskText.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                taskText.classList.add('completed');
            } else {
                taskText.classList.remove('completed');
            }
            saveTasks();
            updatePercentage();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                taskList.removeChild(li);
                saveTasks();
                updatePercentage();
            }
        });

        li.prepend(checkbox);
        li.appendChild(taskText);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            const task = {
                text: li.querySelector('.task-text').textContent,
                completed: li.querySelector('input[type="checkbox"]').checked
            };
            tasks.push(task);
        });
        localStorage.setItem(`${STORAGE_PREFIX}tasks`, JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}tasks`)) || [];
        tasks.forEach(task => addTask(task.text, task.completed));
    }

    function updatePercentage() {
        const tasks = taskList.querySelectorAll('li');
        const completedTasks = taskList.querySelectorAll('li .task-text.completed');
        const percentage = tasks.length ? (completedTasks.length / tasks.length) * 100 : 0;
        percentageDisplay.textContent = `Tasks Completed: ${percentage.toFixed(2)}%`;
        progressBar.style.width = `${percentage}%`;
    }

    function updateStreak() {
        const streak = localStorage.getItem(`${STORAGE_PREFIX}streak`) || 0;
        streakDisplay.textContent = `Current Streak: ${streak} days`;
    }

    function loadHistory() {
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

    function saveHistory(date, tasksCompleted, totalTasks) {
        const history = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}history`));
        history.push({ date, tasksCompleted, totalTasks });
        localStorage.setItem(`${STORAGE_PREFIX}history`, JSON.stringify(history));
    }

    function getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }

    // Reset tasks every day
    function resetTasksDaily(forceReset = false) {
        let lastReset = localStorage.getItem(`${STORAGE_PREFIX}lastReset`);
        const now = new Date();
        const today = getTodayDate();

        if (forceReset) {
            // Bump the last reset date by one day for testing
            const lastResetDate = new Date(lastReset);
            lastResetDate.setDate(lastResetDate.getDate() + 1);
            lastReset = lastResetDate.toISOString().split('T')[0];
        }

        if (lastReset !== today && (forceReset || (now.getHours() === 0 && now.getMinutes() === 0))) {
            const streak = parseInt(localStorage.getItem(`${STORAGE_PREFIX}streak`)) || 0;
            const tasks = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}tasks`)) || [];
            const completedTasksCount = tasks.filter(task => task.completed).length;
            const totalTasksCount = tasks.length;

            let newStreak = streak;
            if (completedTasksCount > 0 && lastReset) {
                newStreak = streak + 1;
                localStorage.setItem(`${STORAGE_PREFIX}streak`, newStreak);
            } else {
                localStorage.setItem(`${STORAGE_PREFIX}streak`, 0);
            }

            saveHistory(lastReset, completedTasksCount, totalTasksCount);

            // Re-add yesterday's tasks as incomplete
            localStorage.setItem(`${STORAGE_PREFIX}tasks`, JSON.stringify(tasks.map(task => ({ ...task, completed: false }))));
            localStorage.setItem(`${STORAGE_PREFIX}lastReset`, today);
            taskList.innerHTML = '';
            loadTasks(); // Reload tasks after resetting
            updateStreak();
            loadHistory(); // Reload history after updating

            // Throw confetti based on the percentage of tasks completed
            if (newStreak > streak) {
                const completionPercentage = totalTasksCount ? (completedTasksCount / totalTasksCount) * 100 : 0;
                if (completionPercentage === 100) {
                    // Spectacular confetti pouring effect for 100% completion
                    const duration = 2 * 1000;
                    const end = Date.now() + duration;

                    (function frame() {
                        confetti({
                            particleCount: 2,
                            angle: 60,
                            spread: 55,
                            origin: { x: 0 }
                        });
                        confetti({
                            particleCount: 2,
                            angle: 120,
                            spread: 55,
                            origin: { x: 1 }
                        });

                        if (Date.now() < end) {
                            requestAnimationFrame(frame);
                        }
                    }());
                } else {
                    const particleCount = Math.min(100, Math.max(10, Math.floor(Math.pow(completionPercentage / 10, 2)))); // Exponential scaling
                    confetti({
                        particleCount: particleCount,
                        spread: 360
                    });
                }
            }
        }
    }

    resetTasksDaily(false); // Pass true to force reset for testing
    loadHistory(); // Ensure history is loaded after resetTasksDaily

    // Check every minute if it's midnight
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            resetTasksDaily();
        }
    }, 60000); // Check every 60 seconds

    // Initialize SortableJS
    new Sortable(taskList, {
        animation: 150,
        onEnd: () => {
            saveTasks();
        }
    });

    function updateCountdown() {
        const now = new Date();
        const nextReset = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        nextReset.setHours(0, 0, 0, 0);

        const timeRemaining = nextReset - now;

        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        countdownDisplay.textContent = `Time Remaining: ${hours}h ${minutes}m ${seconds}s`;
    }

    setInterval(updateCountdown, 1000);

    updateCountdown(); // Initial call to display immediately


});
