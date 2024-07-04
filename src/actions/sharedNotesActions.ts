import Alpine from "alpinejs";

import { NotesUrls, StateStore } from "@utils/enums";
import sharedNotesService from "../services/notesSharesService";
import { INotesStore } from "@store/myNotes.store";
import {
  IToastStore,
  Status_Type,
  STATUS_TYPES,
} from "@store/toaster.store.js";
import shareStore from "@store/share.store.js";

// Invitee: My shared documents
async function setSharedNoteList(payload: ToDo) {
  const noteStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;

  noteStore.isNotesLoading = true;

  const notesRes = await sharedNotesService.getNotes(payload);
  const { items_per_page, items_total, page_number, page_total, data } =
    notesRes.data;

  noteStore.noteList = data;
  noteStore.noteListMeta = {
    pageNumber: page_number,
    pageTotal: page_total,
    itemsTotal: items_total,
    itemsPerPage: items_per_page,
  };
  noteStore.isEmpty = page_total <= 0;
  noteStore.isNotesLoading = false;
}

async function setSharedNoteOpened({ noteId }: ToDo) {
  const noteStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
  noteStore.isNoteLoading = true;
  try {
    const getNoteRes = await sharedNotesService.getNoteByType({
      type: "email",
      id: noteId,
    });
    const { member, note } = getNoteRes.data;
    noteStore.noteOpened = { note, member };
    noteStore.isNoteLoading = false;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function setShowSharedNote({ inviteType, noteId }: ToDo) {
  // ordotype.fr/my-documents-invitation?type=email&id=12345

  const res = await sharedNotesService.getNoteByType({
    type: inviteType,
    id: noteId,
  });
  shareStore.isInvitationLoading = false;

  if (res.status >= 400) {
    shareStore.isInvitedAllowed = false;
    return;
  }

  shareStore.isInvitedAllowed = true;
  if (res.data.note) {
    shareStore.invitationNote = {
      ...res,
    };
  } else {
    shareStore.invitationNote = {
      note: { ...res },
    };
  }
}

async function setSharedNotesSearched(payload: ToDo) {
  const noteStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
  const toastStore = Alpine.store(StateStore.TOASTER) as IToastStore;

  noteStore.isSearch = true;

  try {
    const searchedNotesRes =
      await sharedNotesService.searchSharedNotesByTitleAndPathology({
        noteTitleAndPathologyTitle: payload,
      });
    const { items_per_page, items_total, page_number, page_total, data } =
      searchedNotesRes.data;
    noteStore.noteList = data;
    noteStore.noteListMeta = {
      pageNumber: page_number,
      pageTotal: page_total,
      itemsTotal: items_total,
      itemsPerPage: items_per_page,
    };
  } catch (err) {
    toastStore.toasterMsg(
      window.toastActionMsg.notes.search.error,
      STATUS_TYPES.error
    );
    console.error(err);
  }
}

/**
 *
 * @param {Array<string>} payload.noteIds
 */
async function setRemoveSharedInvitations(payload: { noteIds: string[] }) {
  const toastStore = Alpine.store(StateStore.TOASTER) as IToastStore;
  const { noteIds } = payload;

  const res = await sharedNotesService.removeNoteInvitations({ noteIds });

  if (res.data.deletedCount > 0) {
    toastStore.toasterMsg(
      window.toastActionMsg.shareNotes.removeSharedInvitation.success,
      Status_Type.Success
    );
    await setSharedNoteList({});
  } else {
    toastStore.toasterMsg(
      window.toastActionMsg.shareNotes.removeSharedInvitation.error,
      Status_Type.Error
    );
  }
  return res;
}

async function setCloneNote(payload: ToDo) {
  const toastStore = Alpine.store(StateStore.TOASTER) as IToastStore;

  const { noteId } = payload;
  try {
    await sharedNotesService.cloneSharedNote(noteId, true);

    // Gives the user the option to redirect to my documents page to see the new created document
    // Cloning options usually is inside a sharing page
    toastStore.toasterMsg(
      window.toastActionMsg.shareNotes.cloneNote.success,
      Status_Type.Success,
      4500
    );
    setTimeout(() => {
      location.href = NotesUrls.MY_NOTES;
    }, 1500);
  } catch (err) {
    console.error(err);
    toastStore.toasterMsg(
      window.toastActionMsg.shareNotes.cloneNote.error,
      Status_Type.Error
    );
  }
}

async function setSharedNoteBasicInfo({ id, type }: ToDo) {
  const res = await sharedNotesService.getNoteBasicInfo({
    id,
    type,
  });

  const { title, author } = res.data;

  shareStore.invitationNote = {
    note: {
      title: title,
      author: author,
    },
  };

  shareStore.isInvitedAllowed = false;
  shareStore.isInvitationLoading = false;
}

export {
  setSharedNoteList,
  setSharedNoteOpened,
  setShowSharedNote,
  setSharedNotesSearched,
  setRemoveSharedInvitations,
  setCloneNote,
  setSharedNoteBasicInfo,
};
