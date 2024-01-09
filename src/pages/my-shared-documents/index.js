/* global $ */

import PineconeRouter from "pinecone-router";
import focus from "@alpinejs/focus";
// import alpineWebflow from "../../modules/alpine-webflow";
import Alpine from "alpinejs";
import NProgress from "nprogress";
import { setLocale } from "yup";

import SkeletonLoaderEvent from "../../events/SkeletonLoaderEvent";

import "nprogress/nprogress.css";
import "../../modules/slideon/slideon";
import "../../modules/slideon/style.scss";
import "./navigation/routes";
import globals from "../../utils/globals";
import "../../styles.scss";

import modalStore from "../../store/modal.store";
import drawerStore from "../../store/drawer.store";
import userStore from "../../store/user.store";
import toasterStore from "../../store/toaster.store";
import shareStore from "../../store/share.store";
import notesStore from "../../store/myNotes.store";

import {
  DataTablePaginationMenu,
  DataTableListItem,
  DataTableHeader,
  DataTablePerPageDropdown,
  LayoutContainer,
} from "../../components/Notes/DocumentsDataTable";
import { DataTableListItemSubmenu } from "../../components/SharedNotes/DocumentsDataTable";
import DocumentsTypeNavigation from "../../components/Notes/DocumentsTypeNavigation";
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
import DocumentsSearch from "../../components/SharedNotes/DocumentsSearch";
import DocumentsShareModal from "../../components/Notes/DocumentsShareModal";
import { DocumentAvailableSpaceGraphWidget } from "../../components/Notes/DocumentAvailableSpaceGraphWidget";

import { StateStore } from "../../utils/enums";
import { errorMessageFr } from "../../validation/errorMessages";
import { BeforeRemoveSharedInvitationDialog } from "../../components/SharedNotes/DocumentsModal";

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

Alpine.store("notesStore", notesStore);
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
Alpine.data("DeleteSelectedNotes", DeleteSelectedNotes);
Alpine.data(
  "BeforeRemoveSharedInvitationDialog",
  BeforeRemoveSharedInvitationDialog
);

// Documents Files located in drawer and modal
Alpine.data("DocumentFileListItem", DocumentFileListItem);
Alpine.data("DocumentFileInput", DocumentFileInput);

// Documents Available Space Graph Widget
Alpine.data(
  "DocumentAvailableSpaceGraphWidget",
  DocumentAvailableSpaceGraphWidget
);

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
    // alpineWebflow();

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