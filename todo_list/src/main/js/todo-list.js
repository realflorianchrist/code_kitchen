import {getTodos, getTodoById, addTodo} from "../resources/database.mjs";

const inputField = document.getElementById("input-field");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById('todo-list');

for (const todo of getTodos()) {
    const todoItem = document.createElement('li');
    todoItem.textContent = todo.text;
    todoList.appendChild(todoItem);
}

// addButton.onclick = () => {
//     if (inputField.value !== null && inputField.value !== "") {
//         let newTodo = {
//             id: 2,
//             text: inputField.value
//         };
//
//         addTodo(newTodo);
//         location.reload();
//     }
// };

addButton.onclick = () => {
    console.log("pushed")
    let newTodo = {
        id: 2,
        text: "test2"
    };

    addTodo(newTodo);
    const sessionStorageSize = Object.keys(sessionStorage).length;
    console.log("Größe des sessionStorage:", sessionStorageSize);
    // location.reload();
};

