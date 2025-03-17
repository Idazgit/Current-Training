import openDb from "../config/database.js";
import { Livre } from "../models/LivreModel.js";

let dbPromise = openDb(); // 📌 Charge la base de données une seule fois

export const livreRepository = {
  async findAll(offset, limit) {
    const db = await dbPromise;
    const stmt = await db.prepare(`
      SELECT ID_Livre, Titre, ISBN, Nombre_Pages, Annee_Publication
      FROM LIVRE
      LIMIT ? OFFSET ?
    `);

    const rows = await stmt.all(limit, offset);
    return rows.map(
      (row) =>
        new Livre(
          row.ID_Livre,
          row.Titre,
          row.ISBN,
          row.Nombre_Pages,
          row.Annee_Publication
        )
    );
  },

  async create(livre) {
    const db = await dbPromise;
    const stmt = await db.prepare(`
      INSERT INTO LIVRE (Titre, ISBN, Nombre_Pages, Annee_Publication)
      VALUES (?, ?, ?, ?)
    `);

    const result = await stmt.run(
      livre.Titre,
      livre.ISBN,
      livre.Nombre_Pages,
      livre.Annee_Publication
    );

    return {
      id: result.lastInsertRowid,
      changes: result.changes,
    };
  },

  async findById(id) {
    const db = await dbPromise;
    const stmt = await db.prepare(`
      SELECT ID_Livre, Titre, ISBN, Nombre_Pages, Annee_Publication
      FROM LIVRE
      WHERE ID_Livre = ?
    `);

    const row = await stmt.get(id);
    if (!row) return null;

    return new Livre(
      row.ID_Livre,
      row.Titre,
      row.ISBN,
      row.Nombre_Pages,
      row.Annee_Publication
    );
  },
  async findByCategorie(id, offset, limit) {
    const db = await dbPromise;
    try {
      // Version simplifiée sans pagination
      const stmt = await db.prepare(`
        SELECT c.Nom AS CATEGORIE, l.* 
        FROM LIVRE l 
        JOIN CATEGORIE_LIVRE cl ON l.ID_Livre = cl.ID_Livre
        JOIN CATEGORIE c ON cl.ID_Categorie = c.ID_Categorie
        WHERE cl.ID_Categorie = ?
      `);

      const rows = await stmt.all(id);

      if (!rows || rows.length === 0) return null;

      const categorieNom = rows[0].CATEGORIE;
      return {
        categorieNom,
        livres: rows.map(
          (row) =>
            new Livre(
              row.ID_Livre,
              row.Titre,
              row.ISBN,
              row.Nombre_Pages,
              row.Annee_Publication
            )
        ),
      };
    } catch (error) {
      console.error("Erreur dans findByCategorie:", error);
      throw error;
    }
  },
  async findByAuteur(id, limit, offset) {
    const db = await dbPromise;
    const stmt = await db.prepare(`
      SELECT a.Nom AS AUTEUR, l.* 
      FROM LIVRE l 
      JOIN AUTEUR_LIVRE al ON l.ID_Livre = al.ID_Livre
      JOIN AUTEUR a ON al.ID_Auteur = a.ID_Auteur
      WHERE al.ID_Auteur = ?
      LIMIT ? OFFSET ?
    `);

    const rows = await stmt.all(id, limit, offset);
    if (!rows || rows.length === 0) return null;

    const auteurNom = rows[0].AUTEUR;

    return {
      auteurNom,
      livres: rows.map(
        (row) =>
          new Livre(
            row.ID_Livre,
            row.Titre,
            row.ISBN,
            row.Nombre_Pages,
            row.Annee_Publication
          )
      ),
    };
  },
  async update(livre) {
    const db = await dbPromise;
    const stmt = await db.prepare(`
      UPDATE LIVRE
      SET Titre = ?, ISBN = ?, Nombre_Pages = ?, Annee_Publication = ?
      WHERE ID_Livre = ?
    `);

    const result = await stmt.run(
      livre.Titre,
      livre.ISBN,
      livre.Nombre_Pages,
      livre.Annee_Publication,
      livre.id
    );

    return { changes: result.changes };
  },

  async delete(id) {
    const db = await dbPromise;
    const stmt = await db.prepare(`
      DELETE FROM LIVRE
      WHERE ID_Livre = ?
    `);

    const result = await stmt.run(id);

    return { changes: result.changes };
  },
};
