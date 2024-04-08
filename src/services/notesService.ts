import ApiService from "./apiService.js";
import {
  createOneValidation,
  deleteManyNotesValidation,
  getListSchema,
  createOneSchema,
  getListValidation,
  getOneValidation,
  searchByNoteTitleAndPathologyTitleValidation,
  updateOneValidation,
  searchByNoteTitleAndPathologyTitleSchema,
} from "../validation/notesValidation";
import { parseFormData } from "./apiUtils";
import FileNoteService from "./fileNoteService";
import { InferType } from "yup";
import {
  DeletedResponse,
  PaginatedResponse,
} from "../types/apiTypes/common.js";
import { NoteItem, NoteList, NoteRules } from "../types/apiTypes/notesTypes.js";

type PaginatedNoteListExtended<TNoteList> = PaginatedResponse<TNoteList> & {
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
   */
  async deleteMany(payload: { noteIds: string[] }) {
    const body = { note_ids: payload.noteIds };

    try {
      const validatePayload = await deleteManyNotesValidation(body);
      return await this.request<ToDo, ToDo, DeletedResponse>({
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
   */
  async getOne(id: string) {
    try {
      const payload = await getOneValidation(id);
      return await this.request<null, ToDo, NoteItem>({
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
    Object.keys(validatedPayload).forEach((key: string) => {
      if (
        validatedPayload[key as keyof typeof validatedPayload] === "" ||
        validatedPayload[key as keyof typeof validatedPayload] === undefined ||
        (Array.isArray(
          validatedPayload[key as keyof typeof validatedPayload]
        ) &&
          // @ts-ignore
          validatedPayload[key as keyof typeof validatedPayload].length === 0)
      ) {
        delete validatedPayload[key as keyof typeof validatedPayload];
      }
    });
    return await this.request<
      null,
      InferType<typeof getListSchema>,
      PaginatedNoteListExtended<NoteList>
    >({
      method: "GET",
      queryParams: validatedPayload,
      resCallBack: (response: string) => {
        return {
          ...JSON.parse(response),
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
   */
  async createOne(payload: InferType<typeof createOneSchema>, files: FileList) {
    const validatePayload = await createOneValidation(payload);
    const notesFormData = parseFormData(validatePayload);

    // Add files to formData
    for (let i = 0; i < files.length; i++) {
      notesFormData.append("files", files[i] as Blob);
    }
    return await this.request<ToDo, null, NoteItem>({
      method: "POST",
      contentType: "multipart/form-data",
      data: notesFormData,
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
      filesFormData.append("files", filesArr[i] as Blob);
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

  async searchNotesByTitleAndPathologyTitle({
    page = 1,
    limit = 10,
    sort = "created_on",
    direction = "DESC",
    noteTitleAndPathologyTitle,
  }: InferType<typeof searchByNoteTitleAndPathologyTitleSchema>) {
    const validatePayload = await searchByNoteTitleAndPathologyTitleValidation({
      page,
      limit,
      sort,
      direction,
      noteTitleAndPathologyTitle,
    });
    return await this.request<
      null,
      InferType<typeof searchByNoteTitleAndPathologyTitleSchema>,
      PaginatedResponse<NoteList>
    >({
      method: "GET",
      queryParams: validatePayload,
    });
  }

  async getRulesStatus() {
    return this.request<null, null, NoteRules>({
      method: "GET",
      routeParams: "rules/status",
    });
  }
}

export default NotesService;
