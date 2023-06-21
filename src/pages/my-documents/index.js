import PineconeRouter from "../../modules/pinecone-router-custom";
import focus from "@alpinejs/focus";
import alpineWebflow from "../../modules/alpine-webflow";
import Alpine from "alpinejs";

import "../../router/routes";
import "../../router/pagination";
import globals from "../../utils/globals";
import "../../styles.scss";

import {
  DataTablePaginationMenu,
  DataTableListItem,
  DataTableListItemSubmenu,
  DataTableHeader,
  DataTablePerPageDropdown,
} from "../../components/DocumentsDataTable";

import DocumentsTypeNavigation from "../../components/DocumentsTypeNavigation";
import DocumentsDrawer from "../../components/DocumentsDrawer";
import {
  DocumentsModal,
  OpenModalByType,
  PathologiesAutocomplete,
} from "../../components/DocumentsModal";
import myDocumentsStore from "../../store/myDocuments.store";
import modalStore from "../../store/modal.store";
import drawerStore from "../../store/drawer.store";
import userStore from "../../store/user.store";
import toasterStore from "../../store/toaster.store";

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
Alpine.store("toasterStore", toasterStore);

/**
 * Declaring local state for each component
 */
DocumentsTypeNavigation();
DocumentsDrawer();

// Documents Datatable
Alpine.data("DataTableHeader", DataTableHeader);
Alpine.data("DataTableListItem", DataTableListItem);
Alpine.data("DataTableListItemSubmenu", DataTableListItemSubmenu);
Alpine.data("DataTablePaginationMenu", DataTablePaginationMenu);
Alpine.data("DataTablePerPageDropdown", DataTablePerPageDropdown);

// Documents Modal
Alpine.data("DocumentsModal", DocumentsModal);
Alpine.data("OpenModalByType", OpenModalByType);
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
      console.log(index);
      console.log("files", this.files);
    },
  };
});

// Alpine.store('toasterStore').toasterMsg('This is a toaster message', 'success', 2000)

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
