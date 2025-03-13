export class Auteur {
  constructor(id, nom, prenom, Date_Naissance, nationalite) {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.Date_Naissance = Date_Naissance;
    this.nationalite = nationalite;
  }

  // Validation
  estValide() {
    if (!this.nom || this.nom.trim() === "") {
      return { valide: false, erreur: "Le Nom est requis" };
    }
    if (!this.prenom || this.prenom.trim() === "") {
      return { valide: false, erreur: "Le Prénom est requis" };
    }
    if (!this.Date_Naissance && isNaN(this.Date_Naissance)) {
      return {
        valide: false,
        erreur: "La date de naissance doit être un nombre",
      };
    }
    if (!this.nationalite || this.nationalite.trim() === "") {
      return { valide: false, erreur: "La nationalité est requise" };
    }

    return { valide: true };
  }

  // Méthodes métier
  estEmpruntable() {
    // Logique pour déterminer si le livre peut être emprunté
    return true;
  }
}
