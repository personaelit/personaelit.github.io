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
        const boardData = Array.from(document.querySelectorAll('.list')).map(list => ({
            id: list.id,
            tasks: Array.from(list.querySelectorAll('.taskInput')).map(task => task.innerText)
        }));
        localStorage.setItem('kanban-data', JSON.stringify(boardData));
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
    
        // Append task to the parent .list, not the .list-header
        const list = e.target.closest('.list'); // Find the closest list container
        list.appendChild(task); // Append task below the header
    
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
            e.target.closest('.list').appendChild(draggedTask);
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
        if (element && element.classList.contains('list')) {
            element.appendChild(draggedTask);
        }
    }

    function handleTouchEnd() {
        storeBody();
    }

    // Example tasks to populate the board if it's empty
    const exampleTasks = {
        "todo": ["Click '+' to add a new task", "Drag tasks to move them between lists", "Click 'X' to remove a task"],
        "doing": ["Modify a task by clicking on it", "Refresh the page and your changes persist."],
        "done": ["Enjoy your Kanban board! 🎉"]
    };

    // Load stored Kanban tasks
    let storedData = JSON.parse(localStorage.getItem('kanban-data'));

    if (!storedData || storedData.length === 0) {
        // If no stored data, use example tasks
        storedData = Object.keys(exampleTasks).map(id => ({
            id,
            tasks: exampleTasks[id]
        }));
    }

    storedData.forEach(({ id, tasks }) => {
        const list = document.getElementById(id);
        tasks.forEach(taskText => {
            const task = document.createElement('div');
            task.classList.add('task');
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
            list.appendChild(task);
        });
    });

    // Attach event listeners
    document.querySelectorAll('.list').forEach(list => {
        list.addEventListener('dragover', handleDragover);
        list.addEventListener('drop', handleDrop);
        list.addEventListener('touchmove', handleTouchMove);
        list.addEventListener('touchend', handleTouchEnd);
    });

    document.querySelectorAll('.plus').forEach(plus => {
        plus.addEventListener('click', handlePlusClick);
    });
});
