import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { readFile } from "fs/promises";

let dbInstance = null; // Stocke l'instance de la base de données

export async function openDb() {
  try {
    if (dbInstance) {
      return dbInstance; // Retourne l'instance déjà ouverte
    }

    const dbPath = path.resolve(
      "../exercice-api-bibliotheque/Data/database.db"
    );
    console.log("Chemin de la base de données :", dbPath);

    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("Base de données ouverte avec succès !");

    // Vérifier si la base est vide avant d'exécuter le script SQL
    const tablesExist = await dbInstance.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='LIVRE'"
    );

    if (!tablesExist) {
      console.log("Initialisation de la base de données...");
      const schema = await readFile(
        path.resolve("./sql/bibliotheque.sql"),
        "utf-8"
      );
      await dbInstance.exec(schema);
      await insertData(dbInstance);
      console.log("Schéma appliqué et données insérées !");
    } else {
      console.log("Base de données déjà initialisée.");
    }

    return dbInstance;
  } catch (error) {
    console.error("Erreur lors de l'ouverture de la base de données", error);
    throw new Error("Failed to open database");
  }
}

export default openDb;

export async function insertData(db) {
  try {
    await db.run(`
      INSERT OR IGNORE INTO AUTEUR (ID_Auteur, Nom, Prenom, Date_Naissance, Nationalite)
      VALUES 
        (1, 'Hemingway', 'Ernest', '1899-07-21', 'Américaine'),
        (2, 'Orwell', 'George', '1903-06-25', 'Britannique'),
        (3, 'Dumas', 'Alexandre', '1802-07-24', 'Française'),
        (4, 'Shakespeare', 'William', '1564-04-23', 'Anglais'),
        (5, 'Asimov', 'Isaac', '1920-01-02', 'Russe'),
        (6, 'Tolkien', 'J.R.R.', '1892-01-03', 'Anglais');
    `);

    await db.run(`
      INSERT OR IGNORE INTO CATEGORIE (ID_Categorie, Nom, Description, Date_Creation, Popularite)
      VALUES 
        (1, 'Fiction', 'Livres de fiction', '2025-03-06', 'Haute'),
        (2, 'Science', 'Livres scientifiques', '2025-03-06', 'Moyenne'),
        (3, 'Histoire', 'Livres sur l''histoire', '2025-03-06', 'Faible'),
        (4, 'Arts', 'Livres sur l''art', '2025-03-06', 'Haute'),
        (5, 'Technologie', 'Livres sur les technologies', '2025-03-06', 'Moyenne');
    `);

    await db.run(`
      INSERT OR IGNORE INTO LIVRE (ID_Livre, Titre, ISBN, Nombre_Pages, Annee_Publication)
      VALUES
        (1, 'The Old Man and the Sea', '978-1234567890', 127, 1952),
        (2, '1984', '978-0987654321', 328, 1949),
        (3, 'Le Comte de Monte-Cristo', '978-0307465206', 1000, 1844),
        (4, 'Les Trois Mousquetaires', '978-0192830360', 800, 1844),
        (5, 'Hamlet', '978-0141013072', 200, 1609),
        (6, 'Macbeth', '978-0141014161', 250, 1606),
        (7, 'Fundamentals of Robotics', '978-0133061870', 500, 1985),
        (8, 'The Intelligent Man''s Guide to Science', '978-0385003504', 350, 1960),
        (9, 'The Hobbit', '978-0547928227', 310, 1937),
        (10, 'The Lord of the Rings', '978-0544003415', 1200, 1954),
        (11, 'Le Livre des merveilles', '978-2213225700', 300, 1620),
        (12, 'Othello', '978-0451526938', 150, 1604);
    `);

    await db.run(`
      INSERT OR IGNORE INTO MEMBRE (ID_Membre, Nom, Prenom, Email)
      VALUES
        (1, 'John', 'Doe', 'JohnDoe@email.com'),
        (2, 'Jane', 'Doe', 'JaneDoe@email.com'),
        (3, 'Bob', 'Smith', 'BobSmith@email.com'),
        (4, 'Alice', 'Smith', 'AliceSmith@email.com'),
        (5, 'James', 'Brown', 'JamesBrown@email.com'),
        (6, 'Sarah', 'Brown', 'SarahBrown@email.com');
    `);
    console.log("Insertion des données dans la table EXEMPLAIRE...");
    await db.run(`
      INSERT OR IGNORE INTO EXEMPLAIRE (ID_Exemplaire, ID_Livre, Etat, Disponibilite, Rarete, Date_Acquisition)
      VALUES
        (1, 1, 'Bon', 0, 1, '2021-01-15'),  
        (2, 2, 'Moyen', 1, 0, '2021-01-15'),
        (3, 3, 'Mauvais', 0, 1, '2021-01-15'),  
        (4, 4, 'Bon', 0, 1, '2021-01-15'),
        (5, 5, 'Moyen', 0, 1, '2021-01-15'),
        (6, 6, 'Mauvais', 0, 1, '2021-01-15'),  
        (7, 7, 'Bon', 0, 1, '2021-01-15'),
        (8, 8, 'Moyen', 0, 1, '2021-01-15'),
        (9, 9, 'Mauvais', 0, 1, '2021-01-15'),  
        (10, 10, 'Bon', 0, 1, '2021-01-15'),
        (11, 11, 'Moyen', 0, 1, '2021-01-15'),
        (12, 12, 'Mauvais', 0, 1, '2021-01-15');  
    `);
    console.log("Données insérées dans la table EXEMPLAIRE.");
    await db.run(`
      INSERT OR IGNORE INTO EMPRUNT (ID_Emprunt, ID_Exemplaire, ID_Membre, Date_Emprunt, Date_Retour_Prevue)
      VALUES
        (1, 1, 1, '2021-01-15', '2021-02-15')
      
    `);
    console.log("Données insérées dans la table EMPRUNT.");

    await db.run(`
      INSERT OR IGNORE INTO AUTEUR_LIVRE (ID_Auteur, ID_Livre)
      VALUES
        (3, 3),
        (3, 4),
        (4, 5),
        (4, 6),
        (5, 7),
        (5, 8),
        (6, 9),
        (6, 10),
        (3, 11),
        (4, 12);
        
    `);

    console.log("Données insérées avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'insertion des données : ", error);
    throw new Error("Failed to insert data");
  }
}
