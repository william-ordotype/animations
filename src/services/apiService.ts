import { ORDOTYPE_API } from "./apiConfig";
import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseTransformer,
  isAxiosError,
  ResponseType,
  InternalAxiosRequestConfig,
  isCancel,
} from "axios";

function requestInterceptor(config: InternalAxiosRequestConfig) {
  config.headers.Authorization = `Bearer ${window.memberToken}`;
  return config;
}

interface RequestOptions<TBody, TParams> {
  method?: string;
  routeParams?: string;
  queryParams?: TParams;
  data?: TBody;
  resCallBack?: AxiosResponseTransformer | AxiosResponseTransformer[];
  contentType?: string;
  responseType?: ResponseType;
}

class ApiService {
  private readonly API_URL: string;
  private readonly endpoint: string;
  private instance: AxiosInstance | undefined;
  private controller: null | AbortController;

  constructor(endpoint: string) {
    this.API_URL = ORDOTYPE_API;
    this.endpoint = endpoint;
    this.controller = null;

    if (window.axios) {
      // Axios is available from the pathology search
      this.instance = window.axios.create({
        baseURL: this.API_URL,
      });
    } else {
      // If axios is not available, dynamically import it as fallback
      import("axios")
        .then(({ default: axios }) => {
          this.instance = axios.create({
            baseURL: this.API_URL,
          });
        })
        .catch((error) => {
          console.error("Failed to dynamically import axios:", error);
        });
    }
    this.instance?.interceptors.request.use(requestInterceptor, (error) => {
      // Handle request errors
      return Promise.reject(error);
    });
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
   * @param {string} [options.responseType="json"] - Response type format
   * @param {Function} [options.resCallBack] - A callback function to overwrite the response object.
   */
  async request<TBody, TParams, TResponse>({
    method = "POST",
    routeParams,
    queryParams,
    data,
    resCallBack,
    contentType = "application/json",
    responseType = "json",
  }: RequestOptions<TBody, TParams>): Promise<AxiosResponse<TResponse>> {
    const fetchURL = routeParams
      ? `${this.endpoint}/${routeParams}`
      : `${this.endpoint}`;

    const config: AxiosRequestConfig<TBody> = {
      signal: this.controller?.signal,
      method,
      url: fetchURL,
      data,
      params: queryParams,
      headers: {
        // ToDo insert an interceptor
        // Authorization: `Bearer ${window.memberToken}`,
        "Content-Type": contentType,
      },
      transformResponse: resCallBack,
      responseType,
    };
    try {
      return await this.instance!.request(config);
    } catch (err) {
      // if the reason behind the failure
      // is a cancellation
      if (isCancel(err)) {
        console.error("Request canceled");
      } else if (isAxiosError(err)) {
        console.error("Server Error" + err.message);
      }
      throw err;
    }
  }

  createNewAbortController() {
    // Abort the previous controller if it exists
    if (this.controller) {
      this.controller.abort();
    }
    // Create a new controller for the new request
    this.controller = new AbortController();
  }
}

export default ApiService;
