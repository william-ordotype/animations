import Alpine from "alpinejs";

const API_URL = "https://api.ordotype.fr/v1.0.0";

const myDocumentsStore = {
  getOne: {
    document: {
      note: {},
      member: {},
    },
    async getDocument({ id } = {}) {
      try {
        const response = await fetch(`${API_URL}/notes/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${window.memberToken}`,
          },
        });
        if (response.ok) {
          return await response.json();
        } else {
          throw new Error(window.globals.statusMessages.static.error);
        }
      } catch (err) {
        console.error(err);
        Alpine.store("toasterStore").toasterMsg(err, "error");
      }
    },
    async setDocument(props) {
      const { id } = props;
      const res = await this.getDocument({ id });
      this.document = {
        ...res,
      };
    },
  },
  getList: {
    allChecked: false,
    isLoading: false,
    isEmpty: false,
    documents: [],
    pageNumber: null,
    pageTotal: null,
    itemsTotal: null,
    documentType: null,
    documentTypeTitle: null,
    sort: "created_on",
    direction: "DESC",

    async setDocuments(props = {}) {
      this.isLoading = true;
      this.allChecked = false;
      if (!Alpine.store("userStore").isAuth) {
        this.isLoading = false;
        return;
      }
      let documentsResults;
      this.documents = []; // Reset checkboxes
      try {
        documentsResults = await this.request(props);
      } catch (err) {
        console.error("getList error --", err);
      }
      // Checks if empty
      if (documentsResults["data"].length === 0) {
        this.isEmpty = true;
        this.isLoading = false;
        await Alpine.store("documentsStore").rulesStatus.exec();
        return;
      }
      this.isEmpty = false;
      this.documents = documentsResults["data"];
      this.pageNumber = documentsResults["page_number"];
      this.pageTotal = documentsResults["page_total"];
      this.itemsTotal = documentsResults["items_total"];
      this.limit = documentsResults["items_per_page"];
      this.sort = documentsResults["sort"];
      this.direction = documentsResults["direction"];
      this.documentType = this.documentType || "";
      this.isLoading = false;

      if (location.href.includes("mes-documents")) {
        await Alpine.store("documentsStore").rulesStatus.exec();
      }
    },
    async request({
      page = 1,
      limit = 10,
      sort = "created_on",
      direction = "DESC",
      type = this.documentType || "",
      pathology = "",
    } = {}) {
      try {
        const response = await fetch(
          `${API_URL}/notes?page=${page}&limit=${limit}&sort=${sort}&direction=${direction}&type=${type}&pathology=${pathology}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${memberToken}`,
            },
          }
        );
        if (response.ok) {
          return await response.json();
        } else {
          throw new Error("document - getList - fetch failed.");
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
  mutateOne: {
    async exec(payload, files = [], filesToDelete = []) {
      try {
        return payload._id
          ? await this.updateReq(payload, files, filesToDelete)
          : await this.createReq(payload, files);
      } catch (err) {
        throw new Error(err);
      }
    },
    _validatePayload(payload, isUpdate = false) {
      if (isUpdate) {
        if (!payload._id) {
          console.error("Document id not found");
          throw "Id du document non trouvé";
        }
      }
      if (!payload.title) {
        console.error("Title not found");
        throw "Titre non trouvé";
      }
      if (!payload.type) {
        console.error("Document type not found");
        throw "Type de document non trouvé";
      }
      if (payload.type === "prescriptions") {
        if (
          !(
            payload.prescription_type === "balance_sheet" ||
            payload.prescription_type === "treatment"
          )
        ) {
          console.error("Prescription type must be balance_sheet or treatment");
          throw "Type d'ordonnance doit être bilan ou traitement";
        }
      }
      if (payload.type !== "prescriptions") {
        delete payload.prescription_type;
      }
      return payload;
    },
    /**
     * Create request
     * @param {Object} formFields
     * @param {Array} files
     * @returns {Promise}
     */
    async createReq(formFields, files) {
      try {
        const validatedPayload = this._validatePayload(formFields);
        const documentFormData = parseFormData(validatedPayload);
        // Add files to formData
        for (let i = 0; i < files.length; i++) {
          documentFormData.append("files", files[i]);
        }

        return await fetch(`${API_URL}/notes`, {
          method: "POST",
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${window.memberToken}`,
          },
          body: documentFormData,
        });
      } catch (err) {
        throw err;
      }
    },

    /**
     * Update request
     * @param {Object} formFields
     * @param {Array} files
     * @param {Array} filesToDelete
     * @returns {Promise<*>}
     */
    async updateReq(formFields, files, filesToDelete) {
      try {
        const validatedPayload = this._validatePayload(formFields, true);
        // remove files and documents from formFields
        delete validatedPayload.files;
        delete validatedPayload.documents;

        // Convert files proxy array to normal array
        const filesArr = Array.from(files);
        // Prepare files formData
        const filesFormData = new FormData();
        for (let i = 0; i < filesArr.length; i++) {
          filesFormData.append("files", filesArr[i]);
        }
        filesFormData.append("noteId", formFields._id.toString());
        const sendDocumentsPromise = async () =>
          await fetch(`${API_URL}/notes/${formFields._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${window.memberToken}`,
            },
            body: JSON.stringify(validatedPayload),
          });
        const sendFilesPromise = async () =>
          await fetch(`${API_URL}/documents`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${window.memberToken}`,
            },
            body: filesFormData,
          });
        const deleteFilesPromise = async () =>
          await fetch(`${API_URL}/documents`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${window.memberToken}`,
            },
            body: JSON.stringify({ document_id: filesToDelete }),
          });

        // run all promises
        return await Promise.all([
          sendDocumentsPromise(),
          files.length > 0 && sendFilesPromise(),
          filesToDelete.length > 0 && deleteFilesPromise(),
        ]);
      } catch (err) {
        throw err;
      }
    },
  },
  deleteMany: {
    async exec(documentList) {
      try {
        await this.request(documentList);
      } catch (err) {
        console.error("deleteMany - err", err);
      }
    },
    _validatePayload(payload) {
      if (!Array.isArray(payload)) {
        throw new Error("Payload is not an array");
      } else if (payload.length === 0) {
        throw new Error("Payload array is empty");
      } else if (!payload.every((item) => item._id && item._id.trim() !== "")) {
        throw new Error(
          "Payload array contains items without a valid _id property"
        );
      }
      return payload;
    },
    async request(payload) {
      try {
        const validatedPayload = this._validatePayload(payload);
        // Transform payload to array of ids
        const ids = validatedPayload.map((item) => item._id);
        const response = await fetch(`${API_URL}/notes`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.memberToken}`,
          },
          body: JSON.stringify({ note_ids: [...ids] }),
        });

        return await response;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  pathologies: {
    async searchByTitleAndAlias(query) {
      const response = await fetch(
        `${API_URL}/pathologies?page=1&limit=50&sort=title&direction=DESC&title=${query}&alias=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${memberToken}`,
          },
        }
      );
      return response.json();
    },
    async searchIdBySlug(slug) {
      const response = await fetch(
        `${API_URL}/pathologies?page=1&limit=2&sort=title&direction=ASC&slug=${slug}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${memberToken}`,
          },
        }
      );
      return response.json();
    },
  },
  rulesStatus: {
    isLoading: true,
    currentStatus: {
      consumedNotesPercent: "",
      consumedMegabytesPercent: "",
      consumedNotesNumber: "",
      consumedMegabytesNumber: "",
      allowedNumberOfNotes: "",
      allowedMegabyte: "",
    },
    async exec() {
      try {
        this.isLoading = true;
        const response = await this.request();

        const consumedNotesNumber =
          response.allowedNumberOfNotes - response.numberOfRemainingNotes;
        const consumedMegabytesNumber =
          response.allowedMegabyte - response.numberOfMegabyteRemaining;

        this.currentStatus.consumedNotesNumber = consumedNotesNumber;
        this.currentStatus.consumedMegabytesNumber = consumedMegabytesNumber;
        this.currentStatus.allowedNumberOfNotes = response.allowedNumberOfNotes;
        this.currentStatus.allowedMegabyte = response.allowedMegabyte;

        this.currentStatus.consumedNotesPercent =
          (consumedNotesNumber / response.allowedNumberOfNotes) * 100;
        this.currentStatus.consumedMegabytesPercent =
          (consumedMegabytesNumber / response.allowedMegabyte) * 100;
        this.isLoading = false;
      } catch (err) {
        console.error(err);
      }
    },
    async request() {
      const response = await fetch(`${API_URL}/notes/rules/status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${memberToken}`,
        },
      });
      return response.json();
    },
  },
  async init() {
    console.log("Alpine init store");
    Alpine.effect(() => {
      // Solves Bug: Re attach Webflow dropdown events to newly rendered items
      if (this.getList.documents) {
        setTimeout(() => {
          window.Webflow.require("dropdown").ready();
          window.Webflow.require("ix2").init();
        }, 1000);
      }
      console.log("painted");
    });
  },
};

/**
 * Handle request errors
 * @param response
 * @returns {Object | Error}
 */
function handleRequestErrors(response) {
  if (response === false) return;

  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response.json();
}

/**
 * Convert form fields to FormData
 * @param formFieldValues
 * @returns {FormData}
 */
function parseFormData(formFieldValues) {
  return Object.keys(formFieldValues).reduce((formData, key) => {
    formData.append(key, formFieldValues[key]);
    return formData;
  }, new FormData());
}

export default myDocumentsStore;
