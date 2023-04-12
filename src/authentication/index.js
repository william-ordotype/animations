async function consultsMemberstackAuthentication () {
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
                console.log(data);
            })
        } else {
            // Shows authenticated state
            window.memberToken = window.memberstack?.instance.getMemberCookie();
            $(".content_main_wrapper").show();
        }

        // Removes loading component
        $(".loading_container").hide();
    } catch (err) {
        console.error(err);
    }
}

export default consultsMemberstackAuthentication;
