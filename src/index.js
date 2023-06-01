import PineconeRouter from "./modules/pinecone-router-custom";
import focus from "@alpinejs/focus";
import alpineWebflow from "./modules/alpine-webflow";
import Alpine from "alpinejs";

import "./router/routes";
import "./router/pagination";
import globals from "./utils/globals";
import "./styles.scss";

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
import PathologiesAutocomplete from "./components/PathologiesAutocomplete";
import DataTableSubNav from "./components/DataTableSubnav";

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
Alpine.data("DataTableSubNav", DataTableSubNav);
Alpine.data("PathologiesAutocomplete", PathologiesAutocomplete);
Alpine.data("FormFiles", () => {
  return {
    filesUploaded: [],
    async handleFileChange(ev) {
      const filesInputValue = Array.from(ev.target.files);
      // const uploadedFiles = await Alpine.store('documentsStore').files.createOne.uploadFile(filesInputValue);

      filesInputValue.forEach((file) => {
        this.filesUploaded.push(file);
      });
    },
    handleDeleteFile(_, index) {
      debugger;
      console.log(index);
      console.log("files", this.files);
    },
  };
});

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
