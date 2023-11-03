import ApiService from "./apiService";
import { deleteManyNotesValidation } from "../validation/notesValidation";

class NotesService extends ApiService {
  constructor(API_URL) {
    super(API_URL, "notes");
  }

  async deleteMany(payload) {
    const ids = payload.map((item) => item._id);
    const body = { note_ids: ids };
    try {
      const validatePayload = await deleteManyNotesValidation(body);
      return await this.request({
        method: "DELETE",
        data: validatePayload,
      });
    } catch (err) {
      throw err;
    }
  }
}

export default NotesService;
