import { IToastStore } from "@store/toaster.store";

export const toastStaticStore: IToastStore = {
  showToaster: false,
  message: "",
  type: "success",
  toasterMsg() {},
};
