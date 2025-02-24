// utils/db.js
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

    // S'assurer que la table existe
    await initDb(db, dbFilename);

    return db;
  } catch (error) {
    await logError(error);
    throw new Error(`Failed to open database: ${dbFilename}`);
  }
}

/**
 * Initialise la structure de la base de données.
 * @param {import('sqlite').Database} db - Instance de la base de données.
 * @param {string} dbFilename - Nom du fichier de la base de données.
 */
async function initDb(db, dbFilename) {
  try {
    if (dbFilename === "./database.db") {
      // Initialisation spécifique à database.db
      await db.exec(`
        CREATE TABLE IF NOT EXISTS articles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          version INTEGER DEFAULT 1
        )
      `);
    } else if (dbFilename === "./database2.db") {
      // Initialisation spécifique à database2.db
      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          version INTEGER DEFAULT 1
        )
      `);
    }
  } catch (error) {
    await logError(error);
    throw new Error(`Failed to initialize database: ${dbFilename}`);
  }
}
