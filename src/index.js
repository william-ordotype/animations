// import PineconeRouter from 'pinecone-router'
import PineconeRouter from "./modules/pinecone-router-custom";
import focus from "@alpinejs/focus";
import alpineWebflow from "./modules/alpine-webflow";
import Alpine from "alpinejs";

import "./router/routes";
import "./router/pagination";
import globals from "./utils/globals";

import consultsMemberstackAuthentication from "./authentication";
import DocumentsDataTable from "./components/DocumentsDataTable";
import DocumentsPaginationNavigation from "./components/DocumentsPaginationNavigation";
import DocumentsTypeNavigation from "./components/DocumentsTypeNavigation";
import DocumentsDrawer from "./components/DocumentsDrawer";
import DocumentsModal from "./components/DocumentsModal";
import CreateDocumentsNav from "./components/CreateDocumentsNav/CreateDocumentsNav";
import myDocumentsStore from "./store/myDocuments.store";

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
Alpine.store("documentsStore", myDocumentsStore);

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

    $("#wf-form-mutateDocument").submit(async function (ev) {
      console.log("WF form submit");
      ev.preventDefault();
      await window.globals.modal.form.handleFormSubmit(ev);
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
  Alpine.store("documentsStore").showDrawer = false;
  Alpine.store("documentsStore").showModal = true;

  Alpine.store("documentsStore").createOne.document.type = type;
};
