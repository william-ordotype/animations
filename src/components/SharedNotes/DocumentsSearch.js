import Alpine from "alpinejs";
import { StateStore } from "../../utils/enums";
import { setSharedNotesSearched } from "../../actions/sharedNotesActions";

function DocumentsSearch() {
  return {
    handleSearchInput() {
      return {
        ["x-on:change"]: async (ev) => {
          const searchValue = ev.target.value;
          try {
            await setSharedNotesSearched(searchValue);
          } catch (err) {
            console.error(err.message);
            Alpine.store(StateStore.TOASTER).toasterMsg(err, "error");
          }
        },
        ["x-show"]: "true",
        ["x-model"]: "$store.notesStore.searchValue",
      };
    },
  };
}

export default DocumentsSearch;
