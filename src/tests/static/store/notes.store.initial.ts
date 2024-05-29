import { INotesStore } from "@store/myNotes.store";

export const notesInitialStore: INotesStore = {
  // GetList
  isNotesLoading: true,
  isEmpty: false,
  noteList: [],
  noteListMeta: {
    pageNumber: 1,
    pageTotal: 10,
    // itemsTotal: null,
    // sort: null,
    // direction: null,
    // itemsPerPage: null,
  },
  isSearch: false,
  searchValue: "",
  noteListType: "",
  areNotesSelected: false,

  // Rules Widget
  isRuleStatusLoading: true,
  currentRuleStatus: {
    consumedNotesPercent: undefined,
    consumedMegabytesPercent: undefined,
    consumedNotesNumber: undefined,
    consumedMegabytesNumber: undefined,
    allowedNumberOfNotes: undefined,
    allowedMegabyte: undefined,
  },

  // GetOne
  isNoteLoading: true,
  noteOpened: {
    member: null,
    note: null,
  },
  drawerOpened: false,

  // Mutate One
  isEdit: false,
  editorOpened: false,

  // Delete
  removeShareNoteList: [],
  deleteList: [],
  init() {},
};
