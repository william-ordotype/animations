import Alpine from "alpinejs";

function DocumentsTypeNavigation() {
    return Alpine.data('DocumentsNavigation', () => ({
        allType() {
            return {
                [":class"]: '$store.documentsStore.documentType === "" && "active"'
            }
        },
        notesType() {
            return {
                [":class"]: '$store.documentsStore.documentType === "notes" && "active"'
            }
        },
        recommendationsType() {
            return {
                [":class"]: '$store.documentsStore.documentType === "recommendations" && "active"'
            }
        },
        prescriptionsType() {
            return {
                [":class"]: '$store.documentsStore.documentType === "prescriptions" && "active"'
            }
        },
    }))
}

export default DocumentsTypeNavigation;
