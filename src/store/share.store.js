const shareStore = {
  shareOptionsEnabled: false,
  shareSwitch: false,
  activeNote: {},
  activeNoteEmailList: [1, 2, 3],
  activeNotePublicLink: "",
  clearShareModalOptions() {
    this.shareOptionsEnabled = false;
    this.activeNote = {};
    this.activeNoteEmailList = [];
    this.activeNotePublicLink = "";
  },
};

export default shareStore;
