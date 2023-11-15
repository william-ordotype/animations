import Alpine from "alpinejs";
import PineconeRouter from "pinecone-router";
import alpineWebflow from "../../modules/alpine-webflow";
import SkeletonLoaderEvent from "../../events/SkeletonLoaderEvent";
import { router } from "./navigation/routes";
import globals from "../../utils/globals";
import userStore from "../../store/user.store";
import { StateStore } from "../../utils/enums";
import toasterStore from "../../store/toaster.store";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import SharingInvitation from "../../components/SharingInvitation";
import shareStore from "../../store/share.store";

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

  const getUser = await $memberstackDom.getCurrentMember();
  Alpine.store("userStore", userStore(getUser));
}

Alpine.store(StateStore.TOASTER, toasterStore);
Alpine.store(StateStore.SHARE, shareStore);

Alpine.data("SharingNavigation", router);
Alpine.data("SharingInvitation", SharingInvitation);

/**
 Runs program
 */

window.memberstack = window.memberstack || {};
window.memberstack.instance = window.$memberstackDom;

window.Webflow.push(() => {
  init().then(() => {
    alpineWebflow();

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
