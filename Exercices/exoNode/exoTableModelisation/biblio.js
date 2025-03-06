import { initDb, insertAuteur, insertCategorie } from "./init.js";

const dbFilePath = "./bibliotheque.db";

// Initialiser la base de données
initDb(dbFilePath);

// Insérer une nouvelle catégorie
const newAutor = {
  nom: "King",
  prenom: "Stephen",
  dateNaissance: "1947-09-21",
  nationalite: "USA",
};

insertAuteur(dbFilePath, newAutor);
