import openDb from "../config/database.js";
import { Livre } from "../models/LivreModel.js";

let dbPromise = openDb(); // 📌 Charge la base de données une seule fois

export const livreRepository = {
  async findAll() {
    const db = await dbPromise; // 📌 Utilisation de l'instance existante
    const stmt = await db.prepare(`
      SELECT ID_Livre, Titre, ISBN, Nombre_Pages, Annee_Publication
      FROM LIVRE
    `);

    const rows = await stmt.all();
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
