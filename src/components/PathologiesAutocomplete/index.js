function PathologiesAutocomplete() {
  return {
    pathologyInputValue: Alpine.store("modalStore").pathologyName,
    showSearchResults() {
      return {
        ["x-show"]: "$store.modalStore.form.pathology.length",
        ["x-transition"]: "",
      };
    },
    clearSearchResults() {
      Alpine.store("modalStore").form.pathology = [];
      Alpine.store("modalStore").pathologyName = "";
      $("#aa-pathology-input").attr("disabled", false).val("");
      $(
        "#pathology-autocomplete .aa-InputWrapper, #pathology-autocomplete .aa-InputWrapperSuffix"
      ).show();
      $("#pathology-autocomplete .aa-Form").css("background", "#fff");
      $("#pathology-autocomplete form")[0].reset();
    },
    init() {
      globals.autocomplete({
        onStateChange({ state }) {
          if (state.isOpen === false && state.status === "idle") {
            state.completion = "";
          }
        },
        container: "#pathology-autocomplete",
        placeholder: "Rechercher une pathologie",
        id: "aa-pathology",
        detachedMediaQuery: "none",
        debug: false,
        async getSources({ query = "" }) {
          const res = await Alpine.store("documentsStore").pathologies.getList(
            query
          );
          return [
            {
              sourceId: "pathologies",
              getItems(query) {
                return res.pathologies || [];
              },
              getItemInputValue({ item }) {
                return item.title;
              },
              templates: {
                item({ item, html }) {
                  return html`<div>${item.title}</div>`;
                },
              },
              onSelect(obj) {
                Alpine.store("modalStore").form.pathology = [obj.item._id];
                Alpine.store("modalStore").pathologyName = obj.item.title;
                $("#aa-pathology-input").attr("disabled", true);
                $(
                  "#pathology-autocomplete .aa-InputWrapper, #pathology-autocomplete .aa-InputWrapperSuffix"
                ).hide();
                $("#pathology-autocomplete .aa-Form").css("background", "#eee");
              },
            },
          ];
        },
        onReset(obj) {
          Alpine.store("modalStore").form.pathology = [];
          Alpine.store("modalStore").pathologyName = "";
          $("#aa-pathology-input").attr("disabled", false).val("");
          $(
            "#pathology-autocomplete .aa-InputWrapper, #pathology-autocomplete .aa-InputWrapperSuffix"
          ).show();
          $("#pathology-autocomplete .aa-Form").css("background", "#fff");
        },
        renderNoResults({ state, render }, root) {
          render(`No results for "${state.query}".`, root);
        },
      });
    },
  };
}

export default PathologiesAutocomplete;
