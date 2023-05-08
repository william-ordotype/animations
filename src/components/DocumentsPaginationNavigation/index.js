import Alpine from "alpinejs";

function DocumentsPaginationNavigation() {
    return Alpine.data("documentsPagination", () => ({
        pageNumber(n) {
            return {
                ["x-text"]: "n",
                ["x-on:click"]: "handlePagination($router, n)",
            };
        },
        pageNext() {
            return {
                ["x-on:click"]: "+$store.documentsStore.getList.pageNumber < +$store.documentsStore.getList.pageTotal && handlePagination($router, +$store.documentsStore.getList.pageNumber+1 )",
            }
        },
    }));
}

export default DocumentsPaginationNavigation;
