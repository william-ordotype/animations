const noteActionsToastMsgs = {
  mutate: {
    success: "Document créé avec succès",
    error: "Error in created document",
  },
  delete: {
    success: "Document supprimé",
    error: "Erreur lors de la suppression du document",
  },
  list: {
    error: "Il y a eu une erreur lors du traitement de votre demande",
  },
  search: {
    error: "Erreur de recherche",
  },
};

const shareNoteActionsToastMsgs = {
  switchShare: {
    error:
      "Une erreur s'est produite lors de la tentative de partage de votre document",
  },
  addEmailToList: {
    error: {
      alreadyExists: "L'e-mail existe déjà dans la liste partagée",
      noSelfSharing: "Vous ne pouvez pas partager un document avec vous-même!",
    },
  },
  validateEmails: {
    success: "Enregistré avec succès",
    error: {
      submitError: "Il y avait une erreur",
      dirtyInput:
        "Assurez-vous d'avoir ajouté tous les e-mails de l'entrée avant de soumettre",
    },
  },
  cloneNote: {
    success: "Copie du document enregistrée.",
    error: "Erreur de clonage du document",
  },
  removeSharedInvitation: {
    success: "Document supprimé",
    error: "Erreur lors de la suppression du document",
  },
  acceptedInvitation: {
    success: "Note ajoutée à la page des documents partagés avec moi",
  },
};

const navigationToastMsgs = {
  notFound: "pas trouvé",
  invalidUrlInvitation: "URL invalide. Type ou identifiant manquant",
};

export { noteActionsToastMsgs, shareNoteActionsToastMsgs, navigationToastMsgs };
