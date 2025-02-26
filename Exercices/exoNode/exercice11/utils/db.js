import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { logError } from "./logger.js";

/**
 * Ouvre une connexion à une base de données SQLite donnée.
 * @param {string} dbFilename - Nom du fichier de la base de données.
 * @returns {Promise<import('sqlite').Database>} Instance de la base de données.
 */
export async function openDb(dbFilename = "./database.db") {
  try {
    const db = await open({
      filename: dbFilename,
      driver: sqlite3.Database,
    });

    // S'assurer que la structure de la base est bien en place
    await initDb(db);

    return db;
  } catch (error) {
    await logError(error);
    throw new Error(`Failed to open database: ${dbFilename}`);
  }
}

/**
 * Initialise la structure de la base de données.
 * @param {import('sqlite').Database} db - Instance de la base de données.
 */
async function initDb(db) {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
  } catch (error) {
    await logError(error);
    throw new Error("Failed to initialize database");
  }
}
