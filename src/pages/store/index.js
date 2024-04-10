import Alpine from "alpinejs";
import { setLocale } from "yup";

import { DocumentAvailableSpaceGraphWidget } from "@components/Notes/DocumentAvailableSpaceGraphWidget.js";

import { StateStore } from "@utils/enums.js";
import notesStore from "@store/myNotes.store";
import userStore from "@store/user.store";
import { errorMessageFr } from "../../validation/errorMessages";
import { setNotesRuleStatus } from "../../actions/notesActions";

async function init() {
  const getUser = await $memberstackDom.getCurrentMember();
  Alpine.store(StateStore.USER, userStore(getUser));
  setLocale(errorMessageFr);
  await setNotesRuleStatus();
}

Alpine.store("notesStore", notesStore);

// Documents Available Space Graph Widget
Alpine.data(
  "DocumentAvailableSpaceGraphWidget",
  DocumentAvailableSpaceGraphWidget
);

/**
 Runs program
 */

window.memberstack = window.memberstack || {};
window.memberstack.instance = window.$memberstackDom;

if (!window.Webflow) {
  window.Webflow = [];
}

window.Webflow.push(() => {
  init().then(() => {
    Alpine.start();
  });
});
