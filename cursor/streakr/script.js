document.addEventListener('DOMContentLoaded', () => {
    // Check for the 'clear' query parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('clear') === '1') {
        localStorage.clear();
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
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
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
        const streak = localStorage.getItem('streak') || 0;
        streakDisplay.textContent = `Current Streak: ${streak} days`;
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        const dates = history.map(entry => entry.date);
        const tasksCompleted = history.map(entry => entry.tasksCompleted);

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
                            text: 'Tasks Completed'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function saveHistory(date, tasksCompleted) {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        history.push({ date, tasksCompleted });
        localStorage.setItem('history', JSON.stringify(history));
    }

    // Reset tasks every day
    function resetTasksDaily() {
        const lastReset = localStorage.getItem('lastReset');
        const today = new Date().toISOString().split('T')[0];

        if (lastReset !== today) {
            const streak = parseInt(localStorage.getItem('streak')) || 0;
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const completedTasksCount = tasks.filter(task => task.completed).length;

            if (completedTasksCount > 0 && lastReset) {
                localStorage.setItem('streak', streak + 1);
            } else {
                localStorage.setItem('streak', 0);
            }

            saveHistory(lastReset, completedTasksCount);

            localStorage.setItem('tasks', JSON.stringify([]));
            localStorage.setItem('lastReset', today);
            taskList.innerHTML = '';
            updateStreak();
        }
    }

    resetTasksDaily();
    loadHistory(); // Ensure history is loaded after resetTasksDaily

    // Initialize SortableJS
    new Sortable(taskList, {
        animation: 150,
        onEnd: () => {
            saveTasks();
        }
    });

    function updateCountdown() {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0); // Set to midnight
        const timeRemaining = midnight - now;

        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        countdownDisplay.textContent = `Time Remaining: ${hours}h ${minutes}m ${seconds}s`;
    }

    setInterval(updateCountdown, 1000);

    updateCountdown(); // Initial call to display immediately
});
