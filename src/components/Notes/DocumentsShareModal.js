// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Alpine from "alpinejs";
import shareNotesService from "../../services/notesSharesService";
import { StateStore } from "@utils/enums";
import NProgress from "nprogress";
import { string } from "yup";
import { STATUS_TYPES } from "@store/toaster.store";
import toasterActions from "../../actions/toasterActions";

/**
 * @return {import("alpinejs").AlpineComponent<any>}
 */

function DocumentsShareModal() {
  const shareStore = /**
   * @type {import("@store/share.store").IShareStore}
   */ (Alpine.store(StateStore.SHARE));

  const notesStore = /**
   * @type {import("@store/myNotes.store").INotesStore}
   */ (Alpine.store(StateStore.MY_NOTES));

  const toastStore = /**
   * @type {import("@store/toaster.store").IToastStore}
   */ (Alpine.store(StateStore.TOASTER));

  return {
    // local state
    showSharingOptions: false,
    sharedEmailValue: "",
    sharedEmailList: shareStore.activeNoteEmailList,
    emailsToAdd: /** @type {string[]} */ [],
    emailsToDelete: /** @type {string[]} */ [],
    sharedLinkId: shareStore.activeNotePublicLink,

    // components
    shareModal() {
      return {
        ["x-show"]: "$store.modalStore.showSharingOptions",
        ["x-transition"]: "",
      };
    },
    noteTitle() {
      return {
        ["x-text"]: "$store.shareStore.activeNote?.title",
      };
    },
    switchButton() {
      return {
        ["x-bind:disabled"]: () => {
          return shareStore.isShareSwitchLoading;
        },
        ["x-model"]: "$store.shareStore.shareSwitch",
        ["x-on:change"]: async (
          /** @type {{ preventDefault: () => void; }} */ ev
        ) => {
          NProgress.start();
          const activeNote = shareStore.activeNote;

          shareStore.isShareSwitchLoading = true;
          try {
            if (activeNote && !activeNote["can_share"]) {
              const res = await shareNotesService.activateNote(activeNote._id);
              $(".partage_inputs").slideDown();
              shareStore.activeNotePublicLink = res.data.linkId;

              // ToDo Review the find check. Is probably wrong implemented
              notesStore.noteList.find((note) => note._id)["can_share"] = true;

              activeNote["can_share"] = true;
            } else {
              $(".partage_inputs").slideUp();
              await shareNotesService.deactivateNote(activeNote._id);
              shareStore.activeNotePublicLink = "";
              notesStore.noteList.find((note) => note._id)["can_share"] = false;

              activeNote["can_share"] = false;
            }
            NProgress.done();
            shareStore.isShareSwitchLoading = false;
          } catch (err) {
            toastStore.toasterMsg(
              window.toastActionMsg.shareNotes.switchShare.error,
              STATUS_TYPES.error
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
        ["x-on:keyup.enter"]: async () => {
          const userStore = Alpine.store(StateStore.USER);

          try {
            const validateSharedEmailValueSchema = string()
              .email()
              .required("Ce champ est obligatoire");
            const email = validateSharedEmailValueSchema.validateSync(
              this.sharedEmailValue
            );
            // Avoids sharing document to same owner user
            if (email === userStore.user.auth.email) {
              toastStore.toasterMsg(
                window.toastActionMsg.shareNotes.addEmailToList.error
                  .noSelfSharing,
                STATUS_TYPES.error
              );
              return;
            }
            // Checks if email already exists in shared list to avoid duplication
            if (shareStore.activeNoteEmailList.some((e) => e.email === email)) {
              toastStore.toasterMsg(
                window.toastActionMsg.shareNotes.addEmailToList.error
                  .alreadyExists,
                STATUS_TYPES.error
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
              toastStore.toasterMsg(err.errors, STATUS_TYPES.error);
            }
            console.error(err);
          }
        },
      };
    },
    addEmailtoListBtn() {
      return {
        ["x-on:click.prevent"]: async () => {
          const userStore = Alpine.store(StateStore.USER);

          try {
            const validateSharedEmailValueSchema = string()
              .email()
              .required("Ce champ est obligatoire");

            const email = validateSharedEmailValueSchema.validateSync(
              this.sharedEmailValue
            );
            // Avoids sharing document to same owner user
            if (email === userStore.user.auth.email) {
              toastStore.toasterMsg(
                window.toastActionMsg.shareNotes.addEmailToList.error
                  .noSelfSharing,
                STATUS_TYPES.error
              );
              return;
            }
            // Checks if email already exists in shared list to avoid duplication
            if (shareStore.activeNoteEmailList.some((e) => e.email === email)) {
              toastStore.toasterMsg(
                window.toastActionMsg.shareNotes.addEmailToList.error
                  .alreadyExists,
                STATUS_TYPES.error
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
              toasterActions.setToastMessage(err.message, STATUS_TYPES.error);
              // toastStore.toasterMsg(err.errors, STATUS_TYPES.error);
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
          const currentEmail = this.$data.eMail;
          const modalEmailList = shareStore.activeNoteEmailList;
          const index = modalEmailList.indexOf(currentEmail);
          modalEmailList.splice(index, 1);

          // If email was recently added, delete it from the emailsToAdd array,
          // if not add it to emailsToDelete array to be deleted on validation submit
          if (
            this.emailsToAdd.some(
              (/** @type {any} */ email) => email === currentEmail.email
            )
          ) {
            const emailsToAddIndex = this.emailsToAdd.indexOf(
              currentEmail.email
            );
            this.emailsToAdd.splice(emailsToAddIndex, 1);
          } else {
            this.emailsToDelete.push(currentEmail.email);
          }
        },
      };
    },
    validateButton() {
      return {
        ["x-bind:class"]: () => {
          return (
            this.emailsToDelete.length === 0 &&
            this.emailsToAdd.length === 0 &&
            "disabled"
          );
        },
        ["x-on:click.prevent"]: async () => {
          try {
            if (this.sharedEmailValue !== "") {
              toastStore.toasterMsg(
                window.toastActionMsg.shareNotes.validateEmails.error
                  .dirtyInput,
                STATUS_TYPES.error
              );
              return;
            }
            const payload = {
              emailsToAdd: this.emailsToAdd,
              emailsToRemove: this.emailsToDelete,
              noteId: shareStore.activeNote?._id,
            };
            await shareNotesService.updateEmailsToNote(payload);
            toastStore.toasterMsg(
              window.toastActionMsg.shareNotes.validateEmails.success,
              STATUS_TYPES.success
            );
            this.emailsToAdd = [];
            this.emailsToDelete = [];
          } catch (err) {
            console.error(err);
            toastStore.toasterMsg(
              window.toastActionMsg.shareNotes.validateEmails.error.submitError,
              STATUS_TYPES.error
            );
          }
        },
      };
    },
    closeSharingModal() {
      return {
        ["x-on:click.prevent"]: () => {
          this.sharedEmailValue = "";
          this.emailsToAdd = [];
          this.emailsToDelete = [];
          closeModalFn();
        },
      };
    },
    copySharedLinkBtn: {
      ["x-on:click.prevent"]: () => {},
    },
    copySharedLinkSuccessMsg() {
      return {
        ["x-show"]: "$store.shareStore.showCopySuccessMsg",
        ["x-transition:enter.duration.500ms"]: "",
        ["x-transition:leave.duration.200ms"]: "",
      };
    },
  };
}

const closeModalFn = () => {
  Alpine.store(StateStore.MODAL).showSharingOptions = false;
  Alpine.store(StateStore.SHARE).clearShareModalOptions();
};

export default DocumentsShareModal;
