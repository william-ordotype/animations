import Alpine from "alpinejs";

function DocumentsPaginationNavigation() {
    return Alpine.data("documentsPagination", () => ({
        pageNumber(n) {
            return {
                ["x-text"]: "n",
                ["x-on:click"]: "handlePagination('page', +n, $router.params,)",
            };
        },
        pageNext() {
            return {
                ["x-on:click"]: "handlePagination('page', +$store.documentsStore.getList.pageNumber+1, $router.params,)"
            }
        },
    }));
}

export default DocumentsPaginationNavigation;
