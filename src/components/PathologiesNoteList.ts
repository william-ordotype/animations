// @ts-nocheck

import getFileExtByMimeType from "../assets/file_ext";
import Alpine, { AlpineComponent } from "alpinejs";
import { StateStore } from "@utils/enums";
import { setNoteOpened } from "../actions/notesActions.js";
import { INotesStore } from "@store/myNotes.store";

// ToDo refactor this component to execute only on tab change

function PathologiesNoteList(): AlpineComponent<any> {
  const noteStore = Alpine.store(StateStore.NOTES) as INotesStore;
  return {
    // Binders
    openNotesModal() {
      return {
        ["x-on:click"]:
          "Alpine.store('modalStore').openModal(null, {type: 'notes'})",
      };
    },
    openPrescription() {
      return {
        ["x-on:click"]:
          "Alpine.store('modalStore').openModal(null, {type: 'prescriptions'})",
      };
    },
    openRecomendationModal() {
      return {
        ["x-on:click"]:
          "Alpine.store('modalStore').openModal(null, {type: 'recommendations'})",
      };
    },
    openDrawer() {
      return {
        ["x-on:click.prevent"]: async () =>
          await setNoteOpened(this.$data.doc._id, {
            noteStore: noteStore,
            modalStore: Alpine.store(StateStore.MODAL),
          }),
      };
    },
    openDrawerBilan() {
      return {
        ["x-on:click.prevent"]: async () => {
          await setNoteOpened(this.$data.bilan._id, {
            noteStore: noteStore,
            modalStore: Alpine.store(StateStore.MODAL),
          });
        },
      };
    },
    openDrawerTreatment() {
      return {
        ["x-on:click.prevent"]: async () => {
          await setNoteOpened(this.$data.treatment._id, {
            noteStore: noteStore,
            modalStore: Alpine.store(StateStore.MODAL),
          });
        },
      };
    },
    openDrawerConseil() {
      return {
        ["x-on:click.prevent"]: async () => {
          await setNoteOpened(this.$data.conseil._id, {
            noteStore: noteStore,
            modalStore: Alpine.store(StateStore.MODAL),
          });
        },
      };
    },
  };
}

function PathologiesNoteItem() {
  return {
    // file icons
    fileIcons: [],
    fileIconType(mime_type) {
      return getFileExtByMimeType[mime_type] || "file";
    },

    // Sets file icon variables on load
    checkFileIcons() {
      const ctx =
        this.notes || this.doc || this.bilan || this.treatment || this.conseil;

      const { documents } = ctx;
      const allDocTypes = documents.map((elem) => {
        return elem.mime_type;
      });
      const uniqueDocTypes = new Set(allDocTypes);
      return [...uniqueDocTypes];
    },
    noteFileIconsList() {
      return {
        ["x-init"]: () => {
          // Fix fileIcons not updating when note item updated filesList
          const notesStore = Alpine.store(StateStore.MY_NOTES);
          Alpine.effect(() => {
            if (notesStore.noteList) {
              const ctx =
                this.notes ||
                this.doc ||
                this.bilan ||
                this.treatment ||
                this.conseil;

              const noteAtIndex = notesStore.noteList[this.index];
              if (noteAtIndex) {
                this.fileIcons = [...this.checkFileIcons(ctx)];
              }
            }
          });
        },
        ["x-for"]: "icon in fileIcons",
      };
    },
  };
}

export { PathologiesNoteList, PathologiesNoteItem };
