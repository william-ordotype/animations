import Alpine from "alpinejs";

import { StateStore } from "../utils/enums";
import NotesService from "../services/notesService";
const noteService = new NotesService();

async function setNoteList(payload) {
  Alpine.store(StateStore.MY_NOTES).isNotesLoading = true;

  const notesRes = await noteService.getList(payload);
  const { items_per_page, items_total, page_number, page_total } = notesRes;
  Alpine.store(StateStore.MY_NOTES).noteList = notesRes.data;
  Alpine.store(StateStore.MY_NOTES).noteListMeta = {
    pageNumber: page_number,
    pageTotal: page_total,
    itemsTotal: items_total,
    itemsPerPage: items_per_page,
  };
  Alpine.store(StateStore.MY_NOTES).isEmpty = page_total <= 0;

  Alpine.store(StateStore.MY_NOTES).noteListType = payload.type;

  Alpine.store(StateStore.MY_NOTES).isNotesLoading = false;
  await setNotesRuleStatus();
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

export { setNoteList, setNoteOpened, setNotesRuleStatus, setNotesSearched };
