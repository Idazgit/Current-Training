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
    if (!this.ID_Exemplaire && isNaN(this.ID_Exemplaire)) {
      return { valide: false, erreur: "L'ID Exemplaire doit être un nombre" };
    }
    if (!this.ID_Membre && isNaN(this.ID_Membre)) {
      return { valide: false, erreur: "L'ID Membre doit être un nombre" };
    }
    if (!this.Date_Emprunt && isNaN(this.Date_Emprunt)) {
      return {
        valide: false,
        erreur: "La date d'emprunt doit être un nombre",
      };
    }
    if (!this.Date_Retour_Prevue && isNaN(this.Date_Retour_Prevue)) {
      return {
        valide: false,
        erreur: "La date de retour prévue doit être un nombre",
      };
    }

    return { valide: true };
  }

  // Méthodes métier
  estEmpruntable() {
    // Logique pour déterminer si le livre peut être emprunté
    return true;
  }
}
