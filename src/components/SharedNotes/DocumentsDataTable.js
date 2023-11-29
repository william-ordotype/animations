import {
  setCloneNote,
  setRemoveSharedInvitations,
} from "../../actions/sharedNotesActions";

function DataTableListItemSubmenu() {
  return {
    removeSharedNote(note) {
      return {
        ["x-show"]: "true",
        ["@click.prevent"]: async function () {
          const noteId = note._id;
          await setRemoveSharedInvitations({ noteIds: [noteId] });
        },
      };
    },
    cloneSharedNote(note) {
      return {
        ["x-show"]: "true",
        ["@click.prevent"]: async (ev) => {
          debugger;
          const noteId = note._id;
          await setCloneNote({ noteId });
        },
      };
    },
  };
}

export { DataTableListItemSubmenu };
