import Alpine from "alpinejs";
import { StateStore } from "@utils/enums";
import { IToastStore, Status_Level } from "@store/toaster.store";

function setToastMessage(message: string, type: Status_Level): void {
  const toastStore = Alpine.store(StateStore.TOASTER) as IToastStore;

  toastStore.toasterMsg(message, type);
}

export default {
  setToastMessage,
};
