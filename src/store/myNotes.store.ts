import { NoteType } from "../models/notes.js";
import Alpine from "alpinejs";

export interface INotesStore {
  isNotesLoading: boolean;
  isEmpty: boolean;
  noteList: any[];
  noteListMeta: {
    pageNumber: number;
    pageTotal: number;
    itemsTotal: number;
    sort: string;
    direction: string;
  };
  isSearch: boolean;

  searchValue: string;
  noteListType: NoteType | "";
  areNotesSelected: boolean;
  isRuleStatusLoading: boolean;
  currentRuleStatus: {
    consumedNotesPercent: number;
    consumedMegabytesPercent: number;
    consumedNotesNumber: number;
    consumedMegabytesNumber: number;
    allowedNumberOfNotes: number;
    allowedMegabyte: number;
  };
  isNoteLoading: boolean;
  noteOpened: any;
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
  noteOpened: {},

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
