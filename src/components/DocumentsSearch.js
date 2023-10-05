import Alpine from "alpinejs";

function DocumentsSearch() {
  return {
    handleSearchInput() {
      return {
        ["x-on:change"]: async (ev) => {
          Alpine.store("documentsStore").getList.isSearch = true;
          await Alpine.store("documentsStore").getList.setDocuments({
            title: ev.target.value,
          });
        },
        ["x-show"]: "true",
        ["x-model"]: "$store.documentsStore.getList.searchValue",
      };
    },
  };
}

export default DocumentsSearch;
