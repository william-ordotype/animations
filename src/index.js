import PineconeRouter from "pinecone-router";
import alpineWebflow from "./modules/alpine-webflow";
import Alpine from "alpinejs";
import globals from "./utils/globals";

window.Alpine = Alpine;

async function init() {
  globals.run();
  console.log("Inside memberstack check");
  try {
    // TODO optimize so it doesn't ask two requests in prod
    const user = await memberstack.instance.getCurrentMember();
    if (!user.data) {
      // Shows unauthenticated state
      $(".paywall_wrapper").show();

    // TODO Refactor to show login modal only in local
      memberstack.instance.openModal("LOGIN").then(({ data }) => {
        memberstack.instance.hideModal();
        $(".paywall_wrapper").hide();
        $(".content_main_wrapper").show();
        console.log(data);
      })
    } else {
      // Shows authenticated state
      $(".content_main_wrapper").show();
    }

    // Removes leading
    $(".loading_container").hide();
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
    itemsTotal: null,

    async setDocuments(props) {
      const documentsResults = await this.getDocuments(props);
      this.documents = documentsResults["notes"];
      this.pageNumber = documentsResults["page_number"];
      this.pageTotal = documentsResults["page_total"];
      this.itemsTotal = documentsResults["items_total"];
    },

    async init() {
      await this.setDocuments();
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
      return await response.json();
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
        ["x-text"]: "window.globals.documentTypes[d.type]",
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
        ["x-on:click"]: "$store.documentsStore.setDocuments({page: +n})",
      };
    },
    pageNext() {
      return {
        ["x-on:click"]: "$store.documentsStore.setDocuments({page: +$store.documentsStore.pageNumber+1})"
      }
    }
  }));
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

    Alpine.plugin(PineconeRouter);
    Alpine.start();
  });
});
