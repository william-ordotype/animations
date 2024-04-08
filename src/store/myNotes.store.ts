import {
  NoteItem,
  NoteItemData,
  NoteItemMember,
  NoteList,
  NoteType,
} from "../types/apiTypes/notesTypes";
import Alpine from "alpinejs";

export interface INotesStore {
  isNotesLoading: boolean;
  isEmpty: boolean;
  noteList: NoteList[];
  noteListMeta: {
    pageNumber: number;
    pageTotal: number;
    itemsTotal: number;
    sort: string;
    direction: string;
    itemsPerPage: number;
    pathology_slug?: string;
  };
  isSearch: boolean;
  searchValue: string;
  noteListType: NoteType | "";
  areNotesSelected: boolean;
  deleteList: ToDo;

  isRuleStatusLoading: boolean;
  currentRuleStatus: {
    consumedNotesPercent: number;
    consumedMegabytesPercent: number;
    consumedNotesNumber: number;
    consumedMegabytesNumber: number;
    allowedNumberOfNotes: number;
    allowedMegabyte: number;
  };

  removeShareNoteList: ToDo;

  isNoteLoading: boolean;
  noteOpened: {
    note: NoteItemData | null;
    member: NoteItemMember | null;
  };
  drawerOpened: boolean;

  isEdit: boolean;

  init: () => void;
}

const NotesStore: INotesStore = {
  // GetList
  isNotesLoading: true,
  isEmpty: false,
  noteList: [],
  noteListMeta: {
    pageNumber: 1,
    pageTotal: 10,
    itemsTotal: 10,
    sort: "created_on",
    direction: "DESC",
    itemsPerPage: 10,
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

  isEdit: false,

  // Delete
  removeShareNoteList: [],
  deleteList: [],

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
