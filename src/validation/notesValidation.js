import { string, array, object } from "yup";

const deleteManyNotesValidation = async (payload) => {
  const deleteNotesSchema = object({
    note_ids: array().of(string()).required(),
  })
    .shape({
      note_ids: array(),
    })
    .noUnknown();
  return await deleteNotesSchema.validate(payload);
};

export { deleteManyNotesValidation };
