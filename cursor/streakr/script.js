document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const dateDisplay = document.getElementById('date-display');
    const percentageDisplay = document.getElementById('percentage-display');
    const progressBar = document.getElementById('progress-bar');
    const streakDisplay = document.getElementById('streak-display');
    const historyGrid = document.getElementById('history-grid');

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
        li.textContent = task;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                li.classList.add('completed');
            } else {
                li.classList.remove('completed');
            }
            saveTasks();
            updatePercentage();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) { // Added confirmation prompt
                taskList.removeChild(li);
                saveTasks();
                updatePercentage();
            }
        });

        if (completed) {
            li.classList.add('completed');
        }

        li.prepend(checkbox);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            const task = {
                text: li.childNodes[1].textContent,
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
        const completedTasks = taskList.querySelectorAll('li.completed');
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
        const maxTasksCompleted = Math.max(...history.map(entry => entry.tasksCompleted), 1);
        history.forEach(entry => {
            const cell = document.createElement('div');
            cell.classList.add('history-cell');
            const level = Math.ceil((entry.tasksCompleted / maxTasksCompleted) * 4);
            cell.classList.add(`level-${level}`);
            historyGrid.appendChild(cell);
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
            const streak = localStorage.getItem('streak') || 0;
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const allCompleted = tasks.every(task => task.completed);

            if (allCompleted) {
                localStorage.setItem('streak', parseInt(streak) + 1);
            } else {
                localStorage.setItem('streak', 0);
            }

            saveHistory(lastReset, tasks.filter(task => task.completed).length);

            localStorage.setItem('tasks', JSON.stringify([]));
            localStorage.setItem('lastReset', today);
            taskList.innerHTML = '';
            updateStreak();
        }
    }

    resetTasksDaily();

    // Initialize SortableJS
    new Sortable(taskList, {
        animation: 150,
        onEnd: () => {
            saveTasks();
        }
    });
});
