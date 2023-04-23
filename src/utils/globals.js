// noinspection SpellCheckingInspection
import { autocomplete } from "@algolia/autocomplete-js";

import handleFormSubmit from "../components/DocumentsModal/handleFormSubmit";
import handleDrawer from "../components/DocumentsDrawer/handleDrawer";

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
    handleFormSubmit,
    resetFormFields() {
      window.globals.createRTE.setText("");
      document.querySelector("#docs-title").value = "";
      document.querySelector("#docs-files").value = "";
    },
  },
  content: {
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
};

globals.run = function () {
  window.globals = globals;
};

export default globals;
