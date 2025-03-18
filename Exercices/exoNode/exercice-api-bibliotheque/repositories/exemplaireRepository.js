import { openDb } from "../config/database.js";

export const exemplaireRepository = {
  async findById(id) {
    const db = await openDb();
    return db.get(
      `
      SELECT * FROM EXEMPLAIRE
      WHERE ID_Exemplaire = ?
    `,
      [id]
    );
  },

  async updateDisponibilite(idExemplaire, estDisponible) {
    const db = await openDb();
    return db.run(
      `
      UPDATE EXEMPLAIRE
      SET Disponibilite = ?
      WHERE ID_Exemplaire = ?
    `,
      [estDisponible ? 1 : 0, idExemplaire]
    );
  },
};
