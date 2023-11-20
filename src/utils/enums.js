const StateStore = {
  NOTES: "documentsStore",
  MODAL: "modalStore",
  TOASTER: "toasterStore",
  SHARE: "shareStore",
};

const ShareStates = {
  INVITATION_SENT: "invitation_sent",
  REVOKED: "revoked",
  EXPIRED: "expired",
  AVAILABLE: "available",
};

const ToasterMsgTypes = {
  ERROR: "error",
  SUCCESS: "success",
};

const NotesUrls = {
  MY_NOTES: "/mes-documents#/list",
  NOTES_SHARED_WITH_ME: "/partages-avec-moi",
};

export { StateStore, ShareStates, ToasterMsgTypes, NotesUrls };
