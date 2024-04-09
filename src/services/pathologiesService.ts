// @ts-nocheck
//
import ApiService from "./apiService";
import { searchByTitleAndAliasValidation } from "../validation/pathologiesValidation";

class PathologiesService extends ApiService {
  constructor() {
    super("pathologies");
  }

  /**
   *
   * @param {string} searchQuery
   */
  async searchByTitleAndAlias(searchQuery: ToDo) {
    const reqParams = {
      page: 1,
      limit: 50,
      sort: "title",
      direction: "DESC",
    };
    const validatePayload = await searchByTitleAndAliasValidation(searchQuery);
    return await this.request({
      method: "GET",
      queryParams: {
        ...reqParams,
        alias: validatePayload,
        title: validatePayload,
      },
    });
  }

  /**
   *
   * @param {string} slug
   */
  async searchBySlug(slug: string) {
    return await this.request({
      method: "GET",
      routeParams: slug,
    });
  }
}

export default PathologiesService;
