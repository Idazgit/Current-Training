// routes/routes.js
import { livreController } from "../controllers/livreController.js";
import { auteurController } from "../controllers/auteurController.js";
import { empruntController } from "../controllers/empruntController.js";
import { logger } from "../utils/logger.js";

export const routes = (req, res) => {
  const url = req.url;
  const method = req.method;
  const queryParams = new URLSearchParams(url.split("?")[1]);

  // Routes pour les livres
  if (url.startsWith("/api/livres") && method === "GET") {
    const page = parseInt(queryParams.get("page")) || 1;
    const limit = parseInt(queryParams.get("limit")) || 10;

    if (url === "/api/livres") {
      livreController.getAllLivres(req, res, page, limit);
    } else if (url.match(/^\/api\/livres\/([0-9]+)$/)) {
      const id = url.split("/")[3];
      livreController.getLivreById(req, res, parseInt(id));
      //Routes pour les Livres par Catégorie
    } else if (url.match(/^\/api\/livres\/categorie\/([0-9]+)$/)) {
      const id = url.split("/")[4];
      livreController.getLivreByCategorie(req, res, parseInt(id), page, limit);
    } else if (url.match(/^\/api\/livres\/auteur\/([0-9]+)$/)) {
      const id = url.split("/")[4];
      livreController.getLivreByAuteur(req, res, parseInt(id), page, limit);
    }
  } else if (url === "/api/livres" && method === "POST") {
    console.log(req.body);
    livreController.createLivre(req, res);
  } else if (url.match(/^\/api\/livres\/([0-9]+)$/) && method === "PUT") {
    const id = url.split("/")[3];
    livreController.updateLivre(req, res, parseInt(id));
  } else if (url.match(/^\/api\/livres\/([0-9]+)$/) && method === "DELETE") {
    const id = url.split("/")[3];
    livreController.deleteLivre(req, res, parseInt(id));
  }

  // Routes pour les auteurs (à implémenter)
  else if (url === "/api/auteurs" && method === "GET") {
    auteurController.getAllAuteurs(req, res);
  } else if (url === "/api/auteurs" && method === "POST") {
    auteurController.createAuteur(req, res);
  } else if (url.match(/^\/api\/auteurs\/([0-9]+)$/) && method === "GET") {
    const id = url.split("/")[3];
    auteurController.getAuteurById(req, res, parseInt(id));
  } else if (url.match(/^\/api\/auteurs\/([0-9]+)$/) && method === "PUT") {
    const id = url.split("/")[3];
    auteurController.updateAuteur(req, res, parseInt(id));
  } else if (url.match(/^\/api\/auteurs\/([0-9]+)$/) && method === "DELETE") {
    const id = url.split("/")[3];
    auteurController.deleteAuteur(req, res, parseInt(id));
  }

  // Routes pour les emprunts (à implémenter)
  else if (url === "/api/emprunts" && method === "GET") {
    empruntController.getAllEmprunts(req, res);
  } else if (url === "/api/emprunts" && method === "POST") {
    empruntController.createEmprunt(req, res);
  } else if (url.match(/^\/api\/emprunts\/([0-9]+)$/) && method === "GET") {
    const id = url.split("/")[3];
    empruntController.getEmpruntById(req, res, parseInt(id));
  } else if (url.match(/^\/api\/emprunts\/([0-9]+)$/) && method === "PUT") {
    const id = url.split("/")[3];
    empruntController.updateEmprunt(req, res, parseInt(id));
  } else if (url.match(/^\/api\/emprunts\/([0-9]+)$/) && method === "DELETE") {
    const id = url.split("/")[3];
    empruntController.deleteEmprunt(req, res, parseInt(id));
  }

  // Route non trouvée
  else {
    logger.warn(`Route non trouvée: ${method} ${url}`);
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Route non trouvée" }));
  }
};
