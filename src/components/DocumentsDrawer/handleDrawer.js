import Alpine from "alpinejs";

/**
 * Controller that handles the visibility of the drawer. Can be accessed from the <i>globals</i> object
 * @param id
 * @returns {Promise<void>}
 */
async function handleDrawer ({ id }){
    // TODO Add loading before showing blank drawer
    Alpine.store("drawerStore").loadDrawer = true;
    Alpine.store("drawerStore").showDrawer = true;
    Alpine.store("modalStore").showModal = false;

    try {
        await Alpine.store("documentsStore").getOne.setDocument({ id });
        Alpine.store("drawerStore").loadDrawer = false;
    } catch (err) {
        // TODO Show warning error notification
    }
};

export default handleDrawer