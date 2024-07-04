// @ts-nocheck

import getFileExtByMimeType from "../assets/file_ext";
import Alpine, { AlpineComponent } from "alpinejs";
import { StateStore } from "@utils/enums";
import { setNoteOpened } from "../actions/notesActions.js";
import { INotesStore } from "@store/myNotes.store";

// ToDo refactor this component to execute only on tab change

function PathologiesNoteList(): AlpineComponent<any> {
  const notesStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
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
            noteStore: notesStore,
            modalStore: Alpine.store(StateStore.MODAL),
          }),
      };
    },
    openDrawerBilan() {
      return {
        ["x-on:click.prevent"]: async () => {
          await setNoteOpened(this.$data.bilan._id, {
            noteStore: notesStore,
            modalStore: Alpine.store(StateStore.MODAL),
          });
        },
        ["x-bind:class"]: () => {
          if (notesStore.isNotesLoading) {
            return "skeleton-loader";
          } else {
            return "";
          }
        },
        ["x-bind:style"]: () => {
          return {
            position: "relative",
            width: "100%",
            "margin-bottom": "10px",
          };
        },
      };
    },
    openDrawerTreatment() {
      return {
        ["x-on:click.prevent"]: async () => {
          await setNoteOpened(this.$data.treatment._id, {
            noteStore: notesStore,
            modalStore: Alpine.store(StateStore.MODAL),
          });
        },
        ["x-bind:class"]: () => {
          if (notesStore.isNotesLoading) {
            return "skeleton-loader";
          } else {
            return "";
          }
        },
        ["x-bind:style"]: () => {
          return {
            position: "relative",
            width: "100%",
            "margin-bottom": "10px",
          };
        },
      };
    },
    openDrawerConseil() {
      return {
        ["x-on:click.prevent"]: async () => {
          await setNoteOpened(this.$data.conseil._id, {
            noteStore: notesStore,
            modalStore: Alpine.store(StateStore.MODAL),
          });
        },

        ["x-bind:class"]: () => {
          if (notesStore.isNotesLoading) {
            return "skeleton-loader";
          } else {
            return "";
          }
        },
        ["x-bind:style"]: () => {
          return {
            position: "relative",
            width: "100%",
            "margin-bottom": "10px",
          };
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
    checkFileIcons(ctx) {
      try {
        const { documents } = ctx;
        const allDocTypes = documents?.map((elem) => {
          return elem.mime_type;
        });
        const uniqueDocTypes = new Set(allDocTypes);
        return [...uniqueDocTypes];
      } catch (e) {
        console.error(e);
      }
    },
    noteFileIconsList() {
      return {
        ["x-init"]: () => {
          // Fix fileIcons not updating when note item updated filesList
          const notesStore = Alpine.store(StateStore.MY_NOTES);
          Alpine.effect(() => {
            if (notesStore.noteList.length > 0) {
              const noteAtIndex = notesStore.noteList[this.index];
              if (noteAtIndex) {
                this.fileIcons = [...this.checkFileIcons(noteAtIndex)];
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
