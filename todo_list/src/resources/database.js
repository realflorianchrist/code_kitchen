const database = {
    todos: [
        { id: 1, todo: 'test' }
    ]
}

export function getTodoById(id) {
    return database.todos.find(todo => todo.id === id) || null;
}

export function addTodo(todo) {
    database.todos.push(todo);
}