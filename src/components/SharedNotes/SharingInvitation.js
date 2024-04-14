import { NotesUrls, StateStore } from "@utils/enums";
import NProgress from "nprogress";
import { setCloneNote } from "../../actions/sharedNotesActions";
import Alpine from "alpinejs";
import { STATUS_TYPES } from "@store/toaster.store";

function SharingInvitation() {
  const shareStore = /**
   * @type import('../../store/share.store').IShareStore
   */ (Alpine.store(StateStore.SHARE));

  const toastStore = /**
   * @type {import("@store/toaster.store").IToastStore}
   */ (Alpine.store(StateStore.TOASTER));

  return {
    layoutContainer() {
      return {
        ["x-bind:style"]:
          "$store.shareStore.isInvitedAllowed && { flexDirection: 'row', alignItems: 'center' }",
      };
    },

    // views
    notLoggedIn() {
      return {
        ["x-show"]:
          "!$store.shareStore.isInvitationLoading && (!$store.userStore.isAuth && !$store.shareStore.invitationNotExists)",
        ["x-transition"]: "",
      };
    },
    accessRevoked() {
      return {
        ["x-show"]:
          "(!$store.shareStore.isInvitationLoading && $store.userStore.isAuth && !$store.shareStore.isInvitedAllowed) || $store.shareStore.invitationNotExists",
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
    noteAuthor() {
      return {
        ["x-text"]: "$store.shareStore.invitationNote?.note?.author",
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
        ["@click.prevent"]: async () => {
          NProgress.start();
          try {
            const noteId = shareStore.invitationNote.note?._id;
            await setCloneNote({ noteId });
            setTimeout(() => {
              location.href = `${NotesUrls.MY_NOTES}`;
            }, 2500);
          } catch (err) {
            toastStore.toasterMsg("Error", STATUS_TYPES.error);
          }
          NProgress.done();
        },
      };
    },
  };
}

export default SharingInvitation;
