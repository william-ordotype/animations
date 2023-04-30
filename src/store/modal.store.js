const modalStore = {
  showModal: false,
  showBeforeSave: false,
  showBeforeCancel: false,
  loadModal: true,
  showDrawer: false,
  loadDrawer: false,

  form: {
    _id: "",
    title: "",
    rich_text_ordo: "",
    pathology: [],
    filesId: [],
    type: ""
  },
  openModal(note) {
    if (note) {
      this.form._id = note._id;
      this.form.title = note.title;
      this.form.rich_text_ordo = note.rich_text_ordo;
      this.form.filesId = note.filesId;
    } else {
      this.form._id = "";
      this.form.title = "";
      this.form.rich_text_ordo = "";
      this.form.filesId = [];
    }
    this.showModal = true;
  },
  closeModal() {
    this.showModal = false;
    this.showBeforeSave = false;
    this.showBeforeCancel = false;
    this.form._id = null;
    this.form.title = "";
    this.form.rich_text_ordo = "";
    this.form.pathology = [];
    this.form.filesId = [];
  },
  saveNote() {
    console.log("submitting");
    this.closeModal();
  },
};

export default modalStore;
