import { INotesStore, PathologyTab } from "@store/myNotes.store.js";

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
export function showActiveTab(
  currentPathologyTab: PathologyTab,
  noteStore: INotesStore
) {
  const { pathologyActiveTab } = noteStore;
  return currentPathologyTab === pathologyActiveTab;
}

export function uniqueFileIcons(documents: any[]) {
  const allDocTypes = documents.map((elem: { mime_type: any }) => {
    return elem.mime_type;
  });
  const uniqueDocTypes = new Set(allDocTypes);
  return [...uniqueDocTypes];
}
