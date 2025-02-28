import { openDb } from "../utils/db.js";
import { logError, logRequest } from "../utils/logger.js";

export async function getAllUsers(req) {
  try {
    console.log("Tentative d'ouverture de la base de données...");
    const db = await openDb();
    console.log("Base de données ouverte avec succès.");
    const users = await db.all("SELECT * FROM users");

    return {
      users,
    };
  } catch (error) {
    await logError(error);
    throw new Error("Failed to fetch all Users");
  }
}

export async function getUserById(id) {
  try {
    const db = await openDb();
    const user = await db.get("SELECT * FROM users WHERE id = ?", [id]);
    return user || null;
  } catch (error) {
    await logError(error);
    throw new Error("Failed to fetch user by ID");
  }
}

export async function createUser(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    try {
      const newUser = JSON.parse(body);

      if (!("name" in newUser) || !("email" in newUser)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Erreur développeur : 'name' et 'email' sont requis",
          })
        );
        return;
      }
      if (!newUser.name.trim() || !newUser.email.trim()) {
        res.writeHead(206, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Le name et le email ne peuvent pas être vides",
            type: "validation_error",
          })
        );
        return;
      }
      const db = await openDb();

      const result = await db.run(
        "INSERT INTO users (name , email) VALUES (?,?)",
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
      await logError(error, req);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Données invalides" }));
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

    const transaction = await db.prepare("BEGIN TRANSACTION");
    try {
      const urlParts = req.url.split("/");
      const id = parseInt(urlParts[urlParts.length - 1], 10);
      if (isNaN(id)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "ID invalide" }));
        return;
      }
      const existingUser = await db.get("SELECT * FROM users WHERE id = ?", [
        id,
      ]);
      if (!existingUser) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User non trouvé" }));
        return;
      }
      const updatedUser = JSON.parse(body);
      // Vérification des champs
      if (!("name" in updatedUser) || !("email" in updatedUser)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Le name et l'email sont requis" }));
        return;
      }
      if (!updatedUser.name.trim() || !updatedUser.email.trim()) {
        res.writeHead(206, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Le name et l'email ne peuvent pas être vides",
          })
        );
        return;
      }
      // Mise à jour de l'article
      await db.run("UPDATE articles SET title = ?, content = ? WHERE id = ?", [
        updatedUser.name,
        updatedUser.email,
        id,
      ]);
      // Commit de la transaction
      await db.run("COMMIT");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User mis à jour avec succès" }));
      // Log de la mise à jour
      await logRequest(req, "PUT", `/users/${id}`);
    } catch (error) {
      await logError(error, req);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Erreur interne du serveur" }));
    }
  });
}
