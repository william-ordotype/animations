// noinspection SpellCheckingInspection
import { autocomplete } from "@algolia/autocomplete-js";

import handleFormSubmit from "../components/DocumentsModal/handleFormSubmit";
import handleDrawer from "../components/DocumentsDrawer/handleDrawer";
import Alpine from "alpinejs";
import * as DOMPurify from "dompurify";

const globals = {};

globals.documentTypes = {
  notes: "Note",
  recommendations: "Fiche conseil",
  prescriptions: "Ordonnance",
};

globals.drawer = {
  handleDrawer,
};

globals.autocomplete = autocomplete;

globals.modal = {
  form: {
    pathologyAutocomplete: globals.autocomplete({
      container: "#pathology-autocomplete",
      detachedMediaQuery: "none",
      debug: true,
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
            onSelect() {
              console.log("selected");
            },
          },
        ];
      },
      renderNoResults({ state, render }, root) {
        render(`No results for "${state.query}".`, root);
      },
    }),
    handleFormSubmit,
    resetFormFields() {
      window.globals.createRTE.setText("");
      document.querySelector("#docs-id").value = "";
      document.querySelector("#docs-title").value = "";
      document.querySelector("#docs-files").value = "";
      document.querySelector("#pathology-autocomplete .aa-Input").value = "";
    },
    setModalFields({ _id, title, pathology, rich_text_ordo }) {
      document.querySelector("#docs-id").value = _id;
      document.querySelector("#docs-title").value = title;
      document.querySelector("#pathology-autocomplete .aa-Input").value =
        pathology.name || "";
      window.globals.createRTE.clipboard.dangerouslyPasteHTML(rich_text_ordo);
    },
    getModalFields(ev) {
      const cleanRichText = DOMPurify.sanitize(
        window.globals.createRTE.root.innerHTML,
        { USE_PROFILES: { html: true } }
      );
      const formData = new FormData(ev.target);
      formData.append("rich_text_ordo", cleanRichText);
      formData.append(
        "type",
        Alpine.store("documentsStore").createOne.document.type
      );
      const jsonData = {};
      for (const [key, value] of formData.entries()) {
        jsonData[key] = value;
      }
      const { _id, type, title, pathology, rich_text_ordo } = jsonData;
      return { _id, type, title, pathology, rich_text_ordo };
    },
  },
  content: {

      notes: {
        modal: {title: "Nouvelle note"},
        beforeSave: {
          title: "une nouvelle note",
          inputTitle: "Nom de la note",
          phInputTitle: "Ma nouvelle note",
          inputTypePrescription: "",
          inputPathology: "Associer une pathologie à cette note",
        },
        beforeCancel: {
          title: "la création d’une nouvelle note",
          description:
              "Vous êtes sur le point d’annuler la création d’une nouvelle note. Si vous confirmer, alors le contenu de cette note sera définitivement supprimé et vous ne pourrez pas le récuperer.",
        },
      },
      prescriptions: {
        modal: {title: "Nouvelle ordonnance"},
        beforeSave: {
          title: "une nouvelle ordonnance",
          inputTitle: "Nom de l’ordonnance",
          phInputTitle: "Ma nouvelle ordonnance",
          inputTypePrescription: "Sélectionner le type d’ordonnance",
          inputPathology: "Associer une pathologie à cette ordonnance",
        },
        beforeCancel: {
          title: "création d’une nouvelle ordonnance",
          description:
              "Vous êtes sur le point d’annuler la création d’une nouvelle ordonnance. Si vous confirmer, alors le contenu de cette ordonnance sera définitivement supprimé et vous ne pourrez pas le récuperer.",
        },
      },
      recommendations: {
        modal: {title: "Nouvelle fiche conseil"},
        beforeSave: {
          title: "une nouvelle fiche conseil",
          inputTitle: "Nom de la fiche conseil",
          phInputTitle: "Ma nouvelle fiche conseil",
          inputTypePrescription: "",
          inputPathology: "Associer une pathologie à cette fiche conseil",
        },
        beforeCancel: {
          title: "la création d’une nouvelle fiche conseil",
          description:
              "Vous êtes sur le point d’annuler la création d’une nouvelle fiche conseil. Si vous confirmer, alors le contenu de cette fiche conseil sera définitivement supprimé et vous ne pourrez pas le récuperer.",
        },
      },
    edit: {
      notes: {
        modal: {title: "Nouvelle note"},
        beforeSave: {
          title: "une nouvelle note",
          inputTitle: "Nom de la note",
          phInputTitle: "Ma nouvelle note",
          inputTypePrescription: "",
          inputPathology: "Associer une pathologie à cette note",
        },
        beforeCancel: {
          title: "la création d’une nouvelle note",
          description:
              "Vous êtes sur le point d’annuler la création d’une nouvelle note. Si vous confirmer, alors le contenu de cette note sera définitivement supprimé et vous ne pourrez pas le récuperer.",
        },
      },
    }
  },
};

globals.run = function () {
  window.globals = globals;
};

export default globals;
