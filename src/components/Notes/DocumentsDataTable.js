import Alpine from "alpinejs";
import getFileExtByMimeType from "../../assets/file_ext.js";
import ShareNotesService from "../../services/notesSharesService";
import SkeletonLoaderEvent from "../../events/SkeletonLoaderEvent";
import {
  handleItemsPerPage,
  handlePagination,
  handleSorting,
} from "../../pages/my-documents/navigation/pagination";
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
        },
        ["x-init"]: "$store.notesStore.noteList[index].checked = false",
      };
    },
    openDrawer() {
      return {
        ["x-on:click"]: `$router.navigate('/view/' + note._id)`,
      };
    },
    textTitle() {
      return {
        ["x-text"]: "note.title",
      };
    },
    noteFileIconsList(note) {
      return {
        ["x-init"]: () => {
          Alpine.store(StateStore.MY_NOTES).noteList[this.index].fileIcons = [
            ...this.checkFileIcons(note),
          ];
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
        ["x-text"]: "note.pathologies.length ? note.pathologies[0].title : '-'",
        ["x-bind:href"]:
          "note.pathologies.length ? '/pathologies/' + note.pathologies[0].slug : null",
      };
    },
    // Sets file icon variables on load
    checkFileIcons(note) {
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
  };
}

function DataTableListItemSubmenu() {
  return {
    deleteNote(note) {
      return {
        ["x-show"]: "true",
        ["@click.prevent"]: async (ev) => {
          Alpine.store("modalStore").openBeforeDelete(note);
        },
      };
    },
    editNote(note) {
      return {
        ["x-show"]: "true",
        ["@click.prevent"]: async (ev) => {
          await Alpine.store("modalStore").openModal(d, { type: note.type });
        },
      };
    },
    shareNote(note) {
      return {
        ["x-show"]: "true",
        ["@click.prevent"]: async (ev) => {
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
          Alpine.store("shareStore").activeNote = d;

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
    // -- Select all checkbox
    selectAllClick: () => {
      return {
        ["x-on:click"]: (ev) => {
          ev.preventDefault();
          ev.stopImmediatePropagation();

          // TODO remove this?
          Alpine.store("documentsStore").getList.allChecked =
            !Alpine.store("documentsStore").getList.allChecked;

          const allChecked =
            Alpine.store("documentsStore").getList.allChecked || false;
          Alpine.store("documentsStore").getList.documents.forEach((doc) => {
            doc.completed = allChecked;
          });
        },
      };
    },
    selectAllClass() {
      return Alpine.store("documentsStore").getList.allChecked && "active";
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
  };
}

function DataTablePaginationMenu() {
  return {
    pageNumber(n) {
      return {
        ["x-text"]: "n",
        ["x-on:click"]: () => {
          handlePagination(window.PineconeRouter.currentContext, n);
        },
        [":class"]: () => {
          return (
            +Alpine.store(StateStore.NOTES).getList.pageNumber === +n &&
            "active"
          );
        },
      };
    },
    pageNext() {
      return {
        ["x-on:click"]: () => {
          const notesStore = Alpine.store(StateStore.NOTES);
          const $router = window.PineconeRouter.currentContext;
          return (
            +notesStore.getList.pageNumber < +notesStore.getList.pageTotal &&
            handlePagination($router, +notesStore.getList.pageNumber + 1)
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

export {
  DataTableHeader,
  DataTableListItem,
  DataTableListItemSubmenu,
  DataTablePaginationMenu,
  DataTablePerPageDropdown,
};
