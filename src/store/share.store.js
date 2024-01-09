const shareStore = {
  // My documents page
  shareOptionsEnabled: false,
  shareSwitch: false,
  isShareSwitchLoading: false,
  activeNote: {},
  activeNoteEmailList: [],
  activeNotePublicLink: "",
  showCopySuccessMsg: false,
  clearShareModalOptions() {
    this.shareOptionsEnabled = false;
    this.activeNote = {};
    this.activeNoteEmailList = [];
    this.activeNotePublicLink = "";
    this.showCopySuccessMsg = false;
  },

  // Invitation page
  isInvitationLoading: true,
  isInvitedAllowed: true,
  invitationNote: {},
};

export default shareStore;
