const shareStore = {
  shareOptionsEnabled: false,
  shareSwitch: false,
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
};

export default shareStore;
