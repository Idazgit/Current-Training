import { openDb } from "../utils/db.js";
import { ValidationError } from "../utils/errors/ValidationError.js";
import { PartialContentError } from "../utils/errors/PartialContentError.js";
import { NotFoundError } from "../utils/errors/NotFoundError.js";
import { errorHandler } from "../utils/errors/errorHandler.js";
import { logRequest, logError } from "../utils/logger.js";

export async function getAllUsers(req, res) {
  try {
    const db = await openDb();
    const users = await db.all("SELECT * FROM users");

    console.log("Avant writeHead");

    if (!res.writableEnded) {
      // ✅ Vérifie que la réponse n'a pas déjà été envoyée
      res.writeHead(200, { "Content-Type": "application/json" });
      console.log("Après writeHead");
      res.end(JSON.stringify({ users }));
    }
  } catch (error) {
    await logError(error);

    if (!res.writableEnded) {
      // ✅ Vérifie avant d'envoyer l'erreur
      errorHandler(res, error);
    }
  }
}

export async function getUserById(req, res, id) {
  try {
    if (isNaN(id)) {
      throw new ValidationError("ID invalide");
    }

    const db = await openDb();
    const user = await db.get("SELECT * FROM users WHERE id = ?", [id]);

    if (!user) {
      throw new NotFoundError("Utilisateur non trouvé");
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (error) {
    await logError(error);
    errorHandler(res, error);
  }
}

// 🔹 Récupérer les articles d'un utilisateur
export async function getArticleByUser(req, res) {
  try {
    const id = parseInt(req.url.split("/").pop(), 10);
    if (isNaN(id)) {
      throw new ValidationError("ID invalide");
    }

    const db = await openDb();
    const userName = await db.get("SELECT name FROM users WHERE id = ?", [id]);
    if (!userName) {
      throw new NotFoundError("Utilisateur non trouvé");
    }

    const articles = await db.all("SELECT * FROM articles WHERE user_id = ?", [
      id,
    ]);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ user: userName, articles }));
  } catch (error) {
    await logError(error);
    errorHandler(res, error);
  }
}

// 🔹 Créer un utilisateur
export async function createUser(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const newUser = JSON.parse(body);

      // 🔥 Validation des données
      if (!("name" in newUser) || !("email" in newUser)) {
        throw new ValidationError("'name' et 'email' sont requis");
      }
      if (!newUser.name.trim() || !newUser.email.trim()) {
        throw new PartialContentError(
          "Le name et le email ne peuvent pas être vides"
        );
      }

      const db = await openDb();
      const result = await db.run(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        [newUser.name, newUser.email]
      );

      const createdUser = {
        id: result.lastID,
        name: newUser.name,
        email: newUser.email,
      };

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(createdUser));

      await logRequest(req, "POST", "/users");
    } catch (error) {
      await logError(error);
      errorHandler(res, error);
    }
  });
}

export async function updateUser(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const db = await openDb();
    await db.run("BEGIN TRANSACTION");

    try {
      const urlParts = req.url.split("/");
      const id = parseInt(urlParts[urlParts.length - 1], 10);

      // Vérification de l'ID
      if (isNaN(id)) {
        throw new ValidationError("ID invalide");
      }

      const existingUser = await db.get("SELECT * FROM users WHERE id = ?", [
        id,
      ]);
      if (!existingUser) {
        throw new NotFoundError("Utilisateur non trouvé");
      }

      // Vérification du body JSON
      if (!body) {
        throw new ValidationError("Le corps de la requête est vide");
      }

      const updatedUser = JSON.parse(body);

      // Vérification des champs obligatoires
      if (!("name" in updatedUser) || !("email" in updatedUser)) {
        throw new ValidationError("Les champs 'name' et 'email' sont requis");
      }

      // Vérification des valeurs non vides
      if (!updatedUser.name.trim() || !updatedUser.email.trim()) {
        throw new PartialContentError(
          "Le name et l'email ne peuvent pas être vides"
        );
      }

      // Mise à jour de l'utilisateur
      await db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [
        updatedUser.name,
        updatedUser.email,
        id,
      ]);

      await db.run("COMMIT");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: "Utilisateur mis à jour avec succès" })
      );

      // ✅ Log de la mise à jour
      await logRequest(req, "PUT", `/users/${id}`);
    } catch (error) {
      await db.run("ROLLBACK");
      await logError(error, req);
      errorHandler(res, error); // 🔥 Gestion centralisée des erreurs
    } finally {
      await db.close();
    }
  });
}

export async function deleteUser(req, res) {
  try {
    const id = req.url.split("/").pop(); // Récupère l'ID de l'URL

    // Vérifie si l'ID est valide (un nombre)
    if (isNaN(id)) {
      throw new ValidationError("ID invalide");
    }

    const db = await openDb();

    // Vérifie si l'utilisateur existe avant de le supprimer
    const existingUser = await db.get("SELECT * FROM users WHERE id = ?", [id]);
    if (!existingUser) {
      throw new NotFoundError("L'utilisateur n'existe pas");
    }

    // Suppression de l'utilisateur et de ses articles associés
    await db.run("DELETE FROM users WHERE id = ?", [id]);
    await db.run("DELETE FROM articles WHERE user_id = ?", [id]);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Utilisateur et ses articles supprimés avec succès",
      })
    );

    // ✅ Ajout d'un log après suppression
    await logRequest(req, "DELETE", `/users/${id}`);
  } catch (error) {
    await logError(error, req);
    errorHandler(res, error); // 🔥 Gestion des erreurs centralisée
  }
}
