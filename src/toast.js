/* global $ */

'use strict';


function showToast() {
    const buttons = document.querySelectorAll('[x-ordo-utils*=show-toast]')
    buttons.forEach((button, index) => {
        const timeout = button.dataset.showToastTimeout ?? 3000;
        $(`[x-ordo-utils*=toast-component-${index}]`).hide()

        button.addEventListener('click', (_e) => {
            _e.preventDefault();
            const element = document.querySelector(`[x-ordo-utils=toast-component-${index}]`);
            if (element) {
                $(element).css({ display: 'inline-block', opacity: 0, top: -100 })
                    .animate({ top: 0, opacity: 1 }, 200);
                setTimeout(function () {
                    $(element).fadeOut(200)
                }, timeout);
            }
        })
    })
}


showToast()