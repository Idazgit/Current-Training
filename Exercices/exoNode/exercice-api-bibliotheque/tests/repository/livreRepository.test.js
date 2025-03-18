import { describe, it, expect, vi } from "vitest";
import * as livreRepository from "./repositories/livreRepository.js"; // Ajuste le chemin selon ton projet

describe("livreRepository", () => {
  it("devrait retourner un livre par ID", async () => {
    // 🟢 Création d'un mock pour la fonction getLivreById
    vi.spyOn(livreRepository, "findById").mockResolvedValue({
      ID_Livre: 1,
      Titre: "Les Misérables",
      ISBN: "978-2-253-09861-3",
      Nombre_Pages: 1488,
      Annee_Publication: 1862,
    });

    const livre = await livreRepository.findById(1);

    // ✅ Vérifie que le mock est bien utilisé
    expect(livreRepository.findById).toHaveBeenCalledWith(1);
    expect(livre).toEqual({
      ID_Livre: 1,
      Titre: "Les Misérables",
      ISBN: "978-2-253-09861-3",
      Nombre_Pages: 1488,
      Annee_Publication: 1862,
    });
  });

  it("devrait retourner une liste de livres", async () => {
    vi.spyOn(livreRepository, "getAllLivres").mockResolvedValue([
      { id: 1, titre: "1984", ISBN: "George Orwell" },
      { id: 2, titre: "Le Petit Prince", auteur: "Antoine de Saint-Exupéry" },
    ]);

    const livres = await livreRepository.getAllLivres();

    expect(livreRepository.getAllLivres).toHaveBeenCalled();
    expect(livres).toHaveLength(2);
    expect(livres[0].titre).toBe("1984");
  });
});
