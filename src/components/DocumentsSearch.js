function DocumentsSearch() {
  return {
    handleSearchInput() {
      return {
        ["x-on:change"]: (ev) => {
          Alpine.store("documentsStore").getList.setDocuments({
            title: ev.target.value,
          });
        },
      };
    },
  };
}

export default DocumentsSearch;
