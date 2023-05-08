import Alpine from "alpinejs";

function DocumentsDrawer() {
    return Alpine.data("DocumentsDrawer", () => {
        return {
            drawerStore: Alpine.store('drawerStore'),
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
            drawerClose() {
                return {
                    ["x-on:click"]: `
                        url = $router.path.split('/')
                        removeId = url.pop()
                        $router.navigate(url.join('/'))
                        drawerStore.hideDrawer()
                    `
                }
            },
            getOneTitle() {
                return {
                    ["x-text"]: "$store.documentsStore.getOne.document.title",
                };
            },
            getOneCreatedOn() {
                return {
                    ["x-text"]:
                        "new Date($store.documentsStore.getOne.document.created_on).toLocaleDateString('fr-FR')",
                };
            },
            getOneRichText() {
                return {
                    ["x-html"]: "$store.documentsStore.getOne.document.rich_text_ordo",
                };
            },
        };
    });
}

export default DocumentsDrawer;
