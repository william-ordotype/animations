import Alpine from "alpinejs";
import { StateStore, ToasterMsgTypes } from "@utils/enums";
import NProgress from "nprogress";
import {
  setNoteList,
  setNoteOpened,
  setNotesRuleStatus,
} from "../../../actions/notesActions";

window.router = () => {
  const notesStore = /**
   * @type {import("@store/myNotes.store").INotesStore}
   */ (Alpine.store(StateStore.MY_NOTES));

  return {
    /**
     * @param {import("pinecone-router/dist/types").Context} context
     */
    redirectToAll(context) {
      if (context.path === "/") {
        context.redirect("/list");
      }
    },
    /**
     * @param {import("pinecone-router/dist/types").Context} context
     */
    async listDocuments(context) {
      let type;
      let listTitle;
      switch (context.params.type) {
        case "notes":
          type = context.params.type;
          listTitle = window.globals.documentTypes["notes"];
          break;
        case "recommendations":
          type = context.params.type;
          listTitle = window.globals.documentTypes["recommendations"];
          break;
        case "prescriptions":
          type = context.params.type;
          listTitle = window.globals.documentTypes["prescriptions"];
          break;
        default:
          type = "";
          listTitle = "Tous mes documents";
      }
      notesStore.noteListType = listTitle;
      await handleRouter(context, { type });
    },
    /**
     * @param {import("pinecone-router/dist/types").Context} context
     */
    async viewDocuments(context) {
      const id = context.params.id;
      if (id) {
        // Shows getOne drawer
        // await window.globals.drawer.handleDrawer({ id });
        await setNoteOpened(id);
        console.log("drawer");
      }
      NProgress.done();
    },
    /**
     * @param {import("pinecone-router/dist/types").Context} context
     */
    createPrescription(context) {
      const type = context.path.split("/")[2];
      const qlEditor = $(".ql-editor");
      context.redirect("/");
      Alpine.store("modalStore").openModal(null, {
        type,
      });

      // Inserts pasteOnEditor storage variable saved on ordonnances-types page into rich text editor
      if (localStorage.pasteOnEditor) {
        qlEditor.html("<p></p>");
        qlEditor.append(localStorage.pasteOnEditor);

        if (qlEditor.find(".qr-code-link-block").length > 0) {
          const qrCodes = $(".qr-code-link-block").detach().unwrap("p");
          $(".ql-editor p:last-child")
            .addClass("qrCodesWrapper")
            .append(qrCodes);
        }

        qlEditor.find("p:empty").remove();

        localStorage.removeItem("pasteOnEditor");
      }
    },
    notfound() {
      console.log("Not found");
      Alpine.store(StateStore.TOASTER).toasterMsg(
        window.toastActionMsg.navigation.notFound,
        ToasterMsgTypes.ERROR
      );
    },
  };
};

/**
 * @param {import("pinecone-router/dist/types").Context} context
 */

async function handleRouter(context, { type }) {
  const notesStore = /**
   * @type {import("@store/myNotes.store").INotesStore}
   */ (Alpine.store(StateStore.MY_NOTES));

  const userStore = /**
   * @type {import("@store/user.store").IUserStore}
   */ (Alpine.store(StateStore.USER));

  NProgress.start();
  notesStore.isRuleStatusLoading = true;

  const { page, perPage, sort, direction } = context.params;
  if (!userStore.isAuth || !userStore.hasPaidSub) {
    console.log("Not authorized to navigate");
    return;
  }
  notesStore.noteListType = type;

  // Shows getList items
  Alpine.store("modalStore").showModal = false;

  // Do a reload if necessary
  // AKA if when closing the drawer there are not documents loaded
  if (
    !context.hash.split("/").includes("view") ||
    notesStore.noteList.length === 0
  ) {
    notesStore.isSearch = false;
    notesStore.searchValue = "";
    try {
      const payload = {
        page,
        limit: perPage,
        sort,
        direction,
        type,
      };
      await Promise.all([setNoteList(payload), setNotesRuleStatus()]);

      NProgress.done();
    } catch (err) {
      NProgress.done();
    }
  } else {
    NProgress.done();
  }
}
