window.addEventListener('DOMContentLoaded', () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    if (params.clear === '1') {
        localStorage.clear();
    }

    let draggedTask = null;

    function addEventListenersToTask(task) {
        task.addEventListener('dragstart', handleDragStart);
        task.addEventListener('dragend', handleDragEnd);
        task.addEventListener('keyup', storeBody);
        task.addEventListener('touchstart', handleTouchStart);
        task.addEventListener('touchmove', handleTouchMove);
        task.addEventListener('touchend', handleTouchEnd);
    }

    function storeBody() {
        const matrixData = Array.from(document.querySelectorAll('.quad')).map(list => ({
            id: list.id,
            tasks: Array.from(list.querySelectorAll('.taskInput')).map(task => task.innerText)
        }));
        localStorage.setItem('eisenhower-data', JSON.stringify(matrixData));
    }

    function handlePlusClick(e) {
        const task = document.createElement('div');
        task.classList.add('task');
        task.draggable = true;
        addEventListenersToTask(task);
    
        const taskInput = document.createElement('div');
        taskInput.contentEditable = true;
        taskInput.classList.add('taskInput');
    
        const x = document.createElement('div');
        x.classList.add('x');
        x.innerText = "X";
        x.addEventListener('click', handleXClick);
    
        task.appendChild(taskInput);
        task.appendChild(x);

        const list = e.target.closest('.quad');
        list.appendChild(task);
    
        taskInput.focus();
        storeBody();
    }

    function handleXClick(e) {
        e.target.parentNode.remove();
        storeBody();
    }
    function handleDragStart(e) {
        if (e.target.nodeType === Node.TEXT_NODE) {
            return false;
        }
        draggedTask = e.target.closest('.task');
    }

    function handleDragEnd() {
        storeBody();
    }

    function handleDrop(e) {
        e.preventDefault();
        if (draggedTask && draggedTask !== e.target) {
            e.target.closest('.quad').appendChild(draggedTask);
            storeBody();
        }
    }

    function handleDragover(e) {
        e.preventDefault();
    }

    function handleTouchStart(e) {
        if (e.target.nodeType === Node.TEXT_NODE) {
            return false;
        }
        draggedTask = e.target.closest('.task');
    }

    function handleTouchMove(e) {
        e.preventDefault();
        const touchLocation = e.targetTouches[0];
        const element = document.elementFromPoint(touchLocation.clientX, touchLocation.clientY);
        if (element && element.classList.contains('quad')) {
            element.appendChild(draggedTask);
        }
    }

    function handleTouchEnd() {
        storeBody();
    }

    const exampleTasks = {
        "UrgentImportant": [
            "Prepare presentation for tomorrow's meeting",
            "Submit project report before the deadline",
            "Call the doctor for an urgent appointment"
        ],
        "NotUrgentImportant": [
            "Plan next month's content strategy",
            "Read a book on leadership development",
            "Schedule a networking lunch with a mentor"
        ],
        "UrgentNotImportant": [
            "Reply to an email about a minor issue",
            "Attend an unplanned meeting with no agenda",
            "Fix a formatting issue in a report"
        ],
        "NotUrgentNotImportant": [
            "Scroll through social media",
            "Watch a random YouTube video",
            "Organize old emails with no real need"
        ]
    };

    // Load stored Kanban tasks
    let storedData = JSON.parse(localStorage.getItem('eisenhower-data'));

    if (!storedData || storedData.length === 0) {
        // If no stored data, use example tasks
        storedData = Object.keys(exampleTasks).map(id => ({
            id,
            tasks: exampleTasks[id]
        }));
    }

    storedData.forEach(({ id, tasks }) => {
        const quad = document.getElementById(id);
        tasks.forEach(taskText => {
            const task = document.createElement('div');
            task.classList.add('task');
            task.draggable = true; 

            addEventListenersToTask(task);

            const taskInput = document.createElement('div');
            taskInput.contentEditable = true;
            taskInput.innerText = taskText;
            taskInput.classList.add('taskInput');

            const x = document.createElement('div');
            x.classList.add('x');
            x.innerText = "X";
            x.addEventListener('click', handleXClick);

            task.appendChild(taskInput);
            task.appendChild(x);
            quad.appendChild(task);
        });
    });

     // Attach event listeners
     document.querySelectorAll('.quad').forEach(list => {
        list.addEventListener('dragover', handleDragover);
        list.addEventListener('drop', handleDrop);
        list.addEventListener('touchmove', handleTouchMove);
        list.addEventListener('touchend', handleTouchEnd);
    });

    document.querySelectorAll('.plus').forEach(plus => {
        plus.addEventListener('click', handlePlusClick);
    });

});
