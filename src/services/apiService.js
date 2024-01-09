import { objectToQueryParams } from "./apiUtils";
import { ORDOTYPE_API } from "./apiConfig";

class ApiService {
  /**
   * @param {string} endpoint
   */
  constructor(endpoint) {
    this.API_URL = ORDOTYPE_API;
    this.endpoint = endpoint;
  }

  /**
   * Makes an API request with optional route parameters and query parameters.
   *
   * @param {Object} options - The options for the request.
   * @param {string} [options.method="POST"] - The HTTP method for the request.
   * @param {string} [options.routeParams=""] - The route parameters for the URL.
   * @param {Object} [options.queryParams={}] - The query parameters for the URL.
   * @param {Object} [options.data] - The request body data.
   * @param {String} [options.contentType="application/json"] - Content-Type for the request
   * @param {Function} [options.resCallBack] - A callback function to overwrite the response object.
   * @returns {Promise<object>} A promise that resolves with the response data or rejects with an error.
   */
  async request({
    method = "POST",
    routeParams,
    queryParams,
    data,
    resCallBack,
    contentType = "application/json",
    noContentType = false,
  }) {
    let parsedQueryParams;
    let parsedRouteParams;
    if (queryParams) {
      parsedQueryParams = `?${objectToQueryParams(queryParams)}`;
    }
    if (routeParams) {
      parsedRouteParams = `/${routeParams}`;
    }

    const fetchURL = `${this.API_URL}/${this.endpoint}${
      parsedRouteParams || ""
    }${parsedQueryParams || ""}`;

    try {
      const response = await fetch(fetchURL, {
        method: method,
        headers: {
          Authorization: `Bearer ${window.memberToken}`,
          ...(noContentType ? {} : { "Content-Type": contentType }),
        },
        body: data ? (noContentType ? data : JSON.stringify(data)) : undefined,
      });

      if (resCallBack) {
        return resCallBack(response);
      }

      if (response.ok) {
        return await response.json();
      } else {
        const error = new Error(`Request error. Status: ${response.status}`);
        error.name = "RequestError";
        error.response = response;
        throw error;
      }
    } catch (err) {
      const errObj = {
        ...err,
      };
      // Logs error trace from service request
      console.error(err);
      if (err.response) {
        // Optionally handle the response payload from the server on error
        errObj.response = await err.response.json();
      }
      throw errObj;
    }
  }
}

export default ApiService;
