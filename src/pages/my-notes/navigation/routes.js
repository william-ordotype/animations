import Alpine from "alpinejs";
import NotesService from "../../../services/notesService";
import { StateStore, ToasterMsgTypes } from "../../../utils/enums";

const noteService = new NotesService();

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
        await window.globals.drawer.handleDrawer({ id });
        console.log("drawer");
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

async function handleRouter(context, { type }) {
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

    const notesRes = await noteService.getList({});
    const { items_per_page, items_total, page_number, page_total } = notesRes;
    Alpine.store(StateStore.MY_NOTES).noteList = notesRes.data;
    Alpine.store(StateStore.MY_NOTES).noteListMeta = {
      pageNumber: page_number,
      pageTotal: page_total,
      itemsTotal: items_total,
      itemsPerPage: items_per_page,
    };
  }
}
