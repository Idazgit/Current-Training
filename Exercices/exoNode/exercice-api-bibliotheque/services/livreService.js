// services/livreService.js
import { livreRepository } from "../repositories/livreRepository.js";
import { Livre } from "../models/LivreModel.js";

export const livreService = {
  getAllLivres() {
    return livreRepository.findAll();
  },

  createLivre(livreData) {
    // Création d'une instance à partir des données brutes
    const nouveauLivre = new Livre(
      null, // ID sera généré par la base de données
      livreData.titre,
      livreData.isbn || null,
      livreData.nombrePages || null,
      livreData.anneePublication || null
    );

    // Validation via la méthode du modèle
    const validation = nouveauLivre.estValide();
    if (!validation.valide) {
      throw new Error(validation.erreur);
    }

    // Sauvegarde via repository
    return livreRepository.create(nouveauLivre);
  },
};
