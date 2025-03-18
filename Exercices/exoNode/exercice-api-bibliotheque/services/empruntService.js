import { empruntRepository } from "../repositories/empruntRepository.js";
import { exemplaireRepository } from "../repositories/exemplaireRepository.js";
import { Emprunt } from "../models/EmpruntModel.js";

export const empruntService = {
  getAllEmprunts() {
    return empruntRepository.findAllEmprunts();
  },
  async verifierDisponibilite(idLivre) {
    // Récupérer le nombre d'exemplaires disponibles pour ce livre
    const exemplairesDisponibles =
      await empruntRepository.countExemplairesDisponibles(idLivre);

    // Si moins de 3 exemplaires sont disponibles, le livre n'est pas empruntable
    const empruntable = exemplairesDisponibles >= 3;

    return {
      empruntable,
      exemplairesDisponibles,
      messageErreur: empruntable
        ? null
        : `Livre non disponible: seulement ${exemplairesDisponibles} exemplaire(s) disponible(s)`,
    };
  },
  async createEmprunt(empruntData) {
    // Validation des données
    if (!empruntData.ID_Exemplaire) {
      throw new Error("ID_Exemplaire est requis");
    }
    if (!empruntData.ID_Membre) {
      throw new Error("ID_Membre est requis");
    }

    // Récupérer le livre associé à cet exemplaire
    const exemplaire = await exemplaireRepository.findById(
      empruntData.ID_Exemplaire
    );
    if (!exemplaire) {
      throw new Error("Exemplaire non trouvé");
    }

    // Vérifier la disponibilité du livre
    const disponibilite = await this.verifierDisponibilite(exemplaire.ID_Livre);
    if (!disponibilite.empruntable) {
      throw new Error(disponibilite.messageErreur);
    }

    // Créer l'objet Emprunt
    const emprunt = new Emprunt(
      null, // ID sera généré par la BDD
      empruntData.ID_Exemplaire,
      empruntData.ID_Membre,
      empruntData.Date_Emprunt || Date.now(), // Utiliser la date actuelle si non fournie
      empruntData.Date_Retour_Prevue || Date.now() + 1209600000 // +14 jours par défaut
    );

    // Validation de l'objet
    const validation = emprunt.estValide();
    if (!validation.valide) {
      throw new Error(validation.erreur);
    }

    // Enregistrer l'emprunt
    const result = await empruntRepository.create(emprunt);

    // Marquer l'exemplaire comme non disponible
    await exemplaireRepository.updateDisponibilite(
      emprunt.ID_Exemplaire,
      false
    );

    return result;
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
