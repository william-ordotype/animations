import Alpine from "alpinejs";

function DocumentsDataTable() {
    return Alpine.data("documentsDataTable", () => ({
        textTitle(d) {
            return {
                ["x-text"]: "d.title",
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
    }));
}

export default DocumentsDataTable;
