import { string } from "yup";
import * as DOMPurify from "dompurify";

const searchByTitleAndAliasValidation = async (payload) => {
  const sanitizedPayload = DOMPurify.sanitize(payload);
  const searchByTitleAndAliasSchema = string();

  return await searchByTitleAndAliasSchema.validate(sanitizedPayload);
};

export { searchByTitleAndAliasValidation };
