import Alpine from "alpinejs";

window.router = () => {
  return {
    redirectToAll(context) {
      if (context.path === "/") {
        context.redirect("/all");
      }
    },
    async allDocuments(context, props) {
      await handleRouter(context, { type: "" });
    },
    async notesDocs(context) {
      await handleRouter(context, { type: "notes" });
    },
    async ordonnances(context) {
      await handleRouter(context, { type: "prescriptions" });
    },
    async conseils(context) {
      await handleRouter(context, { type: "recommendations" });
    },
    notfound(context) {
      console.log(context);
      console.log("Not found");
    },
  };
};

async function handleRouter(context, { type }) {
  console.log(context);
  const page = context.params.page;
  const id = context.params.id;
  Alpine.store("documentsStore").getList.documentType = type;

  if (id) {
    // Shows getOne drawer
    await window.globals.drawer.handleDrawer({ id });
    console.log("drawer");
  } else {
    // Shows getList items
    Alpine.store("modalStore").showModal = false;
    Alpine.store("modalStore").showDrawer = false;

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
