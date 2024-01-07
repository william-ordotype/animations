import Alpine from "alpinejs";

function DocumentAvailableSpaceGraphWidget() {
  return {
    docPercent:
      "$store.documentsStore.rulesStatus.currentStatus.consumedMegabytesPercent",
    notesPercent:
      "$store.documentsStore.rulesStatus.currentStatus.consumedNotesPercent",
    consumedNotesNumber() {
      return {
        ["x-text"]:
          "$store.documentsStore.rulesStatus.currentStatus.consumedNotesNumber",
      };
    },
    consumedMegabytesNumber() {
      return {
        ["x-text"]:
          "$store.documentsStore.rulesStatus.currentStatus.consumedMegabytesNumber",
      };
    },
    allowedNumberOfNotes() {
      return {
        ["x-text"]:
          "' ' + $store.documentsStore.rulesStatus.currentStatus.allowedNumberOfNotes",
      };
    },
    allowedMegabytes() {
      return {
        ["x-text"]:
          "' '+ $store.documentsStore.rulesStatus.currentStatus.allowedMegabyte",
      };
    },
    filesBar() {
      return {
        ["x-bind:style"]: `{position: 'absolute', zIndex: ${
          this.docPercent < this.notesPercent ? 3 : 1
        }, width: ${this.docPercent} + '%' }`,
        ["x-transition:enter"]: "transition ease-out duration-300",
      };
    },
    notesBar() {
      return {
        ["x-bind:style"]: `{position: 'absolute',zIndex: ${
          this.docPercent > this.notesPercent ? 3 : 1
        }, width: ${this.notesPercent} + '%' }`,
        ["x-transition:enter"]: "transition ease-out duration-300",
      };
    },
  };
}

export { DocumentAvailableSpaceGraphWidget };
