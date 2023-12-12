import Alpine from "alpinejs";
import ShareNotesService from "../../services/notesSharesService";
import { StateStore, ToasterMsgTypes } from "../../utils/enums";
import NProgress from "nprogress";
import { string } from "yup";

const ShareNoteService = new ShareNotesService();

function DocumentsShareModal() {
  return {
    // local state
    showSharingOptions: false,
    sharedEmailValue: "",
    sharedEmailList: Alpine.store(StateStore.SHARE).activeNoteEmailList,
    emailsToAdd: [],
    emailsToDelete: [],
    sharedLinkId: Alpine.store(StateStore.SHARE).activeNotePublicLink,

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
        ["x-bind:disabled"]: () => {
          return Alpine.store(StateStore.SHARE).isShareSwitchLoading;
        },
        ["x-model"]: "$store.shareStore.shareSwitch",
        ["x-on:change"]: async (ev) => {
          NProgress.start();
          const shareStore = Alpine.store(StateStore.SHARE);
          const notesStore = Alpine.store(StateStore.MY_NOTES);
          const toastStore = Alpine.store(StateStore.TOASTER);
          const activeNote = shareStore.activeNote;

          shareStore.isShareSwitchLoading = true;
          try {
            if (!activeNote["can_share"]) {
              const res = await ShareNoteService.activateNote(activeNote._id);
              $(".partage_inputs").slideDown();
              shareStore.activeNotePublicLink = res.linkId;
              notesStore.noteList.find((note) => note._id)["can_share"] = true;

              activeNote["can_share"] = true;
            } else {
              $(".partage_inputs").slideUp();
              await ShareNoteService.deactivateNote(activeNote._id);
              shareStore.activeNotePublicLink = "";
              notesStore.noteList.find((note) => note._id)["can_share"] = false;

              activeNote["can_share"] = false;
            }
            NProgress.done();
            shareStore.isShareSwitchLoading = false;
          } catch (err) {
            toastStore.toasterMsg(
              "Une erreur s'est produite lors de la tentative de partage de votre document",
              ToasterMsgTypes.ERROR
            );
            console.error(err);
            ev.preventDefault();
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
          const userStore = Alpine.store(StateStore.USER);
          const toastStore = Alpine.store(StateStore.TOASTER);
          const shareStore = Alpine.store(StateStore.SHARE);

          try {
            const validateSharedEmailValueSchema = string().email().required();
            const email = validateSharedEmailValueSchema.validateSync(
              this.sharedEmailValue
            );
            // Avoids sharing document to same owner user
            if (email === userStore.user.auth.email) {
              toastStore.toasterMsg(
                "Vous ne pouvez pas partager un document avec vous-même!",
                ToasterMsgTypes.ERROR
              );
              return;
            }
            // Checks if email already exists in shared list to avoid duplication
            if (shareStore.activeNoteEmailList.some((e) => e.email === email)) {
              toastStore.toasterMsg(
                "L'e-mail existe déjà dans la liste partagée",
                ToasterMsgTypes.ERROR
              );
              return;
            }
            shareStore.activeNoteEmailList.push({
              email,
            });
            this.emailsToAdd.push(this.sharedEmailValue);
            this.sharedEmailValue = "";
          } catch (err) {
            if (err.name === "ValidationError") {
              toastStore.toasterMsg(err.errors, ToasterMsgTypes.ERROR);
            }
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
      ["x-text"]: "eMail.email",
    },
    deleteSharedEmail() {
      return {
        ["x-on:click.prevent"]: () => {
          const currentEmail = this.eMail;
          const modalEmailList = Alpine.store(
            StateStore.SHARE
          ).activeNoteEmailList;
          const index = modalEmailList.indexOf(currentEmail);
          modalEmailList.splice(index, 1);
          this.emailsToDelete.push(currentEmail.email);
        },
      };
    },
    validateButton() {
      return {
        ["x-bind:disabled"]: () => {
          return (
            this.emailsToDelete.length === 0 && this.emailsToAdd.length === 0
          );
        },
        ["x-on:click.prevent"]: async () => {
          try {
            if (this.sharedEmailValue !== "") {
              Alpine.store(StateStore.TOASTER).toasterMsg(
                "Assurez-vous d'avoir ajouté tous les e-mails de l'entrée avant de soumettre",
                ToasterMsgTypes.ERROR
              );
              return;
            }
            const payload = {
              emailsToAdd: this.emailsToAdd,
              emailsToRemove: this.emailsToDelete,
              noteId: Alpine.store("shareStore").activeNote._id,
            };
            await ShareNoteService.updateEmailsToNote(payload);
            Alpine.store("toasterStore").toasterMsg(
              "Enregistré avec succès",
              "success"
            );
          } catch (err) {
            console.error(err);
            Alpine.store("toasterStore").toasterMsg(
              "Il y avait une erreur",
              "error"
            );
          }
        },
      };
    },
    closeSharingModal() {
      return {
        ["x-on:click.prevent"]: () => {
          this.sharedEmailValue = "";
          closeModalFn();
        },
      };
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
