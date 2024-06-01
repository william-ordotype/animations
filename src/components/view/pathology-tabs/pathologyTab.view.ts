import Alpine, { AlpineComponent } from "alpinejs";
import {
  showActiveTab,
  switchActiveTab,
} from "@components/view/pathology-tabs/pathologyTab.controller";
import { INotesStore, PathologyTab } from "@store/myNotes.store";
import { StateStore } from "@utils/enums";

export type PathologyTabListOptions = {
  tab: (pathologyTab: PathologyTab) => void;
};

export function PathologyTabList(): AlpineComponent<PathologyTabListOptions> {
  const notesStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
  return {
    tab(pathologyTab) {
      return {
        ["x-on:click.prevent"]: () => {
          switchActiveTab(pathologyTab, notesStore);
        },
      };
    },
  };
}

type PathologyPaneListOptions = {
  noteList: () => object;
  tabPane: () => object;
};

export function PathologyPaneList(
  pathologyTab: PathologyTab
): AlpineComponent<PathologyPaneListOptions> {
  const notesStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;

  return {
    init() {
      Alpine.effect(() => {
        const isCurrentTabActive = showActiveTab(pathologyTab, notesStore);
        if (isCurrentTabActive) {
          console.log("call notes", pathologyTab);
        }
      });
    },
    tabPane() {
      return {
        ["x-if"]: () => {
          return showActiveTab(pathologyTab, notesStore);
        },
      };
    },
    noteList() {
      return {
        ["x-for"]: "noteItem in $store.noteStore.noteList",
      };
    },
  };
}
