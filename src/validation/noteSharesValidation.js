import { string, array, object, number } from "yup";
import { ShareStates } from "@utils/enums";

const sortByValues = [
  "created_on",
  "pathology",
  "title",
  "type",
  "prescription_type",
  "updated_by.full_name",
];
const activateSharedNoteValidation = async (payload) => {
  const activateSharedNoteSchema = object();

  return await activateSharedNoteSchema.validate(payload);
};

export const updateEmailsToNoteSchema = object({
  emailsToAdd: array().of(string().email()),
  emailsToRemove: array().of(string().email()),
  noteId: string().required(),
});
const updateEmailsToNoteValidation = async (payload) => {
  return await updateEmailsToNoteSchema.validate(payload);
};

const getNoteByTypeValidation = async (payload) => {
  const getNoteByTypeSchema = object({
    type: string().oneOf(["email", "link"]),
    id: string(),
  });

  return await getNoteByTypeSchema.validate(payload);
};

export const getNotesSchema = object({
  page: number().required().positive().integer(),
  limit: number().required().positive().integer(),
  sort: string().oneOf(sortByValues).required(),
  direction: string().oneOf(["DESC", "ASC"]).required(),
  type: string()
    .oneOf(["notes", "prescriptions", "recommendations", ""])
    .optional(),
  prescription_type: string()
    .oneOf(["balance_sheet", "treatment", ""])
    .optional(),
  pathology: array().of(string()).optional(),
  state: string().oneOf([ShareStates.AVAILABLE, ShareStates.INVITATION_SENT]),
});
const getNotesValidation = async (payload) => {
  return await getNotesSchema.validate(payload);
};

export const searchSharedNotesByTitleAndPathologySchema = object({
  page: number().positive().integer(),
  limit: number().positive().integer(),
  sort: string().oneOf(sortByValues),
  direction: string().oneOf(["DESC", "ASC"]),
  noteTitleAndPathologyTitle: string().required(),
  state: string().oneOf([ShareStates.AVAILABLE, ShareStates.INVITATION_SENT]),
});
const searchSharedNotesByTitleAndPathology = async (payload) => {
  return await searchSharedNotesByTitleAndPathologySchema.validate(payload);
};

const removeNoteInvitationsValidation = async (payload) => {
  const removeNoteInvitationsSchema = object({
    noteIds: array().of(string()).required(),
  })
    .shape({
      noteIds: array(),
    })
    .noUnknown();
  return await removeNoteInvitationsSchema.validate(payload);
};

export {
  activateSharedNoteValidation,
  updateEmailsToNoteValidation,
  getNoteByTypeValidation,
  getNotesValidation,
  searchSharedNotesByTitleAndPathology,
  removeNoteInvitationsValidation,
};
