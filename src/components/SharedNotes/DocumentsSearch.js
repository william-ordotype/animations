import Alpine from "alpinejs";
import { StateStore } from "../../utils/enums";
import { setSharedNotesSearched } from "../../actions/sharedNotesActions";
import NProgress from "nprogress";

function DocumentsSearch() {
  return {
    handleSearchInput() {
      return {
        ["x-on:input.debounce.250ms"]: async (ev) => {
          NProgress.start();
          const searchValue = ev.target.value;
          try {
            await setSharedNotesSearched(searchValue);
          } catch (err) {
            console.error(err.message);
            Alpine.store(StateStore.TOASTER).toasterMsg(err, "error");
          }
          NProgress.done();
        },
        ["x-show"]: "true",
        ["x-model"]: "$store.notesStore.searchValue",
      };
    },
  };
}

export default DocumentsSearch;
