import * as DOMPurify from "dompurify";
import Alpine from "alpinejs";

const modalStore = {
  showModal: false,
  showBeforeSave: false,
  showBeforeCancel: false,
  showBeforeDelete: false,
  showInsertUrl: false,
  loadModal: true,
  form: {
    _id: "",
    title: "",
    rich_text_ordo: "",
    prescription_type: "",
    pathologies: [],
    documents: [],
    type: "",
  },
  pathologyName: "",
  files: [],
  content(container, elem) {
    const dt = this.form.type;
    const id = this.form._id;
    const mutation = id ? "edit" : "create";
    const obj = { ...window.globals.modal.content };

    return dt ? obj[mutation][dt][container][elem] : undefined;
  },
  openModal(note, config) {
    if (note) {
      this.form._id = note._id;
      this.form.title = note.title;
      // this.form.rich_text_ordo = note.rich_text_ordo;
      window.globals.createRTE.clipboard.dangerouslyPasteHTML(
        note.rich_text_ordo
      );
      this.form.documents = note.documents.length > 0 ? note.documents : [];
      this.form.type = note.type;
      this.form.pathologies =
        note.pathologies.length > 0 ? note.pathologies[0]._id : [];
      this.form.prescription_type = note.prescription_type;
    } else {
      this.form._id = "";
      this.form.title = "";
      this.form.rich_text_ordo = "";
      this.form.documents = [];
      this.form.type = config.type;
      this.form.pathologies = [];
      this.form.prescription_type = "";
    }
    this.showModal = true;
  },
  // Delete Path
  deleteObject: {},
  deleteList: [],
  openBeforeDelete(doc, isList = false) {
    if (isList === false) {
      this.deleteObject = doc;
    } else {
      this.deleteList = doc;
    }
    this.showBeforeDelete = true;
  },
  contentBeforeDelete(container, elem) {
    let type = "";
    const obj = { ...window.globals.modal.content };
    if (this.deleteList.length === 0) {
      type = this.deleteObject.type || "";
      const mutation = "delete";

      return type ? obj[mutation][type][container][elem] : undefined;
    } else {
      return obj["deleteMany"]["list"][container][elem];
    }
  },
  closeBeforeDelete(ev) {
    if (ev) {
      ev.preventDefault();
    }
    this.showBeforeDelete = false;
    this.deleteObject = {};
    Alpine.store("drawerStore").hideDrawer();
  },
  async submitDelete(ev, list = false) {
    ev.preventDefault();

    try {
      if (!list) {
        await Alpine.store("documentsStore").deleteOne.sendDocument(
          this.deleteObject
        );
        Alpine.store("toasterStore").toasterMsg(
          "Document supprimé avec succès",
          "success",
          2000
        );
      } else {
        await Alpine.store("documentsStore").deleteMany.exec(this.deleteList);
        Alpine.store("toasterStore").toasterMsg(
          "Documents supprimés avec succès",
          "success",
          2000
        );
      }
      this.closeBeforeDelete();
    } catch (err) {
      console.error(err);
    }
  },
  // Create/Edit Path
  closeModal() {
    // clear dynamic fields
    this.showModal = false;
    this.showBeforeSave = false;
    this.showBeforeCancel = false;
    this.form._id = null;
    this.form.title = "";
    this.form.rich_text_ordo = "";
    this.form.pathologies = [];
    this.form.documents = [];
    this.files = [];
    this.prescription_type = "";
    // clear local fields
    globals.createRTE.container.querySelector(".ql-editor").innerHTML = "";

    // clear autocomplete
    $("#pathology-autocomplete form")[0].reset();
  },
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
    try {
      await Alpine.store("documentsStore").createOne.sendDocument(
        form,
        this.files
      );
      this.closeModal();

      Alpine.store("toasterStore").toasterMsg(
        "Document créé avec succès",
        "success",
        2000
      );
    } catch (err) {
      console.error(err);
      Alpine.store("toasterStore").toasterMsg(
        "Une erreur est survenue",
        "error",
        2000
      );
    }
  },
};

export default modalStore;
