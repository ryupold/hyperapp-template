import { jsonFetch } from "./common.js"

const GotTodos = (state, todos) => ({
    ...state, todos: todos
})

export const GetTodos = (state) => [
    { ...state },
    [
        jsonFetch,
        {
            url: 'https://jsonplaceholder.typicode.com/todos',
            action: GotTodos
        }
    ]
]