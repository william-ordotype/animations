// import PineconeRouter from 'pinecone-router'
import PineconeRouter from "./modules/pinecone-router-custom";
import alpineWebflow from "./modules/alpine-webflow";
import Alpine from "alpinejs";

import globals from "./utils/globals";
import consultsMemberstackAuthentication from "./authentication";
import DocumentsDataTable from "./components/DocumentsDataTable";
import DocumentsPaginationNavigation from "./components/DocumentsPaginationNavigation";
import DocumentsTypeNavigation from "./components/DocumentsTypeNavigation";
import DocumentsDrawer from "./components/DocumentsDrawer";

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
  loadModal: true,
  showDrawer: false,

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

    async setDocuments(props) {
      const documentsResults = await this.getDocuments(props);
      this.documents = documentsResults["notes"];
      this.pageNumber = documentsResults["page_number"];
      this.pageTotal = documentsResults["page_total"];
      this.itemsTotal = documentsResults["items_total"];
      this.documentType = props.type;
    },
    async getDocuments({
      page = 1,
      limit = 10,
      sort = "created_on",
      direction = "DESC",
      type,
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
      // TODO add a poll or throttle
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

Alpine.data("DocumentsModal", () => {
  return {
    modalBackdrop() {
      return {
        ["x-show"]: "$store.documentsStore.showModal",
        ["x-transition"]: "",
      };
    },
    modalElem() {
      return {
        ["x-show"]: "$store.documentsStore.showDrawer",
        ["x-transition"]: "",
      };
    },
  };
});

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
    redirectToAll(context) {
      if (context.path === "/") {
        context.redirect("/all");
      }
    },
    async allDocuments(context, props) {
      await routing(context, { type: "" });
    },
    async notesDocs(context) {
      await routing(context, { type: "notes" });
    },
    async ordonnances(context) {
      await routing(context, { type: "prescriptions" });
    },
    async conseils(context) {
      await routing(context, { type: "recommendations" });
    },
    notfound(context) {
      console.log(context);
      console.log("Not found");
    },
  };
};

async function routing(context, { type }) {
  console.log(context);
  const page = context.params.page;
  const id = context.params.id;

  if (id) {
    // TODO show drawer
    await window.handleDrawer({ id });
    console.log("drawer");
  } else {
    // show list
    Alpine.store("documentsStore").showModal = false;
    Alpine.store("documentsStore").showDrawer = false;
    if (context.hash.split("/").length !== 3 || Alpine.store("documentsStore").getList.documents.length === 0) {
      await Alpine.store("documentsStore").getList.setDocuments({ type, page });
    }
  }
}

window.handlePagination = (k, v, params) => {
  const [route, hashParams] = location.hash.split("?");
  const h = hashParams ? hashParams.split("&") : hashParams;
  let cParams = [];

  for (const [key, value] of Object.entries({ ...params })) {
    if (key === k) {
      cParams.push([key, v].join("="));
    }
  }
  cParams.length > 0 ? cParams.join("&") : (cParams = [k, v].join("="));
  location.hash = `${route}?${cParams}`;
};

window.handleDrawer = async ({ id }) => {
  // TODO Add loading before showing blank drawer
  Alpine.store("documentsStore").showDrawer = true;
  Alpine.store("documentsStore").loadDrawer = true;
  Alpine.store("documentsStore").showModal = false;

  try {
    await Alpine.store("documentsStore").getOne.setDocument({ id });
    Alpine.store("documentsStore").loadDrawer = false;
  } catch (err) {
    // TODO Show warning error notification
  }
};
window.modal = () => {};

window.removeLastUrlParam = (url) => {
  const params = url.path.split('/')
  const lastParam = url.pop()
  return params.join('/')
}
