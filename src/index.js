import PineconeRouter from "./modules/pinecone-router-custom";
import focus from "@alpinejs/focus";
import alpineWebflow from "./modules/alpine-webflow";
import Alpine from "alpinejs";

import "./router/routes";
import "./router/pagination";
import globals from "./utils/globals";
import "./styles.scss";

import consultsMemberstackAuthentication from "./authentication";
import DocumentsDataTable from "./components/DocumentsDataTable";
import DocumentsPaginationNavigation from "./components/DocumentsPaginationNavigation";
import DocumentsTypeNavigation from "./components/DocumentsTypeNavigation";
import DocumentsDrawer from "./components/DocumentsDrawer";
import DocumentsModal from "./components/DocumentsModal";
import CreateDocumentsNav from "./components/CreateDocumentsNav/CreateDocumentsNav";
import myDocumentsStore from "./store/myDocuments.store";
import modalStore from "./store/modal.store";
import drawerStore from "./store/drawer.store";
import userStore from "./store/user.store";

window.Alpine = Alpine;

/**
 * Declaring global variables and running auth check before Alpine starts
 * @returns {Promise<void>}
 */
async function init() {
  globals.run();
  // await consultsMemberstackAuthentication();

  const getUser = await $memberstackDom.getCurrentMember();
  Alpine.store("userStore", userStore(getUser));
}

/**
 * Declaring global state to be shared among components
 */

Alpine.store("documentsStore", myDocumentsStore);
Alpine.store("modalStore", modalStore);
Alpine.store("drawerStore", drawerStore);

/**
 * Declaring local state for each component
 */
DocumentsDataTable();
DocumentsPaginationNavigation();
DocumentsTypeNavigation();
DocumentsDrawer();
DocumentsModal();
CreateDocumentsNav();

Alpine.data("DataTableSubNav", (d) => {
  return {
    async showEditModal(ev, d) {
      ev.preventDefault();
      await Alpine.store("modalStore").openModal(d, { type: d.type });
    },
    openDeleteDocument(ev, d) {
      ev.preventDefault();
      Alpine.store("modalStore").openBeforeDelete(d);
    },
  };
});

Alpine.data("PathologiesAutocomplete", () => ({
  pathologyInputValue: Alpine.store('modalStore').pathologyName,
  showSearchResults() {
    return {
      ["x-show"]: "$store.modalStore.form.pathology.length",
      ["x-transition"]: ""
    }
  },
  init() {
    Alpine.effect(() => {
      console.log('Effected')
    })
    globals.autocomplete({
      container: "#pathology-autocomplete",
      placeholder: "Rechercher une pathologie",
      id: 'aa-pathology',
      detachedMediaQuery: "none",
      debug: true,
      async getSources({ query = "" }) {
        const res = await Alpine.store("documentsStore").pathologies.getList(
            query
        );
        return [
          {
            sourceId: "pathologies",
            getItems(query) {
              return res.pathologies || [];
            },
            getItemInputValue({ item }) {
              return item.title;
            },
            templates: {
              item({ item, html }) {
                return html`<div>${item.title}</div>`;
              },
            },
            onSelect(obj) {
              console.log(obj)
              Alpine.store('modalStore').form.pathology = [obj.item._id];
              Alpine.store('modalStore').pathologyName = obj.item.title
              $('#aa-pathology-input').attr('disabled', true);
              $('#pathology-autocomplete .aa-InputWrapper, #pathology-autocomplete .aa-InputWrapperSuffix').hide();
              $('#pathology-autocomplete .aa-Form').css('background', '#ccc')
            },

          },
        ];
      },
      onReset(obj) {
        console.log('reset', obj);
        Alpine.store('modalStore').form.pathology = []
        Alpine.store('modalStore').pathologyName = ""
      },
      renderNoResults({ state, render }, root) {
        render(`No results for "${state.query}".`, root);
      },
    })
  }
}));

/**
 Runs program
 */

window.memberstack = window.memberstack || {};
window.memberstack.instance = window.$memberstackDom;

$(".create_document_form").removeClass("w-form");

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

    $("#wf-form-mutateDocument").submit(async function (ev) {
      debugger;
      console.log("WF form submit");
      ev.preventDefault();
      await Alpine.store("modalStore").submitForm(ev);
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

window.handleModal = ({ type }) => {
  Alpine.store("drawerStore").showDrawer = false;
  Alpine.store("modalStore").showModal = true;

  Alpine.store("documentsStore").createOne.document.type = type;
};
