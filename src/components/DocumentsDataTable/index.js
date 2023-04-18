import Alpine from "alpinejs";

function DocumentsDataTable() {
    return Alpine.data("documentsDataTable", () => ({
        dataTable() {
          return {
              // ["x-init"]: "$nextTick(() => { console.log($el.innerText) })",
              // ["x-effect"]: "items && $nextTick(() => $root.querySelectorAll('input')[0].focus())"
          }
        },
        textTitle(d) {
            return {

                ["x-text"]: "d.title",
                ["x-on:click"]: `
                    url = $router.path.split('?')
                    $router.navigate(url[0] + '/' + d._id)
                    `
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
