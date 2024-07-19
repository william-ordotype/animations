'use strict';

function toggleElementsOnClick() {
    const buttons = document.querySelectorAll('[x-ordo-utils="toggleElementsOnClick"]');
    buttons.forEach(button => {
        button.addEventListener('click', (_e) => {
            _e.preventDefault();
            const elementToShowId = button.getAttribute('data-element-to-show');
            const elementToHideId = button.getAttribute('data-element-to-hide');

            if (elementToHideId) {
                const elementToHide = $(elementToHideId);
                if (elementToHide) {
                    elementToHide.fadeOut();
                } else {
                    console.error(`Element ID "${elementToHideId}" not found on the page`);
                }
            }

            if (elementToShowId) {
                const elementToShow = $(elementToShowId);
                if (elementToShow) {
                    elementToShow.fadeIn();
                } else {
                    console.error(`Element ID "${elementToShowId}" not found on the page`);
                }
            }

            if (!elementToShowId && !elementToHideId) {
                console.error(`Missing data-element-to-show or data-element-to-hide id attribute`);
            }
        });
    });
}

toggleElementsOnClick();
