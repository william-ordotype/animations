// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck ToDo Refactor Loading State custom event

import { setNoteList } from "../actions/notesActions";
import { INotesStore } from "@store/myNotes.store";
import Alpine from "alpinejs";
import { StateStore } from "@utils/enums";

const pathologiesStore = {
  pathologies: [],
  async init() {
    const notesStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
    window.memberToken = window.$memberstackDom.getMemberCookie();
    console.log("note list init");
    if (!window.memberToken) {
      // User is not logged in
      // Remove unnecessary requests
      return;
    }
    try {
      //Custom Event Declaration
      window.customEvents = {};
      window.customEvents.loadingTrigger = new CustomEvent(
        "custom:skeletonLoadTrigger"
      );
      window.customEvents.loadingCancel = new CustomEvent(
        "custom:skeletonLoadCancel"
      );

      window.customListeners = {};
      window.customListeners.loadingTrigger = (e) => {
        const target = e.target;
        // Create a skeleton div
        const skeletonDiv = document.createElement("div");
        skeletonDiv.classList.add("skeleton-loader");

        // Add the skeleton div to the current element
        target.style.position = "relative";
        target.appendChild(skeletonDiv);
      };
      window.customListeners.loadingCancel = (e) => {
        const target = e.target;
        // Remove the skeleton div from the current element
        target.style.position = "";
        target.removeChild(target.lastChild);
      };

      const noteListComponents = document.querySelectorAll(
        ".mes_notes_holder [x-text], .empty_state"
      );
      noteListComponents.forEach((component) => {
        component.addEventListener(
          "custom:skeletonLoadTrigger",
          window.customListeners.loadingTrigger
        );
        component.addEventListener(
          "custom:skeletonLoadCancel",
          window.customListeners.loadingCancel
        );
      });

      noteListComponents.forEach((component) => {
        component.dispatchEvent(window.customEvents.loadingTrigger);
      });
      const pathologySlug =
        import.meta.env.MODE === "development" &&
        location.host === "localhost:3021"
          ? "acne"
          : window.location.pathname.split("/")[2];

      window.pathologies = {
        slug: pathologySlug,
      };
      await setNoteList(
        {
          page: 1,
          limit: 50,
          pathology_slug: pathologySlug,
        },
        {
          noteStore: notesStore,
        }
      );
      noteListComponents.forEach((component) => {
        component.dispatchEvent(window.customEvents.loadingCancel);
      });
    } catch (err) {
      console.error(err);
    }
  },
};

export default pathologiesStore;
