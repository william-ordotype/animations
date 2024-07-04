import { setSharedNotesSearched } from "../../actions/sharedNotesActions";
import NProgress from "nprogress";
import Alpine from "alpinejs";
import { StateStore } from "@utils/enums";
import { INotesStore } from "@store/myNotes.store";

function DocumentsSearch() {
  const notesStore = Alpine.store(StateStore.NOTES) as INotesStore;

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
        ["x-model"]: () => {
          return notesStore.searchValue;
        },
      };
    },
  };
}

export default DocumentsSearch;
