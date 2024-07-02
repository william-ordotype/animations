import Alpine, { AlpineComponent } from "alpinejs";
import {
  isNoteShared,
  canShowActiveTab,
  switchActiveTab,
  getMimeType,
  printDiv,
  shareNote,
  getNotesFromPathologyTab,
  deleteNote,
} from "@components/view/pathology-tabs/pathologyTab.controller";
import { INotesStore, PathologyTab } from "@store/myNotes.store";
import { StateStore } from "@utils/enums";
import { setNoteItemOpen } from "../../../actions/notesActions";
import { FileData, NoteList } from "@interfaces/apiTypes/notesTypes";
import { SharedWithMeNoteList } from "@interfaces/apiTypes/notesSharesTypes";
import getFileExtByMimeType from "@assets/file_ext";
import { IUserStore } from "@store/user.store";
import { PathologyItem } from "@interfaces/apiTypes/pathologiesTypes";
import NProgress from "nprogress";
import { setSharedNoteOpened } from "../../../actions/sharedNotesActions";
import { IShareStore } from "@store/share.store";
import { navigationToastMsgs } from "@utils/toastMessages";

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
  pagination: {
    paginationIterator: () => object;
    pageNumber: () => object;
    pageNext: () => object;
  };
  actions: {
    /**
     * Opens modal with selected note type
     */
    createModalNoteFromTab: () => object;
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
  /**
   * Available in $data. Object iteration from page total.
   */
  pNumber?: number;
};

