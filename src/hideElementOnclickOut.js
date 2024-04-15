document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("[data-hide-element-onclick-out]");

    buttons.forEach((button) => {
        const element = document.getElementById(
            button.dataset.hideElementOnclickOut
        );
        document.addEventListener("click", function (event) {
            const isClickOut =
                !button.contains(event.target) && !element.contains(event.target);
            if (isClickOut) {
                element.style.display = "none";
            }
        });
    });
});
