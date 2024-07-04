import Alpine from "alpinejs";

import { NotesUrls, StateStore } from "@utils/enums";
import noteService from "@services/notesService";

import { INotesStore, PathologyTab } from "@store/myNotes.store";
import { IToastStore } from "@store/toaster.store";
import { IUserStore } from "@store/user.store";
import { handleCloseDrawer } from "@components/Notes/DocumentsDrawer";
import toasterActions from "./toasterActions";
import { InferType } from "yup";
import { getListSchema } from "../validation/notesValidation";
import { isCancel } from "axios";
import { getNotesFromPathologyTab } from "@components/view/pathology-tabs/pathologyTab.controller";

/**
 * Populates noteList and noteMeta
 */
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

/**
 * Deprecated. Populates noteOpened and also modal store
 */

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

/**
 * Populates noteOpened
 */

async function setNoteItemOpen(
  noteId: string,
  store: { noteStore: INotesStore }
) {
  const { noteStore } = store;
  noteStore.isNoteLoading = true;
  try {
    const res = await noteService.getOne(noteId);
    const { member, note } = res.data;
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

/**
 * Populates NoteList "shared with" and "created by" the user
 */
async function setMixedNotesList(
  payload: {
    page?: number;
    limit?: number;
    type: "" | "notes" | "prescriptions" | "recommendations";
    prescription_type?: "" | "balance_sheet" | "treatment";
    pathology_slug: string;
    withShares?: boolean;
  },
  store: { noteStore: INotesStore }
) {
  const { noteStore } = store;
  try {
    noteStore.isNotesLoading = true;
    const res = await noteService.getNotesOwnedAndSharedWithMe(payload);
    const { items_per_page, items_total, page_number, page_total, data } =
      res.data;

    // intercepts network response and return to the NoteList store unique documents mime_types
    data.forEach((noteItem) => {
      if (noteItem.documents && noteItem.documents.length > 0) {
        const seen = new Set();
        noteItem.documents = noteItem.documents.filter((doc) => {
          if (seen.has(doc.mime_type)) {
            return false;
          } else {
            seen.add(doc.mime_type);
            return true;
          }
        });
      }
    });

    noteStore.noteList = data;
    noteStore.noteListMeta = {
      pageNumber: page_number,
      pageTotal: page_total,
      itemsTotal: items_total,
      itemsPerPage: items_per_page,
    };

    noteStore.isEmpty = page_total <= 0;
    noteStore.isNotesLoading = false;

    return noteStore;
  } catch (error) {
    if (isCancel(error)) {
      return null;
    } else if (error instanceof Error) {
      toasterActions.setToastMessage(error.message, "error");
    }
    console.error(error);
  }
}

async function setRemoveNotes(
  payload: { noteIds: string[] },
  store: { noteStore: INotesStore }
) {
  const { noteIds } = payload;
  const { noteStore } = store;
  try {
    await noteService.deleteMany({ noteIds });
    noteStore.noteOpened = {
      note: null,
      member: null,
    };

    noteStore.removeShareNoteList = [];
    noteStore.deleteList = [];
  } catch (err) {
    throw new Error("NoteIds not array");
  }
}

/**
 * Deprecated. Removes notes from store and server
 */
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

      // If modal is open from pathologies page refresh the
      // getList filtered by the pathology slug
      if (window.location.pathname.includes("/pathologies")) {
        const notesStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
        const pathologySlug =
          import.meta.env.MODE === "development"
            ? "acne"
            : location.href.split("/")[4]!;

        await getNotesFromPathologyTab(
          pageNumber,
          notesStore.pathologyActiveTab as PathologyTab,
          pathologySlug,
          notesStore
        );
        return;
      }

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
  setNoteItemOpen,
  setNotesRuleStatus,
  setNotesSearched,
  setDeleteNotes,
  setMixedNotesList,
  setRemoveNotes,
};
