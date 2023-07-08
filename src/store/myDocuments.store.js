import Alpine from "alpinejs";

const API_URL = "https://api.ordotype.fr/v1.0.0/notes";

const myDocumentsStore = {
  getOne: {
    document: {
      note: {},
      member: {},
    },
    async getDocument({ id } = {}) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
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
        documentsResults = await this.getDocuments(props);
      } catch (err) {
        console.error("getList error --", err);
      }
      // Checks if empty
      if (documentsResults["data"].length === 0) {
        this.isEmpty = true;
        this.isLoading = false;
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
    },
    async getDocuments({
      page = 1,
      limit = 10,
      sort = "created_on",
      direction = "DESC",
      type = this.documentType || "",
      pathology = "",
    } = {}) {
      try {
        const response = await fetch(
          `${API_URL}?page=${page}&limit=${limit}&sort=${sort}&direction=${direction}&type=${type}`,
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
  createOne: {
    async sendDocument(jsonData, files = []) {
      // TODO send files in the same fetch
      // if (files.length > 0) {
      //   const fileRes = await this.uploadFile(files);
      //   // const fileIds = fileRes.map((file) => file._id)
      //   jsonData.documents = [fileRes._id];
      // }
      const res = await this.postDocument(jsonData, files);

      if (res.errors) {
        console.error(res);
      } else {
        Alpine.store("modalStore").closeModal();
        Alpine.store("documentsStore").getList.isLoading = true;
        await Alpine.store("documentsStore").getList.setDocuments({
          type: Alpine.store("documentsStore").getList.documentType,
        });
        Alpine.store("documentsStore").getList.isLoading = false;
      }
    },
    async postDocument(data, files) {
      if (!data.type) {
        return console.error("Document type not sent");
      } else if (!data.title) {
        return console.error("Title not found");
      }

      // Convert files proxy array to normal array

      debugger;
      // // Remove null properties
      // for (let prop in data) {
      //   if (
      //     data[prop] === "" ||
      //     data[prop] === null ||
      //     data[prop] === undefined
      //   ) {
      //     delete data[prop];
      //   }
      // }

      const parseFormData = (object) =>
        Object.keys(object).reduce((formData, key) => {
          formData.append(key, object[key]);
          return formData;
        }, new FormData());

      const newFormData = parseFormData(data);
      // Add files to formData

      for (let i = 0; i < files.length; i++) {
        newFormData.append("files", files[i]);
      }

      try {
        const response = await fetch(
          data._id ? `${API_URL}/${data._id}` : `${API_URL}`,
          {
            method: data._id ? "PUT" : "POST",
            headers: {
              // "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${window.memberToken}`,
            },
            body: newFormData,
          }
        );
        if (response.ok) {
          return await response.json();
        } else {
          throw new Error("document - mutateOne - fetch failed.");
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
  deleteMany: {
    async exec(documentList) {
      // Delete execution
      try {
        await this.query(documentList);
        await Alpine.store("documentsStore").getList.setDocuments();
      } catch (err) {
        console.error("deleteMany - err", err);
      }
    },
    async query(payload) {
      // Validators
      if (!Array.isArray(payload)) {
        throw new Error("Payload is not an array");
      } else if (payload.length === 0) {
        throw new Error("Payload array is empty");
      } else if (!payload.every((item) => item._id && item._id.trim() !== "")) {
        throw new Error(
          "Payload array contains items without a valid _id property"
        );
      }

      // Transform payload to array of ids
      const ids = payload.map((item) => item._id);

      try {
        const response = await fetch(`${API_URL}/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.memberToken}`,
          },
          body: JSON.stringify({ note_ids: [...ids] }),
        });
        if (response.ok) {
          return await response.json();
        } else {
          const errorInfo = {
            status: response.status,
            statusText: response.statusText,
          };
          throw new Error(`Request failed: ${JSON.stringify(errorInfo)}`);
        }
      } catch (err) {
        throw new Error(`deleteMany - error: ${err}`);
      }
    },
  },
  pathologies: {
    async getList(query) {
      const response = await fetch(
        `https://api.ordotype.fr/v1.0.0/pathologies?page=1&limit=10&sort=title&direction=DESC&title=${query}`,
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

export default myDocumentsStore;
