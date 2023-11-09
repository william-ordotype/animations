import Alpine from "alpinejs";
import ApiService from "./apiService";
import {
  deleteManyNotesValidation,
  getOneValidation,
  getListValidation,
} from "../validation/notesValidation";
import { StateStore } from "../utils/enums";

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

  async getOne(id) {
    try {
      const payload = await getOneValidation(id);
      const response = await this.request({
        method: "GET",
        routeParams: payload,
      });

      Alpine.store(StateStore.NOTES).getOne.document = {
        ...response,
      };
    } catch (err) {
      throw err;
    }
  }

  async getList({
    page = 1,
    limit = 10,
    sort = "created_on",
    direction = "DESC",
    type = "",
    pathology = [],
    title = "",
    noteTitleAndPathologyTitle = "",
  }) {
    try {
      const validatedPayload = await getListValidation({
        page,
        limit,
        sort,
        direction,
        type,
        pathology,
        title,
        noteTitleAndPathologyTitle,
      });

      // Remove empty parameters
      Object.keys(validatedPayload).forEach(
        (key) =>
          (validatedPayload[key] === "" ||
            validatedPayload[key] === undefined ||
            (Array.isArray(validatedPayload[key]) &&
              validatedPayload[key].length === 0)) &&
          delete validatedPayload[key]
      );

      return await this.request({
        method: "GET",
        queryParams: validatedPayload,
      });
    } catch (err) {
      throw err;
    }
  }
  async createOne(payload, files) {
    const validatePayload = await createOneValidation(payload);
  }
}

export default NotesService;
