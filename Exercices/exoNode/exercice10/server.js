import { openDb } from "./utils/db.js";
import { logError } from "./utils/logger.js";
import http from "http";
import url from "url";

const PORT = 4000;

// Fonction pour gérer les requêtes HTTP
const requestListener = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Route pour récupérer tous les articles
  if (parsedUrl.pathname === "/article" && req.method === "GET") {
    try {
      const db = await openDb();
      const articles = await db.all("SELECT * FROM articles");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(articles));
    } catch (error) {
      await logError(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch articles" }));
    }
    return;
  }

  // Route pour récupérer un article spécifique par ID
  const match = parsedUrl.pathname.match(/^\/article\/(\d+)$/); // Vérifie si l'URL correspond à /article/:id
  if (match && req.method === "GET") {
    const articleId = parseInt(match[1], 10); // Extraire l'ID de l'URL

    try {
      const db = await openDb();

      // Requête pour récupérer l'article avec l'ID donné
      const article = await db.get("SELECT * FROM articles WHERE id = ?", [
        articleId,
      ]);

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

  // Retourne une erreur 404 pour toute autre route
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 Not Found");
};

// Créer le serveur HTTP
const server = http.createServer(requestListener);

// Lancer le serveur
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
