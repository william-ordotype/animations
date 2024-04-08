import Alpine from "alpinejs";
import { StateStore, ToasterMsgTypes } from "../../../utils/enums";
import NProgress from "nprogress";
import {
  setSharedNoteList,
  setSharedNoteOpened,
} from "../../../actions/sharedNotesActions";
import { handleDrawer } from "../../../components/Notes/DocumentsDrawer";
import { setNoteOpened } from "../../../actions/notesActions";

window.router = () => {
  return {
    redirectToAll(context) {
      if (context.path === "/") {
        context.redirect("/list");
      }
    },
    async listDocuments(context) {
      Alpine.store(StateStore.MY_NOTES).noteListType = "shared";
      await handleRouter(context);
    },
    async viewDocuments(context) {
      const id = context.params.id;
      if (id) {
        // Shows getOne drawer

        try {
          await setSharedNoteOpened({ noteId: id });
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
          NProgress.done();
        } catch (err) {
          // TODO Show warning error notification
          NProgress.done();
        }
      }
    },
    createPrescription(context) {
      context.redirect("/");

      Alpine.store("modalStore").openModal(null, {
        type: "prescriptions",
      });

      // Inserts pasteOnEditor storage variable saved on ordonnances-types page into rich text editor
      if (localStorage.pasteOnEditor) {
        $(".ql-editor").html("<p></p>");
        $(".ql-editor").append(localStorage.pasteOnEditor);
        $(".ql-editor").find("p:empty").remove();

        localStorage.removeItem("pasteOnEditor");
      }
    },
    notfound(context) {
      console.log("Not found");
      Alpine.store(StateStore.TOASTER).toasterMsg(
        "Not found",
        ToasterMsgTypes.ERROR
      );
    },
  };
};

async function handleRouter(context) {
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
      };

      await setSharedNoteList(payload);
      NProgress.done();
    } catch (err) {
      console.error(err);
      NProgress.done();
    }
  } else {
    NProgress.done();
  }
}
