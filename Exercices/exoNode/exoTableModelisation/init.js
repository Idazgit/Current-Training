import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { readFile } from "fs/promises";

export async function initDb(dbFilePath) {
  try {
    // Ouvrir la connexion à la base de données
    const db = await open({
      filename: dbFilePath,
      driver: sqlite3.Database,
    });

    // Vérifier l'existence des tables
    const tables = [
      "LIVRE",
      "MEMBRE",
      "AUTEUR",
      "CATEGORIE",
      "EXEMPLAIRE",
      "EMPRUNT",
      "AUTEUR_LIVRE",
      "CATEGORIE_LIVRE",
    ];
    for (const table of tables) {
      const result = await db.get(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`
      );
      if (!result) {
        // Lire le contenu du fichier sqlite-schema.sql
        const schema = await readFile("./sqlite-schema.sql", "utf-8");

        // Exécuter le script SQL pour créer les tables et les index
        await db.exec(schema);

        console.log("Base de données initialisée avec succès.");
        break;
      }
    }
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la base de données:",
      error
    );
  }
}

export async function insertCategorie(dbFilePath, categorie) {
  try {
    const db = await open({
      filename: dbFilePath,
      driver: sqlite3.Database,
    });

    const { nom, description, dateCreation, popularite } = categorie;
    await db.run(
      `INSERT INTO CATEGORIE (Nom, Description, Date_Creation, Popularite) VALUES (?, ?, ?, ?)`,
      [nom, description, dateCreation, popularite]
    );

    console.log("Nouvelle catégorie insérée avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'insertion de la catégorie:", error);
  }
}

export async function insertAuteur(dbFilePath, auteur) {
  try {
    const db = await open({
      filename: dbFilePath,
      driver: sqlite3.Database,
    });
    const { nom, prenom, dateNaissance, nationalite } = auteur;
    await db.run(
      `INSERT INTO AUTEUR (Nom, Prenom, Date_Naissance, Nationalite) VALUES (?, ?, ?, ?)`,
      [nom, prenom, dateNaissance, nationalite]
    );

    console.log("Nouvel auteur inséré avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'insertion de l'auteur:", error);
  }
}
