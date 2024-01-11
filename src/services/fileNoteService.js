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
    const validatePayload = await removeFilesFromNoteValidation(payload);
    debugger;
    return await this.request({
      method: "DELETE",
      data: { document_id: validatePayload },
    });
  }
}

export default FileNoteService;
