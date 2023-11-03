function DocumentsShareModal() {
  return {
    // local state
    showSharingOptions: false,
    sharedEmailValue: "",
    colors: ["Red", "Orange", "Yellow", "Yellow"],

    // components
    shareModal() {
      return {
        ["x-show"]: "$store.modalStore.showSharingOptions",
      };
    },
    switchButton() {
      return {
        ["x-on:change"]: (ev) => {
          // Using jquery to handle sliding transition
          $(".partage_inputs").slideToggle();
          // this.showSharingOptions = !this.showSharingOptions;
          console.log(this.sharedEmailValue);
        },
      };
    },
    sharingOptionsWrapper() {
      return {
        ["x-show"]: () => {
          return this.showSharingOptions;
        },
      };
    },
    sharedEmailInput() {
      return {
        ["x-model"]: "sharedEmailValue",
        ["x-on:keyup.enter"]: () => {
          return this.colors.push(this.sharedEmailValue);
        },
      };
    },
    addEmailtoListBtn() {
      return {
        ["x-on:click.prevent"]: () => {
          this.colors.push(this.sharedEmailValue);
        },
      };
    },
    sharedEmailsList() {
      return {
        ["x-for"]: "color in colors",
      };
    },
    sharedEmailName: {
      ["x-text"]: "color",
    },
    deleteSharedEmail() {
      return {
        ["x-on:click.prevent"]: () => {
          const email = this.color;
          const index = this.colors.indexOf(email);
          this.colors.splice(index, 1);
        },
      };
    },
    closeSharingModal: {
      ["x-on:click.prevent"]: "$store.modalStore.showSharingOptions = false",
    },
    copySharedLinkBtn: {
      ["x-on:click.prevent"]: () => {
        // sharedModalLink.destroy();
      },
    },
  };
}

const closeModalFn = () => {
  Alpine.store("modalStore").showSharingOptions = false;
};

export default DocumentsShareModal;
