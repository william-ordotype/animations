'use strict';

function showElementOnClick() {
    const buttons = document.querySelectorAll('[x-ordo-utils="showElementOnClick"]')
    buttons.forEach(button => {
        button.addEventListener('click', (_e) => {
            const elementId = button.getAttribute('data-element-to-show');
            if(!elementId) {
                console.error(`Missing data-element-to-show id attribute`);
                return
            }
            const element = $(elementId);

            if (element) {
               element.fadeIn()
            } else {
                console.error(`Element ID "${elementId}" not found on the page`);
            }
        })
    })
}

showElementOnClick()