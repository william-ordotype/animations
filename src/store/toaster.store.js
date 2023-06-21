const STATUS_TYPES = {
  success: "success",
  error: "error",
  info: "info",
};

const toasterStore = {
  showToaster: false,
  message: "",
  type: "none",
  toasterMsg(msg = "", type = "none", time = 3000) {
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
