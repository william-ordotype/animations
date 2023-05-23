import Alpine from "alpinejs";
import QRCode from "easyqrcodejs";

import "../../utils/globals";
import modalStore from "../../store/modal.store";
import globals from "../../utils/globals";

function DocumentsModal() {
  return Alpine.data("DocumentsModal", () => {
    return {
      modalStore: Alpine.store("modalStore"),
      init() {
        window.globals.createRTE = new Quill(".modal_text_editor_wrapper", {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"], // toggled buttons
              [{ list: "ordered" }, { list: "bullet" }],
              [{ align: [] }],
              ["link", "image"],
              ["blockquote", "code-block"],
              [{ script: "sub" }, { script: "super" }], // superscript/subscript
              [{ color: [] }, { background: [] }], // outdent/indent
            ],
          },
        });
      },
      modalBackdrop() {
        return {
          ["x-show"]: "modalStore.showModal || modalStore.showBeforeDelete ",
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
            "modalStore.showBeforeSave || modalStore.showBeforeCancel || modalStore.showBeforeDelete || modalStore.showInsertUrl",
          ["x-bind:class"]:
            "(modalStore.showBeforeSave || modalStore.showBeforeCancel || modalStore.showBeforeDelete || modalStore.showInsertUrl) && 'active'",
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
      // add URL
      url: "",
      urlTitle: "",
      insertUrlSubmit() {
        const quill = globals.createRTE
        const qrWrapper = document.createElement("div");
        const options = {
          text: this.url,
          title: this.urlTitle,
          width: 130,
          height: 130,
          quietZone: 15,
          titleHeight: 20,
          titleTop: 10,
          titleFont: "normal 12px Arial",
        };

        const qrCode = new QRCode(qrWrapper, options);

        var range = quill.getSelection(true);
        debugger
        if (range) {
          if (range.length == 0) {
            // Inserts QR at cursor position
            quill.insertEmbed(
              range.index,
              "image",
              qrCode._oDrawing._elCanvas.toDataURL()
            );
          }
        } else {
          // Inserts QR at at end of document
          const length = quill.getLength();
          quill.insertEmbed(
            length,
            "image",
            qrCode._oDrawing._elCanvas.toDataURL()
          );
        }

        this.clearUrlSubmit();
        this.modalStore.showInsertUrl = false;
      },
      clearUrlSubmit() {
        (this.url = ""), (this.urlTitle = "");
      },
      insertUrlDialog() {
        return {
          ["x-show"]: "modalStore.showInsertUrl",
          ["x-trap"]: "modalStore.showInsertUrl",
        };
      },
      showInsertUrlDialog(canShow) {
        return {
          ["x-on:click.prevent"]: function () {
            this.modalStore.showInsertUrl = canShow;
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
        };
      },
    };
  });
}

export default DocumentsModal;
