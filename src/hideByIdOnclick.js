'use strict';

const buttons =document.querySelectorAll('[data-hide-by-id-onclick]')
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const elementId = button.dataset.hideByIdOnclick;
        const element = document.getElementById(elementId);

        if(element){
            element.style.display = 'none';
        } else {
            console.error(`Element id "${elementId}" not found`);
        }
    })
})