export function PathologyPaneList(
  pathologyTab: PathologyTab
): AlpineComponent<PathologyPaneListOptions> {
  const notesStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
  const userStore = Alpine.store(StateStore.USER) as IUserStore;
  const modalStore = Alpine.store(StateStore.MODAL) as any;
  const pathologySlug =
    location.host === "localhost:3021" ? "acne" : location.href.split("/")[4]!;

  return {
    init() {
      Alpine.effect(async () => {
        console.log(notesStore.pathologyActiveTab);
        if (notesStore.pathologyActiveTab) {
          const isCurrentTabActive = canShowActiveTab(pathologyTab, notesStore);
          if (isCurrentTabActive) {
            console.log("call notes", pathologyTab);
            await getNotesFromPathologyTab(
              1,
              pathologyTab,
              pathologySlug,
              notesStore
            );
          }
        }
      });
    },
    actions: {
      createModalNoteFromTab() {
        return {
          ["x-on:click.prevent"]: () => {
            let tabType;
            const pathologyTab = notesStore.pathologyActiveTab;
            if (
              pathologyTab === "balance_sheet" ||
              pathologyTab === "treatment"
            ) {
              tabType = "prescriptions";
            } else {
              tabType = pathologyTab;
            }
            modalStore.openModal(null, { type: tabType });
          },
        };
      },
    },
    layout: {
      isEmpty() {
        return {
          ["x-show"]: () =>
            !notesStore.isNotesLoading &&
            notesStore.isEmpty &&
            notesStore.noteListMeta.itemsTotal === 0,
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
    pagination: {
      paginationIterator() {
        return {
          ["x-for"]: "pNumber in $store.notesStore.noteListMeta.pageTotal",
        };
      },
      pageNumber() {
        return {
          ["x-show"]: () => !notesStore.isNotesLoading,
          ["x-text"]: () => this.$data.pNumber,
          ["x-on:click.prevent"]: async () => {
            await getNotesFromPathologyTab(
              this.$data.pNumber,
              pathologyTab,
              pathologySlug,
              notesStore
            );
          },
          [":class"]: () => {
            return (
              +notesStore.noteListMeta.pageNumber === this.$data.pNumber &&
              "active"
            );
          },
        };
      },
      pageNext() {
        return {
          ["x-show"]: () => !notesStore.isNotesLoading,
          ["x-on:click.prevent"]: async () => {
            if (
              !(
                notesStore.noteListMeta.pageNumber <
                notesStore.noteListMeta.pageTotal
              )
            ) {
              return;
            }
            await getNotesFromPathologyTab(
              this.$data.pNumber!++,
              pathologyTab,
              pathologySlug,
              notesStore
            );
          },
          ["x-bind:disabled"]: () => {
            return (
              notesStore.noteListMeta.pageNumber <=
              notesStore.noteListMeta.pageTotal
            );
          },
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
          NProgress.start();
          if (isNoteShared(currentNote, userStore)) {
            console.log(`Opened shared note id ${currentNote._id}`);
            await setSharedNoteOpened({ noteId: currentNote._id });
          } else {
            console.log(`Opened owned note id ${currentNote._id}`);
            await setNoteItemOpen(currentNote._id, {
              noteStore: notesStore,
            });
          }
          NProgress.done();
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
  actions: {
    noteEdit: () => object;
    notePrint: () => object;
    noteShare: () => object;
    noteDelete: () => object;
  };
  noteTitle: () => object;
  noteCreatedOn: () => object;
  noteRichText: () => object;
  notePathologyTitle: () => object;
  notePathologiesIterator: () => object;
  noteFilesIterator: () => object;
  noteFilesIcon: () => object;
  noteFileDownload: () => object;
  noteFileTitle: () => object;
  noteFileExt: () => object;
  /**
   * Generated by notePathologiesIterator
   */
  notePathology?: PathologyItem;
  noteFile?: FileData;
};

export function PathologyPaneNoteItem(): AlpineComponent<PathologyPaneNoteItemOptions> {
  const notesStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
  const userStore = Alpine.store(StateStore.USER) as IUserStore;
  const modalStore = Alpine.store(StateStore.MODAL) as any;
  const shareStore = Alpine.store(StateStore.SHARE) as IShareStore;

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
    noteFileDownload() {
      return {
        ["x-bind:href"]: () => this.$data.noteFile?.file_url,
        ["x-bind:title"]: () => this.$data.noteFile?.file_name,
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
    noteFileTitle() {
      return {
        ["x-text"]: () => this.$data.noteFile?.file_name.split(".")[0],
      };
    },
    noteFileExt() {
      return {
        ["x-text"]: () => {
          const mimeType = this.$data.noteFile?.mime_type;
          return mimeType && `.${getMimeType(mimeType)}`;
        },
      };
    },
    actions: {
      noteEdit() {
        return {
          ["x-show"]: () => {
            return !isNoteShared(notesStore.noteOpened.note!, userStore);
          },
          ["x-on:click"]: () => {
            NProgress.start();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            Alpine.store("modalStore").openModal(notesStore.noteOpened.note);
            NProgress.done();
          },
        };
      },
      noteDelete() {
        return {
          ["x-show"]: () => {
            return !isNoteShared(notesStore.noteOpened.note!, userStore);
          },
          ["x-on:click"]: async () => {
            // const pathologySlug =
            //   location.host === "localhost:3021"
            //     ? "acne"
            //     : location.href.split("/")[4]!;
            // const pathologyTab = notesStore.pathologyActiveTab || "notes";
            // await getNotesFromPathologyTab(
            //   1,
            //   pathologyTab,
            //   pathologySlug,
            //   notesStore
            // );
            //
            // notesStore.noteOpened = {
            //   note: null,
            //   member: null,
            // };

            await deleteNote({
              noteId: notesStore.noteOpened.note!._id,
              modalStore,
            });
          },
        };
      },
      notePrint() {
        return {
          ["x-on:click"]: async () => {
            await printDiv("[x-data=PathologyPaneNoteItem]");
          },
        };
      },
      noteShare() {
        return {
          ["x-show"]: () => {
            return !isNoteShared(notesStore.noteOpened.note!, userStore);
          },
          ["x-on:click.prevent"]: async () => {
            await shareNote(
              notesStore.noteOpened.note!,
              notesStore,
              modalStore,
              shareStore
            );
          },
        };
      },
    },
  };
}
