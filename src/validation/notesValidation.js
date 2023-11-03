const deleteManyNotesValidation = (payload) => {
  if (!Array.isArray(payload)) {
    throw new Error("Payload is not an array");
  } else if (payload.length === 0) {
    throw new Error("Payload array is empty");
  } else if (!payload.every((item) => item._id && item._id.trim() !== "")) {
    throw new Error(
      "Payload array contains items without a valid _id property"
    );
  }
  return payload;
};

export { deleteManyNotesValidation };
