import apiService from "./apiService";
import { removeFilesFromNoteValidation } from "../validation/fileNoteValidation";

class FileNoteService extends apiService {
  constructor() {
    super("documents");
  }

  async addFilesToNote(payload) {
    return await this.request({
      method: "POST",
      noContentType: true,
      data: payload,
    });
  }

  async removeFilesFromNote(payload) {
    const validatePayload = removeFilesFromNoteValidation(payload);
    return await this.request({
      method: "DELETE",
      data: JSON.stringify({ document_id: validatePayload }),
    });
  }
}

export default FileNoteService;
