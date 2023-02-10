import { Socials } from './components/socials.js';
import { TodoList } from './components/todo-list.js';
import { div, h1 } from './hyper-common.js';

const view = (state) => div({},
    [
        h1('Todos'),
        Socials(state),
        TodoList(state),
    ]);

export default view;