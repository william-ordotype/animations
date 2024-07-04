import Alpine from "alpinejs";
import getFileExtByMimeType from "@assets/file_ext.js";
import shareNotesService from "@services/notesSharesService";
import SkeletonLoaderEvent from "../../events/SkeletonLoaderEvent";
import {
  handleItemsPerPage,
  handlePagination,
  handleSorting,
} from "@pages/my-notes/navigation/pagination.js";
import { StateStore } from "@utils/enums.js";

/**
 * @return {import("alpinejs").AlpineComponent<any>}
 */

function DataTableListItem() {
  return {
    listItems() {
      return {
        ["x-for"]: "(note, index) in $store.notesStore.noteList",
      };
    },
    // Binders
    tableBodyGrid() {
      return {
        // Makes 4 columns if documentType === all or prescriptions. Default 3.
        ["x-bind:class"]:
          "!($store.notesStore.noteListType === '' || $store.notesStore.noteListType === 'prescriptions') && 'ordonan_item'",
      };
    },
    // Row items
    noteCheckBox() {
      const notesStore =
        /** @type {import("@store/myNotes.store").INotesStore} */ (
          Alpine.store(StateStore.MY_NOTES)
        );

      return {
        ["x-on:change"]: () => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          notesStore.noteList[this.$data.index].checked =
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            !notesStore.noteList[this.$data.index].checked;
          // $store.documentsStore.getList.documents.some(e =&gt; e.completed)
          notesStore.areNotesSelected = notesStore.noteList.some(
            (note) => note.checked
          );
        },
        ["x-model"]: () => {
          return this.$data.note;
        },
        ["x-init"]: "$store.notesStore.noteList[index].checked = false;",
      };
    },
    viewNote() {
      return {
        ["x-on:click.self"]: `$router.navigate('/view/' + note._id)`,
      };
    },
    noteTitle() {
      return {
        ["x-text"]: "note.title",
        ["x-on:click.self"]: `$router.navigate('/view/' + note._id)`,
      };
    },
    noteFileIconsList() {
      /**
       *
       */
      const notesStore =
        /** @type {import("@store/myNotes.store").INotesStore} */ (
          Alpine.store(StateStore.MY_NOTES)
        );

      return {
        ["x-init"]: () => {
          Alpine.effect(() => {
            // Fix fileIcons not showing on pagination
            if (notesStore.noteList) {
              const noteAtIndex = notesStore.noteList[this.index];

              if (noteAtIndex) {
                // @ts-expect-error
                noteAtIndex.fileIcons = [...this.checkFileIcons(this.note)];
              }
            }
          });
        },
        ["x-for"]: "icon in note.fileIcons",
      };
    },
    textType() {
      return {
        ["x-text"]: "window.globals.documentTypes[note.type]",
        ["x-show"]: "$store.notesStore.noteListType === ''",
      };
    },
    textPrescriptionType() {
      return {
        ["x-text"]: "window.globals.prescriptionTypes[note.prescription_type]",
      };
    },
    rowType() {
      return {
        ["x-show"]: "$store.notesStore.noteListType === ''",
      };
    },
    rowPrescriptionType() {
      return {
        ["x-show"]: "$store.notesStore.noteListType === 'prescriptions'",
        ["x-bind:class"]:
          "$store.notesStore.noteListType === 'prescriptions' && 'display-inlineflex'",
      };
    },
    textDate() {
      return {
        ["x-text"]: "new Date(note.created_on).toLocaleDateString('fr-FR')",
      };
    },
    pathologyRef() {
      return {
        ["x-on:click"]:
          "note.pathologies.length > 0 ? (location.href = `/pathologies/${note.pathologies[0].slug}`) : console.log('no pathology')",
        ["x-bind:class"]: "note?.pathologies?.length && 'active'",
        ["x-bind:style"]:
          "note.pathologies?.length === 0 ? {backgroundColor: 'transparent'} : ''",
        ["x-text"]:
          "note.pathologies?.length ? note.pathologies[0].title : '-'",
        ["x-bind:href"]:
          "note?.pathologies?.length ? '/pathologies/' + note.pathologies[0].slug : null",
      };
    },
    // Sets file icon variables on load
    checkFileIcons() {
      const { documents } = this.note;

      const allDocTypes = documents.map(
        /**
         * @param elem {ToDo}
         */
        (elem) => {
          return elem.mime_type;
        }
      );
      const uniqueDocTypes = new Set(allDocTypes);
      return [...uniqueDocTypes];
    },
    // Returns fileType. Used in className and in icon text
    /**
     * @param {string } mime_type
     */
    fileIconType(mime_type) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return getFileExtByMimeType[mime_type] || "file";
    },
    authorColumn: {
      ["x-text"]:
        "note.updated_by?.fullName || note.updated_by?.full_name || note.created_by.email",
    },
  };
}

