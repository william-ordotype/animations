import ApiService from "./apiService";
import {
  getNoteByTypeValidation,
  getNotesSchema as getSharedNotesSchema,
  getNotesValidation,
  removeNoteInvitationsValidation,
  searchSharedNotesByTitleAndPathology,
  searchSharedNotesByTitleAndPathologySchema,
  updateEmailsToNoteSchema,
  updateEmailsToNoteValidation,
} from "../validation/noteSharesValidation";
import { ShareStates } from "@utils/enums";
import {
  AcceptNoteInvitation,
  ActivateNote,
  SharedNoteInvitees,
  SharedWithMeNoteList,
  SharingTypes,
  NoteFromLinkAuth,
  NoteFromLinkUnauth,
  DeactivateNote,
  UpdateSharedNoteOptions,
  SharedNoteItem,
} from "@interfaces/apiTypes/notesSharesTypes";
import { InferType } from "yup";
import {
  DeletedResponse,
  PaginatedResponse,
} from "@interfaces/apiTypes/common";

class ShareNotesService extends ApiService {
  constructor() {
    super("note-shares");
  }

  /**
   * Activates sharing options
   * @param {string} noteId
   */
  async activateNote(noteId: string) {
    return await this.request<null, string, ActivateNote>({
      routeParams: `activate/${noteId}`,
    });
  }

  /**
   * Deactivates sharing options
   */
  async deactivateNote(noteId: string) {
    return await this.request<null, string, DeactivateNote>({
      routeParams: `inactive/${noteId}`,
    });
  }

  /**
   * Adds and removes email invitations from note
   */
  async updateEmailsToNote({
    noteId,
    emailsToRemove,
    emailsToAdd,
  }: InferType<typeof updateEmailsToNoteSchema>) {
    try {
      const validatePayload = await updateEmailsToNoteValidation({
        noteId,
        emailsToRemove,
        emailsToAdd,
      });

      return await this.request<
        InferType<typeof updateEmailsToNoteSchema>,
        null,
        UpdateSharedNoteOptions
      >({
        routeParams: "emails",
        data: validatePayload,
        method: "PATCH",
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Clones a note from email or link guest and assigns it to their note list
   */

  async cloneSharedNote(noteId: string, cloneSharedFiles = true) {
    return await this.request<null, string, NoteFromLinkAuth>({
      routeParams: `clone/${noteId}/${cloneSharedFiles}`,
    });
  }

  /**
   * Request when opening the sharing options modal
   * @param {string} noteId
   */
  async getSharedInfoFromNote({ noteId }: { noteId: string }) {
    return await this.request<null, string, SharedNoteInvitees>({
      routeParams: `invitees/${noteId}`,
      method: "GET",
    });
  }

  /**
   * Get List of shared notes to show on the Shared With Me page
   */

  async getNotes({
    page = 1,
    limit = 10,
    sort = "created_on",
    direction = "DESC",
    type = "",
    pathology = [],
    state = ShareStates.AVAILABLE,
  }: InferType<typeof getSharedNotesSchema>) {
    const validatedPayload = await getNotesValidation({
      page,
      limit,
      sort,
      direction,
      type,
      pathology,
      state,
    });

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
      InferType<typeof getSharedNotesSchema>,
      PaginatedResponse<SharedWithMeNoteList>
    >({
      routeParams: "me",
      method: "GET",
      queryParams: validatedPayload,
    });
  }

  /**
   * List by title search input located in Search With Me Page
   */
  async searchSharedNotesByTitleAndPathology({
    page = 1,
    limit = 10,
    sort = "created_on",
    direction = "DESC",
    noteTitleAndPathologyTitle,
    state = ShareStates.AVAILABLE,
  }: InferType<typeof searchSharedNotesByTitleAndPathologySchema>) {
    const validatePayload = await searchSharedNotesByTitleAndPathology({
      page,
      limit,
      sort,
      direction,
      noteTitleAndPathologyTitle,
      state,
    });

    return await this.request<
      null,
      InferType<typeof searchSharedNotesByTitleAndPathologySchema>,
      PaginatedResponse<SharedWithMeNoteList>
    >({
      routeParams: "me",
      method: "GET",
      queryParams: validatePayload,
    });
  }

  /**
   * Gets info from a particular note id
   */
  async getNoteByType({ type, id }: { type: "email" | "link"; id: string }) {
    try {
      const validatePayload = await getNoteByTypeValidation({ type, id });
      return await this.request<null, null, SharedNoteItem>({
        routeParams: `me/${validatePayload.type}/${validatePayload.id}`,
        method: "GET",
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   *  Executes if the user is not logged in and only shows the bare minimum info from the note like author and title
   */
  async getNoteBasicInfo({ id, type }: { type: SharingTypes; id: string }) {
    try {
      return await this.request<null, null, NoteFromLinkUnauth>({
        method: "GET",
        routeParams: `guest/${type}/${id}`,
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Specific for Email invited users. Confirms that the note is shared and can be seen by the invited user in their Shared With Me page
   */
  async acceptNoteInvitation({ noteId }: { noteId: string }) {
    return await this.request<null, null, AcceptNoteInvitation>({
      routeParams: `accept/${noteId}`,
      method: "PUT",
    });
  }

  /**
   * Removes shared access from the note and eliminate it from the Shared With Me page
   * @param {string[]} noteIds
   */
  async removeNoteInvitations({ noteIds }: { noteIds: string[] }) {
    const payload = { noteIds: [...noteIds] };

    try {
      const validatePayload = await removeNoteInvitationsValidation(payload);
      return this.request<ToDo, null, DeletedResponse>({
        method: "DELETE",
        routeParams: "invitations",
        data: validatePayload,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default ShareNotesService;
