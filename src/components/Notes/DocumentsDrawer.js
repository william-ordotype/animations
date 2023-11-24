import Alpine from "alpinejs";
import { StateStore } from "../../utils/enums";
import { setNoteOpened } from "../../actions/notesActions";

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
        ["x-on:click.prevent.self"]: () => {
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
