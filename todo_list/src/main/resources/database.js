const todoStorageKey = 'todos';

const initialTodos = getTodosFromLocalStorage()
    ? getTodosFromLocalStorage()
    : [];

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
    let lastElement = database.todos.length > 0
        ? database.todos[database.todos.length - 1]
        : { id: -1 };

    const newTodo = {
        id: lastElement.id + 1,
        text: text,
        done: false
    };

    database.todos.push(newTodo);

    saveTodosToLocalStorage();

    database.todos = getTodosFromLocalStorage();

    return newTodo;
}

export function removeTodo(text) {
    const todo = database.todos.findIndex(item => item.text === text);

    if (todo) {
        database.todos.splice(todo, 1);

        saveTodosToLocalStorage();
    }
}

export function toggleDone(todo) {
    todo.done = !todo.done;
    saveTodosToLocalStorage();
}

function saveTodosToLocalStorage() {
    localStorage.setItem(todoStorageKey, JSON.stringify(database.todos));
}

function getTodosFromLocalStorage() {
    return JSON.parse(localStorage.getItem(todoStorageKey))
}