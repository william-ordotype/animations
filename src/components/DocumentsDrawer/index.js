import Alpine from "alpinejs";

function DocumentsDrawer() {
  return Alpine.data("DocumentsDrawer", () => {
    return {
      drawerStore: Alpine.store("drawerStore"),
      drawerBackdrop() {
        return {
          ["x-show"]: "drawerStore.showDrawer",
          ["x-transition.opacity"]: "",
        };
      },
      drawerElem() {
        return {
          ["x-show"]: "drawerStore.showDrawer",
          ["x-transition.scale.origin.right"]: "",
          ["x-transition:enter.scale.80"]: "",
          ["x-transition:enter.scale.90"]: "",
        };
      },
      drawerLoading() {
        return {
          ["x-show"]: "drawerStore.loadDrawer",
        };
      },
      drawerContent() {
        return {
          ["x-show"]: "!drawerStore.loadDrawer",
        };
      },
      drawerClose(ev) {
        ev.preventDefault();
        // Reset drawer
        const pageNumber =
          Alpine.store("documentsStore").getList.pageNumber || "";
        const documentType =
          Alpine.store("documentsStore").getList.documentType;
        // Redirect to list
        PineconeRouter.currentContext.navigate(
          `/list?type=${documentType ? documentType : "all"}${
            pageNumber && "&page=" + pageNumber
          }`
        );
        // Reset document object in store
        Alpine.store("documentsStore").getOne.document = {
          note: {},
          member: {},
        };
      },
      async drawerDeleteOne(ev) {
        ev.preventDefault();
        await Alpine.store("modalStore").openBeforeDelete(
          Alpine.store("documentsStore").getOne.document
        );
      },
      drawerEdit(ev) {
        ev.preventDefault();
        Alpine.store("modalStore").openModal(
          Alpine.store("documentsStore").getOne.document
        );
      },

      // Getters
      getOneTitle() {
        return {
          ["x-text"]: "$store.documentsStore.getOne.document.note.title",
        };
      },
      getOneCreatedOn() {
        return {
          ["x-text"]:
            "new Date($store.documentsStore.getOne.document.note.created_on).toLocaleDateString('fr-FR')",
        };
      },
      getOneRichText() {
        return {
          ["x-html"]:
            "$store.documentsStore.getOne.document.note.rich_text_ordo",
        };
      },
      getAuthor() {
        return {
          ["x-text"]:
            "$store.documentsStore.getOne.document.member ? $store.documentsStore.getOne.document.member.lastName + ' '+ $store.documentsStore.getOne.document.member.name : '{{undefined}}'",
        };
      },
    };
  });
}

export function DocumentFileListItem({
  file_name,
  mime_type,
  file_url,
  size,
  _id,
} = {}) {
  const getFileName = () => {
    return file_name.split(".").shift();
  };
  const getFileExt = () => {
    const ext = file_name.split(".");
    return `.${ext[ext.length - 1]}`;
  };
  const getFileSrc = () => {
    return file_url;
  };

  return {
    fileName: getFileName(),
    fileExt: getFileExt(),
    isImg: mime_type.includes("image"),
    fileSrc: getFileSrc(),
    _id,
  };
}

export default DocumentsDrawer;
