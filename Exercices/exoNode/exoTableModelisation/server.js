import { openDb } from "./utils/init.js";

const dbFilePath = "./Data/database.db";

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
