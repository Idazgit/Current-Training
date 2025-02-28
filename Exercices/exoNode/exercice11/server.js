import { openDb } from "./utils/db.js";
import { logError } from "./utils/logger.js";
import http from "http";
import url from "url";
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "./routes/articles.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getArticleByUser,
} from "./routes/users.js";

const PORT = 4000;

const requestListener = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Route pour récupérer tous les articles avec filtrage et pagination
  if (parsedUrl.pathname === "/article" && req.method === "GET") {
    try {
      const articlesData = await getAllArticles(req); // Passe req à la fonction pour obtenir les filtres

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(articlesData)); // Renvoie les articles filtrés et paginés
    } catch (error) {
      await logError(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch articles" }));
    }
    return;
  }
  if (parsedUrl.pathname === "/user" && req.method === "GET") {
    try {
      const usersData = await getAllUsers(req);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(usersData));
    } catch (error) {
      await logError(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch users" }));
    }
    return;
  }
  const matchArticleByUser = parsedUrl.pathname.match(
    /^\/user\/(\d+)\/article$/
  );
  if (matchArticleByUser) {
    const articleByUser = parseInt(matchArticleByUser[1], 10);

    if (req.method === "GET") {
      try {
        const articlesUser = await getArticleByUser(articleByUser);
        if (articlesUser) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(articlesUser));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "ID inexistant" }));
        }
      } catch (error) {
        await logError(error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to fetch article" }));
      }
      return;
    }
  }

  // Route pour créer un nouvel article
  if (parsedUrl.pathname === "/article" && req.method === "POST") {
    try {
      await createArticle(req, res);
    } catch (error) {
      await logError(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to create article" }));
    }
    return;
  }
  if (parsedUrl.pathname === "/user" && req.method === "POST") {
    try {
      await createUser(req, res);
    } catch (error) {
      await logError(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to create user" }));
    }
    return;
  }
  // Route pour récupérer ou modifier un article spécifique par ID
  const matchArticle = parsedUrl.pathname.match(/^\/article\/(\d+)$/);
  if (matchArticle) {
    const articleId = parseInt(matchArticle[1], 10);

    if (req.method === "GET") {
      try {
        const article = await getArticleById(articleId);
        if (article) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(article));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "ID inexistant" }));
        }
      } catch (error) {
        await logError(error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to fetch article" }));
      }
      return;
    }

    if (req.method === "PUT") {
      try {
        await updateArticle(req, res);
      } catch (error) {
        await logError(error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to update article" }));
      }
      return;
    }
  }
  if (matchArticle && req.method === "DELETE") {
    try {
      await deleteArticle(req, res);
    } catch (error) {
      await logError(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Erreur lors de la suppression" }));
    }
    return;
  }

  const matchUser = parsedUrl.pathname.match(/^\/user\/(\d+)$/);
  if (matchUser) {
    const userId = parseInt(matchUser[1], 10);
    if (req.method === "GET") {
      try {
        const user = await getUserById(userId);
        if (user) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(user));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "ID inexistant" }));
        }
      } catch (error) {
        await logError(error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to fetch user" }));
      }
      return;
    }
    if (req.method === "PUT") {
      try {
        await updateUser(req, res);
      } catch (error) {
        await logError(error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to update User" }));
      }
      return;
    }
    if (matchUser && req.method === "DELETE") {
      try {
        await deleteUser(req, res);
      } catch (error) {
        await logError(error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Erreur lors de la suppression" }));
      }
      return;
    }
  }
  // Retourne une erreur 404 pour toute autre route
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 Not Found");
};

// Créer le serveur HTTP
const server = http.createServer(requestListener);

(async () => {
  try {
    await openDb(); // Ouvre la base et initialise les tables
    console.log("Base de données initialisée !");

    // Démarrer le serveur une fois la base prête
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base :", error);
  }
})();
