import Alpine from "alpinejs";

import "../../utils/globals";
import modalStore from "../../store/modal.store";



function DocumentsModal() {
  return Alpine.data("DocumentsModal", () => {
    return {
      modalStore: Alpine.store('modalStore'),
      init() {
        window.globals.createRTE = new Quill(".modal_text_editor_wrapper", {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"], // toggled buttons
              [{ list: "ordered" }, { list: "bullet" }],
              [{ align: [] }],
              ["link"],
              ["blockquote", "code-block"],
              [{ script: "sub" }, { script: "super" }], // superscript/subscript
              [{ color: [] }, { background: [] }], // outdent/indent
              ['image']
            ],
          },
        });
        
      },
           modalBackdrop() {
        return {
          ["x-show"]: "modalStore.showModal || modalStore.showBeforeDelete",
          ["x-trap.noscroll"]: "modalStore.showModal",
          ["x-transition"]: "",
        };
      },
      modalElem() {
        return {
          ["x-show"]: "modalStore.showModal",
          ["x-transition"]: "",
        };
      },
      createOneRichText() {
        return {
          ["x-ref"]: "createOneRichText",
        };
      },
      modalDialogBackdrop() {
        return {
          ["x-show"]:
            "modalStore.showBeforeSave || modalStore.showBeforeCancel || modalStore.showBeforeDelete",
          ["x-bind:class"]:
            "(modalStore.showBeforeSave || modalStore.showBeforeCancel || modalStore.showBeforeDelete) && 'active'",
        };
      },
      beforeSaveDialog(isShow) {
        return {
          ["x-show"]: "modalStore.showBeforeSave",
        };
      },
      showBeforeSave(canShow) {
        return {
          ["x-on:click.prevent"]: function () {
            this.modalStore.showBeforeSave = canShow;
          },
        };
      },
      // Cancellation Dialog
      showBeforeCancel(canShow) {
        return {
          ["x-on:click.prevent"]: `modalStore.showBeforeCancel = ${canShow}`,
        };
      },
      confirmCancel() {
        return {
          ["x-on:click.prevent"]: "modalStore.closeModal()",
        };
      },
      beforeCancelDialog() {
        return {
          ["x-show"]: "modalStore.showBeforeCancel",
          ["x-trap"]: "modalStore.showBeforeCancel",
        };
      },
      beforeDeleteDialog() {
        return {
          ["x-show"]: "modalStore.showBeforeDelete",
          ["x-trap"]: "modalStore.showBeforeDelete",
        }
      }
    };
  });
}

export default DocumentsModal;
