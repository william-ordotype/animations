const pathologiesStore = {
  pathologies: [],
  async init() {
    window.memberToken = $memberstackDom.getMemberCookie();
    console.log("note list init");
    try {
      //Custom Event Declaration
      window.customEvents = {};
      window.customEvents.loadingTrigger = new CustomEvent(
        "custom:skeletonLoadTrigger"
      );
      window.customEvents.loadingCancel = new CustomEvent(
        "custom:skeletonLoadCancel"
      );

      window.customListeners = {};
      window.customListeners.loadingTrigger = (e) => {
        const target = e.target;
        // Create a skeleton div
        const skeletonDiv = document.createElement("div");
        skeletonDiv.classList.add("skeleton-loader");

        // Add the skeleton div to the current element
        target.style.position = "relative";
        target.appendChild(skeletonDiv);
      };
      window.customListeners.loadingCancel = (e) => {
        const target = e.target;
        // Remove the skeleton div from the current element
        target.style.position = "";
        target.removeChild(target.lastChild);
      };

      const noteListComponents = document.querySelectorAll(
        ".mes_notes_holder [x-text], .empty_state"
      );
      noteListComponents.forEach((component) => {
        component.addEventListener(
          "custom:skeletonLoadTrigger",
          window.customListeners.loadingTrigger
        );
        component.addEventListener(
          "custom:skeletonLoadCancel",
          window.customListeners.loadingCancel
        );
      });

      noteListComponents.forEach((component) => {
        component.dispatchEvent(window.customEvents.loadingTrigger);
      });
      const pathologySlug = window.location.pathname.split("/")[2] || "acne";
      const pathology = await Alpine.store(
        "documentsStore"
      ).pathologies.searchIdBySlug(pathologySlug);

      window.pathology = pathology.data[0];

      await Alpine.store("documentsStore").getList.setDocuments({
        limit: 50,
        pathology: pathology._id,
      });
      noteListComponents.forEach((component) => {
        component.dispatchEvent(window.customEvents.loadingCancel);
      });
    } catch (err) {
      console.error(err);
    }
  },
};

export default pathologiesStore;
