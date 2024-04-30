//

import { GetCurrentMemberPayload } from "@memberstack/dom";

class UsersService {
  async getUser(): Promise<GetCurrentMemberPayload["data"] | null> {
    const currentUser = localStorage.getItem("_ms-mem");
    if (!currentUser) {
      const fetchMember = await window.$memberstackDom.getCurrentMember();
      if (!fetchMember) {
        return null;
      }
      return fetchMember.data;
    }
    return JSON.parse(currentUser);
  }
}

export default new UsersService();
