import Alpine from "alpinejs";

function DocumentsDataTable() {
  return Alpine.data("documentsDataTable", () => ({
    textTitle(d) {
      return {
        ["x-text"]: "d.title",
        ["x-on:click"]: `
                    $router.navigate('/view/' + d._id)
                    `,
      };
    },
    textType(d) {
      return {
        ["x-text"]: "window.globals.documentTypes[d.type]",
      };
    },
    textDate(d) {
      return {
        ["x-text"]: "new Date(d.updated_on).toLocaleDateString('fr-FR')",
      };
    },
    pathologyRef(d) {
      console.log(d);
      d.pathology.length > 0
        ? (location.href = `/pathologies/${d.pathology[0].slug}`)
        : console.log("no pathology");
    },
  }));
}

export function HeaderRow() {
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
  };

  function toggleDirection(direction) {
    if (direction === "ASC") {
      return "DESC";
    } else if (direction === "DESC") {
      return "ASC";
    } else {
      return "DESC";
    }
  }

  function toggleActive(state, sortByN) {
    Array.from(Object.keys(state)).forEach((key) => {
      if (key === sortByN) {
        state[key].isActive = true;
        state[key].direction = toggleDirection(state[key].direction);

        window.handleSorting(window.PineconeRouter.currentContext, state[key].propertyName, state[key].direction)
      } else {
        state[key].isActive = false;
        state[key].direction = null;
      }
    });
  }
  return {
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

export default DocumentsDataTable;
