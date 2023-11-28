import Alpine from "alpinejs";

function DocumentFileInput() {
  return {
    filesAttached: Alpine.store("modalStore").files,
    async handleFileChange(ev) {
      const filesAttached = Alpine.store("modalStore").files;
      const filesInputValue = Array.from(ev.target.files);

      filesInputValue.forEach((file) => {
        const limitFileQty = 10;
        const limitFileSize = 15728640; // 15MB

        if (filesAttached.length >= limitFileQty) {
          alert(
            `Vous ne pouvez télécharger que jusqu'à ${limitFileQty} fichiers par document`
          );
          return;
        }
        if (file.size >= limitFileSize) {
          alert(
            `La taille du fichier nommé ${file.name} est trop grande. Veuillez le garder sous 15Mo par fichier`
          );
          return;
        }
        filesAttached.push(file);
      });
      Alpine.store("modalStore").files = filesAttached;

      // Clear input value to allow upload of same file
      ev.target.value = "";
    },
    handleDeleteFile(_, index) {
      // Delete file from array
      this.filesAttached.splice(index, 1);
      Alpine.store("modalStore").files = this.filesAttached;
      console.log(index);
    },
    getFileExtension(filename) {
      return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
    },
    removeFileExtension(filename) {
      return filename.split(".").slice(0, -1).join(".");
    },
    listFilesFromInput: {
      ["x-for"]: "(fileItem, index) in $store.modalStore.files",
    },
    listFilesFromServer: {
      ["x-for"]: "file in $store.modalStore.form.files",
    },
  };
}

function DocumentFileListItem({
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
    return `${ext[ext.length - 1]}`;
  };
  const getFileSrc = () => {
    return file_url;
  };

  return {
    fileName: getFileName(),
    fileExt: getFileExt(),
    isImg: mime_type.includes("image"),
    fileSrc: getFileSrc(),
    fileId: _id,
    filesToDelete: [],
    deleteServerFiles(ev, id) {
      Alpine.store("modalStore").filesToDelete.push(id);

      $(ev.target).unbind("click").parents(".file_block").css("opacity", "0.5");
    },
  };
}

export { DocumentFileInput, DocumentFileListItem };
