import Alpine from "alpinejs";
import { StateStore, ToasterMsgTypes } from "@utils/enums";
import NProgress from "nprogress";
import {
  setSharedNoteList,
  setSharedNoteOpened,
} from "../../../actions/sharedNotesActions";
import { STATUS_TYPES } from "@store/toaster.store";

window.router = () => {
  const notesStore = /**
   * @type {import("@store/myNotes.store").INotesStore}
   */ (Alpine.store(StateStore.MY_NOTES));

  const toastStore = /**
   * @type {import("@store/toaster.store").IToastStore}
   */ (Alpine.store(StateStore.TOASTER));

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
      // @ts-expect-error ToDo review noteListType.
      notesStore.noteListType = "shared";
      await handleRouter(context);
    },
    /**
     * @param {import("pinecone-router/dist/types").Context} context
     */
    async viewDocuments(context) {
      const id = context.params.id;
      if (id) {
        // Shows getOne drawer

        try {
          await setSharedNoteOpened({ noteId: id });
          if (!notesStore.noteOpened.note?._id) {
            toastStore.toasterMsg("Document introuvable", "error", 4500);
          }
          NProgress.done();
        } catch (err) {
          // TODO Show warning error notification
          NProgress.done();
        }
      }
    },
    /**
     * @param {import("pinecone-router/dist/types").Context} context
     */
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
    notfound() {
      console.log("Not found");
      toastStore.toasterMsg("Not found", STATUS_TYPES.error);
    },
  };
};

/**
 * @param {import("pinecone-router/dist/types").Context} context
 */
async function handleRouter(context) {
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
