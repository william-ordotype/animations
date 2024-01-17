import Alpine from "alpinejs";
import { hashToObject } from "../../../router/pagination";
import ShareNotesService from "../../../services/notesSharesService";
import { StateStore, ToasterMsgTypes } from "../../../utils/enums";
import NProgress from "nprogress";
import {
  setSharedNoteBasicInfo,
  setShowSharedNote,
} from "../../../actions/sharedNotesActions";

const shareNoteService = new ShareNotesService();

function router() {
  return {
    async home(context) {
      const { query } = context;
      const obj = hashToObject(query);
      const inviteId = obj["id"];
      const inviteType = obj["type"];
      const acceptId = obj["acceptId"];
      const isAuth = Alpine.store(StateStore.USER).isAuth;

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
          await setShowSharedNote({ inviteType, noteId: inviteId });
        } else {
          Alpine.store(StateStore.TOASTER).toasterMsg(
            window.toastActionMsg.navigation.invalidUrlInvitation,
            ToasterMsgTypes.ERROR,
            10000
          );
          console.error("Invalid URL. Missing type or id");
        }
      } catch (err) {
        Alpine.store(StateStore.SHARE).isInvitedAllowed = false;
        Alpine.store(StateStore.SHARE).isInvitationLoading = false;
        console.error(err);
        if (err.response?.statusCode === 404) {
          Alpine.store(StateStore.SHARE).invitationNotExists = true;
        }
      }
      NProgress.done();
    },
    notfound(context) {
      Alpine.store(StateStore.TOASTER).toasterMsg(
        window.toastActionMsg.navigation.notFound,
        ToasterMsgTypes.ERROR
      );
      console.log("URL not found");
    },
  };
}

export { router };

async function acceptInvitation(acceptId) {
  // ordotype.fr/my-documents-invitation?acceptId=12345
  const res = await shareNoteService.acceptNoteInvitation({ noteId: acceptId });
  NProgress.set(0.5);

  const { noteId, alreadyAccepted } = res;
  if (!alreadyAccepted) {
    Alpine.store(StateStore.TOASTER).toasterMsg(
      window.toastActionMsg.shareNotes.acceptedInvitation.success,
      ToasterMsgTypes.SUCCESS
    );
  }
  location.href = `?id=${noteId}&type=email`;
}
