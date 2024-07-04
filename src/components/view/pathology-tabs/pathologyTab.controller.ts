import { INotesStore, PathologyTab } from "@store/myNotes.store.js";
import { NoteItemData, NoteList } from "@interfaces/apiTypes/notesTypes";
import { SharedWithMeNoteList } from "@interfaces/apiTypes/notesSharesTypes";
import { IUserStore } from "@store/user.store";
import getFileExtByMimeType from "@assets/file_ext";

import { IShareStore } from "@store/share.store";
import shareNotesService from "@services/notesSharesService";
import { setMixedNotesList } from "../../../actions/notesActions";

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

export async function printDiv(divName: string) {
  // @ts-expect-error ToDo review module import
  await import("print-this");

  $(divName).printThis({
    importCSS: true,
    importStyle: true,
    debug: true,
    beforePrint: function () {
      $(divName).show();
    },
    // afterPrint: function () {
    // },
  });
}

export async function deleteNote({
  noteId,
  modalStore,
}: {
  noteId: string;
  modalStore: any;
}) {
  modalStore.deleteList = [noteId];
  modalStore.showBeforeDelete = true;
}

export async function shareNote(
  note: NoteItemData,
  notesStore: INotesStore,
  modalStore: any,
  shareStore: IShareStore
) {
  const isShareActive = !!note["can_share"];

  modalStore.showSharingOptions = true;
  shareStore.shareSwitch = isShareActive;
  shareStore.shareOptionsEnabled = isShareActive;
  shareStore.showSharingOptions = isShareActive;
  shareStore.activeNote = note;
  if (isShareActive) {
    const res = await shareNotesService.getSharedInfoFromNote({
      noteId: note._id,
    });
    const { emails, linkId } = res.data;
    shareStore.activeNoteEmailList = emails;
    shareStore.activeNotePublicLink = linkId;
  }
}

export async function getNotesFromPathologyTab(
  page: number = 1,
  pathologyTab: PathologyTab,
  pathologySlug: string,
  notesStore: INotesStore
) {
  if (pathologyTab === "balance_sheet" || pathologyTab === "treatment") {
    await setMixedNotesList(
      {
        page,
        limit: 10,
        pathology_slug: pathologySlug,
        type: "prescriptions",
        prescription_type: pathologyTab,
      },
      {
        noteStore: notesStore,
      }
    );
  } else {
    await setMixedNotesList(
      {
        page,
        limit: 10,
        pathology_slug: "acne",
        type: pathologyTab,
        prescription_type: "",
      },
      {
        noteStore: notesStore,
      }
    );
  }
}

const MOBILE_SCREEN_WIDTH = 566;

export function isSeenFromMobile() {
  const currentScreenWidth = window.innerWidth;
  return currentScreenWidth <= MOBILE_SCREEN_WIDTH;
}
