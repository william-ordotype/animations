import { NoteItem, NoteItemData, NoteItemMember, NoteList } from "./notesTypes";

type ShareStates = "invitation_sent" | "revoked" | "expired" | "available";
type SharingTypes = "email" | "link";

interface SharedEmailsInNote {
  email: string;
  state: ShareStates;
}

interface ActivateNote {
  linkId: string;
}

type DeactivateNote = null;

interface SharedNoteInvitees {
  linkId: string;
  emails: SharedEmailsInNote[];
}

type UpdateSharedNoteOptions = null;

interface SharedWithMeNoteList extends NoteList {
  updated_by: {
    full_name: string;
  };
}

export interface NoteFromLinkUnauth {
  title: string;
  author: string;
}

export interface NoteFromLinkAuth extends NoteItemData {
  updated_by: {
    full_name: string;
  };
}

export interface SharedNoteItem extends NoteItem {
  member: NoteItemMember;
  note: NoteFromLinkAuth;
}

export interface AcceptNoteInvitation {
  noteId: string;
  alreadyAccepted: boolean;
}

export {
  ActivateNote,
  SharedNoteInvitees,
  SharedWithMeNoteList,
  SharingTypes,
  ShareStates,
  DeactivateNote,
  UpdateSharedNoteOptions,
  SharedEmailsInNote,
};
