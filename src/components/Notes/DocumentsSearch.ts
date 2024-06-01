import Alpine, { AlpineComponent } from "alpinejs";
import { StateStore } from "@utils/enums";
import { setNotesSearched } from "../../actions/notesActions";
import NProgress from "nprogress";
import { INotesStore } from "@store/myNotes.store";
import ChangeEvent = JQuery.ChangeEvent;

function DocumentsSearch(): AlpineComponent<any> {
  return {
    handleSearchInput() {
      return {
        ["x-on:input.debounce.250ms"]: async (ev: ChangeEvent) => {
          NProgress.start();
          const notesStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
          const searchValue = ev.target.value;
          await setNotesSearched(searchValue, { noteStore: notesStore });
          NProgress.done();
        },
        ["x-show"]: "true",
        ["x-model"]: "$store.notesStore.searchValue",
      };
    },
  };
}

export default DocumentsSearch;
