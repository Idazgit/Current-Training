import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Chemin vers votre base de données
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "Data", "database.db");

// Connexion à la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err.message);
    return;
  }
  console.log("Connecté à la base de données SQLite.");

  // Exécution des requêtes
  executeQueries();
});

// Fonction pour exécuter une requête SELECT et afficher les résultats avec console.table
function runSelectQuery(query, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n--- ${description} ---`);
    console.log(`Requête: ${query}\n`);

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Erreur dans la requête :", err.message);
        reject(err);
        return;
      }

      if (rows.length === 0) {
        console.log("Aucun résultat trouvé.");
      } else {
        // Utilisation de console.table pour un affichage propre
        console.table(rows);
        console.log(`Total: ${rows.length} résultat(s)`);
      }
      resolve(rows);
    });
  });
}

// Liste des requêtes SELECT à exécuter
async function executeQueries() {
  try {
    // Définition des requêtes avec leurs descriptions
    const queries = [
      {
        description: "Livres avec leurs auteurs et catégories",
        query: `SELECT l.Titre AS "Titre Livre", a.Nom AS "Auteur", c.Nom AS "Categorie"
                FROM LIVRE l
                JOIN AUTEUR_LIVRE al ON l.ID_Livre = al.ID_Livre
                JOIN AUTEUR a ON al.ID_Auteur = a.ID_Auteur
                JOIN CATEGORIE_LIVRE cl ON l.ID_Livre = cl.ID_Livre
                JOIN CATEGORIE c ON cl.ID_Categorie = c.ID_Categorie`,
      },
      {
        description: "Nombre de livres par catégorie (sans ID)",
        query: `SELECT c.Nom AS "Categorie", COUNT(cl.ID_Livre) AS "Nombre de Livres"
                FROM CATEGORIE c
                JOIN CATEGORIE_LIVRE cl ON c.ID_Categorie = cl.ID_Categorie
                GROUP BY c.Nom
                ORDER BY c.Nom`,
      },
      {
        description:
          "Nombre de livres par catégorie (avec ID et catégories sans livres)",
        query: `SELECT c.ID_Categorie, c.Nom AS "Categorie", COUNT(cl.ID_Livre) AS "Nombre de Livres"
                FROM CATEGORIE c
                LEFT JOIN CATEGORIE_LIVRE cl ON c.ID_Categorie = cl.ID_Categorie
                GROUP BY c.ID_Categorie, c.Nom
                ORDER BY c.ID_Categorie`,
      },
      {
        description: "Auteur avec le plus de livres",
        query: `SELECT a.Nom, COUNT(al.ID_Livre) AS "Nombre de Livres"
                FROM AUTEUR a
                JOIN AUTEUR_LIVRE al ON a.ID_Auteur = al.ID_Auteur
                GROUP BY a.ID_Auteur, a.Nom
                ORDER BY COUNT(al.ID_Livre) DESC
                LIMIT 1`,
      },
    ];

    // Exécuter les requêtes séquentiellement
    for (const query of queries) {
      await runSelectQuery(query.query, query.description);
    }
  } catch (error) {
    console.error("Erreur lors de l'exécution des requêtes :", error);
  } finally {
    // Fermer la connexion à la base de données
    db.close((err) => {
      if (err) {
        console.error(
          "Erreur lors de la fermeture de la base de données :",
          err.message
        );
      } else {
        console.log("\nConnexion à la base de données fermée.");
      }
    });
  }
}
