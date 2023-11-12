import Alpine from "alpinejs";
import NotesService from "../services/notesService";

const API_URL = `${process.env.ORDOTYPE_API}/v1.0.0`;
const NoteService = new NotesService(API_URL);

const myDocumentsStore = {
  getOne: {
    document: {
      note: {},
      member: {},
    },
    async setDocument(props) {
      const { id } = props;
      await NoteService.getOne(id);
    },
  },
  getList: {
    allChecked: false,
    isLoading: false,
    isEmpty: false,
    documents: [],
    pageNumber: null,
    pageTotal: null,
    itemsTotal: null,
    documentType: null,
    documentTypeTitle: null,
    isSearch: false,
    searchValue: "",
    sort: "created_on",
    direction: "DESC",

    async setDocuments(props = {}) {
      this.isLoading = true;
      this.allChecked = false;
      if (!Alpine.store("userStore").isAuth) {
        this.isLoading = false;
        return;
      }
      let documentsResults;
      this.documents = []; // Reset checkboxes
      try {
        documentsResults = await NoteService.getList(props);
      } catch (err) {
        console.error("getList error --", err);
        return;
      }
      // Checks if empty
      if (documentsResults["data"].length === 0) {
        this.isEmpty = true;
        this.isLoading = false;

        // Call status rule endpoint only in localhost or my document page
        if (
          location.href.includes("mes-documents") ||
          location.href.includes("localhost")
        ) {
          await Alpine.store("documentsStore").rulesStatus.exec();
        }
        return;
      }
      this.isEmpty = false;
      this.documents = documentsResults["data"];
      this.pageNumber = documentsResults["page_number"];
      this.pageTotal = documentsResults["page_total"];
      this.itemsTotal = documentsResults["items_total"];
      this.limit = documentsResults["items_per_page"];
      this.sort = documentsResults["sort"];
      this.direction = documentsResults["direction"];
      this.documentType = this.documentType || "";
      this.isLoading = false;

      // Call status rule endpoint only in localhost or my document page
      if (
        location.href.includes("mes-documents") ||
        location.href.includes("localhost")
      ) {
        await Alpine.store("documentsStore").rulesStatus.exec();
      }
    },
  },
  mutateOne: {
    async exec(payload, filesToAdd = [], filesToDelete = []) {
      try {
        return payload._id
          ? await NoteService.updateOne(payload, filesToAdd, filesToDelete)
          : await NoteService.createOne(payload, filesToAdd);
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  deleteMany: {
    async exec(documentList) {
      await NoteService.deleteMany(documentList);
    },
  },
  pathologies: {
    async searchByTitleAndAlias(query) {
      const response = await fetch(
        `${API_URL}/pathologies?page=1&limit=50&sort=title&direction=DESC&title=${query}&alias=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${memberToken}`,
          },
        }
      );
      return response.json();
    },
    async searchIdBySlug(slug) {
      const response = await fetch(
        `${API_URL}/pathologies?page=1&limit=2&sort=title&direction=ASC&slug=${slug}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${memberToken}`,
          },
        }
      );
      return response.json();
    },
  },
  rulesStatus: {
    isLoading: true,
    currentStatus: {
      consumedNotesPercent: "",
      consumedMegabytesPercent: "",
      consumedNotesNumber: "",
      consumedMegabytesNumber: "",
      allowedNumberOfNotes: "",
      allowedMegabyte: "",
    },
    async exec() {
      try {
        this.isLoading = true;
        const response = await this.request();

        const consumedNotesNumber =
          response.allowedNumberOfNotes - response.numberOfRemainingNotes;
        const consumedMegabytesNumber =
          response.allowedMegabyte - response.numberOfMegabyteRemaining;

        this.currentStatus.consumedNotesNumber = consumedNotesNumber;
        this.currentStatus.consumedMegabytesNumber = consumedMegabytesNumber;
        this.currentStatus.allowedNumberOfNotes = response.allowedNumberOfNotes;
        this.currentStatus.allowedMegabyte = response.allowedMegabyte;

        this.currentStatus.consumedNotesPercent =
          (consumedNotesNumber / response.allowedNumberOfNotes) * 100;
        this.currentStatus.consumedMegabytesPercent =
          (consumedMegabytesNumber / response.allowedMegabyte) * 100;
        this.isLoading = false;
      } catch (err) {
        console.error(err);
      }
    },
    async request() {
      const response = await fetch(`${API_URL}/notes/rules/status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${memberToken}`,
        },
      });
      return response.json();
    },
  },
  async init() {
    console.log("Alpine init store");
    Alpine.effect(() => {
      // Solves Bug: Re attach Webflow dropdown events to newly rendered items
      if (this.getList.documents) {
        setTimeout(() => {
          window.Webflow.require("dropdown").ready();
          window.Webflow.require("ix2").init();
        }, 1000);
      }
      console.log("painted");
    });
  },
};

export default myDocumentsStore;
