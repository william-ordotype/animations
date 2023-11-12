import Alpine from "alpinejs";
import NotesService from "../services/notesService";
import { StateStore } from "../utils/enums";

function DocumentsSearch() {
  return {
    handleSearchInput() {
      return {
        ["x-on:change"]: async (ev) => {
          Alpine.store("documentsStore").getList.isSearch = true;
          try {
            await Alpine.store("documentsStore").getList.setDocuments({
              noteTitleAndPathologyTitle: ev.target.value,
            });
          } catch (err) {
            console.error(err.message);
            Alpine.store(StateStore.TOASTER).toasterMsg(err, "error");
          }
        },
        ["x-show"]: "true",
        ["x-model"]: "$store.documentsStore.getList.searchValue",
      };
    },
  };
}

export default DocumentsSearch;
