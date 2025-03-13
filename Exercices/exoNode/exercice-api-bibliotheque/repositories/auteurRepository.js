// repositories/livreRepository.js
import db from "../config/database.js";
import { Auteur } from "../models/AuteurModel.js";

export const auteurRepository = {
  findAllAuteurs() {
    const stmt = db.prepare(`
      SELECT A.ID_Auteur,A.Nom, A.Prenom, A.Date_Naissance, A.Nationalite
      FROM AUTEUR A
    `);

    const rows = stmt.all();
    // Transformation en instances de classe
    return rows.map(
      (row) =>
        new Auteur(
          row.ID_Auteur,
          row.Nom,
          row.Prenom,
          row.Date_Naissance,
          row.Nationalite
        )
    );
  },

  create(auteur) {
    const stmt = db.prepare(`
      INSERT INTO AUTEUR (Nom, Prenom, Date_Naissance, Nationalite)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      auteur.nom,
      auteur.prenom,
      auteur.dateNaissance,
      auteur.nationalite
    );

    return {
      id: result.lastInsertRowid,
      changes: result.changes,
    };
  },
};
