function SharingInvitation() {
  return {
    layoutContainer() {
      return {
        ["x-bind:style"]:
          "$store.shareStore.isInvitedAllowed && { flexDirection: 'row', alignItems: 'stretch' }",
      };
    },

    // views
    notLoggedIn() {
      return {
        ["x-show"]:
          "!$store.shareStore.isInvitationLoading && !$store.userStore.isAuth",
        ["x-transition"]: "",
      };
    },
    accessRevoked() {
      return {
        ["x-show"]:
          "!$store.shareStore.isInvitationLoading && $store.userStore.isAuth && !$store.shareStore.isInvitedAllowed",
        ["x-transition"]: "",
      };
    },
    sharedAccess() {
      return {
        ["x-show"]:
          "!$store.shareStore.isInvitationLoading && $store.userStore.isAuth && $store.userStore.hasPaidSub && $store.shareStore.isInvitedAllowed",
        ["x-transition"]: "",
      };
    },
  };

  // modalGetOne
}

export default SharingInvitation;
