import Alpine from "alpinejs";
import getFileExtByMimeType from "../../assets/file_ext.js";
import ShareNotesService from "../../services/notesSharesService";
import SkeletonLoaderEvent from "../../events/SkeletonLoaderEvent";
import {
  handleItemsPerPage,
  handlePagination,
  handleSorting,
} from "../../pages/my-notes/navigation/pagination";
import { StateStore } from "../../utils/enums";

const API_URL = `${process.env.ORDOTYPE_API}/v1.0.0`;
const ShareNotes = new ShareNotesService(API_URL, window.memberToken);

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
      return {
        ["x-on:change"]: () => {
          Alpine.store(StateStore.MY_NOTES).noteList[this.index].checked =
            !Alpine.store(StateStore.MY_NOTES).noteList[this.index].checked;
          // $store.documentsStore.getList.documents.some(e =&gt; e.completed)
          Alpine.store(StateStore.MY_NOTES).areNotesSelected = Alpine.store(
            StateStore.MY_NOTES
          ).noteList.some((note) => note.checked);
        },
        ["x-model"]: () => this.note.checked,
        ["x-init"]: "$store.notesStore.noteList[index].checked = false;",
      };
    },
    viewNote() {
      return {
        ["x-on:click"]: `$router.navigate('/view/' + note._id)`,
      };
    },
    noteTitle() {
      return {
        ["x-text"]: "note.title",
      };
    },
    noteFileIconsList() {
      return {
        ["x-init"]: () => {
          Alpine.effect(() => {
            // Fix fileIcons not showing on pagination
            if (Alpine.store(StateStore.MY_NOTES).noteList) {
              const notesStore = Alpine.store(StateStore.MY_NOTES);
              const noteAtIndex = notesStore.noteList[this.index];

              if (noteAtIndex) {
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
        ["x-bind:class"]: "note.pathologies.length && 'active'",
        ["x-bind:style"]:
          "note.pathologies.length === 0 ? {backgroundColor: 'transparent'} : ''",
        ["x-text"]: "note.pathologies.length ? note.pathologies[0].title : '-'",
        ["x-bind:href"]:
          "note.pathologies.length ? '/pathologies/' + note.pathologies[0].slug : null",
      };
    },
    // Sets file icon variables on load
    checkFileIcons() {
      const { documents } = this.note;
      const allDocTypes = documents.map((elem) => {
        return elem.mime_type;
      });
      const uniqueDocTypes = new Set(allDocTypes);
      return [...uniqueDocTypes];
    },
    // Returns fileType. Used in className and in icon text
    fileIconType(mime_type) {
      return getFileExtByMimeType[mime_type] || "file";
    },
    authorColumn: {
      ["x-text"]:
        "note.updated_by?.fullName || note.updated_by?.full_name || note.created_by.email",
    },
  };
}

function DataTableListItemSubmenu() {
  return {
    deleteNote() {
      return {
        ["x-show"]: "true",
        ["@click.prevent"]: async (ev) => {
          Alpine.store("modalStore").openBeforeDelete(this.note);
        },
      };
    },
    editNote() {
      return {
        ["x-show"]: "true",
        ["@click.prevent"]: async (ev) => {
          await Alpine.store("modalStore").openModal(this.note, {
            type: this.note.type,
          });
        },
      };
    },
    shareNote() {
      return {
        ["x-show"]: "true",
        ["@click.prevent"]: async (ev) => {
          const note = this.note;
          const isShareActive = !!note["can_share"];

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
          Alpine.store("shareStore").shareSwitch = isShareActive;
          Alpine.store("shareStore").shareOptionsEnabled = isShareActive;
          Alpine.store("shareStore").showSharingOptions = isShareActive;
          Alpine.store("shareStore").activeNote = note;
          if (isShareActive) {
            const { emails, linkId } = await ShareNotes.getSharedInfoFromNote({
              noteId: note._id,
            });
            Alpine.store("shareStore").activeNoteEmailList = emails;
            Alpine.store("shareStore").activeNotePublicLink = linkId;
          }
          SkeletonLoaderEvent.dispatchCustomEvent(
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

  function toggleDirection(direction) {
    if (direction === "ASC") {
      return "DESC";
    }
    if (direction === "DESC") {
      return "ASC";
    }
    return "DESC";
  }

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
      return {
        ["x-on:click"]: (ev) => {
          this.selectAll = !this.selectAll;
          Alpine.store(StateStore.MY_NOTES).noteList.forEach((noteItem) => {
            noteItem.checked = this.selectAll;
          });
          Alpine.store(StateStore.MY_NOTES).areNotesSelected = this.selectAll;
        },
        ["x-model"]: this.selectAll,
      };
    },
    // Class bindings
    // -- Header
    sortByHeadClass(sortBy) {
      return this.state[sortBy].isActive && "active";
    },

    // -- Arrows
    sortByArrowClass(sortBy, direction) {
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

function DataTablePaginationMenu() {
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
          handlePagination(window.PineconeRouter.currentContext, this.pNumber);
        },
        [":class"]: () => {
          return (
            +Alpine.store(StateStore.MY_NOTES).noteListMeta.pageNumber ===
              +this.pNumber && "active"
          );
        },
      };
    },
    pageNext() {
      return {
        ["x-on:click"]: () => {
          const notesStore = Alpine.store(StateStore.MY_NOTES);
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
    dropdownText(number) {
      return `Afficher ${number} par page`;
    },
    showDropdownText: "Afficher 10 par page",
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
