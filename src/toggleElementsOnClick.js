'use strict';

function toggleElementsOnClick() {
    const buttons = document.querySelectorAll('[x-ordo-utils="toggleElementsOnClick"]');
    buttons.forEach(button => {
        button.addEventListener('click', (_e) => {
            const elementToShowId = button.getAttribute('data-element-to-show');
            const elementToHideId = button.getAttribute('data-element-to-hide');

            // Function to hide an element with a fade-out effect
            function hideElement(element, callback) {
                if (element && element.is(':visible')) {
                    element.fadeOut(300, () => {
                        if (callback) callback();
                    });
                } else if (callback) {
                    callback();
                }
            }

            // Function to show an element with a fade-in effect
            function showElement(element) {
                if (element) {
                    element.fadeIn(300);
                }
            }

            // Handle hiding and showing with callback to avoid flicker
            if (elementToHideId) {
                const elementToHide = $(elementToHideId);
                hideElement(elementToHide, () => {
                    if (elementToShowId) {
                        const elementToShow = $(elementToShowId);
                        showElement(elementToShow);
                    }
                });
            } else if (elementToShowId) {
                const elementToShow = $(elementToShowId);
                showElement(elementToShow);
            } else {
                console.error(`Missing data-element-to-show or data-element-to-hide id attribute`);
            }
        });
    });
}

toggleElementsOnClick();
