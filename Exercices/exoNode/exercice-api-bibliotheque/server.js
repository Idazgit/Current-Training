import http from "http";
import { routes } from "./routes/routes.js";
import { logger } from "./utils/logger.js";
import { openDb } from "./config/database.js";
import path from "path";

const dbFilePath = path.resolve("./Data/database.db");
console.log("Chemin de la base de données :", dbFilePath);

// Initialiser la base de données
openDb(dbFilePath)
  .then(() => {
    console.log("Base de données initialisée.");
  })
  .catch((error) => {
    console.error(
      "Erreur lors de l'initialisation de la base de données:",
      error
    );
  });

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight CORS
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Log incoming request
  logger.info(`Incoming request: ${req.method} ${req.url}`);

  // Route the request
  routes(req, res);
});

server.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}/`);
});
