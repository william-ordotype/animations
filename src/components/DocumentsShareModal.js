function DocumentsShareModal() {
  return {
    // local state
    showSharingOptions: false,
    sharedEmailValue: "",
    colors: ["Red", "Orange", "Yellow", "Yellow"],

    // components
    shareModal() {
      return {
        ["x-show"]: "true",
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
          return this.colors.push(this.sharedEmailValue);
        },
      };
    },
    sharedEmailsList() {
      return {
        ["x-for"]: "color in colors",
      };
    },
    name: {
      ["x-text"]: "color",
    },
  };
}

export default DocumentsShareModal;
