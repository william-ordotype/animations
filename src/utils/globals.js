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
  },
  content: {
    create: {
      notes: {
        modal: { title: "Nouvelle note" },
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
        modal: { title: "Nouvelle ordonnance" },
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
        modal: { title: "Nouvelle fiche conseil" },
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
    },
    edit: {
      notes: {
        modal: { title: "Nom de la note" },
        beforeSave: {
          title: "une note",
          inputTitle: "Nom de la note",
          phInputTitle: "Ma nouvelle note",
          inputTypePrescription: "",
          inputPathology: "Associer une pathologie à cette note",
        },
        beforeCancel: {
          title: "la modification d’une note",
          description:
            "Vous êtes sur le point d’annuler la modification d’une note. Si vous confirmer, alors les changements seront définitivement supprimés.",
        },
      },
      prescriptions: {
        modal: { title: "Nom de l’ordonnance" },
        beforeSave: {
          title: "une nouvelle ordonnance",
          inputTitle: "Nom de l’ordonnance",
          phInputTitle: "Ma nouvelle ordonnance",
          inputTypePrescription: "Sélectionner le type d’ordonnance",
          inputPathology: "Associer une pathologie à cette ordonnance",
        },
        beforeCancel: {
          title: "la modification d’une ordonnance",
          description:
            "Vous êtes sur le point d’annuler la modification d’une ordonnance. Si vous confirmer, alors les changements seront définitivement supprimés.",
        },
      },
      recommendations: {
        modal: { title: "Nom de la note" },
        beforeSave: {
          title: "une fiche conseil",
          inputTitle: "Nom de la fiche conseil",
          phInputTitle: "Ma nouvelle fiche conseil",
          inputTypePrescription: "",
          inputPathology: "Associer une pathologie à cette fiche conseil",
        },
        beforeCancel: {
          title: "la modification d’une fiche conseil",
          description:
            "Vous êtes sur le point d’annuler la modification d’une fiche conseil. Si vous confirmer, alors les changements seront définitivement supprimés.",
        },
      },
    },
  },
};

globals.run = function () {
  window.globals = globals;
};

export default globals;
