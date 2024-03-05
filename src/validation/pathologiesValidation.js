import { string } from "yup";

const searchByTitleAndAliasValidation = async (payload) => {
  const purify = await import("dompurify");
  const sanitizedPayload = purify.sanitize(payload);
  const searchByTitleAndAliasSchema = string();

  return await searchByTitleAndAliasSchema.validate(sanitizedPayload);
};

export { searchByTitleAndAliasValidation };
