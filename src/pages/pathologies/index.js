/* global $ */

import "../../styles.scss";
import focus from "@alpinejs/focus";
import alpineWebflow from "../../modules/alpine-webflow";
import Alpine from "alpinejs";

import globals from "../../utils/globals";
import userStore from "../../store/user.store";
import {
  PathologiesNoteList,
  PathologiesNoteItem,
} from "../../components/PathologiesNoteList";
import modalStore from "../../store/modal.store";
import drawerStore from "../../store/drawer.store";
import toasterStore from "../../store/toaster.store";
import DocumentsDrawer from "../../components/Notes/DocumentsDrawer";
import {
  DeleteSelectedNotes,
  DocumentsModal,
  OpenModalByType,
  PathologiesAutocomplete,
} from "../../components/Notes/DocumentsModal";
import {
  DocumentFileInput,
  DocumentFileListItem,
} from "../../components/DocumentsFiles";
import pathologiesStore from "../../store/pathologies.store";
import myNotesStore from "../../store/myNotes.store";
import shareStore from "../../store/share.store";
import { StateStore } from "../../utils/enums";
import DocumentsShareModal from "../../components/Notes/DocumentsShareModal";
import NProgress from "nprogress";
import { setLocale } from "yup";
import { errorMessageFr } from "../../validation/errorMessages";

console.log("pathologies");

window.Alpine = Alpine;

/**
 * Declaring global variables and running auth check before Alpine starts
 * @returns {Promise<void>}
 */
async function init() {
  globals.run();
  NProgress.start();
  const getUser = await $memberstackDom.getCurrentMember();
  Alpine.store(StateStore.USER, userStore(getUser));
  setLocale(errorMessageFr);
}

/**
 * Declaring global state to be shared among components
 */

Alpine.store(StateStore.MY_NOTES, myNotesStore);
Alpine.store(StateStore.MODAL, modalStore);
Alpine.store("drawerStore", drawerStore);
Alpine.store(StateStore.TOASTER, toasterStore);
Alpine.store(StateStore.SHARE, shareStore);
Alpine.store("pathologiesStore", pathologiesStore);

/**
 * Declaring local state for each component
 */

Alpine.data("DocumentsDrawer", DocumentsDrawer);

// Documents Modal
Alpine.data("DocumentsModal", DocumentsModal);
Alpine.data("OpenModalByType", OpenModalByType);
Alpine.data("PathologiesAutocomplete", PathologiesAutocomplete);
Alpine.data("DeleteSelectedNotes", DeleteSelectedNotes);

Alpine.data("PathologiesNoteList", PathologiesNoteList);
Alpine.data("PathologiesNoteItem", PathologiesNoteItem);
Alpine.data("PathologiesAutocomplete", PathologiesAutocomplete);

// Documents Files located in drawer and modal
Alpine.data("DocumentFileListItem", DocumentFileListItem);
Alpine.data("DocumentFileInput", DocumentFileInput);

// Sharing
Alpine.data("DocumentsShareModal", DocumentsShareModal);

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
    Alpine.plugin(focus);
    Alpine.start();

    $("#wf-form-mutateDocument").on("submit", async function (ev) {
      console.log("WF form submit");
      ev.preventDefault();
      await Alpine.store("modalStore").submitForm(ev);
      return false;
    });

    const sharedLinkClipboard = new ClipboardJS("#copy-shared-link", {
      container: document.querySelector(".sauvegarder-ordonnance"),
      text: function () {
        const publicLinkId = Alpine.store("shareStore").activeNotePublicLink;
        return `${location.host}/document-shared-invite?type=link&id=${publicLinkId}`;
      },
    });

    sharedLinkClipboard.on("success", function (e) {
      e.clearSelection();
      Alpine.store(StateStore.SHARE).showCopySuccessMsg = true;

      // Hide successfully copy text after 5 seconds
      setTimeout(() => {
        Alpine.store(StateStore.SHARE).showCopySuccessMsg = false;
      }, 3000);
    });
  });
});
