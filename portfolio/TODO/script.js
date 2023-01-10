let form = document.querySelector("#add-todo");
let input = document.querySelector("#new-todo");
let todoList = document.querySelector("#todo-list");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveTodo();
    //addTodo(event.target[0].value);

});

let db;

window.onload = function () {
    // Open a database
    let request = indexedDB.open("todoDB", 1);

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        // Create an object store for todo items
        let objectStore = db.createObjectStore("todo", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("text", "text", { unique: false });
    };

    request.onsuccess = function (event) {
        db = event.target.result;

        // Open a transaction to the object store
        let transaction = db.transaction(["todo"], "readonly");
        let objectStore = transaction.objectStore("todo");

        // Get all the to-do items from the object store
        let request = objectStore.getAll();

        request.onsuccess = function () {
            let todos = request.result;
            for (let todo of todos) {
                addTodo(todo.text, todo.id);
            }
        };
    };

}


function saveTodo() {
    let text = input.value.trim();

    // Check if the input field is empty
    if (!text) {
        // Show an error message if the input field is empty
        alert("Please enter a valid to-do item.");
        return;
    }

    // Open a transaction to the object store
    let transaction = db.transaction(["todo"], "readwrite");
    let objectStore = transaction.objectStore("todo");

    let todo = { text: input.value };

    // Add the to-do item to the object store
    let request = objectStore.add(todo);

    request.onsuccess = function (event) {
        // Get the ID of the newly added to-do item
        let id = event.target.result;
        todo.id = id;

        // Add the delete button event listener here
        deleteButton.addEventListener("click", () => {
            todoList.removeChild(li);
            deleteTodo(id);
        });
    }

    request.onsuccess = function () {
        console.log("To-do item added!");
        location.reload();
    };

    request.onerror = function () {
        console.log("Error adding to-do item!");
    };
}

function deleteTodo(id) {
    let transaction = db.transaction(["todo"], "readwrite");
    let objectStore = transaction.objectStore("todo");

    id = parseInt(id);
    // Delete the to-do item from the object store
    let request = objectStore.delete(id);

    request.onsuccess = function () {
        console.log("To-do item deleted!");
    };

    request.onerror = function () {
        console.log("Error deleting to-do item!");
    };
}


function addTodo(text, id) {
    let li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" />
      <input type="text" value="${text}" disabled />
      <button data-id="${id}">Delete</button>
    `;
    todoList.appendChild(li);

    let input = li.querySelector("input[type='text']");
    let checkbox = li.querySelector("input[type='checkbox']");
    let deleteButton = li.querySelector("button");

    checkbox.addEventListener("click", e => {
        input.classList.toggle("completed");
    });

    input.addEventListener("input", e => {
        // updating the todo on the DB
        let transaction = db.transaction(["todo"], "readwrite");
        let objectStore = transaction.objectStore("todo");
        let request = objectStore.get(id);
        request.onsuccess = function () {
            let todo = request.result;
            todo.text = input.value;
            objectStore.put(todo);
        };
    });

    deleteButton.addEventListener("click", () => {
        
        let id = deleteButton.dataset.id;
        let deleteItem = confirm("Are you sure you want to delete this item?");
        if (deleteItem) {
            todoList.removeChild(li);
            deleteTodo(id);
        }
    });
}

