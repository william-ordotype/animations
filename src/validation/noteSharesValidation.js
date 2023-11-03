import { string, number, date, array, object } from "yup";
const activateSharedNoteValidation = async (payload) => {
  const activateSharedNoteSchema = object();

  return await activateSharedNoteSchema.validate(payload);
};

export { activateSharedNoteValidation };
