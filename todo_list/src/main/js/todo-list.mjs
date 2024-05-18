import {getTodos, getTodoById, addTodo, removeTodo, toggleDone} from "../resources/database.js";

const inputField = document.getElementById("input-field");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById('todo-list');

for (const todo of getTodos()) {
    const listItem = document.createElement('li');
    const todoItem = document.createElement("div");
    todoItem.textContent = todo.text;
    const label = document.createElement("label");
    label.classList.add("container");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    const span = document.createElement("span");
    span.classList.add("checkmark");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = 'X';
    deleteButton.classList.add("delete-button");

    listItem.appendChild(todoItem);
    label.appendChild(checkbox);
    label.appendChild(span);
    label.appendChild(deleteButton);
    listItem.appendChild(label);

    todoList.appendChild(listItem);

    checkbox.onclick = () => {
        toggleDone(todo);
    }
}

addButton.onclick = () => {
    addTodoFromInput();
};

inputField.onkeydown = (event) => {
    if (event.key === 'Enter') {
        addTodoFromInput();
    }
};

todoList.onclick = (event) => {
    if (event.target.classList.contains('delete-button')) {
        const listItem = event.target.closest('li');
        if (listItem) {
            removeTodo(listItem.textContent)
            listItem.remove();
        }
    }
};

const addTodoFromInput = () => {
    if (inputField.value !== null && inputField.value !== "") {
        addTodo(inputField.value);
        location.reload();
    }
}
