// controllers/livreController.js
import { empruntService } from "../services/empruntService.js";
import { parseRequestBody } from "../utils/httpHelper.js";

export const empruntController = {
  /**
   * Récupère tous les emprunts
   */
  async getAllEmprunts(req, res) {
    try {
      const emprunt = empruntService.getAllEmprunt();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: emprunt }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Erreur serveur" }));
    }
  },

  /**
   * Crée un nouvel emprunt
   */
  async createEmprunt(req, res) {
    try {
      const empruntData = await parseRequestBody(req);

      const result = empruntService.createEmprunt(empruntData);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Emprunt créé avec succès",
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
