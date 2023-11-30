import Alpine from "alpinejs";

import { NotesUrls, StateStore, ToasterMsgTypes } from "../utils/enums";
import ShareNotesService from "../services/notesSharesService";
import { setNotesRuleStatus } from "./notesActions";

const sharedNotesService = new ShareNotesService();

// Invitee: My shared documents
async function setSharedNoteList(payload) {
  Alpine.store(StateStore.MY_NOTES).isNotesLoading = true;

  const notesRes = await sharedNotesService.getNotes(payload);
  const { items_per_page, items_total, page_number, page_total } = notesRes;
  Alpine.store(StateStore.MY_NOTES).noteList = notesRes.data;
  Alpine.store(StateStore.MY_NOTES).noteListMeta = {
    pageNumber: page_number,
    pageTotal: page_total,
    itemsTotal: items_total,
    itemsPerPage: items_per_page,
  };

  Alpine.store(StateStore.MY_NOTES).isEmpty = page_total <= 0;

  Alpine.store(StateStore.MY_NOTES).isNotesLoading = false;

  await setNotesRuleStatus();
}

async function setSharedNoteOpened({ noteId }) {
  Alpine.store(StateStore.MY_NOTES).isNoteLoading = true;
  try {
    const getNoteRes = await sharedNotesService.getNoteByType({
      type: "email",
      id: noteId,
    });
    const { member, note } = getNoteRes;
    Alpine.store(StateStore.MY_NOTES).noteOpened = { note, member };
    Alpine.store(StateStore.MY_NOTES).isNoteLoading = false;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function setShowSharedNote({ inviteType, noteId }) {
  // ordotype.fr/my-documents-invitation?type=email&id=12345

  const res = await sharedNotesService.getNoteByType({
    type: inviteType,
    id: noteId,
  });
  Alpine.store(StateStore.SHARE).isInvitationLoading = false;

  if (res.status) {
    Alpine.store(StateStore.SHARE).isInvitedAllowed = false;
    return;
  }

  Alpine.store(StateStore.SHARE).isInvitedAllowed = true;
  Alpine.store(StateStore.SHARE).invitationNote = {
    ...res,
  };
}

async function setSharedNotesSearched(payload) {
  Alpine.store(StateStore.MY_NOTES).isSearch = true;

  try {
    const searchedNotesRes =
      await sharedNotesService.searchSharedNotesByTitleAndPathology({
        noteTitleAndPathologyTitle: payload,
      });
    const { items_per_page, items_total, page_number, page_total } =
      searchedNotesRes;
    Alpine.store(StateStore.MY_NOTES).noteList = searchedNotesRes.data;
    Alpine.store(StateStore.MY_NOTES).noteListMeta = {
      pageNumber: page_number,
      pageTotal: page_total,
      itemsTotal: items_total,
      itemsPerPage: items_per_page,
    };
  } catch (err) {
    Alpine.store(StateStore.TOASTER).toasterMsg(
      "Search error",
      ToasterMsgTypes.ERROR
    );
    console.error(err);
  }
}

/**
 *
 * @param {Array<string>} payload.noteIds
 * @return {Promise<void>}
 */
async function setRemoveSharedInvitations(payload) {
  const { noteIds } = payload;

  const res = await sharedNotesService.removeNoteInvitations({ noteIds });

  if (res.deletedCount > 0) {
    Alpine.store(StateStore.TOASTER).toasterMsg(
      "Document supprimé",
      ToasterMsgTypes.SUCCESS
    );
  } else {
    Alpine.store(StateStore.TOASTER).toasterMsg(
      "Erreur lors de la suppression du document",
      ToasterMsgTypes.ERROR
    );
  }
}

async function setCloneNote(payload) {
  const { noteId } = payload;
  try {
    await sharedNotesService.cloneSharedNote(noteId, true);

    // Gives the user the option to redirect to my documents page to see the new created document
    // Cloning options usually is inside a sharing page
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
    console.log(err);
    Alpine.store(StateStore.TOASTER).toasterMsg(
      "Erreur de clonage du document",
      ToasterMsgTypes.ERROR
    );
  }
}

export {
  setSharedNoteList,
  setSharedNoteOpened,
  setShowSharedNote,
  setSharedNotesSearched,
  setRemoveSharedInvitations,
  setCloneNote,
};
