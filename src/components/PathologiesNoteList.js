function PathologiesNoteList() {
  const pathologySlug = window.location.pathname.split("/")[2];

  // const pathologyId =
  //   Alpine.store("documentsStore").pathologies.searchIdBySlug(pathologySlug);
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
      await Alpine.store("documentsStore").getList.setDocuments({
        limit: 10,
        // pathology: pathologyId,
      });

      this.allDocuments = [...Alpine.store("documentsStore").getList.documents];
      this.notesDocuments = this.allDocuments.filter(
        (doc) => doc.type === "notes"
      );
      console.log(this.notesDocuments);
    },
  };
}

export default PathologiesNoteList;
