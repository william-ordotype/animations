/**
 * Returns queryParams String from an object
 * @param {Object} obj
 * @returns {string}
 */
function objectToQueryParams(obj: ToDo) {
  const queryParams = new URLSearchParams();

  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      obj[key] !== undefined &&
      obj[key] !== null
    ) {
      queryParams.append(key, obj[key]);
    }
  }

  return queryParams.toString();
}

function parseFormData(formFieldValues: ToDo) {
  return Object.keys(formFieldValues).reduce((formData, key) => {
    formData.append(key, formFieldValues[key]);
    return formData;
  }, new FormData());
}

function removeEmptyParams(formFieldValues: Record<string, any>) {
  Object.keys(formFieldValues).forEach((key: string) => {
    if (
      formFieldValues[key as keyof typeof formFieldValues] === "" ||
      formFieldValues[key as keyof typeof formFieldValues] === undefined ||
      (Array.isArray(formFieldValues[key as keyof typeof formFieldValues]) &&
        formFieldValues[key as keyof typeof formFieldValues].length === 0)
    ) {
      delete formFieldValues[key as keyof typeof formFieldValues];
    }
  });

  return formFieldValues;
}

export { objectToQueryParams, parseFormData, removeEmptyParams };
