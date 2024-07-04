import Alpine from "alpinejs";
import { Status_Type, IToastStore } from "./toaster.store.js";
import { GetCurrentMemberPayload } from "@memberstack/dom";

export interface IUserStore {
  user: GetCurrentMemberPayload["data"] | null;
  isAuth: boolean;
  hasPaidSub: boolean;
  init: () => void;
}

const toastStore = Alpine.store("toasterStore") as IToastStore;

const userStore = (
  user: Awaited<GetCurrentMemberPayload["data"]> | null
): IUserStore => {
  return {
    user: null,
    isAuth: false,
    hasPaidSub: false,
    async init() {
      try {
        if (!user) {
          this.isAuth = false;
          if (import.meta.env.MODE === "development") {
            window.$memberstackDom
              .openModal("LOGIN")
              .then((value) => {
                const { data } = value as GetCurrentMemberPayload;
                this.user = data;
                this.isAuth = true;
                window.$memberstackDom.hideModal();

                toastStore.toasterMsg(
                  "Please, refresh the page",
                  Status_Type.Success,
                  3000
                );
              })
              .catch((err) => console.error("auth modal error", err));
          }
          return;
        }
        this.isAuth = true;
        this.user = user;
        window.memberToken = window.$memberstackDom.getMemberCookie();
        const mainPlan: string = this.user.planConnections
          .filter((plan: { planId: string }) => {
            return window.mainPlansIds.includes(plan.planId);
          })
          .toString();

        if (mainPlan) {
          this.hasPaidSub = true;
        }
      } catch (err) {
        console.error("user error", err);
      }
    },
  };
};

export default userStore;
