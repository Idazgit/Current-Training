import { livreRepository } from "../repositories/livreRepository.js";
import { Livre } from "../models/LivreModel.js";

export const livreService = {
  getAllLivres(page, limit) {
    const offset = (page - 1) * limit;
    return livreRepository.findAll(offset, limit);
  },

  createLivre(livreData) {
    // Création d'une instance à partir des données brutes
    const nouveauLivre = new Livre(
      null, // ID sera généré par la base de données
      livreData.Titre,
      livreData.ISBN || null,
      livreData.Nombre_Pages || null,
      livreData.Annee_Publication || null
    );

    // Validation via la méthode du modèle
    const validation = nouveauLivre.estValide();
    if (!validation.valide) {
      throw new Error(validation.erreur);
    }

    // Sauvegarde via repository
    return livreRepository.create(nouveauLivre);
  },

  getLivreById(id) {
    return livreRepository.findById(id);
  },

  getLivreByCategorie(id, page, limit) {
    const offset = (page - 1) * limit;

    return livreRepository.findByCategorie(id, offset, limit);
  },
  getLivreByAuteur(id, page, limit) {
    const offset = (page - 1) * limit;
    return livreRepository.findByAuteur(id, offset, limit);
  },
  updateLivre(id, livreData) {
    // Création d'une instance à partir des données brutes
    const livreMisAJour = new Livre(
      id,
      livreData.Titre,
      livreData.ISBN || null,
      livreData.Nombre_Pages || null,
      livreData.Annee_Publication || null
    );

    // Validation via la méthode du modèle
    const validation = livreMisAJour.estValide();
    if (!validation.valide) {
      throw new Error(validation.erreur);
    }

    // Mise à jour via repository
    return livreRepository.update(livreMisAJour);
  },

  deleteLivre(id) {
    return livreRepository.delete(id);
  },
};
