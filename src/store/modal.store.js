import * as DOMPurify from "dompurify";
import Alpine from "alpinejs";
import NotesService from "../services/notesService";
import { StateStore, ToasterMsgTypes } from "../utils/enums";
import {
  setDeleteNotes,
  setNoteList,
  setNoteOpened,
} from "../actions/notesActions";
import NProgress from "nprogress";

const notesService = new NotesService();

const modalStore = {
  showModal: false,
  showBeforeSave: false,
  showBeforeCancel: false,
  showBeforeDelete: false,
  showSharingOptions: false,
  showBeforeRemoveSharedInvitation: false,
  showBeforeCloneNote: false,
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
      if (window.location.pathname.includes("pathologies")) {
        this.form.pathology = [
          {
            _id: window.pathology._id,
            title: window.pathology.title,
          },
        ];
      } else {
        this.form.pathology = [];
      }
      this.form.prescription_type = "";
    }
    this.showModal = true;
  },
  // Delete Path
  deleteList: [],
  contentBeforeDelete(container, elem) {
    const obj = { ...window.globals.modal.content };
    return obj["deleteMany"]["list"][container][elem];
  },
  closeBeforeDelete(ev) {
    if (ev) {
      ev.preventDefault();
    }
    this.showBeforeDelete = false;
    this.closeModal();
  },
  async submitDelete(ev) {
    NProgress.start();
    ev.preventDefault();
    this.closeBeforeDelete();
    try {
      await setDeleteNotes({ noteIds: this.deleteList });
    } catch (err) {
      console.error(err);
    }

    NProgress.done();
  },
  // Shared notes modal
  removeShareNoteList: [],

  // Create/Edit Path
  closeModal() {
    // clear dynamic fields
    this.showModal = false;
    this.showBeforeSave = false;
    this.showBeforeCancel = false;
    this.showBeforeRemoveSharedInvitation = false;
    this.showBeforeCloneNote = false;
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
    ev.preventDefault();
    this.form.rich_text_ordo = window.globals.createRTE.root.innerHTML;
    const form = { ...this.form }; // Internal declaration. Because closeModal method resets form._id;
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
      const isEdit = !!form._id;
      this.loadSubmit = true;
      let formResponse;
      if (isEdit) {
        // Transform fetch race to array of json
        const [formRes, fileRes, filesDeletedRes] =
          await notesService.updateOne(form, files, filesToDelete);

        formResponse = formRes;
      } else {
        formResponse = await notesService.createOne(form, files);
      }
      debugger;

      this.closeModal();
      // If modal is open from pathologies page refresh the
      // getList filtered by the pathology slug
      if (window.location.pathname.includes("/pathologies")) {
        const noteListComponents = document.querySelectorAll(
          ".mes_notes_holder [x-text], .empty_state"
        );
        noteListComponents.forEach((component) => {
          component.dispatchEvent(window.customEvents.loadingTrigger);
        });

        if (Alpine.store("drawerStore").showDrawer === true) {
          await setNoteOpened(form._id);
        }

        const pathologyId = window.pathology._id;
        await setNoteList({
          pathology: [pathologyId],
          limit: 40,
        });

        noteListComponents.forEach((component) => {
          component.dispatchEvent(window.customEvents.loadingCancel);
        });
        return;
      }

      // If modal is open from edit button, refresh the getOne document
      // In order to update all the drawer fields
      if (window.location.hash.includes("/view")) {
        Alpine.store("drawerStore").loadDrawer = true;
        await setNoteOpened(form._id);
        Alpine.store("drawerStore").loadDrawer = false;
      } else {
        Alpine.store("toasterStore").toasterMsg(
          window.toastActionMsg.notes.mutate.success,
          "success",
          2500
        );
        // If modal is open from create button, refresh the getList documents
        // In order to update the table list
        await setNoteList({
          type: Alpine.store(StateStore.MY_NOTES).noteListType,
        });
      }
    } catch (err) {
      console.error(err);
      this.formError = true;
      this.loadSubmit = false;
      if (err.statusCode === 401) {
        this.formErrorMessage = window.modalMsg.form.error.exceededStorage;
        return;
      }

      if (err.name === "ValidationError") {
        this.formErrorMessage = err.errors;
        return;
      }

      this.formErrorMessage = err.message || window.modalMsg.form.error.general;
    }
  },
};

export default modalStore;
