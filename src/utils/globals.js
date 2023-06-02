// noinspection SpellCheckingInspection
import { autocomplete } from "@algolia/autocomplete-js";

import handleDrawer from "../components/DocumentsDrawer/handleDrawer";

const globals = {};

globals.documentTypes = {
  notes: "Notes",
  recommendations: "Fiches conseils",
  prescriptions: "Ordonnances",
};

globals.drawer = {
  handleDrawer,
};

globals.autocomplete = autocomplete;

globals.modal = {
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
        modal: { title: "Nom de la fiche conseil" },
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
    delete: {
      prescriptions: {
        beforeDelete: {
          title: "une ordonnance",
          description:
            "Vous êtes sur le point de supprimer une ordonnance. Une fois la suppression confirmée, vous n’aurez plus accès à cette ordonnance.",
        },
      },
      notes: {
        beforeDelete: {
          title: "une note",
          description:
            "Vous êtes sur le point de supprimer une note. Une fois la suppression confirmée, vous n’aurez plus accès à cette note.",
        },
      },
      recommendations: {
        beforeDelete: {
          title: "une fiche conseil",
          description:
            "Vous êtes sur le point de supprimer une fiche conseil. Une fois la suppression confirmée, vous n’aurez plus accès à cette fiche conseil.",
        },
      },
    },
  },
};

globals.statusMessages = {
  createOne: {
    201: "",
    400: "",
    500: "",
  },
  editOne: {},
  deleteOne: {},
  getList: {
    403: "Bad request",
    401: "Unauthorized",
    500: "Server error",
  },
  static: {
    success: "Success",
    error: "There was an error. Please, contact with the administrator",
  },
};

globals.run = function () {
  window.globals = globals;
};

export default globals;
