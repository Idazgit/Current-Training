import { auteurService } from "../services/auteurService.js";
import { parseRequestBody } from "../utils/httpHelper.js";

export const auteurController = {
  /**
   * Récupère tous les auteurs
   */
  async getAllAuteurs(req, res) {
    try {
      console.log("Récupération de tous les auteurs");
      const auteurs = await auteurService.getAllAuteurs();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: auteurs }));
    } catch (error) {
      console.error("Erreur lors de la récupération des auteurs :", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Erreur serveur" }));
    }
  },

  /**
   * Crée un nouvel auteur
   */
  async createAuteur(req, res) {
    try {
      console.log("Création d'un nouvel auteur");
      const auteurData = await parseRequestBody(req);

      const result = await auteurService.createAuteur(auteurData);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Auteur créé avec succès",
          data: { id: result.id },
        })
      );
    } catch (error) {
      console.error("Erreur lors de la création de l'auteur :", error);
      const statusCode = error.message.includes("requis") ? 400 : 500;

      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  },

  /**
   * Récupère un auteur par ID
   */
  async getAuteurById(req, res, id) {
    try {
      console.log(`Récupération de l'auteur avec ID ${id}`);
      const auteur = await auteurService.getAuteurById(id);

      if (!auteur) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Auteur non trouvé" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: auteur }));
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de l'auteur avec ID ${id} :`,
        error
      );
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Erreur serveur" }));
    }
  },

  /**
   * Met à jour un auteur
   */
  async updateAuteur(req, res, id) {
    try {
      console.log(`Mise à jour de l'auteur avec ID ${id}`);
      const auteurData = await parseRequestBody(req);

      const result = await auteurService.updateAuteur(id, auteurData);

      if (!result) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Auteur non trouvé" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Auteur mis à jour avec succès",
        })
      );
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de l'auteur avec ID ${id} :`,
        error
      );
      const statusCode = error.message.includes("requis") ? 400 : 500;

      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  },

  /**
   * Supprime un auteur
   */
  async deleteAuteur(req, res, id) {
    try {
      console.log(`Suppression de l'auteur avec ID ${id}`);
      const result = await auteurService.deleteAuteur(id);

      if (!result) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Auteur non trouvé" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Auteur supprimé avec succès",
        })
      );
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de l'auteur avec ID ${id} :`,
        error
      );
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Erreur serveur" }));
    }
  },
};
