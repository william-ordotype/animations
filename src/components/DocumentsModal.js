import Alpine from "alpinejs";
import QRCode from "easyqrcodejs";

import "../utils/globals";
import globals from "../utils/globals";

function DocumentsModal() {
  return {
    modalStore: Alpine.store("modalStore"),
    submitBtn() {
      return {
        ["x-bind:class"]: "$store.modalStore.loadSubmit === true && 'disabled'",
        ["x-text"]:
          "modalStore.loadSubmit === true ? $el.dataset.wait : 'Sauvegarder'",
        ["x-bind:value"]:
          "modalStore.loadSubmit === true ? $el.dataset.wait : 'Sauvegarder'",
      };
    },
    init() {
      // https://github.com/quilljs/quill/issues/262#issuecomment-948890432
      const Link = Quill.import("formats/link");
      // Override the existing property on the Quill global object and add custom protocols
      Link.PROTOCOL_WHITELIST = [
        "http",
        "https",
        "mailto",
        "tel",
        "radar",
        "rdar",
        "smb",
        "sms",
      ];

      class CustomLinkSanitizer extends Link {
        static sanitize(url) {
          // Run default sanitize method from Quill
          const sanitizedUrl = super.sanitize(url);

          // Not whitelisted URL based on protocol so, let's return `blank`
          if (!sanitizedUrl || sanitizedUrl === "about:blank")
            return sanitizedUrl;

          // Verify if the URL already have a whitelisted protocol
          const hasWhitelistedProtocol = this.PROTOCOL_WHITELIST.some(function (
            protocol
          ) {
            return sanitizedUrl.startsWith(protocol);
          });

          if (hasWhitelistedProtocol) return sanitizedUrl;

          // if not, then append only 'http' to not to be a relative URL
          return `https://${sanitizedUrl}`;
        }
      }

      Quill.register(CustomLinkSanitizer, true);

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
        width: 80,
        height: 80,
        quietZone: 15,
        titleHeight: 20,
        titleTop: 10,
        titleFont: "normal 12px Arial",
      };

      const qrCode = new QRCode(qrWrapper, options);
      const linkedQR = `<a href="${
        options.text
      }"><img src=${qrCode._oDrawing._elCanvas.toDataURL()}  alt=""/> </a>`;

      var range = quill.getSelection(true);
      if (range) {
        if (range.length === 0) {
          // Inserts QR at cursor position

          // quill.insertEmbed(
          //   range.index,
          //   "image",
          //   qrCode._oDrawing._elCanvas.toDataURL()
          // );

          quill.clipboard.dangerouslyPasteHTML(range.index, linkedQR);
        }
        debugger;
      } else {
        // Inserts QR at at end of document
        const length = quill.getLength();

        // quill.insertEmbed(
        //   length,
        //   "image",
        //   qrCode._oDrawing._elCanvas.toDataURL()
        // );

        quill.clipboard.dangerouslyPasteHTML(length, linkedQR);
        debugger;
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
    // pathologyInputValue: Alpine.store("modalStore").pathologyName,
    showSearchResults() {
      return {
        ["x-show"]: "$store.modalStore.form.pathology.length > 0",
        ["x-transition"]: "",
      };
    },
    clearSearchResults(obj) {
      // Delete obj from pathology array
      const index = Alpine.store("modalStore").form.pathology.indexOf(obj);
      if (index > -1) {
        Alpine.store("modalStore").form.pathology.splice(index, 1);
      }

      // Alpine.store("modalStore").form.pathology = [];
      // Alpine.store("modalStore").pathologyName = "";
      // $("#aa-pathology-input").attr("disabled", false).val("");
      // $(
      //   "#pathology-autocomplete .aa-InputWrapper, #pathology-autocomplete .aa-InputWrapperSuffix"
      // ).show();
      // $("#pathology-autocomplete .aa-Form").css("background", "#fff");
      // $("#pathology-autocomplete form")[0].reset();
    },
    init() {
      globals.autocomplete({
        onStateChange({ state, ...rest }) {
          if (state.isOpen === false && state.status === "idle") {
            state.completion = "";
          }
          if (state.isOpen === true && state.status === "loading") {
            Alpine.store("modalStore").loadSubmit = true;
          } else if (state.isOpen === false) {
            Alpine.store("modalStore").loadSubmit = false;
          }
        },
        container: "#pathology-autocomplete",
        placeholder: "Rechercher une pathologie",
        id: "aa-pathology",
        detachedMediaQuery: "none",
        debug: false,
        async getSources({ query = "" }) {
          const res = await Alpine.store(
            "documentsStore"
          ).pathologies.searchByTitleAndAlias(query);
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
              onSelect(obj, rest) {
                // Review if pathology id already exists in pathology store array
                const pathologyExists = Alpine.store(
                  "modalStore"
                ).form.pathology.find((pathology) => {
                  return pathology._id === obj.item._id;
                });
                if (pathologyExists) {
                  return;
                }

                Alpine.store("modalStore").form.pathology.push({
                  _id: obj.item._id,
                  title: obj.itemInputValue,
                });
                // Reset autocomplete input
                $("#pathology-autocomplete form")[0].reset();
              },
            },
          ];
        },
        renderNoResults({ render, html, state }, root) {
          render(
            html`
              <div class="aa-PanelLayout aa-Panel--scrollable">
                Aucun résultat trouvé pour "${state.query}".
              </div>
            `,
            root
          );
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
