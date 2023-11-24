import { string, array, object, number } from "yup";
const activateSharedNoteValidation = async (payload) => {
  const activateSharedNoteSchema = object();

  return await activateSharedNoteSchema.validate(payload);
};

const updateEmailsToNoteValidation = async (payload) => {
  const updateEmailsToNoteSchema = object({
    emailsToAdd: array().of(string().email()),
    emailsToRemove: array().of(string().email()),
    noteId: string().required(),
  });

  return await updateEmailsToNoteSchema.validate(payload);
};

const getNoteByTypeValidation = async (payload) => {
  const getNoteByTypeSchema = object({
    type: string().oneOf(["email", "link"]),
    id: string(),
  });

  return await getNoteByTypeSchema.validate(payload);
};

const getNotesValidation = async (payload) => {
  const getNotesSchema = object({
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
  });

  return await getNotesSchema.validate(payload);
};

export {
  activateSharedNoteValidation,
  updateEmailsToNoteValidation,
  getNoteByTypeValidation,
  getNotesValidation,
};
