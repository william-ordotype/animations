import { objectToQueryParams } from "./apiUtils";

class ApiService {
  constructor(API_URL, endpoint) {
    this.API_URL = API_URL;
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

    debugger;
    const response = await fetch(fetchURL, {
      method: method,
      headers: {
        Authorization: `Bearer ${window.memberToken}`,
        "Content-Type": contentType,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (resCallBack) {
      return resCallBack(response);
    }

    if (response.ok) {
      return await response.json();
    } else {
      if (response.status === 401) {
        throw "Unauthorized";
      }
      if (response.status === 404) {
        throw "Not found";
      }
      throw response.status;
    }
  }
}

export default ApiService;
