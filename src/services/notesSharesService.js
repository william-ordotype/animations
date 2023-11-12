import ApiService from "./apiService";
import { updateEmailsToNoteValidation } from "../validation/noteSharesValidation";

class ShareNotesService extends ApiService {
  constructor() {
    super("note-shares");
  }

  /**
   * @param {string} noteId
   * @returns {Promise<Object>}
   */
  async activateNote(noteId) {
    return await this.request({ routeParams: `activate/${noteId}` });
  }

  async deactivateNote(noteId) {
    return await this.request({
      routeParams: `inactive/${noteId}`,
      resCallBack: (res) => res,
    });
  }

  /**
   * Adds and removes email invitations from note
   * @param {string} noteId
   * @param {array} emailsToRemove
   * @param {array} emailsToAdd
   * @returns {Promise<Object>}
   */
  async updateEmailsToNote({ noteId, emailsToRemove, emailsToAdd }) {
    try {
      const validatePayload = await updateEmailsToNoteValidation({
        noteId,
        emailsToRemove,
        emailsToAdd,
      });

      return await this.request({
        routeParams: "emails",
        data: validatePayload,
        method: "PATCH",
        resCallBack: (res) => res,
      });
    } catch (err) {
      throw err;
    }
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

  async getNotesInvites() {
    return await this.request({ routeParams: "list" });
  }

  /**
   *
   * @param {string} type
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getNoteInviteByType(type, id) {
    return await this.request({
      routeParams: `me/${type}/${id}`,
      method: "GET",
    });
  }
}

export default ShareNotesService;
