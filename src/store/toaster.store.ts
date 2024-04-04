// ToDo evaluate implementation and replace by enum
const STATUS_TYPES = {
  success: "success",
  error: "error",
  info: "info",
};

export enum Status_Types {
  Success = "success",
  Error = "error",
  Info = "info",
}

export type ToastStatus =
  | Status_Types.Success
  | Status_Types.Error
  | Status_Types.Info;

export interface ToastStore {
  showToaster: boolean;
  message: string;
  type: ToastStatus;
  toasterMsg: (msg: string, type: ToastStatus, time: number) => void;
}

const toasterStore: ToastStore = {
  showToaster: false,
  message: "",
  type: Status_Types.Info,
  toasterMsg(msg = "", type, time = 3000) {
    if (STATUS_TYPES[type] === undefined) {
      this.type = "none";
      console.error("Toaster type not found");
    } else {
      this.type = type;
    }
    this.message = msg;
    this.showToaster = true;
    setTimeout(() => {
      this.message = "";
      this.showToaster = false;
      this.type = "none";
    }, time);
  },
};

export default toasterStore;
