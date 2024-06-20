import Alpine, { AlpineComponent } from "alpinejs";
import {
  isNoteShared,
  canShowActiveTab,
  switchActiveTab,
  getMimeType,
} from "@components/view/pathology-tabs/pathologyTab.controller";
import { INotesStore, PathologyTab } from "@store/myNotes.store";
import { StateStore } from "@utils/enums";
import {
  setMixedNotesList,
  setNoteItemOpen,
} from "../../../actions/notesActions";
import { FileData, NoteList } from "@interfaces/apiTypes/notesTypes";
import { SharedWithMeNoteList } from "@interfaces/apiTypes/notesSharesTypes";
import getFileExtByMimeType from "@assets/file_ext";
import { IUserStore } from "@store/user.store";
import { PathologyItem } from "@interfaces/apiTypes/pathologiesTypes";

export type PathologyTabListOptions = {
  tab: (pathologyTab: PathologyTab) => void;
};

export function PathologyTabList(): AlpineComponent<PathologyTabListOptions> {
  const notesStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
  return {
    tab(pathologyTab) {
      return {
        ["x-on:click.prevent"]: () => {
          switchActiveTab(pathologyTab, notesStore);
        },
      };
    },
  };
}

type PathologyPaneListOptions = {
  /**
   *  TabPane should be the parent binder for each `w-tab-pane`
   * - only allows the active pane to render from the store
   *   preventing unnecessary undefined from inactive pane instances.
   */
  tabPane: () => object;
  /**
   * Direct child for `PathologyPaneList` component.
   * If noteList is loading it iterates over a static value (10) to show skeleton loading
   */
  noteListIterator: () => object;
  /**
   * Direct child for `noteListIterator` component
   * Handles skeleton loading class state when notes are loading
   */
  noteElement: () => object;
  /**
   * Direct child of noteElement
   */
  noteTitle: () => object;
  fileIconIterator: () => object;
  fileIconElement: () => object;

  isNoteSharedIcon: () => object;

  layout: {
    isEmpty: () => object;
    isNotEmpty: () => object;
  };

  // -------- Internal Objects

  /**
   * Available in $data. Object iteration inside the NoteList component.
   */
  noteItem?: (NoteList | SharedWithMeNoteList) | number;

  /**
   * Available in $data. Object iteration from noteItem documents array.
   */
  fileIcon?: { mime_type: keyof typeof getFileExtByMimeType };
};

