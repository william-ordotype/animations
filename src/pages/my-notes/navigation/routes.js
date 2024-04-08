import Alpine from "alpinejs";
import { StateStore, ToasterMsgTypes } from "@utils/enums.js";
import NProgress from "nprogress";
import {
  setNoteList,
  setNoteOpened,
  setNotesRuleStatus,
} from "../../../actions/notesActions";

window.router = () => {
  return {
    redirectToAll(context) {
      if (context.path === "/") {
        context.redirect("/list");
      }
    },
    async listDocuments(context) {
      let type;
      let listTitle;
      switch (context.params.type) {
        case "notes":
          type = context.params.type;
          listTitle = globals.documentTypes["notes"];
          break;
        case "recommendations":
          type = context.params.type;
          listTitle = globals.documentTypes["recommendations"];
          break;
        case "prescriptions":
          type = context.params.type;
          listTitle = globals.documentTypes["prescriptions"];
          break;
        default:
          type = "";
          listTitle = "Tous mes documents";
      }
      Alpine.store(StateStore.MY_NOTES).noteListType = listTitle;
      await handleRouter(context, { type });
    },
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
    notfound(context) {
      console.log("Not found");
      Alpine.store(StateStore.TOASTER).toasterMsg(
        window.toastActionMsg.navigation.notFound,
        ToasterMsgTypes.ERROR
      );
    },
  };
};

async function handleRouter(context, { type }) {
  NProgress.start();
  Alpine.store(StateStore.MY_NOTES).isRuleStatusLoading = true;

  const { page, perPage, sort, direction } = context.params;
  if (
    !Alpine.store("userStore").isAuth ||
    !Alpine.store("userStore").hasPaidSub
  ) {
    console.log("Not authorized to navigate");
    return;
  }
  Alpine.store(StateStore.MY_NOTES).noteListType = type;

  // Shows getList items
  Alpine.store("modalStore").showModal = false;
  Alpine.store("drawerStore").showDrawer = false;

  // Do a reload if necessary
  // AKA if when closing the drawer there are not documents loaded
  if (
    !context.hash.split("/").includes("view") ||
    Alpine.store(StateStore.MY_NOTES).noteList.length === 0
  ) {
    Alpine.store(StateStore.MY_NOTES).isSearch = false;
    Alpine.store(StateStore.MY_NOTES).searchValue = "";
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
