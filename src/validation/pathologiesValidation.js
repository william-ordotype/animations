import { string } from "yup";
import purify from "dompurify";

const searchByTitleAndAliasValidation = async (payload) => {
  const sanitizedPayload = purify.sanitize(payload);
  const searchByTitleAndAliasSchema = string();

  return await searchByTitleAndAliasSchema.validate(sanitizedPayload);
};

export { searchByTitleAndAliasValidation };
