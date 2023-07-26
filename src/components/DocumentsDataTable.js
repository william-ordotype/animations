import Alpine from "alpinejs";

function DataTableListItem() {
  return {
    // Binders
    tableBodyGrid() {
      return {
        ["x-bind:class"]:
          "!($store.documentsStore.getList.documentType === '' || $store.documentsStore.getList.documentType === 'prescriptions') && 'ordonan_item'",
      };
    },
    openDrawer() {
      return {
        ["x-on:click"]: `$router.navigate('/view/' + d._id)`,
      };
    },
    textTitle() {
      return {
        ["x-text"]: "d.title",
      };
    },
    textType() {
      return {
        ["x-text"]: "window.globals.documentTypes[d.type]",
        ["x-show"]: "$store.documentsStore.getList.documentType === ''",
      };
    },
    textPrescriptionType() {
      return {
        ["x-text"]: "window.globals.prescriptionTypes[d.prescription_type]",
      };
    },
    rowType() {
      return {
        ["x-show"]: "$store.documentsStore.getList.documentType === ''",
      };
    },
    rowPrescriptionType() {
      return {
        ["x-show"]:
          "$store.documentsStore.getList.documentType === 'prescriptions'",
        ["x-bind:class"]:
          "$store.documentsStore.getList.documentType === 'prescriptions' && 'display-inlineflex'",
      };
    },
    textDate() {
      return {
        ["x-text"]: "new Date(d.created_on).toLocaleDateString('fr-FR')",
      };
    },
    pathologyRef() {
      return {
        ["x-on:click"]:
          "d.pathologies.length > 0 ? (location.href = `/pathologies/${d.pathologies[0].slug}`) : console.log('no pathology')",
        ["x-bind:class"]: "d.pathologies.length && 'active'",
        ["x-text"]: "d.pathologies.length ? d.pathologies[0].title : '-'",
        ["x-bind:href"]:
          "d.pathologies.length ? '/pathologies/' + d.pathologies[0].slug : null",
      };
    },

    // file icons
    fileIcons: [],
    // Sets file icon variables on load
    checkFileIcons(d) {
      const { documents } = d;
      const allDocTypes = documents.map((elem) => {
        return elem.mime_type;
      });
      const uniqueDocTypes = new Set(allDocTypes);
      this.fileIcons = [...uniqueDocTypes];
    },
    // Returns fileType. Used in className and in icon text
    fileIconType(mime_type) {
      const fileType = mime_type.split("/");
      return fileType[1];
    },
  };
}

function DataTableListItemSubmenu() {
  return {
    async showEditModal(ev, d) {
      ev.preventDefault();
      await Alpine.store("modalStore").openModal(d, { type: d.type });
    },
    openDeleteDocument(ev, d) {
      ev.preventDefault();
      Alpine.store("modalStore").openBeforeDelete(d);
    },
  };
}

function DataTableHeader() {
  const initialState = {
    sortByTitle: {
      propertyName: "title",
      isActive: false,
      direction: null,
    },
    sortByType: {
      propertyName: "type",
      isActive: false,
      direction: null,
    },
    sortByDate: {
      propertyName: "created_on",
      isActive: false,
      direction: null,
    },
    sortByPathology: {
      propertyName: "pathology",
      isActive: false,
      direction: null,
    },
    sortByPrescriptionType: {
      propertyName: "prescription_type",
      isActive: false,
      direction: null,
    },
  };

  function toggleDirection(direction) {
    if (direction === "ASC") {
      return "DESC";
    }
    if (direction === "DESC") {
      return "ASC";
    }
    return "DESC";
  }

  function toggleActive(state, sortByN) {
    Array.from(Object.keys(state)).forEach((key) => {
      if (key === sortByN) {
        state[key].isActive = true;
        state[key].direction = toggleDirection(state[key].direction);

        window.handleSorting(
          window.PineconeRouter.currentContext,
          state[key].propertyName,
          state[key].direction
        );
      } else {
        state[key].isActive = false;
        state[key].direction = null;
      }
    });
  }
  return {
    headType() {
      return {
        ["x-show"]: "$store.documentsStore.getList.documentType === ''",
      };
    },
    headPrescriptionType() {
      return {
        ["x-show"]:
          "$store.documentsStore.getList.documentType === 'prescriptions'",
        ["x-bind:class"]:
          "$store.documentsStore.getList.documentType === 'prescriptions' && 'display-inlineflex'",
      };
    },
    tableHeadGrid() {
      return {
        ["x-bind:class"]:
          "($store.documentsStore.getList.documentType === '' || $store.documentsStore.getList.documentType === 'prescriptions') ? 'header_g' : 'header_ordo'",
      };
    },
    state: initialState,
    // Click handlers

    /**
     *
     * @param {*} sortBy
     * example: sortByClick('sortByTitle')
     */
    sortByClick(sortBy) {
      toggleActive(this.state, sortBy);
    },
    // -- Select all checkbox
    selectAllClick: () => {
      return {
        ["x-on:click"]: (ev) => {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          Alpine.store("documentsStore").getList.allChecked =
            !Alpine.store("documentsStore").getList.allChecked;

          const allChecked =
            Alpine.store("documentsStore").getList.allChecked || false;
          Alpine.store("documentsStore").getList.documents.forEach((doc) => {
            doc.completed = allChecked;
          });
        },
      };
    },
    selectAllClass() {
      return Alpine.store("documentsStore").getList.allChecked && "active";
    },
    // Class bindings
    // -- Header
    sortByHeadClass(sortBy) {
      return this.state[sortBy].isActive && "active";
    },

    // -- Arrows
    sortByArrowClass(sortBy, direction) {
      if (this.state[sortBy].direction === direction) {
        return "active";
      }
    },
  };
}

function DataTablePaginationMenu() {
  return {
    pageNumber() {
      return {
        ["x-text"]: "n",
        ["x-on:click"]: "handlePagination($router, n)",
        [":class"]:
          "+$store.documentsStore.getList.pageNumber === +n && 'active'",
      };
    },
    pageNext() {
      return {
        ["x-on:click"]:
          "+$store.documentsStore.getList.pageNumber < +$store.documentsStore.getList.pageTotal && handlePagination($router, +$store.documentsStore.getList.pageNumber+1 )",
      };
    },
  };
}

function DataTablePerPageDropdown() {
  return {
    dropdownText(number) {
      return `Afficher ${number} par page`;
    },
    showDropdownText: "Afficher 10 par page",
    changePerPage(ev, routerParams, number) {
      ev.preventDefault();
      $(ev.target)
        .closest(".w-dropdown-list")
        .removeClass("w--open")
        .siblings(".w-dropdown")
        .find(".w-dropdown-toggle")
        .removeClass("w--open");
      this.showDropdownText = this.dropdownText(number);

      handleItemsPerPage(routerParams, number); // function available in window scope
    },
  };
}

export {
  DataTableHeader,
  DataTableListItem,
  DataTableListItemSubmenu,
  DataTablePaginationMenu,
  DataTablePerPageDropdown,
};
