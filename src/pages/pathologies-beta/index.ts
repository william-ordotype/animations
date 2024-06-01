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
  PathologyPaneView,
  PathologyTabList,
  PathologyTabView,
} from "@components/view/pathology-tabs/pathologyTab.view";
import {
  navigationToastMsgs,
  noteActionsToastMsgs,
  shareNoteActionsToastMsgs,
} from "@utils/toastMessages";
import { noteFormMsg } from "@utils/modalMessages";

window.Alpine = Alpine;

async function init() {
  NProgress.start();
  const currentUser = await UsersService.getUser();

  Alpine.store(StateStore.USER, userStore(currentUser));
  setLocale({ ...errorMessageFr, ...window.validationMsgCustom });
}

Alpine.store("notesStore", notesStore);
Alpine.store("toasterStore", toasterStore);

Alpine.data("PathologyTabList", PathologyTabList);
Alpine.data("PathologyPaneList", PathologyPaneList);

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

window.Webflow.push(() => {
  init().then(() => {
    // alpineWebflow();
    Alpine.plugin(intersect);
    Alpine.plugin(focus);
    Alpine.plugin(PineconeRouter);
    Alpine.start();
  });
});
