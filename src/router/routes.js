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
      debugger;
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
    notfound(context) {
      console.log(context);
      console.log("Not found");
    },
  };
};

async function handleRouter(context, { type }) {
  const page = context.params.page;
  const id = context.params.id;
  if (
    !Alpine.store("userStore").isAuth ||
    !Alpine.store("userStore").hasPaidSub
  ) {
    console.log("Not authorized to navigate");
    return;
  }
  Alpine.store("documentsStore").getList.documentType = type;
  console.log(context);
  if (id) {
    // Shows getOne drawer
    console.log("drawer");
  } else {
    // Shows getList items
    Alpine.store("modalStore").showModal = false;
    Alpine.store("drawerStore").showDrawer = false;

    // Do a reload if necessary
    // TODO could be optimized
    if (
      context.hash.split("/").length !== 3 ||
      Alpine.store("documentsStore").getList.documents.length === 0
    ) {
      await Alpine.store("documentsStore").getList.setDocuments({ type, page });
    }
  }
}
