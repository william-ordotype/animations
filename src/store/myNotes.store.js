import Alpine from "alpinejs";

const NotesStore = {
  isNotesLoading: true,
  isNoteLoading: true,
  isEmpty: false,
  noteList: [],
  noteOpened: {},
  noteListMeta: {
    pageNumber: 1,
    pageTotal: 10,
    itemsTotal: 10,
    sort: "created_on",
    direction: "DESC",
  },
  isSearch: false,
  searchValue: "",
  noteListType: "",
  areNotesSelected: false,

  isRuleStatusLoading: true,
  currentRuleStatus: {
    consumedNotesPercent: "",
    consumedMegabytesPercent: "",
    consumedNotesNumber: "",
    consumedMegabytesNumber: "",
    allowedNumberOfNotes: "",
    allowedMegabyte: "",
  },

  async init() {
    console.log("Alpine init store");
    Alpine.effect(() => {
      // Solves Bug: Re attach Webflow dropdown events to newly rendered items
      if (this.noteList) {
        setTimeout(() => {
          window.Webflow.require("dropdown").ready();
          window.Webflow.require("ix2").init();
        }, 1000);
      }
      console.log("painted");
    });
  },
};

export default NotesStore;
