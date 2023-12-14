import {
  setCloneNote,
  setRemoveSharedInvitations,
  setSharedNoteList,
} from "../../actions/sharedNotesActions";
import { ShareStates, StateStore } from "../../utils/enums";

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
