function DataTableSubNav(d) {
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

export default DataTableSubNav;
