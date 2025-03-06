-- Activer les clés étrangères dans SQLite (important)
PRAGMA foreign_keys = ON;

CREATE TABLE "LIVRE" (
  "ID_Livre" INTEGER PRIMARY KEY,
  "Titre" TEXT NOT NULL,
  "ISBN" TEXT UNIQUE,
  "Nombre_Pages" TEXT UNIQUE,
  "Annee_Publication" INTEGER
);

CREATE TABLE "MEMBRE" (
  "ID_Membre" INTEGER PRIMARY KEY,
  "Nom" TEXT NOT NULL,
  "Prenom" TEXT NOT NULL,
  "Email" TEXT UNIQUE
);

CREATE TABLE "AUTEUR" (
  "ID_Auteur" INTEGER PRIMARY KEY,
  "Nom" TEXT NOT NULL,
  "Prenom" TEXT NOT NULL,
  "Date_Naissance" DATE NOT NULL,
  "Nationalite" TEXT NOT NULL
);

CREATE TABLE "CATEGORIE" (
  "ID_Categorie" INTEGER PRIMARY KEY,
  "Nom" TEXT NOT NULL,
  "Description" TEXT NOT NULL,
  "Date_Creation" DATE NOT NULL,
  "Popularite" TEXT NOT NULL
);

CREATE TABLE "EXEMPLAIRE" (
  "ID_Exemplaire" INTEGER PRIMARY KEY,
  "ID_Livre" INTEGER NOT NULL,
  "Etat" TEXT NOT NULL,
  "Disponibilite" INTEGER DEFAULT 1,
  "Rarete" INTEGER DEFAULT 0,
  "Date_Acquisition" TEXT UNIQUE,
  FOREIGN KEY ("ID_Livre") REFERENCES "LIVRE" ("ID_Livre"),
  CHECK (NOT ("Rarete" = 1 AND "Disponibilite" = 1))
);

CREATE TABLE "EMPRUNT" (
  "ID_Emprunt" INTEGER PRIMARY KEY,
  "ID_Exemplaire" INTEGER NOT NULL,
  "ID_Membre" INTEGER NOT NULL,
  "Date_Emprunt" DATE DEFAULT (date('now')),
  "Date_Retour_Prevue" DATE NOT NULL,
  FOREIGN KEY ("ID_Membre") REFERENCES "MEMBRE" ("ID_Membre"),
  FOREIGN KEY ("ID_Exemplaire") REFERENCES "EXEMPLAIRE" ("ID_Exemplaire")
);

CREATE TABLE "AUTEUR_LIVRE" (
  "ID_Auteur" INTEGER,
  "ID_Livre" INTEGER,
  PRIMARY KEY ("ID_Auteur", "ID_Livre"),
  FOREIGN KEY ("ID_Auteur") REFERENCES "AUTEUR" ("ID_Auteur"),
  FOREIGN KEY ("ID_Livre") REFERENCES "LIVRE" ("ID_Livre")
);

CREATE TABLE "CATEGORIE_LIVRE" (
  "ID_Categorie" INTEGER,
  "ID_Livre" INTEGER,
  PRIMARY KEY ("ID_Categorie", "ID_Livre"),
  FOREIGN KEY ("ID_Categorie") REFERENCES "CATEGORIE" ("ID_Categorie"),
  FOREIGN KEY ("ID_Livre") REFERENCES "LIVRE" ("ID_Livre")
);

-- Création des index
CREATE INDEX "idx_livre_titre" ON "LIVRE" ("Titre");
CREATE INDEX "idx_membre_email" ON "MEMBRE" ("Email");
CREATE INDEX "idx_categorie_nom" ON "CATEGORIE" ("Nom");
