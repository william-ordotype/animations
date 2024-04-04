import Alpine from "alpinejs";
import { Status_Types, ToastStore } from "./toaster.store.js";

const userStore = (getUser) => {
  return {
    user: null,
    isAuth: false,
    hasPaidSub: false,
    async init() {
      try {
        if (!getUser.data) {
          this.isAuth = false;
          if (
            location.href.includes("localhost") ||
            location.href.includes("static")
          ) {
            window.$memberstackDom
              .openModal("LOGIN")
              .then(({ data }) => {
                this.user = data;
                this.isAuth = true;
                window.$memberstackDom.hideModal();

                const toastStore = Alpine.store("toasterStore") as ToastStore;
                toastStore.toasterMsg(
                  "Please, refresh the page",
                  Status_Types.Success,
                  3000
                );
              })
              .catch((err) => console.error("auth modal error", err));
          }
          return;
        }
        this.isAuth = true;
        this.user = getUser.data;
        window.memberToken = window.$memberstackDom.getMemberCookie();
        const mainPlan = this.user.planConnections.filter(
          (plan: { planId: string }) => {
            return window.mainPlansIds.includes(plan.planId);
          }
        );

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
