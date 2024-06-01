import Alpine from "alpinejs";

import { NotesUrls, StateStore } from "@utils/enums";
import NotesService from "@services/notesService";
import { INotesStore } from "@store/myNotes.store";
import { IToastStore } from "@store/toaster.store";
import { IUserStore } from "@store/user.store";
import { handleCloseDrawer } from "@components/Notes/DocumentsDrawer.js";
import toasterActions from "./toasterActions";
import { InferType } from "yup";
import { getListSchema } from "../validation/notesValidation";

const noteService = new NotesService();

async function setNoteList(
  payload: InferType<typeof getListSchema>,
  store: { noteStore: INotesStore }
) {
  const { noteStore } = store;

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

    noteStore.noteListType = payload.type || "";

    noteStore.isNotesLoading = false;
    return noteStore;
  } catch (err) {
    toasterActions.setToastMessage(
      window.toastActionMsg.notes.list.error,
      "error"
    );
    console.error(err);
  }
}

async function setNoteOpened(
  noteId: string,
  store: { noteStore: INotesStore; modalStore: any }
) {
  const { noteStore, modalStore } = store;

  // ToDo remove
  modalStore.showModal = false;

  noteStore.isNoteLoading = true;
  noteStore.drawerOpened = true;
  try {
    const getNoteRes = await noteService.getOne(noteId);
    const { member, note } = getNoteRes.data;
    noteStore.noteOpened = { note, member };
    noteStore.isNoteLoading = false;
    return noteStore;
  } catch (err) {
    noteStore.drawerOpened = false;
    toasterActions.setToastMessage("Document introuvable", "error", 4500);
    console.error(err);
  }
}

async function setNotesRuleStatus(store: {
  noteStore: INotesStore;
  userStore: IUserStore;
}) {
  const { noteStore, userStore } = store;

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
    return noteStore;
  } catch (err) {
    console.error(err);
  }
}

async function setNotesSearched(
  payload: string,
  store: { noteStore: INotesStore }
) {
  const { noteStore } = store;
  try {
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
  } catch (error) {
    if (error instanceof Error) {
      toasterActions.setToastMessage(error.message, "error");
    }
    console.error(error);
  }
}

async function setMixedNotesLists(payload, store: { noteStore: INotesStore }) {
  const { noteStore } = store;

  try {
  } catch (error) {
    if (error instanceof Error) {
      toasterActions.setToastMessage(error.message, "error");
    }
    console.error(error);
  }
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
      if (noteStore.drawerOpened) {
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
      await setNoteList(
        {
          page: pageNumber,
          type: documentType || "",
          sort: noteStore.noteListMeta.sort || "created_on",
          direction: noteStore.noteListMeta.direction || "DESC",
          limit: noteStore.noteListMeta.itemsPerPage || 10,
        },
        { noteStore }
      );
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
