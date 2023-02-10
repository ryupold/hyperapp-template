/**
 * This frontend uses hyperapp to keep everything simple
 * see: https://github.com/jorgebucaran/hyperapp/blob/main/docs/tutorial.md
 */

import { app } from './deps/hyperapp.min.js';
import appView from './app.js';
import { route } from './route.js';
import { GetTodos } from './effects/todos.js';

const init = {
    route: route(window.location),
    todos: [],
};

const node = document.getElementById('app');
try {
    app({ init: GetTodos(init), view: appView, node: node });
} catch (err) {
    console.error(err);
}
