import { NotesUrls, StateStore, ToasterMsgTypes } from "../../utils/enums";
import ShareNotesService from "../../services/notesSharesService";
import NProgress from "nprogress";
import { setCloneNote } from "../../actions/sharedNotesActions";

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
    getFiles() {
      return {
        ["x-for"]: "file in $store.shareStore.invitationNote?.note?.documents",
      };
    },

    // Note modal actions
    cloneNote() {
      return {
        ["@click.prevent"]: async (ev) => {
          NProgress.start();
          try {
            const noteId = Alpine.store(StateStore.SHARE).invitationNote.note
              ?._id;
            await setCloneNote({ noteId });
            setTimeout(() => {
              window.PineconeRouter.currentContext.redirect(
                `${NotesUrls.MY_NOTES}`
              );
            }, 2500);
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
