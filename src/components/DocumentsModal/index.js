import Alpine from "alpinejs";
import * as DOMPurify from 'dompurify';


function DocumentsModal() {
  return Alpine.data("DocumentsModal", () => {
    return {
      docType: "$store.documentStore.createOne.documentType",
      init() {
        window.globals.createRTE = new Quill(".modal_text_editor_wrapper", {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"], // toggled buttons
              [
                { list: "ordered" },
                { list: "bullet" },

                { indent: "-1" },
                { align: [] },
                { indent: "+1" },
              ],
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
            Alpine.store('documentsStore').showBeforeSave = canShow;
            window.autocomplete({
              container: "#pathology-autocomplete",
              async getSources({ query = "" }) {
                const res = await Alpine.store(
                  "documentsStore"
                ).pathologies.getList(query);
                return [
                  {
                    sourceId: "pathologies",
                    getItems(query) {
                      debugger
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
                      console.log('selected')
                    }
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
      submitForm() {
        return {
          // ["x-on:submit"]:
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
          ["x-on:click.prevent"]: `$store.documentsStore.createOne.clearFields();
          $store.documentsStore.showBeforeCancel = false; 
          $store.documentsStore.showModal = false`,
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

window.createForm = async function (ev) {
  ev.preventDefault();

  const cleanRichText = DOMPurify.sanitize(window.globals.createRTE.root.innerHTML, { USE_PROFILES: { html: true } });


  Alpine.store('documentsStore').createOne.rich_text_ordo = cleanRichText;
  Alpine.store('documentsStore').createOne.title = document.getElementById('title');
  Alpine.store('documentsStore').createOne.pathology = document.getElementById('field-2');

  await Alpine.store("documentsStore").createOne.sendDocument();
  Alpine.store("documentsStore").createOne.clearFields()
  await Alpine.store("documentsStore").getList.setDocuments()
}

export default DocumentsModal;
