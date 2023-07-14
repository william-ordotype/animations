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
    pathology: [],
    documents: [],
  },
  pathologyName: "",
  files: [],
  filesToDelete: [],
  content(container, elem) {
    const dt = this.form.type;
    const id = this.form._id;
    const mutation = id ? "edit" : "create";
    const obj = { ...window.globals.modal.content };

    return dt ? obj[mutation][dt][container][elem] : undefined;
  },
  openModal(note, config) {
    // If modal is open from edit button
    if (note) {
      this.form._id = note._id;
      this.form.title = note.title;
      note.rich_text_ordo &&
        window.globals.createRTE.clipboard.dangerouslyPasteHTML(
          note.rich_text_ordo
        );
      this.form.documents = note.documents?.length > 0 ? note.documents : [];
      this.form.type = note.type;
      this.form.pathology =
        note.pathologies?.length > 0 ? [note.pathologies[0]._id] : [];
      this.pathologyName =
        note.pathologies?.length > 0 ? note.pathologies[0].title : "";
      this.form.prescription_type = note.prescription_type;
      this.form.files = note.documents?.length > 0 ? note.documents : [];
    } else {
      // If modal is open from create button
      this.form._id = "";
      this.form.title = "";
      this.form.rich_text_ordo = "";
      this.form.type = config.type;
      this.form.pathology = [];
      this.form.prescription_type = "";
    }
    this.showModal = true;
  },
  // Delete Path
  deleteList: [],
  openBeforeDelete(docsToDelete) {
    // Convert docsToDelete to array if it's not already
    if (!Array.isArray(docsToDelete)) {
      if (docsToDelete.note) {
        // If docsToDelete is from the getOne request, use the note property and convert to array
        docsToDelete = [docsToDelete.note];
      } else {
        docsToDelete = [docsToDelete];
      }
    }
    this.deleteList = [...docsToDelete];
    this.showBeforeDelete = true;
  },
  contentBeforeDelete(container, elem) {
    const obj = { ...window.globals.modal.content };
    return obj["deleteMany"]["list"][container][elem];
  },
  closeBeforeDelete(ev) {
    if (ev) {
      ev.preventDefault();
    }
    this.showBeforeDelete = false;
  },
  async submitDelete(ev) {
    ev.preventDefault();
    this.closeBeforeDelete();
    try {
      await Alpine.store("documentsStore").deleteMany.exec(this.deleteList);
      if (Alpine.store("drawerStore").showDrawer === true) {
        Alpine.store("drawerStore").hideDrawer();
        const pageNumber =
          Alpine.store("documentsStore").getList.pageNumber || "";
        const documentType =
          Alpine.store("documentsStore").getList.documentType;
        // Redirect to list
        PineconeRouter.currentContext.redirect(
          `/list?type=${documentType ? documentType : "all"}${
            pageNumber && "&page=" + pageNumber
          }`
        );
        Alpine.store("documentsStore").getOne.document = {
          note: {},
          member: {},
        };
      }
      await Alpine.store("documentsStore").getList.setDocuments();
      Alpine.store("toasterStore").toasterMsg(
        "Documents supprimés avec succès",
        "success",
        2000
      );
    } catch (err) {
      console.error(err);
      Alpine.store("toasterStore").toasterMsg("Erreur", "error", 2000);
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
    this.form.pathology = [];
    this.form.documents = [];
    this.files = [];
    this.prescription_type = "";
    this.pathologyName = "";
    this.filesToDelete = [];
    // clear local fields
    globals.createRTE.container.querySelector(".ql-editor").innerHTML = "";

    // clear autocomplete
    $("#pathology-autocomplete form")[0].reset();
  },
  async submitForm(ev) {
    this.form.rich_text_ordo = window.globals.createRTE.root.innerHTML;

    const form = this.form;
    const files = this.files;
    const filesToDelete = this.filesToDelete;

    // Iterate through each property of the object
    Object.keys(form).forEach((key) => {
      // Skip if property is files or pathology
      if (key === "files" || key === "pathology") return;
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
      await Alpine.store("documentsStore").mutateOne.exec(
        form,
        files,
        filesToDelete
      );
      this.closeModal();

      Alpine.store("documentsStore").getList.isLoading = true;
      await Alpine.store("documentsStore").getList.setDocuments({
        type: Alpine.store("documentsStore").getList.documentType,
      });

      Alpine.store("documentsStore").getList.isLoading = false;

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
