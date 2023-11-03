import ApiService from "./apiService";

class ShareNotesService extends ApiService {
  constructor(API_URL) {
    super(API_URL, "note-shares");
  }

  /**
   * @param {string} noteId
   * @returns {Promise<Object>}
   */
  async activateNote(noteId) {
    return await this.request({ routeParams: `activate/${noteId}` });
  }

  async deactivateNote(noteId) {
    return await this.request({ routeParams: `inactive/${noteId}` });
  }

  async addEmailsToNote({ noteId, email }) {
    return await this.request({
      routeParams: "email",
      data: { noteId, email },
    });
  }

  async removeEmailsFromNote({ noteId, email }) {
    return await this.request({
      routeParams: "email",
      method: "DELETE",
      data: { noteId, email },
    });
  }

  async cloneSharedNote(noteId, cloneSharedFiles = true) {
    return await this.request({
      routeParams: `clone/${noteId}/${cloneSharedFiles}`,
    });
  }

  /**
   * @param {string} noteId
   * @returns {Promise<Object>}
   */
  async getSharedInfoFromNote({ noteId }) {
    return await this.request({
      routeParams: `invitees/${noteId}`,
      method: "GET",
    });
  }

  async getList() {
    return await this.request({ routeParams: "list" });
  }

  async getListByType(type) {
    return await this.request({ routeParams: `list/${type}` });
  }
}

export default ShareNotesService;
