import { livreService } from "../services/livreService.js";
import { parseRequestBody } from "../utils/httpHelper.js";

export const livreController = {
  /**
   * Récupère tous les livres
   */
  async getAllLivres(req, res, page, limit) {
    try {
      console.log("Récupération de tous les livres");
      const livres = await livreService.getAllLivres(page, limit);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: livres }));
      console.log(`Fetching books with page=${page} and limit=${limit}`);
    } catch (error) {
      console.error("Erreur lors de la récupération des livres :", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Erreur serveur" }));
    }
  },

  /**
   * Crée un nouveau livre
   */
  async createLivre(req, res) {
    try {
      console.log(req.body);
      console.log("Création d'un nouveau livre");

      const livreData = await parseRequestBody(req);

      const result = await livreService.createLivre(livreData);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Livre créé avec succès",
          data: { id: result.id },
        })
      );
    } catch (error) {
      console.error("Erreur lors de la création du livre :", error);
      const statusCode = error.message.includes("requis") ? 400 : 500;

      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  },

  /**
   * Récupère un livre par ID
   */
  async getLivreById(req, res, id) {
    try {
      console.log(`Récupération du livre avec ID ${id}`);
      const livre = await livreService.getLivreById(id);

      if (!livre) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Livre non trouvé" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: livre }));
    } catch (error) {
      console.error(
        `Erreur lors de la récupération du livre avec ID ${id} :`,
        error
      );
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Erreur serveur" }));
    }
  },

  async getLivreByCategorie(req, res, id) {
    try {
      console.log(`Récupération des livres de la catégorie avec ID ${id}`);
      const result = await livreService.getLivreByCategorie(id);

      if (!result) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: false, error: "Catégorie non trouvée" })
        );
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          categorie: result.categorieNom,
          data: result.livres,
        })
      );
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des livres de la catégorie avec ID ${id} :`,
        error
      );
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Erreur serveur" }));
    }
  },
  async getLivreByAuteur(req, res, id) {
    try {
      console.log(`Récupération des livres de l'auteur avec ID ${id}`);
      const result = await livreService.getLivreByAuteur(id);

      if (!result) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Auteur non trouvé" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          auteur: result.auteurNom,
          data: result.livres,
        })
      );
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des livres de l'auteur avec ID ${id} :`,
        error
      );
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Erreur serveur" }));
    }
  },
  /**
   * Met à jour un livre
   */
  async updateLivre(req, res, id) {
    try {
      console.log(`Mise à jour du livre avec ID ${id}`);
      const livreData = await parseRequestBody(req);

      const result = await livreService.updateLivre(id, livreData);

      if (!result) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Livre non trouvé" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Livre mis à jour avec succès",
        })
      );
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour du livre avec ID ${id} :`,
        error
      );
      const statusCode = error.message.includes("requis") ? 400 : 500;

      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  },

  /**
   * Supprime un livre
   */
  async deleteLivre(req, res, id) {
    try {
      console.log(`Suppression du livre avec ID ${id}`);
      const result = await livreService.deleteLivre(id);

      if (!result) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Livre non trouvé" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ success: true, message: "Livre supprimé avec succès" })
      );
    } catch (error) {
      console.error(
        `Erreur lors de la suppression du livre avec ID ${id} :`,
        error
      );
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Erreur serveur" }));
    }
  },
};
