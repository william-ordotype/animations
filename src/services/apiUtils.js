/**
 * Returns queryParams String from an object
 * @param {Object} obj
 * @returns {string}
 */
function objectToQueryParams(obj) {
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

export { objectToQueryParams };
