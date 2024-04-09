export interface IShareStore {
  shareOptionsEnabled: boolean;
  shareSwitch: boolean;
  isShareSwitchLoading: boolean;
  activeNote: ToDo;
  activeNoteEmailList: string[];
  activeNotePublicLink: string;
  showCopySuccessMsg: boolean;
  clearShareModalOptions: () => void;

  // Invitation page
  isInvitationLoading: boolean;
  isInvitedAllowed: boolean;
  invitationNote: ToDo;
  invitationNotExists: boolean;
}

const shareStore: IShareStore = {
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
  invitationNotExists: false,
};

export default shareStore;
