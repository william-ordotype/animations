import ApiService from "./apiService.js";
import {
  createOneValidation,
  deleteManyNotesValidation,
  getListSchema,
  getListValidation,
  getOneValidation,
  searchByNoteTitleAndPathologyTitleValidation,
  updateOneValidation,
} from "../validation/notesValidation";
import { parseFormData } from "./apiUtils";
import FileNoteService from "./fileNoteService";
import { InferType } from "yup";
import { PaginatedResponse } from "../types/apiTypes/common.js";
import { NoteList } from "../types/apiTypes/notesTypes.js";

type NoteListExtended = NoteList & {
  direction: string;
  sort: string;
  pathology_slug?: string;
};
class NotesService extends ApiService {
  private fileNoteService: FileNoteService;
  constructor() {
    super("notes");
    this.fileNoteService = new FileNoteService();
  }

  /**
   * @param {object} payload
   * @param {string[]} payload.noteIds
   * @returns {Promise<Object>}
   */
  async deleteMany(payload: { noteIds: string[] }): Promise<any> {
    const body = { note_ids: payload.noteIds };

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
   * @param id {string}
   * @returns {Promise<Object>}
   */
  async getOne(id: string) {
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

  async getList({
    page = 1,
    limit = 10,
    sort = "created_on",
    direction = "DESC",
    type = "",
    pathology = [],
    title = "",
    pathology_slug,
  }: InferType<typeof getListSchema>) {
    const validatedPayload = await getListValidation({
      page,
      limit,
      sort,
      direction,
      type,
      pathology,
      title,
      pathology_slug,
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

    return await this.request<
      null,
      InferType<typeof getListSchema>,
      PaginatedResponse<NoteListExtended>
    >({
      method: "GET",
      queryParams: validatedPayload,
      resCallBack: (response) => {
        return {
          ...response,
          direction: validatedPayload.direction,
          sort: validatedPayload.sort,
          pathology_slug: validatedPayload.pathology_slug,
        };
      },
    });
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

  async updateOne(payload: any, filesToAdd: FileList, filesToDelete: FileList) {
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
        resCallBack: (res: object) => res,
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
