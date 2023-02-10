import { a, h, img } from "../hyper-common.js";

export const Socials = (state) => h('div', { class: 'socials' },
    [
        a('https://github.com/ryupold', [
            img('/assets/img/github_icon.png', { title: 'github', class: 'social-link' })
        ]),
        a('https://twitter.com/ryupold', [
            img('/assets/img/twitter_icon.png', { title: 'twitter', class: 'social-link' })
        ])
    ]
);