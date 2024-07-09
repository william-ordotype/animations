import Alpine from "alpinejs";
import { NotesUrls, StateStore } from "@utils/enums";
import NProgress from "nprogress";
import { setCloneNote } from "../../actions/sharedNotesActions";
import { IToastStore, STATUS_TYPES } from "@store/toaster.store";
import { IShareStore } from "@store/share.store";
import { IUserStore } from "@store/user.store";

function SharingInvitation() {
  const shareStore = Alpine.store(StateStore.SHARE) as IShareStore;
  const toastStore = Alpine.store(StateStore.TOASTER) as IToastStore;
  const userStore = Alpine.store(StateStore.USER) as IUserStore;

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
        ["x-show"]: () => {
          return (
            !shareStore.isInvitationLoading &&
            userStore.isAuth &&
            userStore.hasPaidSub &&
            shareStore.isInvitedAllowed
          );
        },
        // "(!$store.shareStore.isInvitationLoading && $store.userStore.isAuth && $store.userStore.hasPaidSub && $store.shareStore.isInvitedAllowed)",
      };
    },

    // Note modal component
    noteTitle() {
      return {
        ["x-text"]: () => {
          return shareStore.invitationNote.note?.title;
        },
        // ["x-text"]: "$store.shareStore.invitationNote.note?.title",
      };
    },
    noteAuthor() {
      return {
        ["x-text"]: "$store.shareStore.invitationNote.note?.author",
      };
    },
    noteRichText() {
      return {
        ["x-html"]: () => shareStore.invitationNote.note?.rich_text_ordo,
        // ["x-html"]: "$store.shareStore.invitationNote.note?.rich_text_ordo",
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
