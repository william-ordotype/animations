import { ORDOTYPE_API } from "./apiConfig";
import ApiService from "./apiService";

class ShareNotesService extends ApiService {
  constructor(API_URL, memberToken) {
    super(API_URL, memberToken, "share-notes");
  }

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

  async getSharedInfoFromNote({ noteId, email }) {
    return await this.request({
      routeParams: "email",
      method: "GET",
      data: { noteId, email },
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
