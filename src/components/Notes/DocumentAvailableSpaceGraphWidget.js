function DocumentAvailableSpaceGraphWidget() {
  return {
    showRulesLoading: {
      ["x-show"]: "$store.notesStore.isRuleStatusLoading === true",
    },
    showRulesWidget: {
      ["x-show"]:
        "$store.userStore.isAuth && !($store.notesStore.isRuleStatusLoading)",
    },
    docPercent: "$store.notesStore.currentRuleStatus.consumedMegabytesPercent",
    notesPercent: "$store.notesStore.currentRuleStatus.consumedNotesPercent",
    consumedNotesNumber() {
      return {
        ["x-text"]: "$store.notesStore.currentRuleStatus.consumedNotesNumber",
      };
    },
    consumedMegabytesNumber() {
      return {
        ["x-text"]:
          "$store.notesStore.currentRuleStatus.consumedMegabytesNumber",
      };
    },
    allowedNumberOfNotes() {
      return {
        ["x-text"]:
          "' ' + $store.notesStore.currentRuleStatus.allowedNumberOfNotes",
      };
    },
    allowedMegabytes() {
      return {
        ["x-text"]: "' '+ $store.notesStore.currentRuleStatus.allowedMegabyte",
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
