import { empruntRepository } from "../repositories/empruntRepository.js";
import { Emprunt } from "../models/EmpruntModel.js";

export const empruntService = {
  getAllEmprunts() {
    return empruntRepository.findAllEmprunts();
  },

  createEmprunt(empruntData) {
    // Création d'une instance à partir des données brutes
    const nouveauEmprunt = new Emprunt(
      null, // ID sera généré par la base de données
      empruntData.ID_Exemplaire,
      empruntData.ID_Membre,
      empruntData.Date_Emprunt,
      empruntData.Date_Retour_Prevue
    );

    // Validation via la méthode du modèle
    const validation = nouveauEmprunt.estValide();
    if (!validation.valide) {
      throw new Error(validation.erreur);
    }

    // Sauvegarde via repository
    return empruntRepository.create(nouveauEmprunt);
  },

  getEmpruntById(id) {
    return empruntRepository.findById(id);
  },

  updateEmprunt(id, empruntData) {
    // Création d'une instance à partir des données brutes
    const empruntMisAJour = new Emprunt(
      id,
      empruntData.ID_Exemplaire,
      empruntData.ID_Membre,
      empruntData.Date_Emprunt,
      empruntData.Date_Retour_Prevue
    );

    // Validation via la méthode du modèle
    const validation = empruntMisAJour.estValide();
    if (!validation.valide) {
      throw new Error(validation.erreur);
    }

    // Mise à jour via repository
    return empruntRepository.update(empruntMisAJour);
  },

  deleteEmprunt(id) {
    return empruntRepository.delete(id);
  },
};
