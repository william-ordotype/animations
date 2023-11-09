import { string, array, object } from "yup";
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

  return updateEmailsToNoteSchema.validate(payload);
};

export { activateSharedNoteValidation, updateEmailsToNoteValidation };
