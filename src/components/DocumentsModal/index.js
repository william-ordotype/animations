import Alpine from "alpinejs";
import * as DOMPurify from "dompurify";
import handleFormSubmit from "./handleFormSubmit";

import "../../utils/globals";

function DocumentsModal() {
  return Alpine.data("DocumentsModal", () => {
    return {
      docType: Alpine.store("documentsStore").createOne.document.type,
      modalStore: Alpine.store('modalStore'),
      content(container, elem) {
        const dt = Alpine.store("documentsStore").createOne.document.type;
        const obj = { ...window.globals.modal.content };

        return dt ? obj[dt][container][elem] : undefined;
      },
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
            ],
          },
        });
      },
      modalBackdrop() {
        return {
          ["x-show"]: "modalStore.showModal",
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
            "modalStore.showBeforeSave || modalStore.showBeforeCancel",
          ["x-bind:class"]:
            "(modalStore.showBeforeSave || modalStore.showBeforeCancel) && 'active'",
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
          ["x-on:click.prevent"]: () => {
            Alpine.store("documentsStore").createOne.clearFields();
            this.modalStore.showBeforeCancel = false;
            this.modalStore.showModal = false;

            window.globals.modal.form.resetFormFields();
          },
        };
      },
      beforeCancelDialog(isShow) {
        return {
          ["x-show"]: "modalStore.showBeforeCancel",
          ["x-trap"]: "modalStore.showBeforeCancel",
        };
      },
    };
  });
}

export default DocumentsModal;
