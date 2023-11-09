import ShareNotesService from "../services/notesSharesService";
import { ORDOTYPE_API } from "../services/apiConfig";

const ShareNoteService = new ShareNotesService(
  ORDOTYPE_API,
  window.memberToken
);

function DocumentsShareModal() {
  return {
    // local state
    showSharingOptions: false,
    sharedEmailValue: "",
    sharedEmailList: Alpine.store("shareStore").activeNoteEmailList,
    emailsToAdd: [],
    emailsToDelete: [],
    sharedLinkId: Alpine.store("shareStore").activeNotePublicLink,

    // components
    shareModal() {
      return {
        ["x-show"]: "$store.modalStore.showSharingOptions",
        ["x-transition"]: "",
      };
    },
    noteTitle() {
      return {
        ["x-text"]: "$store.shareStore.activeNote.title",
      };
    },
    switchButton() {
      return {
        ["x-model"]: "$store.shareStore.shareSwitch",
        ["x-on:change"]: async (ev) => {
          const activeNote = Alpine.store("shareStore").activeNote;

          try {
            if (!activeNote["can_share"]) {
              $(".partage_inputs").slideDown();
              await ShareNoteService.activateNote(activeNote._id);
              activeNote["can_share"] = true;
            } else {
              $(".partage_inputs").slideUp();
              await ShareNoteService.deactivateNote(activeNote._id);
              activeNote["can_share"] = false;
            }
          } catch (err) {
            console.error(err);
          }
        },
      };
    },
    sharingOptionsWrapper() {
      return {
        ["x-show"]: "$store.shareStore.shareOptionsEnabled",
      };
    },
    sharedEmailInput() {
      return {
        ["x-model"]: "sharedEmailValue",
        ["x-on:keyup.enter"]: () => {
          return this.sharedEmailList.push(this.sharedEmailValue);
        },
      };
    },
    addEmailtoListBtn() {
      return {
        ["x-on:click.prevent"]: async () => {
          try {
            Alpine.store("shareStore").activeNoteEmailList.push(
              this.sharedEmailValue
            );
            this.emailsToAdd.push(this.sharedEmailValue);
            console.log(this.emailsToAdd);
            this.sharedEmailValue = "";
          } catch (err) {
            console.error(err);
          }
        },
      };
    },
    sharedEmailsList() {
      return {
        ["x-for"]: "eMail in $store.shareStore.activeNoteEmailList",
      };
    },
    sharedEmailName: {
      ["x-text"]: "eMail",
    },
    deleteSharedEmail() {
      return {
        ["x-on:click.prevent"]: () => {
          const email = this.eMail;
          const index = this.sharedEmailList.indexOf(email);
          this.sharedEmailList.splice(index, 1);
          this.emailsToDelete.push(email);
        },
      };
    },
    validateButton() {
      return {
        ["x-on:click.prevent"]: async () => {
          try {
            const payload = {
              emailsToAdd: this.emailsToAdd,
              emailsToRemove: this.emailsToDelete,
              noteId: Alpine.store("shareStore").activeNote._id,
            };
            await ShareNoteService.updateEmailsToNote(payload);
            Alpine.store("toasterStore").toasterMsg("Success", "success");
          } catch (err) {
            console.error(err);
            Alpine.store("toasterStore").toasterMsg("Erreur", "error");
          }
        },
      };
    },
    closeSharingModal: {
      ["x-on:click.prevent"]: () => {
        this.sharedEmailValue = "";
        closeModalFn();
      },
    },
    copySharedLinkBtn: {
      ["x-on:click.prevent"]: () => {},
    },
    copySharedLinkSuccessMsg: {
      ["x-show"]: "$store.shareStore.showCopySuccessMsg",
      ["x-transition:enter.duration.500ms"]: "",
      ["x-transition:leave.duration.0ms"]: "",
    },
  };
}

const closeModalFn = () => {
  Alpine.store("modalStore").showSharingOptions = false;
  Alpine.store("shareStore").clearShareModalOptions();
};

export default DocumentsShareModal;
