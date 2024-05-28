import { IUserStore } from "@store/user.store";

export const unAuthUserStore: IUserStore = {
  user: null,
  isAuth: false,
  hasPaidSub: false,
  init() {},
};
