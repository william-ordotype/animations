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
}

async function setNoteOpened(payload) {
  Alpine.store(StateStore.MY_NOTES).isNoteLoading = true;

  const getNoteRes = await noteService.getOne(payload);
  const { member, note } = getNoteRes;
  Alpine.store(StateStore.MY_NOTES).noteOpened = { note, member };
  Alpine.store(StateStore.MY_NOTES).isNoteLoading = true;
}

export { setNoteList, setNoteOpened };
