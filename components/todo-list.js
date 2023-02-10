import { h, text } from "../hyper-common.js";

const Check = (state, id) => {
    const todos = state.todos;
    const todo = todos.find(t => t.id === id);
    todo.completed = !todo.completed;
    return { ...state, todos: todos };
}

export const TodoList = (state) => h('ol', { class: 'todos' },
    state.todos.map(todo => h('li', { class: 'todo' },
        [
            h('input',
                {
                    type: 'checkbox', checked: todo.completed,
                    name: todo.id, value: todo.id,
                    onchange: [Check, todo.id]
                }, []),
            h('label', { for: todo.id },
                [
                    todo.completed
                        ? h('s', {}, [text(todo.title)])
                        : text(todo.title)
                ]
            )
        ]))
);