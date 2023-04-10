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
                ["x-on:click"]: "$store.documentsStore.setDocuments({page: +$store.documentsStore.pageNumber+1})"
            }
        }
    }));
}

export default DocumentsPaginationNavigation;
