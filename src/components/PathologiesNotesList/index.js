function PathologiesNoteList() {

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
        await Alpine.store("documentsStore").getList.setDocuments();
        
        this.allDocuments = [...Alpine.store("documentsStore").getList.documents];
        this.notesDocuments = this.allDocuments.filter((doc) => doc.type === "notes");
        console.log(this.notesDocuments);
    }
  };
}

export default PathologiesNoteList;