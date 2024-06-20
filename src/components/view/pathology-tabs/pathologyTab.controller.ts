import { INotesStore, PathologyTab } from "@store/myNotes.store.js";
import { NoteList } from "@interfaces/apiTypes/notesTypes";
import { SharedWithMeNoteList } from "@interfaces/apiTypes/notesSharesTypes";
import { IUserStore } from "@store/user.store";
import getFileExtByMimeType from "@assets/file_ext";

/**
 * Use inside a click event to switch active tab
 */
export function switchActiveTab(
  activeTab: PathologyTab,
  noteStore: INotesStore
) {
  noteStore.pathologyActiveTab = activeTab;

  return activeTab;
}

/**
 * Use inside x-show or x-if to display content
 */
export function canShowActiveTab(
  currentPathologyTab: PathologyTab,
  noteStore: INotesStore
) {
  const { pathologyActiveTab } = noteStore;
  return currentPathologyTab === pathologyActiveTab;
}

export function isNoteShared(
  note: NoteList | SharedWithMeNoteList,
  userStore: IUserStore
) {
  return note.member_id !== userStore.user?.id;
}

export function getMimeType(mime_type: keyof typeof getFileExtByMimeType) {
  return getFileExtByMimeType[mime_type];
}