/**
 * @return {import("alpinejs").AlpineComponent<any>}
 */

function DataTableListItemSubmenu() {
  const shareStore = /** @type {import("@store/share.store").IShareStore} */ (
    Alpine.store(StateStore.SHARE)
  );

  return {
    deleteNote() {
      return {
        ["x-show"]: "true",
        ["@click.prevent"]: async () => {
          const noteId = this.$data.note?._id;
          Alpine.store(StateStore.MODAL).deleteList = [noteId];
          Alpine.store(StateStore.MODAL).showBeforeDelete = true;
        },
      };
    },
    editNote() {
      return {
        ["x-show"]: "true",
        ["@click.prevent"]: async () => {
          await Alpine.store("modalStore").openModal(this.note, {
            type: this.$data.note.type,
          });
        },
      };
    },
    shareNote() {
      return {
        ["x-show"]: "true",
        ["x-on:click.prevent"]: async () => {
          const note = this.$data.note;
          const isShareActive = !!note["can_share"];

          // To-Do redo loading skeleton
          SkeletonLoaderEvent.dispatchCustomEvent(
            document.querySelector(".search_result_wrapper.partage"),
            true
          );
          SkeletonLoaderEvent.dispatchCustomEvent(
            document.querySelectorAll(
              ".activer_par_wrapper .text-size-regular, .activer_par_wrapper .text-size-small"
            ),
            true
          );
          Alpine.store("modalStore").showSharingOptions = true;
          shareStore.shareSwitch = isShareActive;
          shareStore.shareOptionsEnabled = isShareActive;
          shareStore.showSharingOptions = isShareActive;
          shareStore.activeNote = note;
          if (isShareActive) {
            const res = await shareNotesService.getSharedInfoFromNote({
              noteId: note._id,
            });
            const { emails, linkId } = res.data;
            shareStore.activeNoteEmailList = emails;
            shareStore.activeNotePublicLink = linkId;
          }

          // ToDo Redo skeleton logic. Maybe binding the class to the response time
          SkeletonLoaderEvent.dispatchCustomEvent(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            document.querySelector(".search_result_wrapper.partage"),
            false
          );
          SkeletonLoaderEvent.dispatchCustomEvent(
            document.querySelectorAll(
              ".activer_par_wrapper .text-size-regular, .activer_par_wrapper .text-size-small"
            ),
            false
          );
        },
      };
    },
  };
}

function DataTableHeader() {
  const initialState = {
    sortByTitle: {
      propertyName: "title",
      isActive: false,
      direction: null,
    },
    sortByType: {
      propertyName: "type",
      isActive: false,
      direction: null,
    },
    sortByDate: {
      propertyName: "created_on",
      isActive: false,
      direction: null,
    },
    sortByPathology: {
      propertyName: "pathology",
      isActive: false,
      direction: null,
    },
    sortByPrescriptionType: {
      propertyName: "prescription_type",
      isActive: false,
      direction: null,
    },
    sortByAuthor: {
      propertyName: "updated_by.full_name",
      isActive: false,
      direction: null,
    },
  };

  /**
   * @param {string} direction
   */
  function toggleDirection(direction) {
    if (direction === "ASC") {
      return "DESC";
    }
    if (direction === "DESC") {
      return "ASC";
    }
    return "DESC";
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  function toggleActive(state, sortByN) {
    Array.from(Object.keys(state)).forEach((key) => {
      if (key === sortByN) {
        state[key].isActive = true;
        state[key].direction = toggleDirection(state[key].direction);

        handleSorting(
          window.PineconeRouter.currentContext,
          state[key].propertyName,
          state[key].direction
        );
      } else {
        state[key].isActive = false;
        state[key].direction = null;
      }
    });
  }
  return {
    headType() {
      return {
        ["x-show"]: "$store.notesStore.noteListType === ''",
      };
    },
    headPrescriptionType() {
      return {
        ["x-show"]: "$store.notesStore.noteListType === 'prescriptions'",
        ["x-bind:class"]:
          "$store.notesStore.noteListType === 'prescriptions' && 'display-inlineflex'",
      };
    },
    tableHeadGrid() {
      return {
        ["x-bind:class"]:
          "($store.notesStore.noteListType === '' || $store.notesStore.noteListType === 'prescriptions') ? 'header_g' : 'header_ordo'",
      };
    },
    state: initialState,
    // Click handlers

    /**
     *
     * @param {*} sortBy
     * example: sortByClick('sortByTitle')
     */
    sortByClick(sortBy) {
      toggleActive(this.state, sortBy);
    },
    selectAll: false,
    selectAllCheckbox() {
      const notesStore = /**
       * @type {import("@store/myNotes.store").INotesStore}
       */ (Alpine.store(StateStore.MY_NOTES));
      return {
        ["x-on:click"]: () => {
          this.selectAll = !this.selectAll;
          notesStore.noteList.forEach((noteItem) => {
            noteItem.checked = this.selectAll;
          });
          notesStore.areNotesSelected = this.selectAll;
        },
        ["x-model"]: this.selectAll,
      };
    },
    // Class bindings
    // -- Header
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    sortByHeadClass(sortBy) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return this.state[sortBy].isActive && "active";
    },

    // -- Arrows
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    sortByArrowClass(sortBy, direction) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (this.state[sortBy].direction === direction) {
        return "active";
      }
    },
    // Had to create this one individually to fix selectAll conflict bubbling event
    sortByTitle() {
      return {
        ["x-on:click.self"]: "sortByClick('sortByTitle')",
        ["x-bind:class"]: "sortByHeadClass('sortByTitle')",
      };
    },
  };
}

