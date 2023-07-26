import * as DOMPurify from "dompurify";
import Alpine from "alpinejs";

const modalStore = {
  showModal: false,
  showBeforeSave: false,
  showBeforeCancel: false,
  showBeforeDelete: false,
  showInsertUrl: false,
  loadModal: true,
  loadSubmit: false,
  formError: false,
  formErrorMessage: "",
  form: {
    _id: "",
    title: "",
    rich_text_ordo: "",
    prescription_type: "",
    pathology: [],
    documents: [],
  },
  files: [],
  filesToDelete: [],
  content(container, elem) {
    const dt = this.form.type || "prescriptions";
    const id = this.form._id;
    const mutation = id ? "edit" : "create";
    const obj = { ...window.globals.modal.content };

    return dt ? obj[mutation][dt][container][elem] : undefined;
  },
  openModal(note, config) {
    // If modal opens using the "edit" button
    // fill the form store/form fields from note object from the getList chached response
    if (note) {
      this.form._id = note._id;
      this.form.title = note.title;
      note.rich_text_ordo &&
        window.globals.createRTE.clipboard.dangerouslyPasteHTML(
          note.rich_text_ordo
        );
      this.form.documents = note.documents?.length > 0 ? note.documents : [];
      this.form.type = note.type || "prescriptions";
      this.form.pathology =
        note.pathologies?.length > 0
          ? // Add only id and title to pathology array
            note.pathologies.map((pathology) => {
              return {
                _id: pathology._id,
                title: pathology.title,
              };
            })
          : [];
      this.pathologyName =
        note.pathologies?.length > 0 ? note.pathologies[0].title : "";
      this.form.prescription_type = note.prescription_type;
      this.form.files = note.documents?.length > 0 ? note.documents : [];
    } else {
      // If modal is open from create button initialized form fields to empty values
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
    this.form.files = [];
    this.prescription_type = "";
    this.pathologyName = "";
    this.filesToDelete = [];
    // clear local fields
    globals.createRTE.container.querySelector(".ql-editor").innerHTML = "";

    // clear autocomplete
    $("#pathology-autocomplete form")[0].reset();

    // clear form status
    this.formError = false;
    this.formErrorMessage = "";
    this.loadSubmit = false;
  },
  async submitForm(ev) {
    this.form.rich_text_ordo = window.globals.createRTE.root.innerHTML;

    const form = { ...this.form };
    const files = this.files;
    const filesToDelete = this.filesToDelete;
    form.pathology = this.form.pathology.map((path) => path._id);

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
      const isEdit = !!this.form._id; // Internal declaration. Because closeModal method resets form._id
      this.loadSubmit = true;
      const formResponse = await (
        await Alpine.store("documentsStore").mutateOne.exec(
          form,
          files,
          filesToDelete
        )
      ).json();

      if (formResponse.error) {
        this.loadSubmit = false;
        console.error(...formResponse);
        this.formError = true;
        this.formErrorMessage = formResponse.error;
        return;
      }

      this.formError = false;
      this.formErrorMessage = "";
      this.loadSubmit = false;
      this.closeModal();

      // If modal is open from edit button, refresh the getOne document
      // In order to update all the drawer fields
      if (isEdit) {
        await Alpine.store("documentsStore").getOne.getDocument(this.form._id);
      } else {
        // If modal is open from create button, refresh the getList documents
        // In order to update the table list
        Alpine.store("documentsStore").getList.isLoading = true;
        await Alpine.store("documentsStore").getList.setDocuments({
          type: Alpine.store("documentsStore").getList.documentType,
        });
        Alpine.store("documentsStore").getList.isLoading = false;
      }

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
