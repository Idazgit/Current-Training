import { openDb } from "../config/database.js";
import { Emprunt } from "../models/EmpruntModel.js";

export const empruntRepository = {
  async findAllEmprunts() {
    const db = await openDb();
    const rows = await db.all(`
      SELECT E.ID_Emprunt, E.ID_Exemplaire, E.ID_Membre, E.Date_Emprunt, E.Date_Retour_Prevue
      FROM Emprunt E
    `);
    // Transformation en instances de classe
    return rows.map(
      (row) =>
        new Emprunt(
          row.ID_Emprunt,
          row.ID_Exemplaire,
          row.ID_Membre,
          row.Date_Emprunt,
          row.Date_Retour_Prevue
        )
    );
  },

  async create(emprunt) {
    const db = await openDb();
    const result = await db.run(
      `
      INSERT INTO Emprunt (ID_Exemplaire, ID_Membre, Date_Emprunt, Date_Retour_Prevue)
      VALUES (?, ?, ?, ?)
    `,
      [
        emprunt.ID_Exemplaire,
        emprunt.ID_Membre,
        emprunt.Date_Emprunt,
        emprunt.Date_Retour_Prevue,
      ]
    );

    return {
      id: result.lastID,
      changes: result.changes,
    };
  },

  async findById(id) {
    const db = await openDb();
    const row = await db.get(
      `
      SELECT E.ID_Emprunt, E.ID_Exemplaire, E.ID_Membre, E.Date_Emprunt, E.Date_Retour_Prevue
      FROM Emprunt E
      WHERE E.ID_Emprunt = ?
    `,
      [id]
    );

    if (!row) {
      return null;
    }

    return new Emprunt(
      row.ID_Emprunt,
      row.ID_Exemplaire,
      row.ID_Membre,
      row.Date_Emprunt,
      row.Date_Retour_Prevue
    );
  },

  async update(emprunt) {
    const db = await openDb();
    const result = await db.run(
      `
      UPDATE Emprunt
      SET ID_Exemplaire = ?, ID_Membre = ?, Date_Emprunt = ?, Date_Retour_Prevue = ?
      WHERE ID_Emprunt = ?
    `,
      [
        emprunt.ID_Exemplaire,
        emprunt.ID_Membre,
        emprunt.Date_Emprunt,
        emprunt.Date_Retour_Prevue,
        emprunt.ID_Emprunt,
      ]
    );

    return {
      changes: result.changes,
    };
  },

  async delete(id) {
    const db = await openDb();
    const result = await db.run(
      `
      DELETE FROM Emprunt
      WHERE ID_Emprunt = ?
    `,
      [id]
    );

    return {
      changes: result.changes,
    };
  },
  async countExemplairesDisponibles(idLivre) {
    const db = await openDb();
    const stmt = await db.prepare(`
      SELECT COUNT(*) AS total 
      FROM EXEMPLAIRE 
      WHERE ID_Livre = ? AND Disponibilite = 1
    `);
    const row = await stmt.get(idLivre);
    return row.total;
  },
};
