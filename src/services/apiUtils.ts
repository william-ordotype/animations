/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/**
 * Returns queryParams String from an object
 * @param {Object} obj
 * @returns {string}
 */
function objectToQueryParams(obj: ToDo) {
  const queryParams = new URLSearchParams();

  for (const key in obj) {
    if (
      obj.hasOwnProperty(key) &&
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

export { objectToQueryParams, parseFormData };
