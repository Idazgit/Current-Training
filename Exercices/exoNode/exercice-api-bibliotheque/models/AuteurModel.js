export class Auteur {
  constructor(id, Nom, Prenom, Date_Naissance, Nationalite) {
    this.id = id;
    this.Nom = Nom;
    this.Prenom = Prenom;
    this.Date_Naissance = Date_Naissance;
    this.Nationalite = Nationalite;
  }

  // Validation
  estValide() {
    if (!this.Nom || this.Nom.trim() === "") {
      return { valide: false, erreur: "Le Nom est requis" };
    }
    if (!this.Prenom || this.Prenom.trim() === "") {
      return { valide: false, erreur: "Le Prénom est requis" };
    }

    if (!this.Date_Naissance || this.Date_Naissance.trim() === "") {
      return { valide: false, erreur: "La date de naissance est requise" };
    }
    if (!this.Nationalite || this.Nationalite.trim() === "") {
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
