function PathologiesNoteList() {
  return {
    // Binders
    openModal() {
      return {
        ["x-on:click"]:
          "Alpine.store('modalStore').openModal(null, {type: 'notes'})",
      };
    },
    openDrawer() {
      return {
        ["x-on:click.prevent"]: `await window.globals.drawer.handleDrawer({ id: doc._id })`,
      };
    },
    // Getters
    allDocuments: [],
    notesDocuments: [],
    recommendationsDocuments: [],
    prescriptionsDocuments: [],
    //
    // Lifecycle hooks
    async init() {
      console.log("note list init");
      try {
        const pathologySlug = window.location.pathname.split("/")[2] || "acne";
        debugger;
        const pathology = await Alpine.store(
          "documentsStore"
        ).pathologies.searchIdBySlug(pathologySlug);

        await Alpine.store("documentsStore").getList.setDocuments({
          limit: 50,
          pathology: pathology.data[0]._id,
        });

        this.allDocuments = [
          ...Alpine.store("documentsStore").getList.documents,
        ];
        this.notesDocuments = this.allDocuments.filter(
          (doc) => doc.type === "notes"
        );
        console.log(this.notesDocuments);
      } catch (err) {
        console.error(err);
      }
    },
  };
}

export default PathologiesNoteList;
