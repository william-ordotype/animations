import { ORDOTYPE_API } from "./apiConfig";
import ApiService from "./apiService";
import { deleteManyNotesValidation } from "../validation/notesValidation";

class NotesService extends ApiService {
  constructor(API_URL, memberToken) {
    super(API_URL, "notes");
    debugger;
  }

  async deleteMany(payload) {
    const validatedPayload = deleteManyNotesValidation(payload);
    const ids = validatedPayload.map((item) => item._id);
    return await this.request({
      method: "DELETE",
      data: { note_ids: ids },
    });
  }
}

export default NotesService;
