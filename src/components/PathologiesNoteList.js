import getFileExtByMimeType from "../assets/file_ext";
import Alpine from "alpinejs";
import { StateStore } from "../utils/enums";

function PathologiesNoteList() {
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
        ["x-on:click.prevent"]: `await window.globals.drawer.handleDrawer({ id: doc._id })`,
      };
    },
    openDrawerBilan() {
      return {
        ["x-on:click.prevent"]: `await window.globals.drawer.handleDrawer({ id: bilan._id })`,
      };
    },
    openDrawerTreatment() {
      return {
        ["x-on:click.prevent"]: `await window.globals.drawer.handleDrawer({ id: treatment._id })`,
      };
    },
    openDrawerConseil() {
      return {
        ["x-on:click.prevent"]: `await window.globals.drawer.handleDrawer({ id: conseil._id })`,
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
