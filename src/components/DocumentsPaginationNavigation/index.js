import Alpine from "alpinejs";

function DocumentsPaginationNavigation() {
    return Alpine.data("documentsPagination", () => ({
        pageNumber(n) {
            return {
                ["x-text"]: "n",
                ["x-on:click"]: "$store.documentsStore.setDocuments({page: +n})",
            };
        },
        pageNext() {
            return {
                ["x-on:click"]: "handlePagination('page', +$store.documentsStore.pageNumber+1, $router.params,)"
            }
        },
    }));
}

export default DocumentsPaginationNavigation;
