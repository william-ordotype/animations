type NoteType = "notes" | "prescriptions" | "recommendations";
type PrescriptionType = "balance_sheet" | "treatment" | "";
type AuthorRole = "client" | "admin";

interface NoteItem {
  item: NoteItemData;
  member: NoteItemMember;
}

interface NoteItemData {
  created_by: { role: AuthorRole; email: string; full_name: string };
  created_on: string;
  documents?: FileData[];
  pathologies?: { _id: string; title: string; slug: string }[];
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

interface NoteList extends NoteItem {
  created_by: { role: AuthorRole; email: string; full_name: string };
  created_on: string;
  documents?: { mime_type: string }[];
  pathologies?: { _id: string; title: string; slug: string };
  member_id: string;
  prescription_type: PrescriptionType;
  title: string;
  type: NoteType;
  updated_on: string;
  _id: string;
  can_share?: boolean;
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

export {
  NoteList,
  NoteItem,
  NoteItemMember,
  NoteItemData,
  NoteType,
  PrescriptionType,
  FileData,
};
