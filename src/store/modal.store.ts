/* eslint-disable */
// @ts-nocheck

import Alpine from "alpinejs";
import { StateStore } from "@utils/enums";
import {
  setDeleteNotes,
  setMixedNotesList,
  setNoteItemOpen,
  setNoteList,
  setNoteOpened,
  setRemoveNotes,
} from "../actions/notesActions.js";
import NProgress from "nprogress";
import PathologiesService from "../services/pathologiesService";
import { INotesStore } from "@store/myNotes.store";
import notesService from "@services/notesService";
import { getNotesFromPathologyTab } from "@components/view/pathology-tabs/pathologyTab.controller";

const pathologiesService = new PathologiesService();

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
    pathologies: [],
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
  async openModal(note, config) {
    // If modal opens using the "edit" button
    // fill the form store/form fields from note object from the getList chached response
    if (note) {
      NProgress.start();
      const getNote = await notesService.getOne(note._id);
      const {
        _id,
        title,
        documents,
        type,
        pathologies,
        prescription_type,
        rich_text_ordo,
      } = getNote.data.note;
      this.form = {
        _id,
        title,
        documents: documents?.length > 0 ? documents : [],
        type,
        pathologies:
          pathologies?.length > 0
            ? // Add only id and title to pathology array
              pathologies.map((p) => {
                return {
                  _id: p._id,
                  title: p.title,
                };
              })
            : [],
        pathologyName: pathologies?.length > 0 ? pathologies[0].title : "",
        prescription_type: prescription_type,
      };

      window.globals.createRTE.clipboard.dangerouslyPasteHTML(rich_text_ordo);
      this.showModal = true;
      NProgress.done();
    } else {
      // If modal is open from create button initialized form fields to empty values
      this.form._id = "";
      this.form.title = "";
      this.form.rich_text_ordo = "";
      this.form.type = config.type;
      this.showModal = true;
      if (window.location.pathname.includes("pathologies")) {
        const pathologySlug =
          import.meta.env.MODE === "development" &&
          location.host === "localhost:3021"
            ? "acne"
            : location.href.split("/")[4]!;
        const res = await pathologiesService.searchBySlug(pathologySlug);
        this.form.pathologies = [
          {
            _id: res.data._id,
            title: res.data.title,
          },
        ];

        window.pathology = {
          _id: res.data._id,
          title: res.data.title,
        };
      } else {
        this.form.pathologies = [];
      }
      this.form.prescription_type = "";
    }
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

  // TODO migrate this function to modal component
  async submitDeleteFromPathologies(ev) {
    const notesStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;

    NProgress.start();
    ev.preventDefault();
    this.closeBeforeDelete();
    notesStore.drawerOpened = false;

    try {
      await setRemoveNotes(
        { noteIds: this.deleteList },
        { noteStore: notesStore }
      );

      await getNotesFromPathologyTab(
        1,
        notesStore.pathologyActiveTab,
        import.meta.env.MODE === "development" &&
          location.host === "localhost:3021"
          ? "acne"
          : location.href.split("/")[4]!,
        notesStore
      );
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
    this.form.pathologies = [];
    this.form.documents = [];
    this.files = [];
    this.form.files = [];
    this.prescription_type = "";
    this.pathologyName = "";
    this.filesToDelete = [];
    // clear local fields
    globals.createRTE.container.querySelector(".ql-editor").innerHTML = "";

    // clear autocomplete
    if ($("#pathology-autocomplete form").length) {
      $("#pathology-autocomplete form")[0].reset();
    }

    // clear form status
    this.formError = false;
    this.formErrorMessage = "";
    this.loadSubmit = false;
  },
  async submitForm(ev) {
    const notesStore = Alpine.store(StateStore.MY_NOTES) as INotesStore;
    const pathologySlug =
      import.meta.env.MODE === "development" &&
      location.host === "localhost:3021"
        ? "acne"
        : location.href.split("/")[4]!;

    ev.preventDefault();
    const purify = await import("dompurify");
    this.form.rich_text_ordo = window.globals.createRTE.root.innerHTML;
    const form = { ...this.form }; // Internal declaration. Because closeModal method resets form._id;
    const files = this.files;
    const filesToDelete = this.filesToDelete;
    form.pathologies = this.form.pathologies.map((path) => path._id);
    // Iterate through each property of the object
    Object.keys(form).forEach((key) => {
      // Skip if property is files or pathology
      if (key === "files" || key === "pathologies") return;
      // Sanitize the html value of each property using DOMPurify
      if (key === "rich_text_ordo") {
        form[key] = purify.default.sanitize(form[key], {
          USE_PROFILES: { html: true },
        });
      }
      // Sanitize the string value of each property using DOMPurify
      form[key] = purify.default.sanitize(form[key]);
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

      this.closeModal();
      // If modal is open from pathologies page refresh the
      // getList filtered by the pathology slug
      if (window.location.pathname.includes("/pathologies")) {
        if (notesStore.pathologyActiveTab === "notes") {
          notesStore.noteOpened = {
            note: null,
            message: null,
          };
        }

        await Promise.all([
          getNotesFromPathologyTab(
            notesStore.noteListMeta.pageNumber,
            notesStore.pathologyActiveTab,
            pathologySlug,
            notesStore
          ),
          notesStore.pathologyActiveTab !== "notes" &&
            setNoteItemOpen(form._id, { noteStore: notesStore }),
        ]);

        return;
      }

      // If modal is open from edit button, refresh the getOne document
      // In order to update all the drawer fields
      if (window.location.hash.includes("/view")) {
        Alpine.store("drawerStore").loadDrawer = true;
        await setNoteOpened(form._id, {
          noteStore: notesStore,
          modalStore: Alpine.store(StateStore.MODAL),
        });
        Alpine.store("drawerStore").loadDrawer = false;
      } else {
        Alpine.store("toasterStore").toasterMsg(
          window.toastActionMsg.notes.mutate.success,
          "success",
          2500
        );
        // If modal is open from create button, refresh the getList documents
        // In order to update the table list
        await setNoteList(
          {
            type: notesStore.noteListType,
          },
          {
            noteStore: notesStore,
          }
        );
      }
    } catch (err) {
      console.error(err);
      this.formError = true;
      this.loadSubmit = false;
      if (err.response?.statusCode === 401) {
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
