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
   * @param searchQuery
   * @return {Promise<Object>}
   */
  async searchBySlug(searchQuery) {
    const validatePayload = searchQuery;
    return await this.request({
      method: "GET",
      queryParams: {
        page: 1,
        limit: 2,
        sort: "title",
        direction: "ASC",
        slug: validatePayload,
      },
    });
  }
}

export default PathologiesService;
