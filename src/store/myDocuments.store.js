import Alpine from "alpinejs";

const myDocumentsStore = {
  showModal: false,
  showBeforeSave: false,
  showBeforeCancel: false,
  loadModal: true,
  showDrawer: false,
  loadDrawer: false,

  getOne: {
    document: {},
    async getDocument({ id } = {}) {
      const response = await fetch(
        `https://api.ordotype.fr/v1.0.0/notes/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${window.memberToken}`,
          },
        }
      );
      return await response.json();
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
      debugger;
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
    documents: [],
    pageNumber: null,
    pageTotal: null,
    itemsTotal: null,
    documentType: null,

    async setDocuments(props = {}) {
      const documentsResults = await this.getDocuments(props);
      this.documents = documentsResults["notes"];
      this.pageNumber = documentsResults["page_number"];
      this.pageTotal = documentsResults["page_total"];
      this.itemsTotal = documentsResults["items_total"];
      this.documentType = this.documentType || "";
    },
    async getDocuments({
      page = 1,
      limit = 10,
      sort = "created_on",
      direction = "DESC",
      type = this.documentType || "",
    } = {}) {
      const response = await fetch(
        `https://api.ordotype.fr/v1.0.0/notes?page=${page}&limit=${limit}&sort=${sort}&direction=${direction}&type=${type}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${memberToken}`,
          },
        }
      );
      return await response.json();
    },
  },

  createOne: {
    document: {
      _id: "",
      type: "",
      title: "",
      pathology: [],
      rich_text_ordo: "",
      fileIds: [],
    },
    files: [],
    async sendDocument(jsonData, files) {
      // TODO get all documents from form and send request
      debugger;
      if (this.files.length > 0) {
        const fileRes = await this.uploadFile(files);
        jsonData.filesIds = [...fileRes];
      }
      const res = await this.postDocument(jsonData);
      this.clearFields();
    },
    async uploadFile() {
      const formData = new FormData();
      formData.append("file", this.files);

      const response = await fetch("https://api.ordotype.fr/v1.0.0/documents", {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${window.memberToken}`,
        },
        body: formData,
      });
      return (this.document.fileId = response.data.fileId);
    },
    async postDocument(data) {
      if (!data.type) {
        return console.error("Document type not sent");
      } else if (!data.title) {
        return console.error("Title not found");
      }
      const response = await fetch(
        data._id
          ? `https://api.ordotype.fr/v1.0.0/notes/${data._id}`
          : `https://api.ordotype.fr/v1.0.0/notes`,
        {
          method: data._id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.memberToken}`,
          },
          body: JSON.stringify(data),
        }
      );
      return await response.json();
    },
    clearFields() {
      this.document.title = null;
      this.document.pathology = [];
      this.document.type = this.documentType;
      this.document.rich_text_ordo = null;
      this.document.documents = [];

      Alpine.store("documentsStore").showDrawer = false;
      Alpine.store("documentsStore").showModal = false;
      Alpine.store("documentsStore").showBeforeSave = false;
      Alpine.store("documentsStore").showBeforeCancel = false;
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
