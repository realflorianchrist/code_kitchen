const todoStorageKey = 'todos';

const savedTodos = localStorage.getItem(todoStorageKey);
const initialTodos = savedTodos
    ? JSON.parse(savedTodos)
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
        text: text
    };

    database.todos.push(newTodo);

    localStorage.setItem(todoStorageKey, JSON.stringify(database.todos));

    database.todos = JSON.parse(localStorage.getItem(todoStorageKey));

    return newTodo;
}

export function removeTodo(text) {
    const todo = database.todos.findIndex(item => item.text === text);

    if (todo) {
        database.todos.splice(todo, 1);

        localStorage.setItem(todoStorageKey, JSON.stringify(database.todos));
    }
}