import Alpine from "alpinejs";
import QRCode from "easyqrcodejs";

import "../utils/globals";
import globals from "../utils/globals";

function DocumentsModal() {
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
      const quill = globals.createRTE;
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
}

function PathologiesAutocomplete() {
  return {
    pathologyInputValue: Alpine.store("modalStore").pathologyName,
    showSearchResults() {
      return {
        ["x-show"]: "$store.modalStore.form.pathology.length",
        ["x-transition"]: "",
      };
    },
    clearSearchResults() {
      Alpine.store("modalStore").form.pathology = [];
      Alpine.store("modalStore").pathologyName = "";
      $("#aa-pathology-input").attr("disabled", false).val("");
      $(
        "#pathology-autocomplete .aa-InputWrapper, #pathology-autocomplete .aa-InputWrapperSuffix"
      ).show();
      $("#pathology-autocomplete .aa-Form").css("background", "#fff");
      $("#pathology-autocomplete form")[0].reset();
    },
    init() {
      globals.autocomplete({
        onStateChange({ state }) {
          if (state.isOpen === false && state.status === "idle") {
            state.completion = "";
          }
        },
        container: "#pathology-autocomplete",
        placeholder: "Rechercher une pathologie",
        id: "aa-pathology",
        detachedMediaQuery: "none",
        debug: false,
        async getSources({ query = "" }) {
          const res = await Alpine.store("documentsStore").pathologies.getList(
            query
          );
          return [
            {
              sourceId: "pathologies",
              getItems() {
                return (
                  res.data.filter((pathology) => {
                    return pathology.is_ok_for_posos === "true";
                  }) || []
                );
              },
              getItemInputValue({ item }) {
                return item.title;
              },
              templates: {
                item({ item, html }) {
                  return html`<div>${item.title}</div>`;
                },
              },
              onSelect(obj) {
                Alpine.store("modalStore").form.pathology = [obj.item._id];
                Alpine.store("modalStore").pathologyName = obj.itemInputValue;
                $("#aa-pathology-input").attr("disabled", true);
                $(
                  "#pathology-autocomplete .aa-InputWrapper, #pathology-autocomplete .aa-InputWrapperSuffix"
                ).hide();
                $("#pathology-autocomplete .aa-Form").css("background", "#eee");
              },
            },
          ];
        },
        onReset(obj) {
          Alpine.store("modalStore").form.pathology = [];
          Alpine.store("modalStore").pathologyName = "";
          $("#aa-pathology-input").attr("disabled", false).val("");
          $(
            "#pathology-autocomplete .aa-InputWrapper, #pathology-autocomplete .aa-InputWrapperSuffix"
          ).show();
          $("#pathology-autocomplete .aa-Form").css("background", "#fff");
        },
        renderNoResults({ state, render }, root) {
          render(`No results for "${state.query}".`, root);
        },
      });
    },
  };
}

function OpenModalByType() {
  return {
    prescriptionsNewType() {
      return {
        // type = ordonnances
        ["x-on:click.prevent"]:
          "$store.modalStore.openModal(null, {type: 'prescriptions'})",
      };
    },
    notesNewType() {
      // type = notes
      return {
        ["x-on:click.prevent"]:
          "$store.modalStore.openModal(null,{type: 'notes'})",
      };
    },
    recommendationsNewType() {
      // type = conseils patient
      return {
        ["x-on:click.prevent"]:
          "$store.modalStore.openModal(null,{type: 'recommendations'})",
      };
    },
  };
}

export { DocumentsModal, OpenModalByType, PathologiesAutocomplete };
