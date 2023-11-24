import Alpine from "alpinejs";

import { StateStore } from "../utils/enums";
import ShareNotesService from "../services/notesSharesService";

const sharedNotesService = new ShareNotesService();

async function setSharedNoteList(payload) {
  Alpine.store(StateStore.MY_NOTES).isNotesLoading = true;

  const notesRes = await sharedNotesService.getList(payload);
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
}

export { setSharedNoteList };
