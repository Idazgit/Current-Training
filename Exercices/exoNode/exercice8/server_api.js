const http = require("http");
const fs = require("fs").promises;

// Lecture du fichier JSON
async function readArticles() {
  try {
    const data = await fs.readFile("articles.json", "utf8");
    const parsedData = JSON.parse(data); // Parser le fichier JSON
    return parsedData.articles || []; // Retourner la propriété 'articles', ou un tableau vide si non définie
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier articles.json:", error);
    return []; // Retourner un tableau vide en cas d'erreur
  }
}

// Écriture dans le fichier JSON
async function writeArticles(articles) {
  try {
    const data = { articles }; // Envelopper les articles dans un objet
    await fs.writeFile("articles.json", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(
      "Erreur lors de l'écriture dans le fichier articles.json:",
      error
    );
  }
}

// Création du serveur HTTP
const server = http.createServer(async (req, res) => {
  // Headers CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Gestion du preflight CORS
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Logging des requêtes
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // Route pour récupérer tous les articles
  if (req.url === "/articles" && req.method === "GET") {
    const articles = await readArticles();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(articles));
  }
  // Route pour récupérer un article par son ID
  else if (req.url.match(/^\/articles\/\d+$/) && req.method === "GET") {
    const id = req.url.split("/")[2];
    const articles = await readArticles();
    const article = articles.find((article) => article.id == id);

    if (!article) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Article not found" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(article));
    }
  }
  // Route pour ajouter un nouvel article
  else if (req.url === "/articles" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const article = JSON.parse(body);
        const articles = await readArticles();
        article.id = articles.length + 1; // ID unique basé sur le timestamp
        articles.push(article);
        await writeArticles(articles);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(article));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid data" }));
      }
    });
  }
  // Route pour mettre à jour un article
  else if (req.url.match(/^\/articles\/\d+$/) && req.method === "PUT") {
    const id = req.url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const updatedData = JSON.parse(body);
        const articles = await readArticles();

        const articleIndex = articles.findIndex((article) => article.id == id);

        if (articleIndex === -1) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Article not found" }));
        } else {
          articles[articleIndex] = {
            ...articles[articleIndex],
            ...updatedData,
          };
          await writeArticles(articles);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(articles[articleIndex]));
        }
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid data" }));
      }
    });
  }
  // Route pour supprimer un article
  else if (req.url.match(/^\/articles\/\d+$/) && req.method === "DELETE") {
    const id = req.url.split("/")[2];
    const articles = await readArticles();

    const updatedArticles = articles.filter((article) => article.id != id);

    if (updatedArticles.length === articles.length) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Article not found" }));
    } else {
      await writeArticles(updatedArticles);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Article deleted" }));
    }
  }
  // Gestion des autres routes non définies
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

// Démarrage du serveur
server.listen(4000, () => {
  console.log("API Server running on port 4000");
});
