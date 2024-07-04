import { IUserStore } from "@store/user.store";

export const freeUserStore: IUserStore = {
  user: {
    id: "mem_sb_clj28vbgk011o0tkzb48rewzh",
    verified: false,
    createdAt: "2023-06-19T02:35:40.870Z",
    profileImage: "",
    auth: {
      email: "raquelcle+2@gmail.com",
      hasPassword: true,
      providers: [],
    },
    metaData: {},
    customFields: {
      nom: "Raquel 2",
      prnom: "Lopez",
    },
    permissions: [],
    stripeCustomerId: "",
    loginRedirect: "/membership/successful-login",
    planConnections: [
      {
        id: "con_sb_clr9xa1tl00310sszba7e8g3e",
        active: true,
        status: "ACTIVE",
        planId: "pln_compte-ouvert-u94k0of5",
        type: "FREE",
        payment: null,
      },
    ],
  },
  isAuth: true,
  hasPaidSub: false,
  init() {},
};
