import ApiService from "./apiService";
import {
  getNoteByTypeValidation,
  updateEmailsToNoteValidation,
} from "../validation/noteSharesValidation";

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

  async getNotes() {
    return await this.request({ routeParams: "me" });
  }

  /**
   *
   * @param {string} type
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getNoteByType({ type, id }) {
    try {
      const validatePayload = await getNoteByTypeValidation({ type, id });
      return await this.request({
        routeParams: `me/${validatePayload.type}/${validatePayload.id}`,
        method: "GET",
      });
    } catch (err) {
      throw err;
    }
  }

  async acceptNoteInvitation({ noteId }) {
    return await this.request({
      routeParams: `accept/${noteId}`,
      method: "PUT",
    });
  }
}

export default ShareNotesService;
