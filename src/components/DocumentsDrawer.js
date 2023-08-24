import Alpine from "alpinejs";
import drawerStore from "../store/drawer.store";

function DocumentsDrawer() {
  return Alpine.data("DocumentsDrawer", () => {
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
      drawerClose(ev) {
        ev.preventDefault();
        if (ev.target !== ev.currentTarget) {
          return false;
        }
        if (window.location.pathname.includes("/pathologies")) {
          Alpine.store("drawerStore").hideDrawer();
          return;
        }
        // Reset drawer
        const pageNumber =
          Alpine.store("documentsStore").getList.pageNumber || "";
        const documentType =
          Alpine.store("documentsStore").getList.documentType;
        // Redirect to list
        PineconeRouter.currentContext.navigate(
          `/list?type=${documentType ? documentType : "all"}${
            pageNumber && "&page=" + pageNumber
          }`
        );
        // Reset document object in store
        Alpine.store("documentsStore").getOne.document = {
          note: {},
          member: {},
        };
      },
      async drawerDeleteOne(ev) {
        ev.preventDefault();
        await Alpine.store("modalStore").openBeforeDelete(
          Alpine.store("documentsStore").getOne.document
        );
      },
      drawerEdit(ev) {
        ev.preventDefault();
        Alpine.store("modalStore").openModal(
          Alpine.store("documentsStore").getOne.document.note
        );
      },

      // Getters
      getOneTitle() {
        return {
          ["x-text"]: "$store.documentsStore.getOne.document.note.title",
        };
      },
      getOneCreatedOn() {
        return {
          ["x-text"]:
            "new Date($store.documentsStore.getOne.document.note.created_on).toLocaleDateString('fr-FR')",
        };
      },
      getOneRichText() {
        return {
          ["x-html"]:
            "$store.documentsStore.getOne.document.note.rich_text_ordo",
        };
      },
      getAuthor() {
        return {
          ["x-text"]:
            "($store.documentsStore.getOne.document.member.lastName === undefined ? '' : $store.documentsStore.getOne.document.member.lastName) + ' ' + ($store.documentsStore.getOne.document.member.name === 'undefined' ? $store.documentsStore.getOne.document.member.name : 'Non renseigné')",
        };
      },
    };
  });
}

/**
 * Controller that handles the visibility of the drawer. Can be accessed from the <i>globals</i> object
 * @param id
 * @returns {Promise<void>}
 */
async function handleDrawer({ id }) {
  // TODO Add loading before showing blank drawer
  Alpine.store("drawerStore").loadDrawer = true;
  Alpine.store("drawerStore").showDrawer = true;
  Alpine.store("modalStore").showModal = false;

  try {
    await Alpine.store("documentsStore").getOne.setDocument({ id });
    if (Alpine.store("documentsStore").getOne.document.note._id) {
      Alpine.store("drawerStore").loadDrawer = false;
    } else {
      Alpine.store("drawerStore").hideDrawer();
      Alpine.store("toasterStore").toasterMsg("Id not found", "error", 3500);
    }
  } catch (err) {
    // TODO Show warning error notification
  }
}

export default DocumentsDrawer;
export { handleDrawer };
