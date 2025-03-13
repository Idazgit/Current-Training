// controllers/livreController.js
import { auteurService } from "../services/auteurService.js";
import { parseRequestBody } from "../utils/httpHelper.js";

export const auteurController = {
  /**
   * Récupère tous les livres
   */
  async getAllAuteurs(req, res) {
    try {
      const auteurs = auteurService.getAllAuteur();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: auteurs }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Erreur serveur" }));
    }
  },

  /**
   * Crée un nouveau auteur
   */
  async createAuteur(req, res) {
    try {
      const auteurData = await parseRequestBody(req);

      const result = auteurService.createAuteur(auteurData);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Auteur créé avec succès",
          data: { id: result.id },
        })
      );
    } catch (error) {
      const statusCode = error.message.includes("requis") ? 400 : 500;

      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  },
};
