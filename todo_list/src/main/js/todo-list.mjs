import {getTodos, getTodoById, addTodo} from "../resources/database.js";

const inputField = document.getElementById("input-field");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById('todo-list');

for (const todo of getTodos()) {
    const listItem = document.createElement('li');
    const todoItem = document.createElement("div");
    todoItem.textContent = todo.text;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    listItem.appendChild(todoItem);
    listItem.appendChild(checkbox);

    todoList.appendChild(listItem);
}

addButton.onclick = () => {
    addTodoFromInput();
};

inputField.onkeydown = (event) => {
    if (event.key === 'Enter') {
        addTodoFromInput();
    }
};

const addTodoFromInput = () => {
    if (inputField.value !== null && inputField.value !== "") {
        addTodo(inputField.value);
        location.reload();
    }
}
