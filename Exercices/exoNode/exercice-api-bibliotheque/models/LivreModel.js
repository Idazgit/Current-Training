// models/Livre.js
export class Livre {
  constructor(id, Titre, ISBN, Nombre_Pages, Annee_Publication) {
    this.id = id;
    this.Titre = Titre;
    this.ISBN = ISBN;
    this.Nombre_Pages = Nombre_Pages;
    this.Annee_Publication = Annee_Publication;
  }

  // Validation
  estValide() {
    if (!this.Titre || this.Titre.trim() === "") {
      return { valide: false, erreur: "Le titre est requis" };
    }

    if (!this.ISBN && isNaN(this.ISBN)) {
      return { valide: false, erreur: "L'ISBN doit être un nombre" };
    }

    if (this.Nombre_Pages && isNaN(this.Nombre_Pages)) {
      return {
        valide: false,
        erreur: "Le nombre de pages doit être un nombre",
      };
    }
    if (this.Annee_Publication && isNaN(this.Annee_Publication)) {
      return { valide: false, erreur: "L'année doit être un nombre" };
    }

    return { valide: true };
  }

  // Méthodes métier
  estEmpruntable() {
    // Logique pour déterminer si le livre peut être emprunté
    return true;
  }
}
