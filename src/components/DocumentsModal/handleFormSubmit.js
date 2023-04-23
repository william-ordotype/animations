import * as DOMPurify from "dompurify";
import Alpine from "alpinejs";

/**
 * Controller for the modal form submission. It is called from the <i>globals</i> object
 * @param ev
 * @returns {Promise<void>}
 */
const handleFormSubmit = async function (ev) {
    ev.preventDefault();

    const cleanRichText = DOMPurify.sanitize(window.globals.createRTE.root.innerHTML, { USE_PROFILES: { html: true } });


    Alpine.store('documentsStore').createOne.rich_text_ordo = cleanRichText;
    Alpine.store('documentsStore').createOne.title = document.getElementById('title');
    Alpine.store('documentsStore').createOne.pathology = document.getElementById('field-2');

    await Alpine.store("documentsStore").createOne.sendDocument();
    Alpine.store("documentsStore").createOne.clearFields()
    await Alpine.store("documentsStore").getList.setDocuments()
}

export default handleFormSubmit;
