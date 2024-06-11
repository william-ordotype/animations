'use strict';

function hideElementOnClick() {
    const buttons = document.querySelectorAll('[x-ordo-utils="hideElementOnClick"]')
    buttons.forEach(button => {
        button.addEventListener('click', (_e) => {
            const elementId = button.getAttribute('data-element-to-hide');
            if(!elementId) {
                console.error(`Missing data-element-to-hide id attribute`);
                return
            }
            const element = $(elementId);

            if (element) {
                element.fadeOut()
            } else {
                console.error(`Element ID "${elementId}" not found on the page`);
            }
        })
    })
}

hideElementOnClick();