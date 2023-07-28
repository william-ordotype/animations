function PathologiesNoteList() {
  return {
    // Binders
    openNotesModal() {
      return {
        ["x-on:click"]:
          "Alpine.store('modalStore').openModal(null, {type: 'notes'})",
      };
    },
    openPrescription() {
      return {
        ["x-on:click"]:
          "Alpine.store('modalStore').openModal(null, {type: 'prescriptions'})",
      };
    },
    openRecomendationModal() {
      return {
        ["x-on:click"]:
          "Alpine.store('modalStore').openModal(null, {type: 'recommendations'})",
      };
    },
    openDrawer() {
      return {
        ["x-on:click.prevent"]: `await window.globals.drawer.handleDrawer({ id: doc._id })`,
      };
    },
    openDrawerBilan() {
      return {
        ["x-on:click.prevent"]: `await window.globals.drawer.handleDrawer({ id: bilan._id })`,
      };
    },
    openDrawerTreatment() {
      return {
        ["x-on:click.prevent"]: `await window.globals.drawer.handleDrawer({ id: treatment._id })`,
      };
    },
    openDrawerConseil() {
      return {
        ["x-on:click.prevent"]: `await window.globals.drawer.handleDrawer({ id: conseil._id })`,
      };
    },
    fileIconType(mime_type) {
      const fileType = mime_type.split("/");
      return fileType[1];
    },
    checkFileIcons(d) {
      const { documents } = d;
      const allDocTypes = documents.map((elem) => {
        return elem.mime_type;
      });
      const uniqueDocTypes = new Set(allDocTypes);
      this.fileIcons = [...uniqueDocTypes];
    },
  };
}

export default PathologiesNoteList;
