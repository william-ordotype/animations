import { array, string } from "yup";

const removeFilesFromNoteValidation = (payload) => {
  const removeFilesFromNoteSchema = array().of(string());

  return removeFilesFromNoteSchema.validate(payload);
};

export { removeFilesFromNoteValidation };
