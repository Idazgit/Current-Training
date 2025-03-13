// controllers/livreController.js
import { livreService } from "../services/livreService.js";
import { parseRequestBody } from "../utils/httpHelper.js";

export const livreController = {
  /**
   * Récupère tous les livres
   */
  async getAllLivres(req, res) {
    try {
      const livres = livreService.getAllLivres();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: livres }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Erreur serveur" }));
    }
  },

  /**
   * Crée un nouveau livre
   */
  async createLivre(req, res) {
    try {
      const livreData = await parseRequestBody(req);

      const result = livreService.createLivre(livreData);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Livre créé avec succès",
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
