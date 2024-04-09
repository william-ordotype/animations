// ToDo evaluate implementation and replace by const
export const STATUS_TYPES = {
  success: "success",
  error: "error",
  info: "info",
} as const;

type ObjectValues<T> = T[keyof T];

type Status_Level = ObjectValues<typeof STATUS_TYPES>;

export enum Status_Type {
  Success = "success",
  Error = "error",
  Info = "info",
}

export type ToastStatus =
  | Status_Type.Success
  | Status_Type.Error
  | Status_Type.Info;

export interface IToastStore {
  showToaster: boolean;
  message: string;
  type: Status_Level;
  toasterMsg: (msg: string, type: Status_Level, time?: number) => void;
}

const toasterStore: IToastStore = {
  showToaster: false,
  message: "",
  type: Status_Type.Info,
  toasterMsg(msg = "", type, time = 3000) {
    if (STATUS_TYPES[type] === undefined) {
      console.error("Toaster type not found");
    } else {
      this.type = STATUS_TYPES[type];
    }
    this.message = msg;
    this.showToaster = true;
    setTimeout(() => {
      this.message = "";
      this.showToaster = false;
    }, time);
  },
};

export default toasterStore;
