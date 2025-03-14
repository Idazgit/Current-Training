import { auteurRepository } from "../repositories/auteurRepository.js";
import { Auteur } from "../models/AuteurModel.js";

export const auteurService = {
  getAllAuteurs() {
    return auteurRepository.findAllAuteurs();
  },

  createAuteur(auteurData) {
    // Création d'une instance à partir des données brutes
    const nouvelAuteur = new Auteur(
      null, // ID sera généré par la base de données
      auteurData.Nom,
      auteurData.Prenom,
      auteurData.Date_Naissance,
      auteurData.Nationalite
    );

    // Validation via la méthode du modèle
    const validation = nouvelAuteur.estValide();
    if (!validation.valide) {
      throw new Error(validation.erreur);
    }

    // Sauvegarde via repository
    return auteurRepository.create(nouvelAuteur);
  },

  getAuteurById(id) {
    return auteurRepository.findById(id);
  },

  updateAuteur(id, auteurData) {
    // Création d'une instance à partir des données brutes
    const auteurMisAJour = new Auteur(
      id,
      auteurData.Nom,
      auteurData.Prenom,
      auteurData.Date_Naissance,
      auteurData.Nationalite
    );

    // Validation via la méthode du modèle
    const validation = auteurMisAJour.estValide();
    if (!validation.valide) {
      throw new Error(validation.erreur);
    }

    // Mise à jour via repository
    return auteurRepository.update(auteurMisAJour);
  },

  deleteAuteur(id) {
    return auteurRepository.delete(id);
  },
};
