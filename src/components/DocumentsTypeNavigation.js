import Alpine from "alpinejs";

function DocumentsTypeNavigation() {
    return Alpine.data('DocumentsNavigation', () => ({
        allType() {
            return {
                [":class"]: '$store.documentsStore.getList.documentType === "" && "active"'
            }
        },
        notesType() {
            return {
                [":class"]: '$store.documentsStore.getList.documentType === "notes" && "active"'
            }
        },
        recommendationsType() {
            return {
                [":class"]: '$store.documentsStore.getList.documentType === "recommendations" && "active"'
            }
        },
        prescriptionsType() {
            return {
                [":class"]: '$store.documentsStore.getList.documentType === "prescriptions" && "active"'
            }
        },
    }))
}

export default DocumentsTypeNavigation;
