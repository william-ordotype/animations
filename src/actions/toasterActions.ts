import Alpine from "alpinejs";
import { StateStore } from "@utils/enums";
import { IToastStore, Status_Level } from "@store/toaster.store";

function setToastMessage(
  message: string,
  type: Status_Level,
  milliseconds?: number
): void {
  const toastStore = Alpine.store(StateStore.TOASTER) as IToastStore;

  toastStore.toasterMsg(message, type, milliseconds);
}

export default {
  setToastMessage,
};
