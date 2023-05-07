import * as DOMPurify from "dompurify";
import Alpine from "alpinejs";

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
    documents: [],
    type: "",
  },
  files: [],
  content(container, elem) {
    const dt = this.form.type;
    const id = this.form._id;
    const mutation = id ? "edit" : "create";
    const obj = { ...window.globals.modal.content };

    return dt ? obj[mutation][dt][container][elem] : undefined;
  },
  openModal(note, config) {
    debugger
    if (note) {
      this.form._id = note._id;
      this.form.title = note.title;
      // this.form.rich_text_ordo = note.rich_text_ordo;
      window.globals.createRTE.clipboard.dangerouslyPasteHTML(
        note.rich_text_ordo
      );
      this.form.documents = note.documents.length > 0 ? note.documents : [];
      this.form.type = note.type;
      this.form.pathology = note.pathology.length > 0 ? note.pathology[0]._id : [];
    } else {
      this.form._id = "";
      this.form.title = "";
      this.form.rich_text_ordo = "";
      this.form.documents = [];
      this.form.type = config.type;
      this.form.pathology = [];
    }
    this.showModal = true;
  },
  closeModal() {
    // clear dynamic fields
    this.showModal = false;
    this.showBeforeSave = false;
    this.showBeforeCancel = false;
    this.form._id = null;
    this.form.title = "";
    this.form.rich_text_ordo = "";
    this.form.pathology = [];
    this.form.documents = [];
    this.files = [];

    // clear local fields
    globals.createRTE.container.querySelector('.ql-editor').innerHTML = ""},
  async submitForm(ev) {
    console.log("submitting");
    this.form.rich_text_ordo = window.globals.createRTE.root.innerHTML;

    const form = this.form;
    // Iterate through each property of the object
    Object.keys(form).forEach((key) => {
      // Sanitize the html value of each property using DOMPurify
      if (key === "rich_text_ordo") {
        form[key] = DOMPurify.sanitize(form[key], {
          USE_PROFILES: { html: true },
        });
      }
      // Sanitize the string value of each property using DOMPurify
      form[key] = DOMPurify.sanitize(form[key]);
    });
    await Alpine.store("documentsStore").createOne.sendDocument(form, this.files);

    this.closeModal();
  },
};

export default modalStore;
