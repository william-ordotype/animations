import Alpine from "alpinejs";

function DocumentsTypeNavigation() {
  return Alpine.data("DocumentsNavigation", () => ({
    allType() {
      return {
        [":class"]: '$store.notesStore.noteListType === "" && "active"',
      };
    },
    notesType() {
      return {
        [":class"]: '$store.notesStore.noteListType === "notes" && "active"',
      };
    },
    recommendationsType() {
      return {
        [":class"]:
          '$store.notesStore.noteListType === "recommendations" && "active"',
      };
    },
    prescriptionsType() {
      return {
        [":class"]:
          '$store.notesStore.noteListType === "prescriptions" && "active"',
      };
    },
  }));
}

export default DocumentsTypeNavigation;
