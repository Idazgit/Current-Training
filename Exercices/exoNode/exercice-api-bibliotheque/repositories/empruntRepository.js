// repositories/empruntRepository.js
import db from "../config/database.js";
import { Emprunt } from "../models/empruntModel.js";

export const empruntRepository = {
  findAllEmprunts() {
    const stmt = db.prepare(`
      SELECT E.ID_Emprunt, E.ID_Exemplaire, E.ID_Membre,E.Date_Emprunt,E.Date_Retour_Prevue
      FROM Emprunt E
    `);

    const rows = stmt.all();
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

  create(emprunt) {
    const stmt = db.prepare(`
        INSERT INTO Emprunt (ID_Exemplaire, ID_Membre, Date_Emprunt, Date_Retour_Prevue)
    `);

    const result = stmt.run(
      emprunt.ID_Exemplaire,
      emprunt.ID_Membre,
      emprunt.Date_Emprunt,
      emprunt.Date_Retour_Prevue
    );

    return {
      id: result.lastInsertRowid,
      changes: result.changes,
    };
  },
};
