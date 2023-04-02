import alpineWebflow from "./modules/alpine-webflow";
import Alpine from "alpinejs";
import { documentTypes } from "./utils/globals";

window.Alpine = Alpine;

async function init() {
  documentTypes();
  console.log("Inside memberstack check");
  const user = await memberstack.instance.getCurrentMember();
  try {
    if (!user.data) {
      memberstack.instance.openModal("LOGIN").then(({ data }) => {
        memberstack.instance.hideModal();
        console.log(data);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("alpine:init", () => {
  console.log("inside Alpine init...");
  const memberToken = memberstack.instance.getMemberCookie();

  Alpine.store("documentsStore", {
    documents: [],
    pageNumber: null,
    pageTotal: null,

    async init() {
      const documentsResults = await this.getDocuments();
      this.documents = documentsResults["notes"];
      this.pageNumber = documentsResults["page_number"];
      this.pageTotal = documentsResults["page_total"];

      Alpine.effect(() => {
        // TODO add a poll or throttle
        // Re attach Webflow dropdown events to newly rendered items
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
    } = {}) {
      const response = await fetch(
        `https://api.ordotype.fr/v1.0.0/notes?page=${page}&limit=${limit}&sort=${sort}&direction=${direction}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${memberToken}`,
          },
        }
      );
      const documents = await response.json();
      return documents;
    },
  });

  Alpine.data("documentsDataTable", () => ({
    textTitle(d) {
      return {
        ["x-text"]: "d.title",
      };
    },
    textType(d) {
      return {
        ["x-text"]: "window.documentTypes[d.type]",
      };
    },
    textDate(d) {
      return {
        ["x-text"]: "new Date(d.updated_on).toLocaleDateString('fr-FR')",
      };
    },
  }));

  Alpine.data("documentsPagination", () => ({
    pageNumber(n) {
      return {
        ["x-text"]: "n",
        ["x-on:click"]: "console.log(await $store.documentsStore.getDocuments({page:n}))"
      }
    }
  }))
});

document.addEventListener("alpine:initialized", () => {
  window.Webflow.require("dropdown").ready();
});

if (!window.Webflow) {
  window.Webflow = [];
}
window.Webflow.push(() => {
  init().then(() => {
    alpineWebflow();
    Alpine.start();
  });
});
