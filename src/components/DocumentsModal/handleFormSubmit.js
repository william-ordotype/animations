import * as DOMPurify from "dompurify";
import Alpine from "alpinejs";

/**
 * Controller for the modal form submission. It is called from the <i>globals</i> object
 * @param ev
 * @returns {Promise<void>}
 */
const handleFormSubmit = async function (ev) {
    ev.preventDefault();

    const jsonData = window.globals.modal.form.getModalFields(ev)
    await Alpine.store("documentsStore").createOne.sendDocument(jsonData);
    Alpine.store("documentsStore").createOne.clearFields()
    await Alpine.store("documentsStore").getList.setDocuments()
}

export default handleFormSubmit;
