import { setCloneNote } from "../../actions/sharedNotesActions";
import { StateStore } from "@utils/enums.js";

function DataTableListItemSubmenu() {
  return {
    removeSharedNote(note) {
      return {
        ["x-show"]: "true",
        ["@click.prevent"]: async function () {
          const noteId = this.note._id;
          Alpine.store(StateStore.MODAL).removeShareNoteList = [noteId];
          console.log("remove share modal");
          Alpine.store(
            StateStore.MODAL
          ).showBeforeRemoveSharedInvitation = true;
        },
      };
    },
    cloneSharedNote(note) {
      return {
        ["x-show"]: "true",
        ["@click.prevent"]: async (ev) => {
          const noteId = note._id;
          await setCloneNote({ noteId });
        },
      };
    },
  };
}

export { DataTableListItemSubmenu };
