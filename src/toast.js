'use strict';

function injectStyles() {
    var style = document.createElement("style");
    style.innerHTML = `
      .ordotype-front-utils__toast {
        visibility: hidden !important;
        text-align: center;
        border-radius: 2px;
        padding: 16px;
        position: fixed;
        z-index: 10000;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
      }
      .ordotype-front-utils__show {
        visibility: visible !important;
        -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
        animation: fadein 0.5s, fadeout 0.5s 2.5s;
      }
      @keyframes fadein {
        from {top: 0; opacity: 0;}
        to {top: 20%; opacity: 1;}
      }
      @keyframes fadeout {
        from {top: 20%; opacity: 1;}
        to {top: 0; opacity: 0;}
      }
    `;
    document.head.appendChild(style);
}

function showToast() {
    const buttons = document.querySelectorAll('[data-show-toast]')
    buttons.forEach(button => {
        const toast = document.getElementById(button.dataset.showToast);
        toast.className = 'ordotype-front-utils__toast'
        button.addEventListener('click', (_e) => {
            const elementId = button.dataset.showToast;
            const element = document.getElementById(elementId);
            if (element) {
                element.className = "ordotype-front-utils__toast ordotype-front-utils__show"
                setTimeout(function () {
                    element.className = element.className.replace("show", "");
                }, 3000);
            }
        })
    })

    injectStyles()
}


showToast()