import Alpine from "alpinejs";
import intersect from "@alpinejs/intersect";
import focus from "@alpinejs/focus";
import PineconeRouter from "pinecone-router";
import NProgress from "nprogress";
import UsersService from "@services/usersService";
import { StateStore } from "@utils/enums";
import userStore from "@store/user.store";
import { setLocale } from "yup";
import { errorMessageFr } from "../../validation/errorMessages";
import notesStore from "@store/myNotes.store";
import toasterStore from "@store/toaster.store";
import {
  PathologyPaneList,
  PathologyPaneNoteItem,
  PathologyTabList,
} from "@components/view/pathology-tabs/pathologyTab.view";
import {
  navigationToastMsgs,
  noteActionsToastMsgs,
  shareNoteActionsToastMsgs,
} from "@utils/toastMessages";
import { noteFormMsg } from "@utils/modalMessages";
import modalStore from "@store/modal.store";
import shareStore from "@store/share.store";
import {
  DeleteSelectedNotes,
  DocumentsModal,
  OpenModalByType,
  PathologiesAutocomplete,
} from "@components/Notes/DocumentsModal";
import DocumentsShareModal from "@components/Notes/DocumentsShareModal";
import {
  PathologiesNoteItem,
  PathologiesNoteList,
} from "@components/PathologiesNoteList";
import {
  DocumentFileInput,
  DocumentFileListItem,
} from "@components/DocumentsFiles";
import globals from "@utils/globals";

window.Alpine = Alpine;

async function init() {
  globals.run();
  NProgress.start();
  const currentUser = await UsersService.getUser();

  Alpine.store(StateStore.USER, userStore(currentUser));
  setLocale({ ...errorMessageFr, ...window.validationMsgCustom });
}

Alpine.store(StateStore.MY_NOTES, notesStore);
Alpine.store(StateStore.MODAL, modalStore);
Alpine.store(StateStore.TOASTER, toasterStore);
Alpine.store(StateStore.SHARE, shareStore);

Alpine.data("PathologyTabList", PathologyTabList);
Alpine.data("PathologyPaneList", PathologyPaneList);
Alpine.data("PathologyPaneNoteItem", PathologyPaneNoteItem);

Alpine.data("PathologiesNoteList", PathologiesNoteList);
Alpine.data("PathologiesNoteItem", PathologiesNoteItem);
Alpine.data("PathologiesAutocomplete", PathologiesAutocomplete);

// Documents Modal
Alpine.data("DocumentsModal", DocumentsModal);
Alpine.data("OpenModalByType", OpenModalByType);
Alpine.data("PathologiesAutocomplete", PathologiesAutocomplete);
Alpine.data("DeleteSelectedNotes", DeleteSelectedNotes);

// Documents Files located in drawer and modal
Alpine.data("DocumentFileListItem", DocumentFileListItem);
Alpine.data("DocumentFileInput", DocumentFileInput);

// Sharing
Alpine.data("DocumentsShareModal", DocumentsShareModal);

window.toastActionMsgCustom = window.toastActionMsgCustom || {};
window.modalMsgCustom = window.modalMsgCustom || {};
window.validationMsgCustom = window.validationMsgCustom || {};

window.toastActionMsg = {
  notes: {
    ...noteActionsToastMsgs,
    ...window.toastActionMsgCustom.notes,
  },
  shareNotes: {
    ...shareNoteActionsToastMsgs,
    ...toastActionMsgCustom.shareNotes,
  },
  navigation: {
    ...navigationToastMsgs,
    ...toastActionMsgCustom.navigation,
  },
};

window.modalMsg = {
  form: {
    ...noteFormMsg,
    ...modalMsgCustom,
  },
};

if (!window.Webflow) {
  window.Webflow = [];
}

window.Quill = Quill;

window.Webflow.push(() => {
  init().then(() => {
    // alpineWebflow();
    Alpine.plugin(intersect);
    Alpine.plugin(focus);
    Alpine.plugin(PineconeRouter);
    Alpine.start();
  });

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
