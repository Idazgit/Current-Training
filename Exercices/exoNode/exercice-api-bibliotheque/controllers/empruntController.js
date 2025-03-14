import { empruntService } from "../services/empruntService.js";
import { parseRequestBody } from "../utils/httpHelper.js";

export const empruntController = {
  /**
   * Récupère tous les emprunts
   */
  async getAllEmprunts(req, res) {
    try {
      console.log("Récupération de tous les emprunts");
      const emprunts = await empruntService.getAllEmprunts();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: emprunts }));
    } catch (error) {
      console.error("Erreur lors de la récupération des emprunts :", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Erreur serveur" }));
    }
  },

  /**
   * Crée un nouvel emprunt
   */
  async createEmprunt(req, res) {
    try {
      console.log("Création d'un nouvel emprunt");
      const empruntData = await parseRequestBody(req);

      const result = await empruntService.createEmprunt(empruntData);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Emprunt créé avec succès",
          data: { id: result.id },
        })
      );
    } catch (error) {
      console.error("Erreur lors de la création de l'emprunt :", error);
      const statusCode = error.message.includes("requis") ? 400 : 500;

      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  },

  /**
   * Récupère un emprunt par ID
   */
  async getEmpruntById(req, res, id) {
    try {
      console.log(`Récupération de l'emprunt avec ID ${id}`);
      const emprunt = await empruntService.getEmpruntById(id);

      if (!emprunt) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: false, error: "Emprunt non trouvé" })
        );
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: emprunt }));
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de l'emprunt avec ID ${id} :`,
        error
      );
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Erreur serveur" }));
    }
  },

  /**
   * Met à jour un emprunt
   */
  async updateEmprunt(req, res, id) {
    try {
      console.log(`Mise à jour de l'emprunt avec ID ${id}`);
      const empruntData = await parseRequestBody(req);

      const result = await empruntService.updateEmprunt(id, empruntData);

      if (!result) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: false, error: "Emprunt non trouvé" })
        );
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Emprunt mis à jour avec succès",
        })
      );
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de l'emprunt avec ID ${id} :`,
        error
      );
      const statusCode = error.message.includes("requis") ? 400 : 500;

      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  },

  /**
   * Supprime un emprunt
   */
  async deleteEmprunt(req, res, id) {
    try {
      console.log(`Suppression de l'emprunt avec ID ${id}`);
      const result = await empruntService.deleteEmprunt(id);

      if (!result) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: false, error: "Emprunt non trouvé" })
        );
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Emprunt supprimé avec succès",
        })
      );
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de l'emprunt avec ID ${id} :`,
        error
      );
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Erreur serveur" }));
    }
  },
};
