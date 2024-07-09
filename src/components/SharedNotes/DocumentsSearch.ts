import { setSharedNotesSearched } from "../../actions/sharedNotesActions";
import NProgress from "nprogress";

function DocumentsSearch() {
  return {
    handleSearchInput() {
      return {
        ["x-on:input.debounce.250ms"]: async (ev: Event) => {
          NProgress.start();
          const searchValue = (<HTMLInputElement>ev.target).value;
          await setSharedNotesSearched(searchValue);
          NProgress.done();
        },
        ["x-show"]: "true",
        ["x-model"]: "$store.notesStore.searchValue",
      };
    },
  };
}

export default DocumentsSearch;
