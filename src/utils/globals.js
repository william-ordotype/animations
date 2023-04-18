// noinspection SpellCheckingInspection

const globals = {}

globals.documentTypes = {
    notes: "Note",
    recommendations: "Fiche conseil",
    prescriptions: "Ordonnance",
}

globals.run = function () {
  window.globals = globals;
}

export default globals;