export function PathologyPaneList(
  pathologyTab: PathologyTab
): AlpineComponent<PathologyPaneListOptions> {
  const notesStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
  const userStore = Alpine.store(StateStore.USER) as IUserStore;

  return {
    init() {
      const pathologySlug = notesStore.noteListMeta.pathology_slug || "acne";
      Alpine.effect(async () => {
        const isCurrentTabActive = canShowActiveTab(pathologyTab, notesStore);
        if (isCurrentTabActive) {
          console.log("call notes", pathologyTab);
          if (
            pathologyTab === "balance_sheet" ||
            pathologyTab === "treatment"
          ) {
            await setMixedNotesList(
              {
                page: 1,
                limit: 10,
                pathology_slug: pathologySlug,
                type: "prescriptions",
                prescription_type: pathologyTab,
              },
              {
                noteStore: notesStore,
              }
            );
          } else {
            await setMixedNotesList(
              {
                page: 1,
                limit: 10,
                pathology_slug: "acne",
                type: pathologyTab,
                prescription_type: "",
              },
              {
                noteStore: notesStore,
              }
            );
          }
        }
      });
    },
    layout: {
      isEmpty() {
        return {
          ["x-show"]: () => !notesStore.isNotesLoading && notesStore.isEmpty,
        };
      },
      isNotEmpty() {
        return {
          ["x-show"]: () =>
            notesStore.isNotesLoading ||
            (!notesStore.isNotesLoading && !notesStore.isEmpty),
        };
      },
    },
    tabPane() {
      return {
        ["x-if"]: () => {
          return canShowActiveTab(pathologyTab, notesStore);
        },
      };
    },
    noteListIterator() {
      return {
        ["x-show"]: () =>
          notesStore.isNotesLoading ||
          (!notesStore.isNotesLoading && !notesStore.isEmpty),
        ["x-for"]:
          "noteItem in $store.notesStore.isNotesLoading ? 10 : $store.notesStore.noteList",
      };
    },
    noteElement() {
      return {
        ["x-on:click"]: async () => {
          const currentNote = this.$data.noteItem as
            | NoteList
            | SharedWithMeNoteList;

          notesStore.noteOpened.note = null;
          notesStore.noteOpened.member = null;

          if (isNoteShared(currentNote, userStore)) {
            console.log(`Opened shared note id ${currentNote._id}`);
          } else {
            console.log(`Opened owned note id ${currentNote._id}`);
            await setNoteItemOpen(currentNote._id, {
              noteStore: notesStore,
            });
          }
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
            height: "40px",
            "margin-bottom": "10px",
          };
        },
      };
    },
    noteTitle() {
      return {
        ["x-text"]: () => {
          if (typeof this.$data.noteItem === "number") {
            return;
          }
          return this.$data["noteItem"]?.title;
        },
      };
    },
    fileIconIterator() {
      return {
        ["x-for"]: "fileIcon in noteItem.documents",
      };
    },
    fileIconElement() {
      return {
        ["x-bind:class"]: () => {
          const mimeType = this.$data.fileIcon?.mime_type;
          return mimeType && getMimeType(mimeType);
        },
        ["x-text"]: () => {
          const mimeType = this.$data.fileIcon?.mime_type;
          return mimeType && getMimeType(mimeType);
        },
      };
    },
    isNoteSharedIcon() {
      return {
        ["x-show"]: () =>
          isNoteShared(
            this.$data.noteItem as NoteList | SharedWithMeNoteList,
            userStore
          ),
      };
    },
  };
}

type PathologyPaneNoteItemOptions = {
  layout: {
    /**
     * Will be on display if note was selected from the note list. Else will be hidden
     */
    isNoteOpened: () => object;
  };
  noteTitle: () => object;
  noteCreatedOn: () => object;
  noteRichText: () => object;
  notePathologyTitle: () => object;
  notePathologiesIterator: () => object;
  noteFilesIterator: () => object;
  noteFilesIcon: () => object;
  /**
   * Generated by notePathologiesIterator
   */
  notePathology?: PathologyItem;
  noteFile?: FileData;
};

export function PathologyPaneNoteItem(): AlpineComponent<PathologyPaneNoteItemOptions> {
  const notesStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;

  return {
    layout: {
      isNoteOpened() {
        return {
          ["x-if"]: () => notesStore.noteOpened.note !== null,
        };
      },
    },
    noteTitle() {
      return {
        ["x-text"]: () => notesStore.noteOpened.note!.title,
      };
    },
    noteCreatedOn() {
      return {
        ["x-text"]: () =>
          new Date(notesStore.noteOpened.note!.created_on).toLocaleDateString(
            "fr-FR"
          ),
      };
    },
    noteRichText() {
      return {
        ["x-html"]: () => notesStore.noteOpened.note!.rich_text_ordo,
      };
    },
    notePathologiesIterator() {
      return {
        ["x-for"]:
          "notePathology in $store.notesStore.noteOpened.note.pathologies",
      };
    },
    notePathologyTitle() {
      return {
        ["x-text"]: () => this.$data.notePathology?.title,
      };
    },
    noteFilesIterator() {
      return {
        ["x-for"]: "noteFile in $store.notesStore.noteOpened.note.documents",
      };
    },
    noteFilesIcon() {
      return {
        ["x-bind:class"]: () => {
          const mimeType = this.$data.noteFile?.mime_type;
          return mimeType && getMimeType(mimeType);
        },
        ["x-text"]: () => {
          const mimeType = this.$data.noteFile?.mime_type;
          return mimeType && getMimeType(mimeType);
        },
      };
    },
  };
}
