'use strict';

function toggleCookiesManager() {
    const cookieManagerButton = document.querySelector('[x-ordo-utils="cookieManagerButton"]');
    const cookieManagerClose = document.querySelector('[x-ordo-utils="cookieManagerClose"]');

    // Open manager
    cookieManagerButton.addEventListener('click', (e) => {
        $(cookieManagerButton)
            .css({
                display: 'block',
                opacity: 1,
                bottom: '0'
            }).animate({
            opacity: 0,
            bottom: '-100%'
        }, 800);
    });

    // Close manager
    cookieManagerClose.addEventListener('click', (e) => {
        $(cookieManagerButton).css({
            display: 'block',
            opacity: 0,
            bottom: '-100%'
        }).animate({
            opacity: 1,
            bottom: '0'
        }, 400);
    })
}

toggleCookiesManager();