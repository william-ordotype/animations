import Alpine from "alpinejs";
import { hashToObject } from "../../../router/pagination";
import ShareNotesService from "../../../services/notesSharesService";
import { StateStore, ToasterMsgTypes } from "../../../utils/enums";
import NProgress from "nprogress";

const shareNoteService = new ShareNotesService();

function router() {
  return {
    async home(context) {
      const { query } = context;
      const obj = hashToObject(query);
      const inviteId = obj["id"];
      const inviteType = obj["type"];
      const acceptId = obj["acceptId"];
      debugger;
      try {
        if (acceptId) {
          await acceptInvitation(acceptId);
          NProgress.done();
        } else if (inviteType && inviteId) {
          debugger;
          await showSharedNote({ inviteType, noteId: inviteId });
          NProgress.done();
        } else {
          Alpine.store(StateStore.TOASTER).toasterMsg(
            "No id found",
            ToasterMsgTypes.ERROR
          );
          console.error("No id found");
          NProgress.done();
        }
      } catch (err) {
        Alpine.store(StateStore.SHARE).isInvitedAllowed = false;
        Alpine.store(StateStore.SHARE).isInvitationLoading = false;
        NProgress.done();
      }
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
  debugger;
  const { noteId } = res;
  location.href = `?id=${noteId}&type=email`;
  await showSharedNote({
    inviteType: "email",
    noteId,
  });
}

async function showSharedNote({ inviteType, noteId }) {
  // ordotype.fr/my-documents-invitation?type=email&id=12345
  const res = await shareNoteService.getNoteByType({
    type: inviteType,
    id: noteId,
  });
  Alpine.store(StateStore.SHARE).isInvitedAllowed = true;
  Alpine.store(StateStore.SHARE).isInvitationLoading = false;
  Alpine.store(StateStore.SHARE).invitationNote = {
    ...res,
  };
}
