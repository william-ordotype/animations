//

import { GetCurrentMemberPayload } from "@memberstack/dom";

async function getUser(): Promise<GetCurrentMemberPayload["data"]> {
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

export { getUser };
