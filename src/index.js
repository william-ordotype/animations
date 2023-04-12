// import PineconeRouter from 'pinecone-router'
import PineconeRouter from './modules/pinecone-router-custom'
import alpineWebflow from "./modules/alpine-webflow";
import Alpine from "alpinejs";

import globals from "./utils/globals";
import consultsMemberstackAuthentication from "./authentication";
import DocumentsDataTable from "./components/DocumentsDataTable";
import DocumentsPaginationNavigation from "./components/DocumentsPaginationNavigation";

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
    type,
  } = {}) {
    debugger;
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
    async allDocuments(context, props) {
      await routing(context, {type: ""})
    },
    async notesDocs(context) {
      await routing(context,{type: "notes"});
    },
    async ordonnances(context) {
      debugger;
     await routing(context,{type: "prescriptions"});
    },
    async conseils(context) {
      await routing(context,{type: "recommendations"});
    },
    notfound(context) {
      console.log(context);
      console.log("Not found");
    },
  };
};

async function routing(context, {type}) {
  console.log(context)
  const page = context.params.page;
  await Alpine.store('documentsStore').setDocuments({type, page});
}

window.handlePagination = (k, v, params ) => {
  debugger;
  const [route, hashParams] = location.hash.split('?')
  const h = hashParams ? hashParams.split('&') : hashParams;
  let cParams= [];

  for (const [key, value] of Object.entries({...params})) {
      if(key === k) {
        cParams.push([key,v].join('=') )
      }
  }
  cParams.length > 0 ? cParams.join("&") : cParams = [k,v].join("=")
  location.hash=`${route}?${cParams}`
}
