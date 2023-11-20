import {
  setIsNoteLoading,
  setIsNotesLoading,
  setNoteList,
} from "../actions/myDocuments.actions";
import StoreCreator from "./StoreCreator";

const NotesStore = {
  isNotesLoading: false,
  isNoteLoading: false,
  noteList: [],
  noteOpened: {},
  noteListMeta: {
    pageNumber: null,
    pageTotal: null,
    itemsTotal: null,
    documentType: null,
    isSearch: false,
    sort: "created_on",
    direction: "DESC",
  },
  isRuleStatusLoading: false,
  currentRuleStatus: {
    consumedNotesPercent: "",
    consumedMegabytesPercent: "",
    consumedNotesNumber: "",
    consumedMegabytesNumber: "",
    allowedNumberOfNotes: "",
    allowedMegabyte: "",
  },
};

export default NotesStore;
