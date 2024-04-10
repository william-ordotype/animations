import { SharedEmailsInNote } from "@interfaces/apiTypes/notesSharesTypes";
import { NoteItemData } from "@interfaces/apiTypes/notesTypes";

export interface IShareStore {
  shareOptionsEnabled: boolean;
  shareSwitch: boolean;
  isShareSwitchLoading: boolean;
  activeNote: NoteItemData | null;
  activeNoteEmailList: SharedEmailsInNote[] | [];
  activeNotePublicLink: string;
  showCopySuccessMsg: boolean;
  showSharingOptions: boolean;
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
  activeNote: null,
  activeNoteEmailList: [],
  activeNotePublicLink: "",
  showCopySuccessMsg: false,
  showSharingOptions: false,
  clearShareModalOptions() {
    this.shareOptionsEnabled = false;
    this.activeNote = null;
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
