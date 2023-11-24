/* global $ */

import PineconeRouter from "pinecone-router";
import focus from "@alpinejs/focus";
import alpineWebflow from "../../modules/alpine-webflow";
import Alpine from "alpinejs";
import NProgress from "nprogress";

import SkeletonLoaderEvent from "../../events/SkeletonLoaderEvent";

import "nprogress/nprogress.css";
import "../../modules/slideon/slideon";
import "../../modules/slideon/style.scss";
import "./navigation/routes";
import globals from "../../utils/globals";
import "../../styles.scss";

import myDocumentsStore from "../../store/myDocuments.store";
import modalStore from "../../store/modal.store";
import drawerStore from "../../store/drawer.store";
import userStore from "../../store/user.store";
import toasterStore from "../../store/toaster.store";

import {
  DataTablePaginationMenu,
  DataTableListItem,
  DataTableListItemSubmenu,
  DataTableHeader,
  DataTablePerPageDropdown,
  LayoutContainer,
} from "../../components/notes/DocumentsDataTable";

import DocumentsTypeNavigation from "../../components/Notes/DocumentsTypeNavigation";
import DocumentsDrawer from "../../components/Notes/DocumentsDrawer";
import {
  DocumentsModal,
  OpenModalByType,
  PathologiesAutocomplete,
} from "../../components/DocumentsModal";

import {
  DocumentFileInput,
  DocumentFileListItem,
} from "../../components/DocumentsFiles";
import { DocumentAvailableSpaceGraphWidget } from "../../components/DocumentAvailableSpaceGraphWidget";
import DocumentsSearch from "../../components/DocumentsSearch";
import shareStore from "../../store/share.store";
import DocumentsShareModal from "../../components/DocumentsShareModal";
import NotesStore from "../../store/myNotes.store";
import { StateStore } from "../../utils/enums";
import { setLocale } from "yup";
import { errorMessageFr } from "../../validation/errorMessages";

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

Alpine.store("documentsStore", myDocumentsStore);
Alpine.store("notesStore", NotesStore);
Alpine.store("modalStore", modalStore);
Alpine.store("drawerStore", drawerStore);
Alpine.store("toasterStore", toasterStore);
Alpine.store("shareStore", shareStore);

/**
 * Declaring local state for each component
 */
DocumentsTypeNavigation();
Alpine.data("LayoutContainer", LayoutContainer);
Alpine.data("DocumentsDrawer", DocumentsDrawer);
// Documents Datatable
Alpine.data("DataTableHeader", DataTableHeader);
Alpine.data("DataTableListItem", DataTableListItem);
Alpine.data("DataTableListItemSubmenu", DataTableListItemSubmenu);
Alpine.data("DataTablePaginationMenu", DataTablePaginationMenu);
Alpine.data("DataTablePerPageDropdown", DataTablePerPageDropdown);
Alpine.data("DocumentsSearch", DocumentsSearch);

// Documents Modal
Alpine.data("DocumentsModal", DocumentsModal);
Alpine.data("OpenModalByType", OpenModalByType);
Alpine.data("PathologiesAutocomplete", PathologiesAutocomplete);

// Documents Files located in drawer and modal
Alpine.data("DocumentFileListItem", DocumentFileListItem);
Alpine.data("DocumentFileInput", DocumentFileInput);

// Documents Available Space Graph Widget
Alpine.data("DocumentsAvailableSpace", DocumentAvailableSpaceGraphWidget);

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
    alpineWebflow();

    Alpine.plugin(focus);
    Alpine.plugin(PineconeRouter);
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
        return Alpine.store("shareStore").activeNotePublicLink;
      },
    });

    sharedLinkClipboard.on("success", function (e) {
      e.clearSelection();
      Alpine.store("shareStore").showCopySuccessMsg = true;
    });

    SkeletonLoaderEvent.init();
  });
});

/**
 * Routing WIP
 */
document.addEventListener("alpine:initialized", () => {
  window.PineconeRouter.settings.hash = true;
});
