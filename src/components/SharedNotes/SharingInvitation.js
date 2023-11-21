import { NotesUrls, StateStore, ToasterMsgTypes } from "../utils/enums";
import ShareNotesService from "../services/notesSharesService";
import NProgress from "nprogress";

const shareNotesService = new ShareNotesService();

function SharingInvitation() {
  return {
    layoutContainer() {
      return {
        ["x-bind:style"]:
          "$store.shareStore.isInvitedAllowed && { flexDirection: 'row', alignItems: 'stretch' }",
      };
    },

    // views
    notLoggedIn() {
      return {
        ["x-show"]:
          "!$store.shareStore.isInvitationLoading && !$store.userStore.isAuth",
        ["x-transition"]: "",
      };
    },
    accessRevoked() {
      return {
        ["x-show"]:
          "!$store.shareStore.isInvitationLoading && $store.userStore.isAuth && !$store.shareStore.isInvitedAllowed",
        ["x-transition"]: "",
      };
    },
    sharedAccess() {
      return {
        ["x-show"]:
          "!$store.shareStore.isInvitationLoading && $store.userStore.isAuth && $store.userStore.hasPaidSub && $store.shareStore.isInvitedAllowed",
        ["x-transition"]: "",
      };
    },

    // Note modal component
    noteTitle() {
      return {
        ["x-text"]: "$store.shareStore.invitationNote?.note?.title",
      };
    },
    noteRichText() {
      return {
        ["x-html"]: "$store.shareStore.invitationNote?.note?.rich_text_ordo",
      };
    },

    // Note modal actions
    cloneNote() {
      return {
        ["@click.prevent"]: async (ev) => {
          debugger;
          ev.preventDefault();
          NProgress.start();
          const noteObj = Alpine.store(StateStore.SHARE).invitationNote.note;
          try {
            await shareNotesService.cloneSharedNote(noteObj._id, true);
            Alpine.store(StateStore.TOASTER).toasterMsg(
              `Copie de le document enregistrée. <a id="redirectNote" target="_self" href="${NotesUrls.MY_NOTES}">Redirect to my documents</a>`,
              ToasterMsgTypes.ERROR,
              4500
            );
            $("#redirectNote").on("click", () => {
              window.PineconeRouter.currentContext.redirect(NotesUrls.MY_NOTES);
              return true;
            });
          } catch (err) {
            Alpine.store(StateStore.TOASTER).toasterMsg(
              "Error",
              ToasterMsgTypes.ERROR
            );
          }
          NProgress.done();
        },
      };
    },
  };
}

export default SharingInvitation;
