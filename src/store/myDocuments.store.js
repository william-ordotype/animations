import Alpine from "alpinejs";

const API_URL = "https://api.ordotype.fr/v1.0.0/notes";

const myDocumentsStore = {
  completedAction: false,
  getOne: {
    document: {},
    async getDocument({ id } = {}) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${window.memberToken}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          return responseData;
        } else {
          throw new Error("Upload failed.");
        }
      } catch (err) {
        throw err;
      }
    },
    async setDocument(props) {
      const { id } = props;
      const res = await this.getDocument({ id });
      this.document = { ...res };
    },
    setModalDocument(props) {
      const jsonData = Object.assign({}, props);
      const pathology = Object.assign({}, jsonData.pathology);
      const filesIds = Object.assign({}, jsonData.filesIds);
      const { _id, rich_text_ordo, title } = jsonData;

      Alpine.store("documentsStore").showModal = true;
      window.globals.modal.form.setModalFields({
        _id,
        rich_text_ordo,
        title,
        pathology,
      });
    },
  },

  getList: {
    isLoading: false,
    isEmpty: false,
    documents: [],
    pageNumber: null,
    pageTotal: null,
    itemsTotal: null,
    documentType: null,
    documentTypeTitle: null,

    async setDocuments(props = {}) {
      this.isLoading = true;
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
      if (documentsResults["notes"].length === 0) {
        this.isEmpty = true;
        this.isLoading = false;
        return;
      }
      this.isEmpty = false;
      this.documents = documentsResults["notes"];
      this.pageNumber = documentsResults["page_number"];
      this.pageTotal = documentsResults["page_total"];
      this.itemsTotal = documentsResults["items_total"];
      this.documentType = this.documentType || "";
      this.isLoading = false;
    },
    async getDocuments({
      page = 1,
      limit = 10,
      sort = "created_on",
      direction = "DESC",
      type = this.documentType || "",
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
          const responseData = await response.json();
          return responseData;
        } else {
          throw new Error("Upload failed.");
        }
      } catch (err) {
        throw err;
      }
    },
  },

  createOne: {
    async sendDocument(jsonData, files) {
      // TODO get all documents from form and send request
      if (files.length > 0) {
        const fileRes = await this.uploadFile(files);
        // const fileIds = fileRes.map((file) => file._id)
        jsonData.documents = [fileRes._id];
      }
      const res = await this.postDocument(jsonData);

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
    async uploadFile(files) {
      const formData = new FormData();
      formData.append("file", files[0]);

      const response = await fetch("https://api.ordotype.fr/v1.0.0/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${window.memberToken}`,
        },
        body: formData,
      });
      return await response.json();
    },
    async postDocument(data) {
      if (!data.type) {
        return console.error("Document type not sent");
      } else if (!data.title) {
        return console.error("Title not found");
      }

      // Remove null properties
      for (let prop in data) {
        if (
          data[prop] === "" ||
          data[prop] === null ||
          data[prop] === undefined
        ) {
          delete data[prop];
        }
      }

      try {
        const response = await fetch(
          data._id ? `${API_URL}/${data._id}` : `${API_URL}`,
          {
            method: data._id ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${window.memberToken}`,
            },
            body: JSON.stringify(data),
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          return responseData;
        } else {
          throw new Error("Upload failed.");
        }
      } catch (err) {
        throw err;
      }
    },
  },

  deleteOne: {
    async sendDocument(data) {
      try {
        const res = await this.deleteDocument(data);
        if (!res.ok) {
          console.error(res.status + " Failed Fetch ");
        }
        await Alpine.store("documentsStore").getList.setDocuments();
      } catch (err) {
        console.error("EXCEPTION: ", err);
      }
    },
    async deleteDocument(data) {
      if (!data._id) {
        console.error("Id not found");
        return;
      }
      try {
        const response = await fetch(`${API_URL}/${data._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.memberToken}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          return responseData;
        } else {
          throw new Error("Upload failed.");
        }
      } catch (err) {
        throw err;
      }
    },
  },
  deleteMany: {},
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
