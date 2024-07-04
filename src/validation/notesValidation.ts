import { array, boolean, number, object, string } from "yup";
import { NoteTypes } from "@utils/enums";
import { InferType } from "yup";

const sortByValues = [
  "created_on",
  "pathology",
  "title",
  "type",
  "prescription_type",
  "updated_by.full_name",
];

const deleteNotesSchema = object({
  note_ids: array().of(string()).required(),
})
  .shape({
    note_ids: array(),
  })
  .noUnknown();
const deleteManyNotesValidation = async (
  payload: InferType<typeof deleteNotesSchema>
) => {
  return await deleteNotesSchema.validate(payload);
};

const getOneValidation = async (payload: ToDo) => {
  const getOneSchema = string();
  return await getOneSchema.validate(payload);
};

export const getListSchema = object({
  page: number().positive().integer().default(1),
  limit: number().positive().integer().default(10),
  sort: string().oneOf(sortByValues).default("created_by"),
  direction: string().oneOf(["DESC", "ASC"]).default("DESC"),
  type: string()
    .oneOf(["notes", "prescriptions", "recommendations", ""])
    .optional(),
  prescription_type: string()
    .oneOf(["balance_sheet", "treatment", ""])
    .optional(),
  pathology: array().of(string()).optional(),
  pathology_slug: string().optional(),
  title: string(),
  withShares: boolean().optional(),
});

const getListValidation = async (payload: InferType<typeof getListSchema>) => {
  return await getListSchema.validate(payload);
};

export const createOneSchema = object({
  title: string().required().max(200),
  type: string()
    .required()
    .oneOf([
      NoteTypes.NOTES,
      NoteTypes.PRESCRIPTIONS,
      NoteTypes.RECOMMENDATIONS,
    ]),
  prescription_type: string().when("type", {
    is: "prescriptions",
    then: (schema) => schema.oneOf(["balance_sheet", "treatment"]),
  }),
  pathology: array().of(string()).optional(),
  rich_text_ordo: string(),
});
const createOneValidation = async (
  payload: InferType<typeof createOneSchema>
) => {
  return await createOneSchema.validate(payload);
};

export const updateOneSchema = object({
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
const updateOneValidation = async (
  payload: InferType<typeof updateOneSchema>
) => {
  return await updateOneSchema.validate(payload);
};

export const searchByNoteTitleAndPathologyTitleSchema = object({
  page: number().required().positive().integer().optional(),
  limit: number().required().positive().integer().optional(),
  sort: string().oneOf(sortByValues).optional(),
  direction: string().oneOf(["DESC", "ASC"]).optional(),
  noteTitleAndPathologyTitle: string().default(""),
});
const searchByNoteTitleAndPathologyTitleValidation = async (
  payload: InferType<typeof searchByNoteTitleAndPathologyTitleSchema>
) => {
  return await searchByNoteTitleAndPathologyTitleSchema.validate(payload);
};

export {
  deleteManyNotesValidation,
  getOneValidation,
  getListValidation,
  createOneValidation,
  updateOneValidation,
  searchByNoteTitleAndPathologyTitleValidation,
};
