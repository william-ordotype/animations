import "../../styles.scss";
import focus from "@alpinejs/focus";
import alpineWebflow from "../../modules/alpine-webflow";
import Alpine from "alpinejs";

import globals from "../../utils/globals";
import userStore from "../../store/user.store";
import PathologiesNoteList from "../../components/PathologiesNoteList";
import myDocumentsStore from "../../store/myDocuments.store";
import modalStore from "../../store/modal.store";
import drawerStore from "../../store/drawer.store";
import toasterStore from "../../store/toaster.store";
import DocumentsDrawer from "../../components/DocumentsDrawer";
import {
  DocumentsModal,
  OpenModalByType,
  PathologiesAutocomplete,
} from "../../components/DocumentsModal";
import {
  DocumentFileInput,
  DocumentFileListItem,
} from "../../components/DocumentsFiles";
import pathologiesStore from "../../store/pathologies.store";

console.log("pathologies");

window.Alpine = Alpine;

/**
 * Declaring global variables and running auth check before Alpine starts
 * @returns {Promise<void>}
 */
async function init() {
  globals.run();

  const getUser = await $memberstackDom.getCurrentMember();
  await Alpine.store("userStore", userStore(getUser));

  /**
   * Declaring global state to be shared among components
   */

  Alpine.store("documentsStore", myDocumentsStore);
  Alpine.store("modalStore", modalStore);
  Alpine.store("drawerStore", drawerStore);
  Alpine.store("toasterStore", toasterStore);
  Alpine.store("pathologiesStore", pathologiesStore);

  /**
   * Declaring local state for each component
   */

  Alpine.data("PathologiesNoteList", PathologiesNoteList);
  DocumentsDrawer();
  // Documents Modal
  Alpine.data("DocumentsModal", DocumentsModal);
  Alpine.data("OpenModalByType", OpenModalByType);
  Alpine.data("PathologiesAutocomplete", PathologiesAutocomplete);

  // Documents Files located in drawer and modal
  Alpine.data("DocumentFileListItem", DocumentFileListItem);
  Alpine.data("DocumentFileInput", DocumentFileInput);
}
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
    Alpine.start();

    $("#wf-form-mutateDocument").submit(async function (ev) {
      console.log("WF form submit");
      ev.preventDefault();
      await Alpine.store("modalStore").submitForm(ev);
      return false;
    });
  });
});
