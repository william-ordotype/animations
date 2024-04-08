// @ts-nocheck
//
import ApiService from "./apiService";
import { searchByTitleAndAliasValidation } from "../validation/pathologiesValidation";

class PathologiesService extends ApiService {
  constructor() {
    super("pathologies");
  }

  // async getList(payload) {
  //   // const validatedPayload
  //   return await this.request({
  //     method: "GET",
  //     queryParams: `page=1&limit=50&sort=title&direction=DESC&title=${validatePayload}&alias=${validatePayload}`,
  //   });
  // }

  /**
   *
   * @param {string} searchQuery
   * @returns {Promise<Object>}
   */
  async searchByTitleAndAlias(searchQuery) {
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
   * @return {Promise<Object>}
   */
  async searchBySlug(slug) {
    return await this.request({
      method: "GET",
      routeParams: slug,
    });
  }
}

export default PathologiesService;
