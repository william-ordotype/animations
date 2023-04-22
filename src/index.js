// import PineconeRouter from 'pinecone-router'
import PineconeRouter from "./modules/pinecone-router-custom";
import focus from "@alpinejs/focus";
import alpineWebflow from "./modules/alpine-webflow";
import Alpine from "alpinejs";

import './router/routes'
import './router/pagination'
import globals from "./utils/globals";

import consultsMemberstackAuthentication from "./authentication";
import DocumentsDataTable from "./components/DocumentsDataTable";
import DocumentsPaginationNavigation from "./components/DocumentsPaginationNavigation";
import DocumentsTypeNavigation from "./components/DocumentsTypeNavigation";
import DocumentsDrawer from "./components/DocumentsDrawer";
import DocumentsModal from "./components/DocumentsModal";
import CreateDocumentsNav from "./components/CreateDocumentsNav/CreateDocumentsNav";


window.Alpine = Alpine;

/**
 * Declaring global variables and running auth check before Alpine starts
 * @returns {Promise<void>}
 */
async function init() {
  globals.run();
  await consultsMemberstackAuthentication();
}

/**
 * Declaring global state to be shared among components
 */
Alpine.store("documentsStore", {
  showModal: false,
  showBeforeSave: false,
  showBeforeCancel: false,
  loadModal: true,
  showDrawer: false,
  loadDrawer: false,

  getOne: {
    document: {},
    async getDocument({ id } = {}) {
      const response = await fetch(
        `https://api.ordotype.fr/v1.0.0/notes/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${window.memberToken}`,
          },
        }
      );
      return await response.json();
    },
    async setDocument(props) {
      const { id } = props;
      const res = await this.getDocument({ id });
      this.document = { ...res };
      console.log(this.document.title);
    },
  },

  getList: {
    documents: [],
    pageNumber: null,
    pageTotal: null,
    itemsTotal: null,
    documentType: null,

    async setDocuments(props = {}) {
      const documentsResults = await this.getDocuments(props);
      this.documents = documentsResults["notes"];
      this.pageNumber = documentsResults["page_number"];
      this.pageTotal = documentsResults["page_total"];
      this.itemsTotal = documentsResults["items_total"];
      this.documentType = this.documentType || "";
    },
    async getDocuments({
      page = 1,
      limit = 10,
      sort = "created_on",
      direction = "DESC",
      type = this.documentType || "",
    } = {}) {
      const response = await fetch(
        `https://api.ordotype.fr/v1.0.0/notes?page=${page}&limit=${limit}&sort=${sort}&direction=${direction}&type=${type}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${memberToken}`,
          },
        }
      );
      return await response.json();
    },
  },

  createOne: {
    document: {
      _id: "",
      type: "",
      title: "",
      pathology: [],
      rich_text_ordo: "",
      fileIds: [],
    },
    files: [],
    async sendDocument() {
      // TODO get all documents from form and send request
      if (this.files.length > 0) {
        await this.uploadFile();
      }
      const res = await this.postDocument(this.document);
      console.log(res);

      this.clearFields();
    },
    async uploadFile() {
      const formData = new FormData();
      formData.append("file", this.files);

      const response = await fetch("https://api.ordotype.fr/v1.0.0/documents", {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${window.memberToken}`,
        },
        body: formData,
      });
      return (this.document.fileId = response.data.fileId);
    },
    async postDocument(data) {
      if(!data.type) {
        return console.error("Document type not sent")
      } else if (!data.title) {
        return console.error("Title not found")
      }
      const response = await fetch(`https://api.ordotype.fr/v1.0.0/notes`, {
        method: data._id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.memberToken}`,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    clearFields() {
      this.document.title = null;
      this.document.pathology = [];
      this.document.type = this.documentType;
      this.document.rich_text_ordo = null;
      this.document.documents = [];

      Alpine.store("documentsStore").showDrawer = false;
      Alpine.store("documentsStore").showModal = false;
      Alpine.store("documentsStore").showBeforeSave = false;
      Alpine.store("documentsStore").showBeforeCancel = false;
    },
  },

  pathologies: {
    async getList(query) {
      const response = await fetch(
        `https://api.ordotype.fr/v1.0.0/pathologies?page=1&limit=10&sort=title&direction=DESC&title=${query}`,
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
});

/**
 * Declaring local state for each component
 */
DocumentsDataTable();
DocumentsPaginationNavigation();
DocumentsTypeNavigation();
DocumentsDrawer();
DocumentsModal();
CreateDocumentsNav();

/**
 Runs program
 */

if (!window.Webflow) {
  window.Webflow = [];
}

window.Quill = Quill;
window.Webflow.push(() => {
  init().then(() => {
    alpineWebflow();

    Alpine.plugin(focus);
    Alpine.plugin(PineconeRouter);
    Alpine.start();

    $("#wf-form-mutateDocument").submit(function (ev) {
      console.log("WF form submit");
      window.createForm(ev);
      return false;
    });
  });
});

/**
 * Routing WIP
 */
document.addEventListener("alpine:initialized", () => {
  window.PineconeRouter.settings.hash = true;
});

window.handleDrawer = async ({ id }) => {
  // TODO Add loading before showing blank drawer
  Alpine.store("documentsStore").loadDrawer = true;
  Alpine.store("documentsStore").showDrawer = true;
  Alpine.store("documentsStore").showModal = false;

  try {
    await Alpine.store("documentsStore").getOne.setDocument({ id });
    Alpine.store("documentsStore").loadDrawer = false;
  } catch (err) {
    // TODO Show warning error notification
  }
};

window.handleModal = ({ type }) => {
  Alpine.store("documentsStore").showDrawer = false;
  Alpine.store("documentsStore").showModal = true;

  Alpine.store("documentsStore").createOne.document.type = type;
};
