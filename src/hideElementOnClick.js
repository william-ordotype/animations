'use strict';

function hideElementOnClick() {
    const buttons = document.querySelectorAll('[x-od-utils=hide-element-onclick]')
    buttons.forEach(button => {
        button.addEventListener('click', (_e) => {
            const elementId = button.dataset.hideElementOnclick;
            const element = document.getElementById(elementId);

            if (!element) {
                console.error(`Element ID "${elementId}" not found`);
                return null
            }

            if (element.style.display) {
                element.dataset.previousDisplay = element.style.display
            }

            element.style.display = 'none';
        })
    })
}

hideElementOnClick()