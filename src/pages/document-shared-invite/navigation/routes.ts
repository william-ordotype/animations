import Alpine from "alpinejs";
import { hashToObject } from "@utils/pagination";
import shareNotesService from "../../../services/notesSharesService";
import { StateStore } from "@utils/enums";
import NProgress from "nprogress";
import {
  setSharedNoteBasicInfo,
  setShowSharedNote,
} from "../../../actions/sharedNotesActions";
import { IToastStore, STATUS_TYPES } from "@store/toaster.store";
import { IUserStore } from "@store/user.store";
import { IShareStore } from "@store/share.store";

function router() {
  const userStore = Alpine.store(StateStore.USER) as IUserStore;

  const toastStore = Alpine.store(StateStore.TOASTER) as IToastStore;

  const shareStore = Alpine.store(StateStore.SHARE) as IShareStore;

  return {
    /**
     * @param {import("pinecone-router/dist/types").Context} context
     */
    async home(context) {
      const { query } = context;
      const obj = hashToObject(query);
      const inviteId = obj["id"];
      const inviteType = obj["type"];
      const acceptId = obj["acceptId"];
      const isAuth = userStore.isAuth;

      try {
        if (acceptId) {
          if (!isAuth) {
            await setSharedNoteBasicInfo({ id: acceptId, type: "email" });
            NProgress.done();
            return;
          }

          // ordotype.fr/my-documents-invitation?acceptId=12345
          await acceptInvitation(acceptId);
        } else if (inviteType && inviteId !== "undefined") {
          if (!isAuth) {
            await setSharedNoteBasicInfo({ id: inviteId, type: inviteType });
            NProgress.done();
            return;
          }

          // ordotype.fr/my-documents-invitation?id=12345&type=email
          debugger;
          await setShowSharedNote(
            { inviteType, noteId: inviteId },
            { shareStore }
          );
        } else {
          toastStore.toasterMsg(
            window.toastActionMsg.navigation.invalidUrlInvitation,
            STATUS_TYPES.error,
            10000
          );
          console.error("Invalid URL. Missing type or id");
        }
      } catch (err) {
        shareStore.isInvitedAllowed = false;
        shareStore.isInvitationLoading = false;
        console.error(err);
        if (err.response?.statusCode === 404) {
          shareStore.invitationNotExists = true;
        }
      }
      NProgress.done();
    },
    notfound() {
      toastStore.toasterMsg(
        window.toastActionMsg.navigation.notFound,
        STATUS_TYPES.error
      );
      console.log("URL not found");
    },
  };
}

export { router };

/**
 * @param {any} acceptId
 */
async function acceptInvitation(acceptId) {
  const toastStore = /**
   * @type {import("@store/toaster.store").IToastStore}
   */ Alpine.store(StateStore.TOASTER);

  // ordotype.fr/my-documents-invitation?acceptId=12345
  const res = await shareNotesService.acceptNoteInvitation({
    noteId: acceptId,
  });
  NProgress.set(0.5);

  const { noteId, alreadyAccepted } = res.data;
  if (!alreadyAccepted) {
    toastStore.toasterMsg(
      window.toastActionMsg.shareNotes.acceptedInvitation.success,
      STATUS_TYPES.success
    );
  }
  location.href = `?id=${noteId}&type=email`;
}
