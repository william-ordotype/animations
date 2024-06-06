function injectStyles() {
    var style = document.createElement("style");
    style.innerHTML = `
        [x-ordo-utils=slider] {
                    border-radius: 34px;

        }
        
        [x-ordo-utils=slider]:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          -webkit-transition: .4s;
          transition: .4s;
                    border-radius: 50%;

        }
        
        input:checked + [x-ordo-utils=slider] {
          background-color: #2196F3;
        }
        
        input:focus + [x-ordo-utils=slider] {
          box-shadow: 0 0 1px #2196F3;
        }
        
        input:checked + [x-ordo-utils=slider]:before {
          -webkit-transform: translateX(26px);
          -ms-transform: translateX(26px);
          transform: translateX(26px);
        }
    `;
    document.head.appendChild(style);
}

function toggleSwitch() {
    injectStyles()
}

toggleSwitch()