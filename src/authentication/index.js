async function consultsMemberstackAuthentication() {
  try {
    // TODO optimize so it doesn't ask two requests in prod
    const user = await memberstack.instance.getCurrentMember();
    if (!user.data) {
      // Shows unauthenticated state
      $(".paywall_wrapper").show();

      // TODO Refactor to show login modal only in local
      memberstack.instance.openModal("LOGIN").then(({ data }) => {
        memberstack.instance.hideModal();
        $(".paywall_wrapper").hide();
        $(".content_main_wrapper").show();
      });
      return;
    }

    const mainPlan =
      user.data?.planConnections.filter((plan) => {
        return window.mainPlansIds.includes(plan.planId);
      });

    if(!mainPlan) {
        $(".paywall_wrapper").show();
        return;
    }

    // Shows authenticated state
    window.memberToken = window.memberstack?.instance.getMemberCookie();
    $(".paywall_wrapper").hide();
    debugger
    $(".content_main_wrapper").show();

    window.memberstack.user = window.memberstack.user || user.data;

    // Removes loading component
    // $(".loading_container").hide();
  } catch (err) {
    console.error(err);
  }
}

export default consultsMemberstackAuthentication;
