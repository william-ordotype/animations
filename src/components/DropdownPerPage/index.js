function DropdownPerPage() {
  return {
    dropdownText(number) {
      return `Afficher ${number} par page`;
    },
    showDropdownText: "Afficher 10 par page",
    changePerPage(ev, routerParams, number) {
      ev.preventDefault();
      debugger
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

export default DropdownPerPage;
