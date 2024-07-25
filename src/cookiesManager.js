'use strict';

function toggleCookiesManager() {
    const cookieManagerButton = $('[x-ordo-utils="cookieManagerButton"]');
    const cookieManagerClose = $('[x-ordo-utils="cookieManagerClose"]');
    const cookieManagerBannerClose = $('[x-ordo-utils="cookieManagerBannerClose"]')

    // Open manager
    cookieManagerButton.on('click', (e) => {
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
    cookieManagerClose.on('click', (e) => {
        $(cookieManagerButton).css({
            display: 'block',
            opacity: 0,
            bottom: '-100%'
        }).animate({
            opacity: 1,
            bottom: '0'
        }, 400);
    }, false)

    cookieManagerBannerClose.on('click', (e) => {
        $('[fs-cc="banner"]').css({
            display: 'block',
            opacity: 1,
            bottom: '0'
        }).animate({
            opacity: 0,
            bottom: '-100%'
        }, 800);

        cookieManagerButton.css({
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