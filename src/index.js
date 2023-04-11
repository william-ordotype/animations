import PineconeRouter from "pinecone-router";
import alpineWebflow from "./modules/alpine-webflow";
import Alpine from "alpinejs";

import globals from "./utils/globals";
import consultsMemberstackAuthentication from "./authentication";
import DocumentsDataTable from "./components/DocumentsDataTable";
import DocumentsPaginationNavigation from "./components/DocumentsPaginationNavigation";

window.Alpine = Alpine;

window.myDocumentType = ""

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
const memberToken = memberstack.instance.getMemberCookie();
Alpine.store("documentsStore", {
  documents: [],
  pageNumber: null,
  pageTotal: null,
  itemsTotal: null,
  documentType: null,

  async setDocuments(props) {
    const documentsResults = await this.getDocuments(props);
    this.documents = documentsResults["notes"];
    this.pageNumber = documentsResults["page_number"];
    this.pageTotal = documentsResults["page_total"];
    this.itemsTotal = documentsResults["items_total"];
  },

  async init() {
    console.log('Alpine init store')
    // await this.setDocuments(myDocumentType);

    Alpine.effect(() => {
      // TODO add a poll or throttle
      // Solves Bug: Re attach Webflow dropdown events to newly rendered items
      setTimeout(() => {
        window.Webflow.require("dropdown").ready();
        window.Webflow.require("ix2").init();
      }, 1000);
    });
  },

  async getDocuments({
    page = 1,
    limit = 10,
    sort = "created_on",
    direction = "DESC",
    type = "",
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
});

/**
 * Declaring local state for each component
 */
DocumentsDataTable();
DocumentsPaginationNavigation();


/**
 Runs program
 */

if (!window.Webflow) {
  window.Webflow = [];
}
window.Webflow.push(() => {
  init().then(() => {
    alpineWebflow();

    Alpine.plugin(PineconeRouter);
    Alpine.start();
  });
});

/**
 * Routing WIP
 */
document.addEventListener("alpine:initialized", () => {
  window.PineconeRouter.settings.hash = true;
});

window.router = () => {
  return {
    async allDocuments(context) {
      // document.querySelector('#app').innerHTML = `<h1>Home</h1>`;
      console.log("holaa");
      window.myDocumentType = ""
      console.log('routing all')
      console.log(context)
      console.log(context.params)
      await Alpine.store('documentsStore').setDocuments();
    },
    async notesDocs(context) {
      debugger;
      window.myDocumentType = "notes"
      // TODO add loading switch in method
      console.log('loading')
      console.log(context)
      await Alpine.store('documentsStore').setDocuments();
    },
    async ordonnances(context) {
      window.myDocumentType = "prescriptions"
      // TODO add loading switch in method
      console.log('loading')
      console.log(context)
      await Alpine.store('documentsStore').setDocuments();
    },
    async conseils(context) {
      window.myDocumentType = "recommendations"
      // TODO add loading switch in method
      console.log('loading')
      console.log(context)
      await Alpine.store('documentsStore').setDocuments({documentType: window.myDocumentType});
    },
    notfound(context) {
      console.log(context);
      console.log("Not found");
    },
  };
};
