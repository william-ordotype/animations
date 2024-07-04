import Alpine from "alpinejs";
import { setCloneNote } from "../../actions/sharedNotesActions";
import { StateStore } from "@utils/enums.js";

/**
 * @return {import("alpinejs").AlpineComponent<any>}
 */
function DataTableListItemSubmenu() {
  return {
    removeSharedNote() {
      return {
        ["x-show"]: "true",
        ["@click.prevent"]: async () => {
          const noteId = this.$data.note._id;
          Alpine.store(StateStore.MODAL).removeShareNoteList = [noteId];
          console.log("remove share modal");
          Alpine.store(
            StateStore.MODAL
          ).showBeforeRemoveSharedInvitation = true;
        },
      };
    },
    /**
     * @param {{ _id: any; }} note
     */
    cloneSharedNote(note) {
      return {
        ["x-show"]: "true",
        ["@click.prevent"]: async () => {
          const noteId = note._id;
          await setCloneNote({ noteId });
        },
      };
    },
  };
}

export { DataTableListItemSubmenu };
