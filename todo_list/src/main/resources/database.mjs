const database = {
    todos: [
        { id: 1, text: 'test' }
    ]
}

export function getTodos() {
    return database.todos;
}

export function getTodoById(id) {
    return database.todos.find(todo => todo.id === id) || null;
}

export function addTodo(todo) {
    database.todos.push(todo);
}