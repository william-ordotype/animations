import Alpine from "alpinejs";

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
      Alpine.store("documentsStore").getList.documentTypeTitle = listTitle;
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
      Alpine.store("toasterStore").toasterMsg("Not found", "error");
      // if (context.path.includes("list") || context.path.includes("view")) {
      //   console.log(context);
      //   console.log("Not found");
      // } else {
      //   location.href = context.path;
      // }
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
  Alpine.store("documentsStore").getList.documentType = type;

  // Shows getList items
  Alpine.store("modalStore").showModal = false;
  Alpine.store("drawerStore").showDrawer = false;

  // Do a reload if necessary
  // AKA if when closing the drawer there are not documents loaded
  if (
    !context.hash.split("/").includes("view") ||
    Alpine.store("documentsStore").getList.documents.length === 0
  ) {
    Alpine.store("documentsStore").getList.isSearch = false;
    Alpine.store("documentsStore").getList.searchValue = "";

    await Alpine.store("documentsStore").getList.setDocuments({
      type,
      page,
      limit: perPage,
      sort,
      direction,
    });
  }
}
