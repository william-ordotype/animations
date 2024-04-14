'use strict';

function showElementOnClick() {
    const buttons = document.querySelectorAll('[data-show-element-onclick]')
    buttons.forEach(button => {
        button.addEventListener('click', (_e) => {
            const elementId = button.dataset.showElementOnclick;
            const element = document.getElementById(elementId);

            if (element) {
                element.style.display = element.dataset.previousDisplay || '';
            } else {
                console.error(`Element ID "${elementId}" not found`);
            }
        })
    })
}

showElementOnClick()