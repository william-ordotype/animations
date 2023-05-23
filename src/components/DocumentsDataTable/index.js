import Alpine from "alpinejs";

function DocumentsDataTable() {
  return Alpine.data("documentsDataTable", () => ({
    textTitle(d) {
      return {
        ["x-text"]: "d.title",
        ["x-on:click"]: `
                    $router.navigate('/view/' + d._id)
                    `,
      };
    },
    textType(d) {
      return {
        ["x-text"]: "window.globals.documentTypes[d.type]",
      };
    },
    textDate(d) {
      return {
        ["x-text"]: "new Date(d.updated_on).toLocaleDateString('fr-FR')",
      };
    },
    pathologyRef(d) {
      console.log(d);
      d.pathology.length > 0
        ? (location.href = `/pathologies/${d.pathology[0].slug}`)
        : console.log("no pathology");
    },
  }));
}

export default DocumentsDataTable;
