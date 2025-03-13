// services/livreService.js
import { auteurRepository } from "../repositories/auteurRepository.js";
import { Auteur } from "../models/AuteurModel.js";

export const auteurService = {
  getAllAuteur() {
    return auteurRepository.findAll();
  },

  createAuteur(auteurData) {
    // Création d'une instance à partir des données brutes
    const nouveauAuteur = new Auteur(
      null, // ID sera généré par la base de données
      auteurData.nom,
      auteurData.prenom,
      auteurData.dateNaissance || null,
      auteurData.nationalite || null
    );

    // Validation via la méthode du modèle
    const validation = nouveauAuteur.estValide();
    if (!validation.valide) {
      throw new Error(validation.erreur);
    }

    // Sauvegarde via repository
    return auteurRepository.create(nouveauAuteur);
  },
};
