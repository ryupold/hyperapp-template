/**
 * This is a stupid and simple "markdown" parser implementation.
 * It doesn't nowhere near implement the full markdown spec, 
 * nor does it implement the subset I'm interested in correctly.
 * This serves as a quick and dirty way to easily embed markdown text like:
 * - headings (h1 - h6)
 * - bold text
 * - cursive text
 * - hyperlinks
 * - images (with additional styling)
 * - lists (1 level only)
 * into the web page.
 * 
 * For real markdown support you need to find a different library
 */

import { h, text } from './deps/hyperapp.min.js';
import { isString, isArray } from './type.js';

const patterns = {
    h6: {
        rx: /^\s*######(.+)$/gm, substitute: (m) => ({
            key: "h6",
            content: substitute(m[1])
        })
    },
    h5: {
        rx: /^\s*#####(.+)$/gm, substitute: (m) => ({
            key: "h5",
            content: substitute(m[1])
        })
    },
    h4: {
        rx: /^\s*####(.+)$/gm, substitute: (m) => ({
            key: "h4",
            content: substitute(m[1])
        })
    },
    h3: {
        rx: /^\s*###(.+)$/gm, substitute: (m) => ({
            key: "h3",
            content: substitute(m[1])
        })
    },
    h2: {
        rx: /^\s*##(.+)$/gm, substitute: (m) => ({
            key: "h2",
            content: substitute(m[1])
        })
    },
    h1: {
        rx: /^\s*#(.+)$/gm, substitute: (m) => ({
            key: "h1",
            content: substitute(m[1])
        })
    },
    bold: {
        rx: /\*\*(.+?)\*\*/gm, substitute: (m) => ({
            key: "bold",
            content: substitute(m[1])
        })
    },
    emphasized: {
        rx: /__(.+?)__/gm, substitute: (m) => ({
            key: "emphasized",
            content: substitute(m[1])
        })
    },
    img: {
        rx: /!\[(.+?)\]\((.+?)\)/gm, substitute: (m) => {
            const style = {};
            if (m[1].includes(":")) {
                const styles = m[1].split(";");
                for (const s of styles) {
                    const [l, r] = s.split(":");
                    if (!!l && !!r) {
                        style[l.trim()] = r.trim();
                    }
                }
            }
            return {
                key: "img",
                attr: {
                    src: m[2],
                    alt: !m[1].includes(":") ? m[1] : "",
                    style: m[1].includes(":") ? style : undefined
                },
                content: []
            };
        }
    },
    url: {
        rx: /\[(.+?)\]\((.+?)\)/gm, substitute: (m) => ({
            key: "url",
            attr: { href: m[2] },
            content: substitute(m[1])
        })
    },
    ul: {
        rx: /(?:^\s*- (.+?)$)+/gm, substitute: (m) => ({
            key: "ul",
            content: substitute(m[1])
        })
    },
    ol: {
        rx: /(?:^\s*\d{1,3}\. (.+?)$)+/gm, substitute: (m) => ({
            key: "ol",
            content: substitute(m[1])
        })
    },
};

/**
 * takes a markdown(ish) string and transforms it to a list of hyperapp components
 * @example 
 * **fat**  -> <strong>fat</strong>
 * *emphasized*    -> <em>emphasized</em>
 * __underlined__    -> <u>emphasized</u>
 * [description](link) -> <a href="link">description</a>
 * 
 * @param {string} markdownString 
 * @returns [hyper components]
 */
export function markdownToHyper(markdownString) {
    const intermediate = substitute(markdownString);
    return toHyper(intermediate);
}

/** 
 * get earliest match
 * - sets key of the matched pattern
 */
function detect(markdownString) {
    let match = { index: -1, key: '', result: '' };
    for (const k of Object.keys(patterns)) {
        const tmp = patterns[k].rx.exec(markdownString);
        if (tmp && (tmp.index < match.index || match.index < 0)) {
            match = tmp;
            match.key = k;
        }
    }

    if (match.index < 0)
        return null;
    else
        return match;
}

export function substitute(markdownString) {
    const result = [];
    if (isString(markdownString)) {
        const match = detect(markdownString);
        if (match) {
            //prefix
            const preMatch = markdownString.substring(0, match.index);
            for (const pre of substitute(preMatch)) {
                result.push(pre);
            }

            //inner
            const sub = patterns[match.key].substitute(match);
            result.push(sub);

            //suffix
            if (markdownString.length > match.index + match[0].length) {
                const postMatch = markdownString.substring(match.index + match[0].length);
                for (const post of substitute(postMatch)) {
                    result.push(post);
                }
            }
        }
        else {
            result.push({ key: "text", content: [markdownString] });
        }
    } else if (isArray(markdownString)) {
        const wrapped = markdownString.map(x => isString(x) ? substitute(x) : substitute(x.content));
        for (const w of wrapped) {
            result.push(w);
        }
    }

    return result;
}

