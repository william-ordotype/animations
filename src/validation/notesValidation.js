import { string, array, object, number, mixed } from "yup";

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

const getOneValidation = async (payload) => {
  const getOneSchema = string().required();
  return await getOneSchema.validate(payload);
};

const getListValidation = async (payload) => {
  const sortByValues = [
    "collection_id",
    "created_on",
    "form_id",
    "item_id",
    "member_id",
    "object_id",
    "pathology",
    "rich_text_ordo",
    "slug",
    "title",
    "updated_on",
    "wf_item_id",
    "published_on",
    "is_deleted",
  ];
  const getListSchema = object({
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

  return await getListSchema.validate(payload);
};

const createOneValidation = async (payload) => {
  const createOneSchema = object({
    title: string().required().max(200),
    type: string()
      .required()
      .oneOf(["notes", "prescriptions", "recommendations"]),
    prescription_type: string().when("type", {
      is: "prescriptions",
      then: (schema) => schema.oneOf(["balance_sheet", "treatment"]),
    }),
    pathology: array().of(string()).optional(),
    rich_text_ordo: string(),
  });

  return createOneSchema.validate(payload);
};

const updateOneValidation = async (payload) => {
  const updateOneSchema = object({
    _id: string().required(),
    title: string().required().max(200),
    type: string()
      .required()
      .oneOf(["notes", "prescriptions", "recommendations"]),
    prescription_type: string().when("type", {
      is: "prescriptions",
      then: (schema) => schema.oneOf(["balance_sheet", "treatment"]),
    }),
    pathology: array().of(string()).optional(),
    rich_text_ordo: string(),
  });

  return updateOneSchema.validate(payload);
};

export {
  deleteManyNotesValidation,
  getOneValidation,
  getListValidation,
  createOneValidation,
  updateOneValidation,
};
