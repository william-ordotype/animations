import Alpine from "alpinejs";
import * as DOMPurify from "dompurify";
import handleFormSubmit from "./handleFormSubmit";

import "../../utils/globals";

function DocumentsModal() {
  return Alpine.data("DocumentsModal", () => {
    return {
      docType: Alpine.store("documentsStore").createOne.document.type,
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
          ["x-show"]: "$store.documentsStore.showModal",
          ["x-trap.noscroll"]: "$store.documentsStore.showModal",
          ["x-transition"]: "",
        };
      },
      modalElem() {
        return {
          ["x-show"]: "$store.documentsStore.showModal",
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
            "$store.documentsStore.showBeforeSave || $store.documentsStore.showBeforeCancel",
          ["x-bind:class"]:
            "($store.documentsStore.showBeforeSave || $store.documentsStore.showBeforeCancel) && 'active'",
        };
      },
      beforeSaveDialog(isShow) {
        return {
          ["x-show"]: "$store.documentsStore.showBeforeSave",
        };
      },
      showBeforeSave(canShow) {
        return {
          ["x-on:click.prevent"]: function () {
            Alpine.store("documentsStore").showBeforeSave = canShow;
            !document.querySelector("#pathology-autocomplete .aa-Input") &&
              window.globals.autocomplete({
                container: "#pathology-autocomplete",
                detachedMediaQuery: "none",
                debug: true,
                async getSources({ query = "" }) {
                  const res = await Alpine.store(
                    "documentsStore"
                  ).pathologies.getList(query);
                  return [
                    {
                      sourceId: "pathologies",
                      getItems(query) {
                        return res.pathologies || [];
                      },
                      getItemInputValue({ item }) {
                        return item.title;
                      },
                      templates: {
                        item({ item, html }) {
                          return html`<div>${item.title}</div>`;
                        },
                      },
                      onSelect() {
                        console.log("selected");
                      },
                    },
                  ];
                },
                renderNoResults({ state, render }, root) {
                  render(`No results for "${state.query}".`, root);
                },
              });
          },
        };
      },
      // Cancellation Dialog
      showBeforeCancel(canShow) {
        return {
          ["x-on:click.prevent"]: `$store.documentsStore.showBeforeCancel = ${canShow}`,
        };
      },
      confirmCancel() {
        return {
          ["x-on:click.prevent"]: () => {
            Alpine.store("documentsStore").createOne.clearFields();
            Alpine.store("documentsStore").showBeforeCancel = false;
            Alpine.store("documentsStore").showModal = false;

            window.globals.modal.form.resetFormFields();
          },
        };
      },
      beforeCancelDialog(isShow) {
        return {
          ["x-show"]: "$store.documentsStore.showBeforeCancel",
          ["x-trap"]: "$store.documentsStore.showBeforeCancel",
        };
      },
    };
  });
}

export default DocumentsModal;
