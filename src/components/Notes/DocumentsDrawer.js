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
  return {
    drawerStore: Alpine.store("drawerStore"),
    drawerBackdrop() {
      return {
        ["x-show"]: "drawerStore.showDrawer",
        ["x-on:click"]: "drawerClose($event)",
        ["x-transition.opacity"]: "",
      };
    },
    drawerElem() {
      return {
        ["x-show"]: "drawerStore.showDrawer",
        ["x-transition.scale.origin.right"]: "",
        ["x-transition:enter.scale.80"]: "",
        ["x-transition:enter.scale.90"]: "",
      };
    },
    drawerLoading() {
      return {
        ["x-show"]: "drawerStore.loadDrawer",
      };
    },
    drawerContent() {
      return {
        ["x-show"]: "!drawerStore.loadDrawer",
      };
    },
    drawerClose() {
      return {
        ["x-on:click.prevent.self"]: async () => {
          if (window.location.pathname.includes("/pathologies")) {
            Alpine.store("drawerStore").hideDrawer();
          } else {
            // Reset drawer
            const pageNumber =
              Alpine.store(StateStore.MY_NOTES).noteListMeta.pageNumber || "";
            const documentType = Alpine.store(StateStore.MY_NOTES).noteListMeta
              .noteListType;
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
          Alpine.store(StateStore.MY_NOTES).noteOpened = {
            note: {},
            member: {},
          };
        },
      };
    },
    async drawerDeleteOne(ev) {
      ev.preventDefault();
      await Alpine.store("modalStore").openBeforeDelete(
        Alpine.store(StateStore.MY_NOTES).noteOpened.note
      );
    },
    drawerEdit(ev) {
      ev.preventDefault();
      Alpine.store("modalStore").openModal(
        Alpine.store(StateStore.MY_NOTES).noteOpened.note
      );
    },
    drawerShare() {
      return {
        ["@click.prevent"]: async (ev) => {
          const note = Alpine.store(StateStore.MY_NOTES).noteOpened.note;
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
          const noteId = Alpine.store(StateStore.MY_NOTES).noteOpened.note._id;
          await setCloneNote({ noteId });
        },
      };
    },
    drawerRemoveAccess() {
      return {
        ["x-on:click.prevent"]: async () => {
          const noteId = Alpine.store(StateStore.MY_NOTES).noteOpened.note._id;
          const res = await setRemoveSharedInvitations({ noteIds: [noteId] });

          if (!res.deletedCount > 0) {
            // dont close modal
            return;
          }

          // close modal
          // Reset drawer
          const pageNumber =
            Alpine.store(StateStore.MY_NOTES).noteListMeta.pageNumber || "";
          const documentType = Alpine.store(StateStore.MY_NOTES).noteListMeta
            .noteListType;
          // Redirect to list
          PineconeRouter.currentContext.navigate(
            `/list?type=${documentType ? documentType : "all"}${
              pageNumber && "&page=" + pageNumber
            }`
          );

          // Reset document object in store
          console.log("close drawer");
          await setNotesRuleStatus();
          Alpine.store(StateStore.MY_NOTES).noteOpened = {
            note: {},
            member: {},
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

/**
 * Controller that handles the visibility of the drawer. Can be accessed from the <i>globals</i> object
 * @param id
 * @returns {Promise<void>}
 */
async function handleDrawer({ id }) {
  // TODO this could be handled internally and remove drawer store
  Alpine.store("drawerStore").loadDrawer = true;
  Alpine.store("drawerStore").showDrawer = true;
  Alpine.store("modalStore").showModal = false;

  try {
    await setNoteOpened(id);
    if (Alpine.store(StateStore.MY_NOTES).noteOpened.note?._id) {
      Alpine.store("drawerStore").loadDrawer = false;
    } else {
      Alpine.store("drawerStore").hideDrawer();
      Alpine.store("toasterStore").toasterMsg(
        "Document introuvable",
        "error",
        4500
      );
    }
  } catch (err) {
    // TODO Show warning error notification
  }
}

export default DocumentsDrawer;
export { handleDrawer };
