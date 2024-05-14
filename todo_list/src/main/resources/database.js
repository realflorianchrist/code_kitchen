const todoStorageKey = 'todos';

const savedTodos = localStorage.getItem(todoStorageKey);
const initialTodos = savedTodos
    ? JSON.parse(savedTodos)
    : [{ id: 1, text: 'fix this code' }];

const database = {
    todos: initialTodos
};

export function getTodos() {
    return database.todos;
}

export function getTodoById(id) {
    return database.todos.find(todo => todo.id === id) || null;
}

export function addTodo(text) {
    let lastElement = database.todos.slice(-1);

    const newTodo = { id: lastElement.id + 1, text: text };

    database.todos.push(newTodo);

    localStorage.setItem(todoStorageKey, JSON.stringify(database.todos));

    database.todos = JSON.parse(localStorage.getItem(todoStorageKey));

    return newTodo;
}