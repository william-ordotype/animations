function BeforeRemoveSharedInvitationDialog() {
  return {
    modal: {
      ["x-show"]: "$store.modalStore.showBeforeRemoveSharedInvitation",
    },
    modalCancelBtn: {
      ["x-on:click.prevent"]:
        "$store.modalStore.closeDialog('showBeforeRemoveSharedInvitation')",
    },
    modalAcceptBtn: {
      ["x-on:click.prevent"]: () => {},
    },
  };
}

function BeforeCloneNote() {
  return {
    modal: {
      ["x-show"]: "$store.modalStore.showBeforeCloneNote",
    },
    modalCancelBtn: {
      ["x-on:click.prevent"]:
        "$store.modalStore.closeDialog('showBeforeCloneNote')",
    },
    modalAcceptBtn: {
      ["x-on:click.prevent"]: () => {},
    },
  };
}

export { BeforeRemoveSharedInvitationDialog, BeforeCloneNote };
