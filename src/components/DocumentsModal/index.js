import Alpine from "alpinejs";

function DocumentsModal() {
  return Alpine.data("DocumentsModal", () => {
    return {
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
          ["x-on:click.prevent"]: `$store.documentsStore.showBeforeSave = ${canShow}`,
        };
      },
      submitForm() {
        return {
          ["x-on:submit"]: function (ev) {
            ev.preventDefault();
            const formData = new FormData(ev.target);
            formData.append(
              "rich_text_ordo",
              window.globals.createRTE.root.innerHTML
            );
            Alpine.store("documentsStore").createOne.sendDocument(formData);
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

export default DocumentsModal;


window.onload = function () { MemberStack.onReady.then(async function(member) { console.log('memberstack is ready, memeber = ', member); var metadata = await member.getMetaData(); if (metadata.signupAt == null) { console.log('memberstack detected new signup'); member.updateMetaData({ signupAt: Date.now() }); window.dataLayer = window.dataLayer || []; window.dataLayer.push({'event': 'new_signup', member_id: member.id }); } }) }

