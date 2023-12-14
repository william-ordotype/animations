import Alpine from "alpinejs";
import { StateStore } from "../../utils/enums";
import { setNotesSearched } from "../../actions/notesActions";
import NProgress from "nprogress";

function DocumentsSearch() {
  return {
    handleSearchInput() {
      return {
        ["x-on:input.debounce.250ms"]: async (ev) => {
          const searchValue = ev.target.value;
          NProgress.start();
          try {
            await setNotesSearched(searchValue);
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
