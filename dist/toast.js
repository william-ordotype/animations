function n(){var e=document.createElement("style");e.innerHTML=`
      .ordotype-front-utils__toast {
        visibility: hidden !important;
        position: fixed;
        z-index: 10000;
        top: 20%;
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
    `,document.head.appendChild(e)}function d(){document.querySelectorAll("[data-show-toast]").forEach(t=>{const s=t.dataset.showToastTimeout??3e3,a=document.getElementById(t.dataset.showToast);a.className="ordotype-front-utils__toast",t.addEventListener("click",c=>{const i=t.dataset.showToast,o=document.getElementById(i);o&&(o.className="ordotype-front-utils__toast ordotype-front-utils__show",setTimeout(function(){o.className=o.className.replace("show","")},s))})}),n()}d();
