const API_URL = `${process.env.ORDOTYPE_API}/v1.0.0`;

const shareStore = {
  getList: {},
  getListByType: {},
  activateNote: {
    async exec({ noteId }) {
      return await this.request({ noteId });
    },
    async request({ noteId }) {
      const response = await fetch(
        `${API_URL}/note-shares/activate/${noteId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${memberToken}`,
          },
        }
      );
      if (response.ok) {
        return await response.json();
      } else {
        if (response.status === 401) {
          throw "Unauthorized";
        }
        if (response.status === 404) {
          throw "Note note found";
        }
        throw response.status;
      }
    },
  },
  deactivateNote: {
    exec({ noteId }) {
      return this.request({ noteId });
    },
    async request({ noteId }) {
      const response = await fetch(
        `${API_URL}/note-shares/inactive/${noteId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${memberToken}`,
          },
        }
      );
      if (response.ok) {
        return await response.json();
      } else {
        if (response.status === 401) {
          throw "Unauthorized";
        }
        if (response.status === 404) {
          throw "Note note found";
        }
        throw response.status;
      }
    },
  },
  addEmailsToNote: {
    async exec({ noteId, email }) {
      return await this.request();
    },
    async request({ noteId, email }) {
      const response = await fetch(`${API_URL}/note-shares/email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${memberToken}`,
        },
        body: JSON.stringify({ email, noteId }),
      });
      if (response.ok) {
        return await response.json();
      } else {
        if (response.status === 401) {
          throw "Unauthorized";
        }
        if (response.status === 404) {
          throw "Note note found";
        }
        throw response.status;
      }
    },
  },
  removeEmailsFromNote: {
    async exec({ noteId, email }) {
      return await this.request({ noteId, email });
    },
    async request({ noteId, email }) {
      const response = await fetch(`${API_URL}/note-shares/email`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${memberToken}`,
        },
        body: JSON.stringify({ email, noteId }),
      });
      if (response.ok) {
        return await response.json();
      } else {
        if (response.status === 401) {
          throw "Unauthorized";
        }
        if (response.status === 404) {
          throw "Note note found";
        }
        throw response.status;
      }
    },
  },
  cloneSharedNote: {
    async request({ noteId, cloneSharedFiles = true }) {
      const response = await fetch(
        `${API_URL}/note-shares/note-shares/clone/${noteId}/${cloneSharedFiles}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${memberToken}`,
          },
        }
      );
      if (response.ok) {
        return await response.json();
      } else {
        if (response.status === 401) {
          throw "Unauthorized";
        }
        if (response.status === 404) {
          throw "Note id found";
        }
        throw response.status;
      }
    },
  },
  getSharedInfoFromNote: {
    async request({ noteId, email }) {
      const response = await fetch(`${API_URL}/note-shares/email`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${memberToken}`,
        },
        body: JSON.stringify({ email, noteId }),
      });
      if (response.ok) {
        return await response.json();
      } else {
        if (response.status === 401) {
          throw "Unauthorized";
        }
        if (response.status === 404) {
          throw "Note note found";
        }
        throw response.status;
      }
    },
  },
};

export default shareStore;
