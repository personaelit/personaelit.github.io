window.addEventListener('DOMContentLoaded', (event) => {
    
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let value = params.clear;
    if (value === '1'){
        localStorage.clear();
    }

    if (localStorage.getItem('kanban-body') != null)
    {
        document.body.innerHTML = localStorage.getItem('kanban-body');
    }
    
    let draggedTask = null;

    const lists = document.querySelectorAll('.list');
    lists.forEach(function (quad) {
        quad.addEventListener('dragover', handleDragover);
        quad.addEventListener('drop', handleDrop);
        quad.addEventListener('touchmove', handleTouchMove);
        quad.addEventListener('touchend', handleTouchEnd);
    });
    
    const plusses = document.querySelectorAll('.plus');
    plusses.forEach(function (plus) {
        plus.addEventListener('click', handlePlusClick);
    });

    // Reapply event listeners to tasks that were retrieved from localStorage.
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(function (task) {
        task.addEventListener('dragover', handleDragover);
        task.addEventListener('dragstart', handleDragStart);
        task.addEventListener('dragend', handleDragEnd);
        task.addEventListener('keyup', handleKeyup);
        task.addEventListener('touchstart', handleTouchStart);
        task.addEventListener('touchmove', handleTouchMove);
        task.addEventListener('touchend', handleTouchEnd);
    });

    // Reapply event listeners to x that were retrieved from localStorage.
    const exes = document.querySelectorAll('.x');
    exes.forEach(function (x) {
        x.addEventListener('click', handleXClick);
    });

    function handlePlusClick(e) {
        const task = document.createElement('div');
        task.setAttribute('class', 'task');
        task.addEventListener('dragover', handleDragover);
        task.addEventListener('dragstart', handleDragStart);
        task.addEventListener('dragend', handleDragEnd);
        task.addEventListener('touchstart', handleTouchStart);
        task.addEventListener('touchmove', handleTouchMove);
        task.addEventListener('touchend', handleTouchEnd);
        task.draggable = true;        

        const taskInput = document.createElement('div');
        taskInput.contentEditable = true;
        taskInput.addEventListener('keyup', handleKeyup);
        taskInput.setAttribute('class', 'taskInput');
        
        const x = document.createElement('div');
        x.contentEditable = false;
        x.setAttribute('class', 'x');
        x.addEventListener('click', handleXClick);
        x.innerText = "X";
        task.appendChild(taskInput);
        task.appendChild(x);
        e.target.parentNode.appendChild(task);
        taskInput.focus();
        
        storeBody();
    }

    function handleXClick(e) {
        e.target.parentNode.remove();
        storeBody();
    }

    function handleKeyup(e) {
        storeBody();
    }
    
    function handleDragStart(e) {
        if (e.target.nodeType === Node.TEXT_NODE) {
            return false;
        }
        draggedTask = e.target;
    }
      
    function handleDragEnd(e) {
        storeBody();
    }
    
    function handleDrop(e) {
        e.preventDefault();
        if (e.target === draggedTask) return false;
        draggedTask.parentNode.removeChild(draggedTask);
        this.appendChild(draggedTask);
        storeBody();
    }

    function handleDragover(e) {
        e.preventDefault();
    }

    function handleTouchStart(e) {
        if (e.target.nodeType === Node.TEXT_NODE) {
            return false;
        }
        draggedTask = e.target;
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        const touchLocation = e.targetTouches[0];
        const element = document.elementFromPoint(touchLocation.clientX, touchLocation.clientY);
        if (element && element.classList.contains('list')) {
            element.appendChild(draggedTask);
        }
    }
    
    function handleTouchEnd(e) {
        storeBody();
    }

    function storeBody() {
        localStorage.setItem('kanban-body', document.body.innerHTML);
    }
});
