// Import des utilitaires pour la gestion des fichiers et des logs
import { readJsonFile, writeJsonFile } from "../utils/file-utils.js";
import { logError } from "../utils/logger.js";

// Chemin constant vers le fichier de données JSON
const ARTICLES_FILE = "./data/articles.json";

/*
 * Gère toutes les requêtes entrantes concernant les articles
 * @param {Object} req - Objet requête HTTP
 * @param {Object} res - Objet réponse HTTP
 */
export async function handleRequest(req, res) {
  // Extraction de l'ID de l'URL si présent
  const urlParts = req.url.split("/");
  const id = urlParts[2];

  try {
    // Routage selon la méthode HTTP
    switch (req.method) {
      case "GET":
        // GET /articles ou GET /articles/:id
        if (id) {
          await getArticleById(req, res, id);
        } else {
          await getAllArticles(req, res);
        }
        break;
      case "POST":
        // POST /articles
        await createArticle(req, res);
        break;
      case "PUT":
        // PUT /articles/:id
        if (id) {
          await updateArticle(req, res, id);
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "ID requis pour la mise à jour" }));
        }
        break;
      case "DELETE":
        // DELETE /articles/:id
        if (id) {
          await deleteArticle(req, res, id);
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "ID requis pour la suppression" }));
        }
        break;
      default:
        res.writeHead(405, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Méthode non autorisée" }));
    }
  } catch (error) {
    logError("Erreur lors du traitement de la requête", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Erreur serveur interne" }));
  }
}

/*
 * Récupère tous les articles
 * @param {Object} req - Objet requête HTTP
 * @param {Object} res - Objet réponse HTTP
 */
async function getAllArticles(req, res) {
  try {
    const articles = await readJsonFile(ARTICLES_FILE);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(articles));
  } catch (error) {
    logError("Erreur lors de la récupération des articles", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "Erreur lors de la récupération des articles" })
    );
  }
}

/*
 * Récupère un article par son ID
 * @param {Object} req - Objet requête HTTP
 * @param {Object} res - Objet réponse HTTP
 * @param {string} id - ID de l'article à récupérer
 */
async function getArticleById(req, res, id) {
  try {
    const articles = await readJsonFile(ARTICLES_FILE);
    const article = articles.find((a) => a.id === parseInt(id));

    if (article) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(article));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Article non trouvé" }));
    }
  } catch (error) {
    logError("Erreur lors de la récupération de l'article", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "Erreur lors de la récupération de l'article" })
    );
  }
}

/*
 * Crée un nouvel article
 * @param {Object} req - Objet requête HTTP
 * @param {Object} res - Objet réponse HTTP
 */
async function createArticle(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const newArticle = JSON.parse(body);

      // Vérifie si la propriété content existe (erreur développeur)
      if (!("content" in newArticle)) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error:
              "Erreur développeur : La propriété 'content' est manquante dans la requête",
          })
        );
        return;
      }

      // Vérifie si le contenu est vide (validation utilisateur)
      if (!newArticle.content || newArticle.content.trim() === "") {
        res.writeHead(206, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Votre contenu ne peut être posté car le contenu est vide",
            type: "validation_error",
          })
        );
        return;
      }

      // Si on arrive ici, le content est valide
      const articles = await readJsonFile(ARTICLES_FILE);

      // Génération d'un nouvel ID unique
      newArticle.id =
        articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 1;

      // Ajout du nouvel article et sauvegarde
      articles.push(newArticle);
      await writeJsonFile(ARTICLES_FILE, articles);

      // Succès - Article créé
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newArticle));
    } catch (error) {
      logError("Erreur lors de la création de l'article", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Données invalides" }));
    }
  });
}
/*
 * Met à jour un article existant
 * @param {Object} req - Objet requête HTTP
 * @param {Object} res - Objet réponse HTTP
 * @param {string} id - ID de l'article à mettre à jour
 */
async function updateArticle(req, res, id) {
  let body = "";

  // Collecte des données envoyées
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  // Traitement une fois toutes les données reçues
  req.on("end", async () => {
    try {
      const updateData = JSON.parse(body);
      const articles = await readJsonFile(ARTICLES_FILE);
      const index = articles.findIndex((a) => a.id === parseInt(id));

      if (index !== -1) {
        // Mise à jour de l'article en conservant l'ID
        articles[index] = {
          ...articles[index],
          ...updateData,
          id: parseInt(id),
        };
        await writeJsonFile(ARTICLES_FILE, articles);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(articles[index]));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Article non trouvé" }));
      }
    } catch (error) {
      logError("Erreur lors de la mise à jour de l'article", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Données invalides" }));
    }
  });
}

/*
 * Supprime un article
 * @param {Object} req - Objet requête HTTP
 * @param {Object} res - Objet réponse HTTP
 * @param {string} id - ID de l'article à supprimer
 */
async function deleteArticle(req, res, id) {
  try {
    const articles = await readJsonFile(ARTICLES_FILE);
    const initialLength = articles.length;
    const updatedArticles = articles.filter((a) => a.id !== parseInt(id));

    if (updatedArticles.length === initialLength) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Article non trouvé" }));
    } else {
      await writeJsonFile(ARTICLES_FILE, updatedArticles);
      res.writeHead(204, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Article supprimé avec succès" }));
    }
  } catch (error) {
    logError("Erreur lors de la suppression de l'article", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "Erreur lors de la suppression de l'article" })
    );
  }
}

// Export de toutes les fonctions pour utilisation dans d'autres fichiers
export {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