function toHyper(intermediate) {
    const components = [];

    let p = [];
    let i = 0;
    while (i < intermediate.length) {
        const x = intermediate[i];

        //special case for paragraphs
        if (x.key === 'text' || x.key === 'bold' || x.key == 'emphasized') {
            const lines = (x.key === 'text' ? x.content[0] : x.content[0].content[0]).split('\n');
            const hasNewline = lines.length > 0 && lines[0].trim().length === 0 && lines[lines.length - 1].trim().length === 0;

            if (hasNewline && p.length > 0) {
                components.push(h('p', {}, p));
                p = [];
            }

            switch (x.key) {
                case 'text':
                    for (const l of lines) {
                        if (l.trim().length === 0 && p.length > 0) {
                            components.push(h('p', {}, p));
                            p = [];
                        }
                        else p.push(text(l));
                    }

                    break;
                case 'bold':
                    p.push(h('strong', {}, toHyper(x.content)));
                    break;
                case 'emphasized':
                    p.push(h('em', {}, toHyper(x.content)));
                    break;

                default:
                    break;
            }

            if (hasNewline && p.length > 0) {
                components.push(h('p', {}, p));
                p = [];
            }
        }
        else if (x.key.match(/^h\d/) && p.length > 0) {
            components.push(h('p', {}, p));
            p = [];
        }

        switch (x.key) {
            case 'text': //handled before the `switch`
                // components.push(text(x.content[0]));
                break;
            case 'h1':
                components.push(h('h1', {}, toHyper(x.content)));
                break;
            case 'h2':
                components.push(h('h2', {}, toHyper(x.content)));
                break;
            case 'h3':
                components.push(h('h3', {}, toHyper(x.content)));
                break;
            case 'h4':
                components.push(h('h4', {}, toHyper(x.content)));
                break;
            case 'h5':
                components.push(h('h5', {}, toHyper(x.content)));
                break;
            case 'h6':
                components.push(h('h6', {}, toHyper(x.content)));
                break;
            case 'bold': //handled before the `switch`
                // components.push(h('strong', {}, toHyper(x.content)));
                break;
            case 'emphasized': //handled before the `switch`
                // components.push(h('em', {}, toHyper(x.content)));
                break;
            case 'url':
                if(p.length > 0) p.push(h('a', { ...x.attr }, toHyper(x.content)));
                else components.push(h('a', { ...x.attr }, toHyper(x.content)));
                break;
            case 'img':
                if(p.length > 0) p.push(h('img', { ...x.attr }, toHyper(x.content)));
                else components.push(h('img', { ...x.attr }, toHyper(x.content)));
                break;
            case 'ul':
                const listUl = [h('li', {}, toHyper(x.content))];
                i++;
                let nextUl = intermediate[i];
                while (!!nextUl && nextUl.key === 'text' && nextUl.content[0] === "") {
                    i++;
                    nextUl = intermediate[i];
                }
                while (!!nextUl && nextUl.key === 'ul') {
                    listUl.push(h('li', {}, toHyper(nextUl.content)));
                    i++;
                    nextUl = intermediate[i];
                    while (!!nextUl && nextUl.key === 'text' && nextUl.content[0] === "") {
                        i++;
                        nextUl = intermediate[i];
                    }
                }

                if(p.length > 0) p.push(h('ul', {}, listUl)); 
                else components.push(h('ul', {}, listUl));

                if (!!nextUl) {
                    continue;
                }

                break;

            case 'ol':
                const listOl = [h('li', {}, toHyper(x.content))];
                i++;
                let nextOl = intermediate[i];
                while (!!nextOl && nextOl.key === 'text' && nextOl.content[0] === "") {
                    i++;
                    nextOl = intermediate[i];
                }
                while (!!nextOl && nextOl.key === 'ol') {
                    listOl.push(h('li', {}, toHyper(nextOl.content)));
                    i++;
                    nextOl = intermediate[i];
                    while (!!nextOl && nextOl.key === 'text' && nextOl.content[0] === "") {
                        i++;
                        nextOl = intermediate[i];
                    }
                }

                if(p.length > 0) p.push(h('ol', {}, listOl)); 
                else components.push(h('ol', {}, listOl));

                if (!!nextOl) {
                    continue;
                }

                break;

            default:
                console.warn(`cannot transform: ${JSON.stringify(x)} to hyperapp component`);
                break;
        }

        i++;
    }

    if (p.length === 1) {
        components.push(p[0]);
        p = [];
    }
    else if (p.length > 1) {
        components.push(h('p', {}, p));
        p = [];
    }

    return components;
}
