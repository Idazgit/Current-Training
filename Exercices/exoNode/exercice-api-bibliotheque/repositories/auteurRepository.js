import { openDb } from "../config/database.js";
import { Auteur } from "../models/AuteurModel.js";

export const auteurRepository = {
  async findAllAuteurs() {
    const db = await openDb();
    const rows = await db.all(`
      SELECT A.ID_Auteur, A.Nom, A.Prenom, A.Date_Naissance, A.Nationalite
      FROM AUTEUR A
    `);
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

  async create(auteur) {
    const db = await openDb();
    const result = await db.run(
      `
      INSERT INTO AUTEUR (Nom, Prenom, Date_Naissance, Nationalite)
      VALUES (?, ?, ?, ?)
    `,
      [auteur.nom, auteur.prenom, auteur.dateNaissance, auteur.nationalite]
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
      SELECT A.ID_Auteur, A.Nom, A.Prenom, A.Date_Naissance, A.Nationalite
      FROM AUTEUR A
      WHERE A.ID_Auteur = ?
    `,
      [id]
    );

    if (!row) {
      return null;
    }

    return new Auteur(
      row.ID_Auteur,
      row.Nom,
      row.Prenom,
      row.Date_Naissance,
      row.Nationalite
    );
  },

  async update(auteur) {
    const db = await openDb();
    const result = await db.run(
      `
      UPDATE AUTEUR
      SET Nom = ?, Prenom = ?, Date_Naissance = ?, Nationalite = ?
      WHERE ID_Auteur = ?
    `,
      [
        auteur.nom,
        auteur.prenom,
        auteur.dateNaissance,
        auteur.nationalite,
        auteur.id,
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
      DELETE FROM AUTEUR
      WHERE ID_Auteur = ?
    `,
      [id]
    );

    return {
      changes: result.changes,
    };
  },
};
