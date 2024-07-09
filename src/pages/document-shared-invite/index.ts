import Alpine from "alpinejs";
import PineconeRouter from "pinecone-router";
import SkeletonLoaderEvent from "../../events/SkeletonLoaderEvent";
import { router } from "./navigation/routes";
import globals from "@utils/globals";
import userStore from "@store/user.store";
import { StateStore } from "@utils/enums";
import toasterStore from "@store/toaster.store";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import SharingInvitation from "@components/SharedNotes/SharingInvitation";
import shareStore from "@store/share.store";
import { DocumentFileListItem } from "@components/DocumentsFiles";
import "../../styles.scss";
import {
  navigationToastMsgs,
  noteActionsToastMsgs,
  shareNoteActionsToastMsgs,
} from "@utils/toastMessages";
import UsersService from "@services/usersService";

window.Alpine = Alpine;

/**
 * Declaring global variables and running auth check before Alpine starts
 * @returns {Promise<void>}
 */
async function init() {
  globals.run();

  NProgress.start();
  Alpine.store(StateStore.SHARE).isInvitedAllowed = false;
  Alpine.store(StateStore.SHARE).isInvitationLoading = true;

  const currentUser = await UsersService.getUser();

  Alpine.store(StateStore.USER, userStore(currentUser));
}

Alpine.store(StateStore.TOASTER, toasterStore);
Alpine.store(StateStore.SHARE, shareStore);

Alpine.data("SharingNavigation", router);
Alpine.data("SharingInvitation", SharingInvitation);
Alpine.data("DocumentFileListItem", DocumentFileListItem);

/**
 Runs program
 */

window.toastActionMsgCustom = window.toastActionMsgCustom || {};

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

window.Webflow.push(() => {
  init().then(() => {
    Alpine.plugin(PineconeRouter);
    Alpine.start();

    SkeletonLoaderEvent.init();
  });
});

/**
 * Routing WIP
 */
document.addEventListener("alpine:initialized", () => {
  window.PineconeRouter.settings.hash = false;
  window.PineconeRouter.settings.basePath = "/";
});
