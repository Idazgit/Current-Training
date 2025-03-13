// repositories/livreRepository.js
import db from "../config/database.js";
import { Livre } from "../models/LivreModel.js";

export const livreRepository = {
  findAll() {
    const stmt = db.prepare(`
      SELECT L.ID_Livre, L.Titre, L.ISBN,L.Nombre_Pages, L.Annee_Publication
      FROM LIVRE L
    `);

    const rows = stmt.all();
    // Transformation en instances de classe
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

  create(livre) {
    const stmt = db.prepare(`
      INSERT INTO LIVRE (Titre, ISBN, Nombre_Pages, Annee_Publication)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      livre.titre,
      livre.isbn,
      livre.nombrePages,
      livre.anneePublication
    );

    return {
      id: result.lastInsertRowid,
      changes: result.changes,
    };
  },
};
