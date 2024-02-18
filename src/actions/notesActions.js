import Alpine from "alpinejs";

import { NotesUrls, StateStore, ToasterMsgTypes } from "../utils/enums";
import NotesService from "../services/notesService";
const noteService = new NotesService();

/**
 *
 * @param {Object} payload
 * @return {Promise<void>}
 */
async function setNoteList(payload) {
  Alpine.store(StateStore.MY_NOTES).isNotesLoading = true;
  try {
    const notesRes = await noteService.getList(payload);
    debugger;
    const {
      items_per_page,
      items_total,
      page_number,
      page_total,
      sort,
      direction,
    } = notesRes;
    Alpine.store(StateStore.MY_NOTES).noteList = notesRes.data;
    Alpine.store(StateStore.MY_NOTES).noteListMeta = {
      pageNumber: page_number,
      pageTotal: page_total,
      itemsTotal: items_total,
      itemsPerPage: items_per_page,
      sort,
      direction,
    };
    Alpine.store(StateStore.MY_NOTES).isEmpty = page_total <= 0;

    Alpine.store(StateStore.MY_NOTES).noteListType = payload.type;

    Alpine.store(StateStore.MY_NOTES).isNotesLoading = false;
    if (
      location.href.includes(NotesUrls.MY_NOTES) ||
      location.href.includes("my-notes")
    ) {
      await setNotesRuleStatus();
    }
  } catch (err) {
    Alpine.store(StateStore.TOASTER).toasterMsg(
      window.toastActionMsg.notes.list.error,
      ToasterMsgTypes.ERROR
    );
  }
}

async function setNoteOpened(payload) {
  Alpine.store(StateStore.MY_NOTES).isNoteLoading = true;
  try {
    const getNoteRes = await noteService.getOne(payload);
    const { member, note } = getNoteRes;
    Alpine.store(StateStore.MY_NOTES).noteOpened = { note, member };
    Alpine.store(StateStore.MY_NOTES).isNoteLoading = false;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function createNote(payload) {
  // TODO handle side effects from modal using
}

async function editNote(payload) {
  // TODO handle side effects from modal
}

async function setNotesRuleStatus() {
  try {
    Alpine.store(StateStore.MY_NOTES).isRuleStatusLoading = true;
    if (!Alpine.store(StateStore.USER).isAuth) {
      return;
    }
    const response = await noteService.getRulesStatus();

    const consumedNotesNumber =
      response.allowedNumberOfNotes - response.numberOfRemainingNotes;
    const consumedMegabytesNumber =
      response.allowedMegabyte - response.numberOfMegabyteRemaining;

    const currentStatus = {
      consumedNotesNumber:
        response.allowedNumberOfNotes - response.numberOfRemainingNotes,
      consumedMegabytesNumber:
        response.allowedMegabyte - response.numberOfMegabyteRemaining,
      allowedNumberOfNotes: response.allowedNumberOfNotes,
      allowedMegabyte: response.allowedMegabyte,
      consumedNotesPercent:
        (consumedNotesNumber / response.allowedNumberOfNotes) * 100,
      consumedMegabytesPercent:
        (consumedMegabytesNumber / response.allowedMegabyte) * 100,
    };

    Alpine.store(StateStore.MY_NOTES).currentRuleStatus = {
      ...currentStatus,
    };
    Alpine.store(StateStore.MY_NOTES).isRuleStatusLoading = false;
  } catch (err) {
    console.error(err);
  }
}

async function setNotesSearched(payload) {
  Alpine.store(StateStore.MY_NOTES).isSearch = true;

  const searchedNotesRes =
    await noteService.searchNotesByTitleAndPathologyTitle({
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
}

async function setDeleteNotes(payload) {
  const { noteIds } = payload;
  const noteStore = Alpine.store(StateStore.MY_NOTES);
  const drawerStore = Alpine.store("drawerStore");
  const toasterStore = Alpine.store(StateStore.TOASTER);

  let body;
  if (Array.isArray(noteIds)) {
    if (noteIds.note) {
      // If docsToDelete is from the getOne request, use the note property and convert to array
      body = [noteIds.note];
    } else {
      body = [...noteIds];
    }
  }
  try {
    const res = await noteService.deleteMany({ noteIds: body });
    const documentType = noteStore.noteListType;
    const pageNumber = noteStore.noteListMeta?.pageNumber || 1;
    if (res.deletedCount > 0) {
      if (drawerStore.showDrawer === true) {
        drawerStore.hideDrawer();

        if (location.href.includes(NotesUrls.MY_NOTES)) {
          const redirectUrl = `/list?type=${
            documentType ? documentType : "all"
          }${pageNumber && "&page=" + pageNumber}`;
          if (PineconeRouter) {
            // Redirect to list
            PineconeRouter.currentContext.redirect(redirectUrl);
          }
        }
      }

      toasterStore.toasterMsg(
        window.toastActionMsg.notes.delete.success,
        ToasterMsgTypes.SUCCESS
      );
      await setNoteList({
        page: pageNumber || 1,
        type: documentType ? documentType : "all",
        sort: noteStore.noteListMeta.sort,
        direction: noteStore.noteListMeta.direction,
      });
    } else {
      toasterStore.toasterMsg(
        window.toastActionMsg.notes.delete.error,
        ToasterMsgTypes.ERROR
      );
      return;
    }

    noteStore.noteOpened = {
      note: {},
      member: {},
    };

    noteStore.removeShareNoteList = [];
    noteStore.deleteList = [];

    return res;
  } catch (err) {
    toasterStore.toasterMsg(
      window.toastActionMsg.notes.delete.error,
      ToasterMsgTypes.ERROR
    );
    console.error(err);
  }
}

export {
  setNoteList,
  setNoteOpened,
  setNotesRuleStatus,
  setNotesSearched,
  setDeleteNotes,
};
