const pathologiesStore = {
  pathologies: [],
  async init() {
    window.memberToken = $memberstackDom.getMemberCookie();
    console.log("note list init");
    try {
      const pathologySlug = window.location.pathname.split("/")[2] || "acne";
      const pathology = await Alpine.store(
        "documentsStore"
      ).pathologies.searchIdBySlug(pathologySlug);

      window.pathologyId = pathology.data[0]._id;

      await Alpine.store("documentsStore").getList.setDocuments({
        limit: 50,
        pathology: pathology.data[0]._id,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

export default pathologiesStore;
