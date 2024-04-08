import Alpine from "alpinejs";

import { NotesUrls, StateStore } from "@utils/enums";
import NotesService from "@services/notesService";
import { INotesStore } from "@store/myNotes.store";
import { IToastStore } from "@store/toaster.store";
import { IUserStore } from "@store/user.store";
import { handleCloseDrawer } from "@components/Notes/DocumentsDrawer.js";

const noteService = new NotesService();

async function setNoteList(payload: ToDo) {
  const noteStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
  const toastStore = Alpine.store(StateStore.TOASTER) as IToastStore;

  noteStore.isNotesLoading = true;
  try {
    const notesRes = await noteService.getList(payload);

    const {
      items_per_page,
      items_total,
      page_number,
      page_total,
      sort,
      direction,
      pathology_slug,
      data,
    } = notesRes.data;

    noteStore.noteList = data;
    noteStore.noteListMeta = {
      pageNumber: page_number,
      pageTotal: page_total,
      itemsTotal: items_total,
      itemsPerPage: items_per_page,
      sort,
      direction,
      pathology_slug,
    };
    noteStore.isEmpty = page_total <= 0;

    noteStore.noteListType = payload.type;

    noteStore.isNotesLoading = false;
  } catch (err) {
    toastStore.toasterMsg(window.toastActionMsg.notes.list.error, "error");
  }
}

async function setNoteOpened(payload: ToDo) {
  const noteStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
  const toastStore = Alpine.store(StateStore.TOASTER) as IToastStore;

  // @ts-ignore ToDo remove
  Alpine.store("modalStore").showModal = false;

  noteStore.isNoteLoading = true;
  noteStore.drawerOpened = true;
  try {
    const getNoteRes = await noteService.getOne(payload);
    const { member, note } = getNoteRes.data;
    noteStore.noteOpened = { note, member };
    noteStore.isNoteLoading = false;
  } catch (err) {
    noteStore.drawerOpened = false;
    toastStore.toasterMsg("Document introuvable", "error", 4500);
    console.error(err);
  }
}

// @ts-ignore
async function createNote(payload) {
  // TODO NewEditor: handle side effects
}

// @ts-ignore
async function editNote(payload) {
  // TODO NewEditor: handle side effects
}

async function setNotesRuleStatus() {
  const noteStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
  const userStore = Alpine.store(StateStore.USER) as IUserStore;

  try {
    noteStore.isRuleStatusLoading = true;
    if (!userStore.isAuth) {
      return;
    }
    const response = await noteService.getRulesStatus();

    const consumedNotesNumber =
      response.data.allowedNumberOfNotes - response.data.numberOfRemainingNotes;
    const consumedMegabytesNumber =
      response.data.allowedMegabyte - response.data.numberOfMegabyteRemaining;

    const currentStatus = {
      consumedNotesNumber:
        response.data.allowedNumberOfNotes -
        response.data.numberOfRemainingNotes,
      consumedMegabytesNumber:
        response.data.allowedMegabyte - response.data.numberOfMegabyteRemaining,
      allowedNumberOfNotes: response.data.allowedNumberOfNotes,
      allowedMegabyte: response.data.allowedMegabyte,
      consumedNotesPercent:
        (consumedNotesNumber / response.data.allowedNumberOfNotes) * 100,
      consumedMegabytesPercent:
        (consumedMegabytesNumber / response.data.allowedMegabyte) * 100,
    };

    noteStore.currentRuleStatus = {
      ...currentStatus,
    };
    noteStore.isRuleStatusLoading = false;
  } catch (err) {
    console.error(err);
  }
}

async function setNotesSearched(payload: string) {
  const noteStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;

  noteStore.isSearch = true;

  const searchedNotesRes =
    await noteService.searchNotesByTitleAndPathologyTitle({
      noteTitleAndPathologyTitle: payload,
    });
  const { items_per_page, items_total, page_number, page_total } =
    searchedNotesRes.data;

  noteStore.noteList = searchedNotesRes.data.data;
  noteStore.noteListMeta = {
    direction: "DESC",
    sort: "created_on",
    pageNumber: page_number,
    pageTotal: page_total,
    itemsTotal: items_total,
    itemsPerPage: items_per_page,
  };
}

async function setDeleteNotes(payload: { noteIds: string[] }) {
  const { noteIds } = payload;
  const noteStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
  const toastStore = Alpine.store(StateStore.TOASTER) as IToastStore;
  // ToDo review delete in List and Drawer
  let body: string[] = [];
  if (noteIds && Array.isArray(noteIds)) {
    body = [...noteIds];
  } else {
    throw new Error("NoteIds not array");
  }
  try {
    const res = await noteService.deleteMany({ noteIds: body });
    const documentType = noteStore.noteListType;
    const pageNumber = noteStore.noteListMeta?.pageNumber || 1;
    if (res.data.deletedCount > 0) {
      // @ts-ignore
      if (noteStore.drawerOpened) {
        // @ts-ignore
        await handleCloseDrawer();

        if (location.href.includes(NotesUrls.MY_NOTES)) {
          const redirectUrl = `/list?type=${
            documentType ? documentType : "all"
          }${pageNumber && "&page=" + pageNumber}`;
          // Redirect to list
          window.PineconeRouter.currentContext.redirect(redirectUrl);
        }
      }

      toastStore.toasterMsg(
        window.toastActionMsg.notes.delete.success,
        "success"
      );
      await setNoteList({
        page: pageNumber || 1,
        type: documentType ? documentType : "",
        sort: noteStore.noteListMeta.sort,
        direction: noteStore.noteListMeta.direction,
      });
    } else {
      toastStore.toasterMsg(window.toastActionMsg.notes.delete.error, "error");
      return;
    }

    noteStore.noteOpened = {
      note: null,
      member: null,
    };

    noteStore.removeShareNoteList = [];
    noteStore.deleteList = [];

    return res;
  } catch (err) {
    toastStore.toasterMsg(window.toastActionMsg.notes.delete.error, "error");
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
