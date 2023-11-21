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

  Alpine.store(StateStore.MY_NOTES).isNotesLoading = false;
}

export { setNoteList };
