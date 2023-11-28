import Alpine from "alpinejs";
import { hashToObject } from "../../../router/pagination";
import ShareNotesService from "../../../services/notesSharesService";
import { StateStore, ToasterMsgTypes } from "../../../utils/enums";
import NProgress from "nprogress";
import { setShowSharedNote } from "../../../actions/sharedNotesActions";

const shareNoteService = new ShareNotesService();

function router() {
  return {
    async home(context) {
      const { query } = context;
      const obj = hashToObject(query);
      const inviteId = obj["id"];
      const inviteType = obj["type"];
      const acceptId = obj["acceptId"];
      try {
        if (acceptId) {
          await acceptInvitation(acceptId);
        } else if (inviteType && inviteId !== "undefined") {
          await setShowSharedNote({ inviteType, noteId: inviteId });
        } else {
          Alpine.store(StateStore.TOASTER).toasterMsg(
            "URL invalide",
            ToasterMsgTypes.ERROR,
            10000
          );
          console.error("Invalid URL. Missing type or id");
        }
      } catch (err) {
        Alpine.store(StateStore.SHARE).isInvitedAllowed = false;
        Alpine.store(StateStore.SHARE).isInvitationLoading = false;
      }
      NProgress.done();
    },
    notfound(context) {
      Alpine.store(StateStore.TOASTER).toasterMsg(
        "Not found",
        ToasterMsgTypes.ERROR
      );
    },
  };
}

export { router };

function notfound(context) {
  Alpine.store(StateStore.TOASTER).toasterMsg(
    "Not found",
    ToasterMsgTypes.ERROR
  );
  console.log("not foundd");
}

async function acceptInvitation(acceptId) {
  // ordotype.fr/my-documents-invitation?acceptId=12345
  const res = await shareNoteService.acceptNoteInvitation({ noteId: acceptId });
  NProgress.set(0.5);

  const { noteId } = res;
  location.href = `?id=${noteId}&type=email`;
  await showSharedNote({
    inviteType: "email",
    noteId,
  });
}
