import getFileExtByMimeType from "../assets/file_ext";

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
  };
}

function PathologiesNoteItem() {
  return {
    // file icons
    fileIcons: [],
    fileIconType(mime_type) {
      return getFileExtByMimeType[mime_type] || "file";
    },
    checkFileIcons(d) {
      const { documents } = d;
      if (!documents) {
        this.fileIcons = [];
        return;
      }
      const allDocTypes = documents.map((elem) => {
        return elem.mime_type;
      });
      const uniqueDocTypes = new Set(allDocTypes);
      this.fileIcons = [...uniqueDocTypes];
    },
  };
}

export { PathologiesNoteList, PathologiesNoteItem };
