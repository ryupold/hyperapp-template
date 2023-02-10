/**
 * @module These are some helper functions for common html elements as syntactic sugar to reduce amount of h(...) calls
 */

import { h, text } from './deps/hyperapp.min.js';
import { isString } from './type.js';

export { h, text } from './deps/hyperapp.min.js';

// layout
export const div = (attr, children) => h('div', attr, children);

// links
export const a = (href, content, attr = {}) => h('a', { ...attr, href }, isString(content) ? [text(content)] : content);
export const img = (src, attr = { style: {width: '100%'} }) => h('img', { ...attr, src }, []);

// text
export const span = (content, attr = {}) => h('span', attr, isString(content) ? [text(content)] : content);
const H = (n) => (content, attr = {}) => h(`h${n}`, attr, isString(content) ? [text(content)] : content)
export const h1 = H(1);
export const h2 = H(2);
export const h3 = H(3);
export const h4 = H(4);
export const h5 = H(5);
export const h6 = H(6);

export const p = (content, attr = {}) => h('p', attr, isString(content) ? [text(content)] : content);
export const strong = (content, attr = {}) => h('strong', attr, isString(content) ? [text(content)] : content);
export const em = (content, attr = {}) => h('em', attr, isString(content) ? [text(content)] : content);

// lists
export const ul = (attr, elements) => h('ul', attr, elements.map(e => h('li', {}, [isString(e) ? text(e) : e])));
export const ol = (attr, elements) => h('ol', attr, elements.map(e => h('li', {}, [isString(e) ? text(e) : e])));

// separators
export const hr = (attr = {}) => h('hr', attr, []);
export const br = (attr = {}) => h('br', attr, []);