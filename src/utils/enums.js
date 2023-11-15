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

export { StateStore, ShareStates, ToasterMsgTypes };
