import ShareNotesService from "../services/notesSharesService";

const API_URL = `${process.env.ORDOTYPE_API}/v1.0.0`;
const ShareNoteService = new ShareNotesService(API_URL, window.memberToken);

function DocumentsShareModal() {
  return {
    // local state
    showSharingOptions: false,
    sharedEmailValue: "",
    colors: ["Red", "Orange", "Yellow", "Yellow"],

    // components
    shareModal() {
      return {
        ["x-show"]: "$store.modalStore.showSharingOptions",
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
          return this.colors.push(this.sharedEmailValue);
        },
      };
    },
    addEmailtoListBtn() {
      return {
        ["x-on:click.prevent"]: () => {
          this.colors.push(this.sharedEmailValue);
        },
      };
    },
    sharedEmailsList() {
      return {
        ["x-for"]: "color in colors",
      };
    },
    sharedEmailName: {
      ["x-text"]: "color",
    },
    deleteSharedEmail() {
      return {
        ["x-on:click.prevent"]: () => {
          const email = this.color;
          const index = this.colors.indexOf(email);
          this.colors.splice(index, 1);
        },
      };
    },
    closeSharingModal: {
      ["x-on:click.prevent"]: closeModalFn,
    },
    copySharedLinkBtn: {
      ["x-on:click.prevent"]: () => {},
    },
  };
}

const closeModalFn = () => {
  Alpine.store("modalStore").showSharingOptions = false;
  Alpine.store("shareStore").shareOptionsEnabled = false;
  Alpine.store("shareStore").activeNote = {};
};

export default DocumentsShareModal;
