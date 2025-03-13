// models/Livre.js
export class Livre {
  constructor(id, titre, isbn, nombrePages, anneePublication) {
    this.id = id;
    this.titre = titre;
    this.isbn = isbn;
    this.nombrePages = nombrePages;
    this.anneePublication = anneePublication;
  }

  // Validation
  estValide() {
    if (!this.titre || this.titre.trim() === "") {
      return { valide: false, erreur: "Le titre est requis" };
    }
    if (!this.isbn || this.isbn.trim() === "" || isNaN(this.isbn)) {
      return {
        valide: false,
        erreur: "L'ISBN est requis et doit être un nombre",
      };
    }

    if (this.nombrePages && isNaN(this.nombrePages)) {
      return {
        valide: false,
        erreur: "Le nombre de pages doit être un nombre",
      };
    }
    if (this.anneePublication && isNaN(this.anneePublication)) {
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
