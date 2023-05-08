import Alpine from "alpinejs";

function CreateDocumentsNav() {
  return Alpine.data("CreateDocumentsNav", () => {
    return {
      prescriptionsNewType() {
        return {
          // type = ordonnances
          ["x-on:click.prevent"]:
            "$store.modalStore.openModal(null, {type: 'prescriptions'})",
        };
      },
      notesNewType() {
        // type = notes
        return {
          ["x-on:click.prevent"]:
            "$store.modalStore.openModal(null,{type: 'notes'})",

        };
      },
      recommendationsNewType() {
        // type = conseils patient
        return {
          ["x-on:click.prevent"]:
            "$store.modalStore.openModal(null,{type: 'recommendations'})",
        };
      },
    };
  });
}

export default CreateDocumentsNav;
