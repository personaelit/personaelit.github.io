import { updateTaskGraph, updateStreak, saveHistory } from './historyManager.js'
const STORAGE_PREFIX = 'streak_';
const percentageDisplay = document.getElementById('percentage-display');
const progressBar = document.getElementById('progress-bar');
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');

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
            const completedTasks = document.querySelectorAll('#task-list li .task-text.completed').length;
            const totalTasks = document.querySelectorAll('#task-list li').length;
            const completionPercentage = (completedTasks / totalTasks) * 100;

            // Slower increase in confetti based on completed tasks
            const particleCount = Math.pow(1.5, completedTasks) * 10;

            if (completionPercentage < 100) {
                confetti({
                    particleCount: Math.min(particleCount, 300),
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } else if (completionPercentage === 100) {
                throwFireworks();
            }

            // Update task graph and streak immediately
            updateTaskGraph();
            updateStreak();
        } else {
            taskText.classList.remove('completed');
            // Also update when unchecking a task
            updateTaskGraph();
            updateStreak();
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

export function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}tasks`)) || [];
    if (tasks.length === 0) {
        // Add default tasks if no tasks are saved
        const defaultTasks = [
            "Brush Teeth",
            "Drink Water",
            "Take a Walk",
            "Avoid Fast Food",
            "Take Medicine",
            "Brush Teeth"
        ];
        defaultTasks.forEach(task => addTask(task, false));
        saveTasks(); // Save the default tasks to localStorage
    } else {
        tasks.forEach(task => addTask(task.text, task.completed));
    }
}

export function updatePercentage() {
    const tasks = taskList.querySelectorAll('li');
    const completedTasks = taskList.querySelectorAll('li .task-text.completed');
    const percentage = tasks.length ? (completedTasks.length / tasks.length) * 100 : 0;
    percentageDisplay.textContent = `Tasks Completed: ${percentage.toFixed(2)}%`;
    progressBar.style.width = `${percentage}%`;
}

function throwFireworks() {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#ff0000', '#00ff00', '#0000ff']
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#ff0000', '#00ff00', '#0000ff']
        }));
    }, 250);
}

export function resetTasksDaily(forceReset = false) {
    // let lastReset = localStorage.getItem(`${STORAGE_PREFIX}lastReset`);
    // const now = new Date();
    // const today = getTodayDate();

    // if (forceReset) {
    //     // Bump the last reset date by one day for testing
    //     const lastResetDate = new Date(lastReset);
    //     lastResetDate.setDate(lastResetDate.getDate() + 1);
    //     lastReset = lastResetDate.toISOString().split('T')[0];
    // }

    // if (lastReset !== today && (forceReset || (now.getHours() === 0 && now.getMinutes() === 0))) {
    //     const streak = parseInt(localStorage.getItem(`${STORAGE_PREFIX}streak`)) || 0;
    //     const tasks = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}tasks`)) || [];
    //     const completedTasksCount = tasks.filter(task => task.completed).length;
    //     const totalTasksCount = tasks.length;

    //     let newStreak = streak;
    //     if (completedTasksCount > 0 && lastReset) {
    //         newStreak = streak + 1;
    //         localStorage.setItem(`${STORAGE_PREFIX}streak`, newStreak);
    //     } else {
    //         localStorage.setItem(`${STORAGE_PREFIX}streak`, 0);
    //     }

    //     saveHistory(lastReset, completedTasksCount, totalTasksCount);

    //     // Re-add yesterday's tasks as incomplete
    //     localStorage.setItem(`${STORAGE_PREFIX}tasks`, JSON.stringify(tasks.map(task => ({ ...task, completed: false }))));
    //     localStorage.setItem(`${STORAGE_PREFIX}lastReset`, today);
    //     taskList.innerHTML = '';
    //     loadTasks(); // Reload tasks after resetting
    //     updateStreak();
    //     loadHistory(); // Reload history after updating
    // }
}


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

// Initialize SortableJS
new Sortable(taskList, {
    animation: 150,
    onEnd: () => {
        saveTasks();
    }
});