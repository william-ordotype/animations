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
            $memberstackDom
              .openModal("LOGIN")
              .then(({ data }) => {
                this.user = data;
                this.isAuth = true;
                $memberstackDom.hideModal();
                Alpine.store("toasterStore").toasterMsg(
                  "Please, refresh the page",
                  "success",
                  3000
                );
              })
              .catch((err) => console.error("auth modal error", err));
          }
          return;
        }
        this.isAuth = true;
        this.user = getUser.data;
        window.memberToken = $memberstackDom.getMemberCookie();
        const mainPlan = this.user.planConnections.filter((plan) => {
          return window.mainPlansIds.includes(plan.planId);
        });

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
