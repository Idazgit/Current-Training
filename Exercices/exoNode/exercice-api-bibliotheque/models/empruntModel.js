export class Emprunt {
  constructor(
    ID_Emprunt,
    ID_Exemplaire,
    ID_Membre,
    Date_Emprunt,
    Date_Retour_Prevue
  ) {
    this.ID_Emprunt = ID_Emprunt;
    this.ID_Exemplaire = ID_Exemplaire;
    this.ID_Membre = ID_Membre;
    this.Date_Emprunt = Date_Emprunt;
    this.Date_Retour_Prevue = Date_Retour_Prevue;
  }

  // Validation
  estValide() {
    if (!this.nom || this.nom.trim() === "") {
      return { valide: false, erreur: "Le Nom est requis" };
    }
    if (!this.prenom || this.prenom.trim() === "") {
      return { valide: false, erreur: "Le Prénom est requis" };
    }
    if (!this.dateNaissance && isNaN(this.dateNaissance)) {
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
