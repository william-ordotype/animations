import Alpine from "alpinejs";
import ApiService from "./apiService";
import {
  createOneValidation,
  deleteManyNotesValidation,
  getListValidation,
  getOneValidation,
  searchByNoteTitleAndPathologyTitleValidation,
  updateOneValidation,
} from "../validation/notesValidation";
import { StateStore, ToasterMsgTypes } from "../utils/enums";
import { parseFormData } from "./apiUtils";
import FileNoteService from "./fileNoteService";

class NotesService extends ApiService {
  constructor() {
    super("notes");
    this.fileNoteService = new FileNoteService();
  }

  /**
   *
   * @param payload.noteIds {array<object>}
   * @returns {Promise<Object>}
   */
  async deleteMany(payload) {
    const { noteIds } = payload;
    const body = { note_ids: noteIds };

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

  /**
   *
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getOne(id) {
    try {
      const payload = await getOneValidation(id);
      return await this.request({
        method: "GET",
        routeParams: payload,
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param {number} page
   * @param {number} limit
   * @param {string} sort
   * @param {string} direction
   * @param {string} type
   * @param {array<string>} pathology
   * @param {string} title
   * @returns {Promise<Object>}
   */
  async getList({
    page = 1,
    limit = 10,
    sort = "created_on",
    direction = "DESC",
    type = "",
    pathology = [],
    title = "",
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
      console.error(err);
      Alpine.store(StateStore.TOASTER).toasterMsg(
        "Il y a eu une erreur lors du traitement de votre demande",
        ToasterMsgTypes.ERROR
      );
      throw err;
    }
  }

  /**
   *
   * @param {object} payload
   * @param {FileList} files
   * @returns {Promise<Object>}
   */
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

  /**
   *
   * @param {object} payload
   * @param {FileList} filesToAdd
   * @param {FileList} filesToDelete
   * @returns {Promise<Array>}
   */
  async updateOne(payload, filesToAdd, filesToDelete) {
    delete payload.files;
    delete payload.documents;
    delete payload.prescription_type;
    const validatePayload = await updateOneValidation(payload);
    // remove files and documents from formFields

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
        resCallBack: (res) => res,
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

  async searchNotesByTitleAndPathologyTitle({
    page = 1,
    limit = 10,
    sort = "created_on",
    direction = "DESC",
    noteTitleAndPathologyTitle,
  }) {
    const validatePayload = await searchByNoteTitleAndPathologyTitleValidation({
      page,
      limit,
      sort,
      direction,
      noteTitleAndPathologyTitle,
    });
    return await this.request({
      method: "GET",
      queryParams: validatePayload,
    });
  }

  async getRulesStatus() {
    return this.request({
      method: "GET",
      routeParams: "rules/status",
    });
  }
}

export default NotesService;
