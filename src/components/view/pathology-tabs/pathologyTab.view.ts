import Alpine, { AlpineComponent } from "alpinejs";
import {
  showActiveTab,
  switchActiveTab,
} from "@components/view/pathology-tabs/pathologyTab.controller";
import { INotesStore, PathologyTab } from "@store/myNotes.store";
import { StateStore } from "@utils/enums";
import { setMixedNotesList } from "../../../actions/notesActions";
import { NoteList } from "@interfaces/apiTypes/notesTypes";
import { SharedWithMeNoteList } from "@interfaces/apiTypes/notesSharesTypes";
import getFileExtByMimeType from "@assets/file_ext";

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
    init() {
      const currentElem = this.$el;
      if (currentElem.getAttribute("aria-selected") === "true") {
        /* empty */
      }
    },
  };
}

type PathologyPaneListOptions = {
  /**
   * Direct child for tabPane component.
   * If noteList is loading it iterates over a static value (10) to show skeleton loading
   */
  noteListIterator: () => object;
  /**
   * TabPane should be the parent binder for each pane
   * - only allows the active pane to render from the store
   *   preventing unnecessary undefined from inactive pane instances.
   */

  tabPane: () => object;
  /**
   * Direct child for noteList component
   * Handles loading state when notes are loading
   */
  noteElement: () => object;
  /**
   * Direct child of noteElement
   */
  noteTitle: () => object;
  /**
   * Available in $data. Object iteration inside the NoteList component.
   */
  noteItem?: (NoteList | SharedWithMeNoteList) | number;
  fileIcon?: { mime_type: keyof typeof getFileExtByMimeType };
  /**
   * Date parsed to fr-FR format
   */
  noteCreatedDate: () => object;
  fileIconIterator: () => object;
  fileIconElement: () => object;
  // actions: {
  //   something: () => object;
  // };
};

export function PathologyPaneList(
  pathologyTab: PathologyTab
): AlpineComponent<PathologyPaneListOptions> {
  const notesStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;

  return {
    init() {
      const pathologySlug = notesStore.noteListMeta.pathology_slug || "acne";
      Alpine.effect(async () => {
        const isCurrentTabActive = showActiveTab(pathologyTab, notesStore);
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
    tabPane() {
      return {
        ["x-if"]: () => {
          return showActiveTab(pathologyTab, notesStore);
        },
      };
    },
    noteListIterator() {
      return {
        ["x-for"]:
          "noteItem in $store.notesStore.isNotesLoading ? 10 : $store.notesStore.noteList",
      };
    },
    noteElement() {
      return {
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
          this.$data["noteItem"]?.title;
        },
      };
    },
    noteCreatedDate() {
      return {
        ["x-text"]: () => {
          if (typeof this.$data.noteItem === "number") {
            return;
          }
          const date = new Date(this.$data!.noteItem!.created_on);
          return date.toLocaleDateString("fr-FR");
        },
      };
    },
    fileIconIterator() {
      return {
        ["x-if"]: () => {
          if (typeof this.$data.noteItem !== "number") {
            return (
              this.$data?.noteItem &&
              this.$data?.noteItem.documents &&
              this.$data?.noteItem.documents?.length > 0
            );
          }
        },
        ["x-for"]: "fileIcon in noteItem.documents",
      };
    },
    fileIconElement() {
      return {
        ["x-bind:class"]: () => {
          const mimeType = this.fileIcon?.mime_type;
          if (mimeType) {
            console.log(mimeType);
            return getFileExtByMimeType[mimeType];
          }
        },
        ["x-text"]: () => {
          const mimeType = this.fileIcon?.mime_type;
          if (mimeType) {
            console.log(mimeType);
            return getFileExtByMimeType[mimeType];
          }
        },
      };
    },
  };
}
