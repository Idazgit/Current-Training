// services/livreService.js
import { empruntRepository } from "../repositories/empruntRepository.js";
import { Emprunt } from "../models/empruntModel.js";

export const empruntService = {
  getAllEmprunts() {
    return empruntRepository.findAll();
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
};
