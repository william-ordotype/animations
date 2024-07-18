'use strict';

function showElementAfterDelay() {
    const elements = document.querySelectorAll('[x-ordo-utils="showElementAfterDelay"]');
    elements.forEach(element => {
        const delay = parseInt(element.getAttribute('data-delay-milliseconds'), 10);

        if (isNaN(delay)) {
            console.error(`Invalid or missing data-delay-milliseconds attribute`);
            return;
        }

        setTimeout(() => {
            $(element).fadeIn()
        }, delay);
    });
}

showElementAfterDelay();