/**
 * @return {import("alpinejs").AlpineComponent<any>}
 */
function DataTablePaginationMenu() {
  const notesStore = /**
   * @type {import("@store/myNotes.store").INotesStore}
   */ (Alpine.store(StateStore.MY_NOTES));
  return {
    paginationList() {
      return {
        ["x-for"]: "pNumber in $store.notesStore.noteListMeta.pageTotal",
      };
    },
    pageNumber() {
      return {
        ["x-text"]: "pNumber",
        ["x-on:click"]: () => {
          handlePagination(
            window.PineconeRouter.currentContext,
            this.$data.pNumber
          );
        },
        [":class"]: () => {
          return (
            +notesStore.noteListMeta.pageNumber === +this.$data.pNumber &&
            "active"
          );
        },
      };
    },
    pageNext() {
      return {
        ["x-on:click"]: () => {
          const $router = window.PineconeRouter.currentContext;
          return (
            +notesStore.noteListMeta.pageNumber <
              +notesStore.noteListMeta.pageTotal &&
            handlePagination($router, +notesStore.noteListMeta.pageNumber + 1)
          );
        },
      };
    },
  };
}

function DataTablePerPageDropdown() {
  return {
    /**
     * @param {any} number
     */
    dropdownText(number) {
      return `Afficher ${number} par page`;
    },
    showDropdownText: "Afficher 10 par page",
    /**
     * @param {{ preventDefault: () => void; target: any; }} ev
     * @param {any} routerParams
     * @param {any} number
     */
    changePerPage(ev, routerParams, number) {
      ev.preventDefault();
      $(ev.target)
        .closest(".w-dropdown-list")
        .removeClass("w--open")
        .siblings(".w-dropdown")
        .find(".w-dropdown-toggle")
        .removeClass("w--open");
      this.showDropdownText = this.dropdownText(number);

      handleItemsPerPage(routerParams, number); // function available in window scope
    },
  };
}

/**
 * @return {import("alpinejs").AlpineComponent<any>}
 */
function LayoutContainer() {
  return {
    isMemberView() {
      return {
        ["x-show"]:
          "$store.userStore.hasPaidSub && !$store.notesStore.isNotesLoading && (!$store.notesStore.isEmpty || $store.notesStore.isSearch)",
      };
    },
    notMemberView() {
      return {
        ["x-show"]: "!$store.userStore.isAuth || !$store.userStore.hasPaidSub",
      };
    },
    isEmptyView() {
      return {
        ["x-show"]:
          "$store.userStore.hasPaidSub && !($store.notesStore.isNotesLoading) && $store.notesStore.isEmpty && !($store.notesStore.isSearch)",
      };
    },
    mainHeading() {
      return {
        ["x-text"]:
          "$store.notesStore.noteListType == false ? 'Tous mes documents' : globals.documentTypes[$store.notesStore.noteListType]",
      };
    },
    noteTotal() {
      return {
        ["x-text"]: "$store.notesStore.noteListMeta.itemsTotal",
      };
    },
    dataTableLoading: {
      ["x-show"]: "$store.notesStore.isNotesLoading",
    },
  };
}

export {
  DataTableHeader,
  DataTableListItem,
  DataTableListItemSubmenu,
  DataTablePaginationMenu,
  DataTablePerPageDropdown,
  LayoutContainer,
};
