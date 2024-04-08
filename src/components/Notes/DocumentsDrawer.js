import Alpine from "alpinejs";
import { StateStore } from "../../utils/enums";
import { setNoteOpened, setNotesRuleStatus } from "../../actions/notesActions";
import SkeletonLoaderEvent from "../../events/SkeletonLoaderEvent";
import ShareNotesService from "../../services/notesSharesService";
import {
  setCloneNote,
  setRemoveSharedInvitations,
} from "../../actions/sharedNotesActions";

const shareNotesService = new ShareNotesService();

function DocumentsDrawer() {
  /**
   * @type import('#store').INotesStore
   */
  const notesStore = Alpine.store(StateStore.MY_NOTES);
  return {
    drawerBackdrop() {
      return {
        ["x-show"]: () => notesStore.drawerOpened,
        ["x-on:click.self"]: async () => await handleCloseDrawer(),
        ["x-transition.opacity"]: "",
      };
    },
    drawerElem() {
      return {
        ["x-show"]: () => notesStore.drawerOpened,
        ["x-transition.scale.origin.right"]: "",
        ["x-transition:enter.scale.80"]: "",
        ["x-transition:enter.scale.90"]: "",
      };
    },
    drawerLoading() {
      return {
        ["x-show"]: () => notesStore.isNoteLoading,
      };
    },
    drawerContent() {
      return {
        ["x-show"]: () => !notesStore.isNoteLoading,
      };
    },
    drawerClose() {
      return {
        ["x-on:click.prevent.self"]: async () => await handleCloseDrawer(),
      };
    },
    async drawerDeleteOne(ev) {
      ev.preventDefault();
      const noteId = notesStore.noteOpened.note._id;
      Alpine.store(StateStore.MODAL).deleteList = [noteId];
      Alpine.store(StateStore.MODAL).showBeforeDelete = true;
    },
    drawerEdit(ev) {
      ev.preventDefault();
      Alpine.store("modalStore").openModal(notesStore.noteOpened.note);
    },
    drawerShare() {
      return {
        ["@click.prevent"]: async (ev) => {
          const note = notesStore.noteOpened.note;
          const isShareActive = !!note["can_share"];

          SkeletonLoaderEvent.dispatchCustomEvent(
            document.querySelector(".search_result_wrapper.partage"),
            true
          );
          SkeletonLoaderEvent.dispatchCustomEvent(
            document.querySelectorAll(
              ".activer_par_wrapper .text-size-regular, .activer_par_wrapper .text-size-small"
            ),
            true
          );
          Alpine.store(StateStore.MODAL).showSharingOptions = true;
          Alpine.store(StateStore.SHARE).shareSwitch = isShareActive;
          Alpine.store(StateStore.SHARE).shareOptionsEnabled = isShareActive;
          Alpine.store(StateStore.SHARE).showSharingOptions = isShareActive;
          Alpine.store(StateStore.SHARE).activeNote = note;
          if (isShareActive) {
            const { emails, linkId } =
              await shareNotesService.getSharedInfoFromNote({
                noteId: note._id,
              });
            Alpine.store(StateStore.SHARE).activeNoteEmailList = emails;
            Alpine.store(StateStore.SHARE).activeNotePublicLink = linkId;
          }
          SkeletonLoaderEvent.dispatchCustomEvent(
            document.querySelector(".search_result_wrapper.partage"),
            false
          );
          SkeletonLoaderEvent.dispatchCustomEvent(
            document.querySelectorAll(
              ".activer_par_wrapper .text-size-regular, .activer_par_wrapper .text-size-small"
            ),
            false
          );
        },
      };
    },

    // shared page
    drawerClone() {
      return {
        ["x-on:click.prevent"]: async () => {
          const noteId = notesStore.noteOpened.note._id;
          await setCloneNote({ noteId });
        },
      };
    },
    drawerRemoveAccess() {
      return {
        ["x-on:click.prevent"]: async () => {
          const noteId = notesStore.noteOpened.note._id;
          const res = await setRemoveSharedInvitations({ noteIds: [noteId] });

          if (!res.deletedCount > 0) {
            // dont close modal
            return;
          }

          // close modal
          // Reset drawer
          const pageNumber = notesStore.noteListMeta.pageNumber || "";
          const documentType = notesStore.noteListType;
          // Redirect to list
          PineconeRouter.currentContext.navigate(
            `/list?type=${documentType ? documentType : "all"}${
              pageNumber && "&page=" + pageNumber
            }`
          );

          // Reset document object in store
          console.log("close drawer");
          await setNotesRuleStatus();
          notesStore.noteOpened = {
            note: null,
            member: null,
          };
        },
      };
    },

    // Getters
    getOneTitle() {
      return {
        ["x-text"]: "$store.notesStore.noteOpened?.note?.title || ''",
      };
    },
    getOneCreatedOn() {
      return {
        ["x-text"]:
          "new Date($store.notesStore.noteOpened?.note?.created_on).toLocaleDateString('fr-FR')",
      };
    },
    getOneRichText() {
      return {
        ["x-html"]: "$store.notesStore.noteOpened?.note?.rich_text_ordo",
      };
    },
    getAuthor() {
      return {
        ["x-text"]:
          "($store.notesStore.noteOpened?.member?.lastName === undefined && $store.notesStore.noteOpened?.member?.name === undefined) ? 'Non renseigné' : ($store.notesStore.noteOpened?.member?.name || 'Non renseigné') + ' ' + ($store.notesStore.noteOpened.member.lastName || 'Non renseigné')",
      };
    },
    copyBtn() {
      return {
        ["x-show"]:
          "$store.notesStore.noteOpened.note?.type === 'prescriptions'",
      };
    },
    printBtn() {
      return {
        ["x-show"]:
          "$store.notesStore.noteOpened.note?.type === 'recommendations'",
      };
    },
    getFiles() {
      return {
        ["x-for"]: "file in $store.notesStore.noteOpened.note?.documents",
      };
    },
    listPathologies() {
      return {
        ["x-for"]: "ptag in $store.notesStore.noteOpened.note?.pathologies",
      };
    },
  };
}

async function handleCloseDrawer() {
  /**
   * @type import('#store').INotesStore
   */
  const notesStore = Alpine.store(StateStore.MY_NOTES);

  if (window.location.pathname.includes("/pathologies")) {
    notesStore.drawerOpened = false;
  } else {
    // Reset drawer
    const pageNumber = notesStore.noteListMeta.pageNumber || "";
    const documentType = notesStore.noteListType;
    // Redirect to list
    PineconeRouter.currentContext.navigate(
      `/list?type=${documentType ? documentType : "all"}${
        pageNumber && "&page=" + pageNumber
      }`
    );
  }
  // Reset document object in store
  console.log("close drawer");
  await setNotesRuleStatus();
  notesStore.noteOpened = {
    note: null,
    member: null,
  };
}

export default DocumentsDrawer;
export { handleDrawer };
