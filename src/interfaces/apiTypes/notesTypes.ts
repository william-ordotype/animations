import { PathologyItem } from "./pathologiesTypes.js";

type NoteType = "notes" | "prescriptions" | "recommendations";
type PrescriptionType = "balance_sheet" | "treatment" | "";
type AuthorRole = "client" | "admin";
type SortNotes =
  | "created_on"
  | "pathology"
  | "title"
  | "type"
  | "prescription_type"
  | "updated_by.full_name";

interface NoteItem {
  note: NoteItemData;
  member: NoteItemMember;
}

interface NoteItemData {
  created_by: { role: AuthorRole; email: string; full_name?: string };
  created_on: string;
  documents?: FileData[];
  pathologies?: PathologyItem[];
  member_id: string;
  prescription_type: PrescriptionType;
  title: string;
  type: NoteType;
  updated_on: string;
  _id: string;
  can_share?: boolean;
}

interface NoteItemMember {
  email: string;
  lastName: string;
  name: string;
}

interface NoteList {
  _id: string;
  member_id: string;
  title: string;
  type: NoteType;
  prescription_type: PrescriptionType;
  pathologies?: PathologyItem[]; // Optional array
  documents?: { mime_type: string }[]; // Optional array
  created_on: string;
  updated_on: string;
  created_by: { role: AuthorRole; email: string; full_name?: string }; // full_name is optional
  updated_by?: { role: AuthorRole; email: string }; // Optional field
  can_share?: boolean;
  checked?: boolean;
}

interface FileData {
  created_on: string;
  file_name: string;
  file_url: string;
  member_id: string;
  mime_type: string;
  note_id: string;
  original_name?: string;
  size: number;
  thumbnail_name?: string;
  thumbnail_url?: string;
  updated_on: string;
  _id: string;
}

interface NoteRules {
  allowedMegabyte: number;
  allowedNumberOfNotes: number;
  numberOfMegabyteRemaining: number;
  numberOfRemainingNotes: number;
}

export {
  NoteList,
  NoteItem,
  NoteItemMember,
  NoteItemData,
  NoteType,
  PrescriptionType,
  FileData,
  NoteRules,
  SortNotes,
};
