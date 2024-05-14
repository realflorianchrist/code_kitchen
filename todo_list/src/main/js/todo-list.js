import {getTodos, getTodoById, addTodo} from "../resources/database.mjs";

const inputField = document.getElementById("input-field");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById('todo-list');

for (const todo of getTodos()) {
    const todoItem = document.createElement('li');
    todoItem.textContent = todo.text;
    todoList.appendChild(todoItem);
}