function PathologiesNoteList() {
  const pathology = window.location.pathname.split("/")[2];

  return {
    // Getters
    allDocuments: [],
    notesDocuments: [],
    recommendationsDocuments: [],
    prescriptionsDocuments: [],
    // Methods
    mutateDocument(doc) {},

    // Lifecycle hooks
    async init() {
      await Alpine.store("documentsStore").getList.setDocuments({
        limit: 10,
        pathology: pathology,
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
