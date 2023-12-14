import NProgress from "nprogress";
import { ShareStates, StateStore } from "../../utils/enums";
import {
  setRemoveSharedInvitations,
  setSharedNoteList,
} from "../../actions/sharedNotesActions";

function BeforeRemoveSharedInvitationDialog() {
  return {
    modal: {
      ["x-show"]: "$store.modalStore.showBeforeRemoveSharedInvitation",
    },
    modalCancelBtn: {
      ["x-on:click.prevent"]: "$store.modalStore.closeModal()",
    },
    modalAcceptBtn: {
      ["x-on:click.prevent"]: async () => {
        const modalStore = Alpine.store(StateStore.MODAL);
        NProgress.start();
        const noteIds = modalStore.removeShareNoteList;
        try {
          await setRemoveSharedInvitations({ noteIds });
          modalStore.removeShareNoteList = [];
          modalStore.closeModal();
        } catch (err) {
          console.error(err);
        }
        NProgress.done();
      },
    },
  };
}

function BeforeCloneNote() {
  return {
    modal: {
      ["x-show"]: "$store.modalStore.showBeforeCloneNote",
    },
    modalCancelBtn: {
      ["x-on:click.prevent"]: "$store.modalStore.closeModal()",
    },
    modalAcceptBtn: {
      ["x-on:click.prevent"]: () => {},
    },
  };
}

export { BeforeRemoveSharedInvitationDialog, BeforeCloneNote };
