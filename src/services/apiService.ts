import { ORDOTYPE_API } from "./apiConfig";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseTransformer,
  isAxiosError,
  ResponseType,
} from "axios";
import Alpine from "alpinejs";
import { StateStore } from "../utils/enums.js";
import { IToastStore, Status_Type } from "../store/toaster.store.js";

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
  private instance: AxiosInstance;

  constructor(endpoint: string) {
    this.API_URL = ORDOTYPE_API;
    this.endpoint = endpoint;

    this.instance = axios.create({
      baseURL: this.API_URL,
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
      method,
      url: fetchURL,
      data,
      params: queryParams,
      headers: {
        Authorization: `Bearer ${window.memberToken}`,
        "Content-Type": contentType,
      },
      transformResponse: resCallBack,
      responseType,
    };
    try {
      return await this.instance.request(config);
    } catch (err) {
      const toastStore = Alpine.store(StateStore.TOASTER) as IToastStore;

      if (isAxiosError(err)) {
        toastStore.toasterMsg("Server Error", Status_Type.Error, 2500);
      }
      console.error(err);
      throw err;
    }
  }
}

export default ApiService;
