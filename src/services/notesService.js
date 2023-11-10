import Alpine from "alpinejs";
import ApiService from "./apiService";
import {
  deleteManyNotesValidation,
  getOneValidation,
  getListValidation,
  createOneValidation,
  updateOneValidation,
} from "../validation/notesValidation";
import { StateStore } from "../utils/enums";
import { parseFormData } from "./apiUtils";
import FileNoteService from "./fileNoteService";

class NotesService extends ApiService {
  constructor(API_URL) {
    super(API_URL, "notes");
    this.fileNoteService = new FileNoteService(API_URL);
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
    const notesFormData = parseFormData(validatePayload);
    // Add files to formData
    for (let i = 0; i < files.length; i++) {
      notesFormData.append("files", files[i]);
    }
    return await this.request({
      method: "POST",
      contentType: "multipart/form-data",
      data: notesFormData,
      noContentType: true,
    });
  }

  async updateOne(payload, filesToAdd, filesToDelete) {
    const validatePayload = await updateOneValidation(payload);
    debugger;
    // remove files and documents from formFields
    delete validatePayload.files;
    delete validatePayload.documents;
    delete validatePayload.prescription_type;

    // Convert files proxy array to normal array
    const filesArr = Array.from(filesToAdd);
    // Prepare files formData
    const filesFormData = new FormData();
    for (let i = 0; i < filesArr.length; i++) {
      filesFormData.append("files", filesArr[i]);
    }
    filesFormData.append("noteId", validatePayload._id.toString());

    const updateFieldsReq = async () =>
      await this.request({
        routeParams: validatePayload._id,
        method: "PUT",
        data: validatePayload,
      });

    const addFilesToNoteReq = async () =>
      await this.fileNoteService.addFilesToNote(filesFormData);
    const removeFilesFromNoteReq = async () =>
      await this.fileNoteService.removeFilesFromNote(filesToDelete);

    return await Promise.all([
      updateFieldsReq(),
      filesToAdd.length > 0 && addFilesToNoteReq(),
      filesToDelete.length > 0 && removeFilesFromNoteReq(),
    ]);
  }
}

export default NotesService;
