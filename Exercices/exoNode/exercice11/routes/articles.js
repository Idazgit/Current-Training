import { openDb } from "../utils/db.js";
import { logError, logRequest } from "../utils/logger.js";
import { ValidationError } from "../utils/errors/ValidationError.js";
import { NotFoundError } from "../utils/errors/NotFoundError.js";
import { ConflictError } from "../utils/errors/conflictError.js";
import { PartialContentError } from "../utils/errors/PartialContentError.js";
import { errorHandler } from "../utils/errors/errorHandler.js";

/**
 * Récupère tous les articles avec pagination et filtres (recherche et date).
 * @param {Object} req - L'objet de la requête HTTP.
 * @returns {Promise<Object>} - Une promesse qui retourne les articles avec pagination et filtres.
 */
export async function getAllArticles(req) {
  try {
    console.log("Tentative d'ouverture de la base de données...");
    const db = await openDb();
    console.log("Base de données ouverte avec succès.");

    // Récupère les paramètres limit, offset, search, startDate et endDate depuis la requête
    const url = new URL(req.url, `http://${req.headers.host}`);
    const limit = parseInt(url.searchParams.get("limit")) || 10; // Valeur par défaut de 10
    const offset = parseInt(url.searchParams.get("offset")) || 0; // Valeur par défaut de 0
    const search = url.searchParams.get("search") || ""; // Mot-clé de recherche (par défaut rien)
    const startDate = url.searchParams.get("startDate"); // Date de début
    const endDate = url.searchParams.get("endDate"); // Date de fin

    // Construction de la requête SQL avec filtres
    let query = "SELECT * FROM articles WHERE 1=1"; // "WHERE 1=1" est une condition toujours vraie, on ajoutera d'autres filtres après
    let params = [];

    // Ajouter un filtre de recherche si un mot-clé est fourni
    if (search) {
      query += " AND (title LIKE ? OR content LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // Ajouter un filtre de date si les dates de début et de fin sont fournies
    if (startDate && endDate) {
      query +=
        " AND DATE(created_at) >= DATE(?) AND DATE(created_at) <= DATE(?)";
      params.push(startDate, endDate);
    } else if (startDate) {
      query += " AND DATE(created_at) >= DATE(?)";
      params.push(startDate);
    } else if (endDate) {
      query += " AND DATE(created_at) <= DATE(?)";
      params.push(endDate);
    }

    // Ajout de la pagination
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Exécution de la requête SQL avec les paramètres
    const articles = await db.all(query, params);

    // Récupère le nombre total d'articles après les filtres
    let totalQuery = "SELECT COUNT(*) AS count FROM articles WHERE 1=1";
    let totalParams = [];

    if (search) {
      totalQuery += " AND (title LIKE ? OR content LIKE ?)";
      totalParams.push(`%${search}%`, `%${search}%`);
    }

    if (startDate && endDate) {
      totalQuery +=
        " AND DATE(created_at) >= DATE(?) AND DATE(created_at) <= DATE(?)";
      totalParams.push(startDate, endDate);
    } else if (startDate) {
      totalQuery += " AND DATE(created_at) >= DATE(?)";
      totalParams.push(startDate);
    } else if (endDate) {
      totalQuery += " AND DATE(created_at) <= DATE(?)";
      totalParams.push(endDate);
    }

    const total = await db.get(totalQuery, totalParams);

    return {
      articles,
      total: total.count,
      limit,
      offset,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    throw new Error("Failed to fetch all articles");
  }
}

/**
 * Récupère un article spécifique par son ID.
 * @param {number} id - L'ID de l'article.
 * @returns {Promise<Object|null>} L'article correspondant ou null s'il n'existe pas.
 */
export async function getArticleById(id) {
  try {
    const db = await openDb();
    const article = await db.get("SELECT * FROM articles WHERE id = ?", [id]);
    return article || null;
  } catch (error) {
    await logError(error);
    throw new Error("Failed to fetch article by ID");
  }
}

/**
 * Crée un nouvel article dans la base de données.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */

export async function createArticle(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const newArticle = JSON.parse(body);

      // Vérifie si `title` et `content` et `user_id` sont bien présents
      if (
        !("title" in newArticle) ||
        !("content" in newArticle) ||
        !("user_id" in newArticle)
      ) {
        return errorHandler(
          res,
          new ValidationError(
            "Erreur développeur : 'title','content' et 'user_id' sont requis"
          )
        );
      }

      // Vérifie que `title` et `content` et `user_id` ne sont pas vides
      if (
        !newArticle.title.trim() ||
        !newArticle.content.trim() ||
        !newArticle.user_id == null
      ) {
        return errorHandler(
          res,
          new PartialContentError(
            "Le titre, le contenu et le user id ne peuvent pas être vides"
          )
        );
      }

      const db = await openDb();

      // ✅ Insertion de `title` et `content`
      const result = await db.run(
        "INSERT INTO articles (title, content, user_id ) VALUES (?, ?,?)",
        [newArticle.title, newArticle.content, newArticle.user_id]
      );

      const createdArticle = {
        id: result.lastID,
        title: newArticle.title,
        content: newArticle.content,
        user_id: newArticle.user_id,
      };

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(createdArticle));

      // ✅ Log de la requête après succès
      await logRequest(req, "POST", "/articles");
    } catch (error) {
      await logError(error, req);
      errorHandler(res, new ValidationError("Données invalides"));
    }
  });
}
/**
 * Met à jour un article existant dans la base de données.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
export async function updateArticle(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const db = await openDb();

    // Démarre une transaction
    await db.run("BEGIN TRANSACTION");

    try {
      const urlParts = req.url.split("/");
      const id = parseInt(urlParts[urlParts.length - 1], 10);

      if (isNaN(id)) {
        await db.run("ROLLBACK");
        return errorHandler(res, new ValidationError("ID invalide"));
      }

      const existingArticle = await db.get(
        "SELECT * FROM articles WHERE id = ?",
        [id]
      );
      if (!existingArticle) {
        await db.run("ROLLBACK");
        return errorHandler(res, new NotFoundError("Article non trouvé"));
      }

      const updatedArticle = JSON.parse(body);

      // Vérification des champs
      if (
        !("title" in updatedArticle) ||
        !("content" in updatedArticle) ||
        !("user_id" in updatedArticle)
      ) {
        await db.run("ROLLBACK");
        return errorHandler(
          res,
          new ValidationError("Le titre et le contenu sont requis")
        );
      }

      if (
        !updatedArticle.title.trim() ||
        !updatedArticle.content.trim() ||
        !updatedArticle.user_id == null
      ) {
        await db.run("ROLLBACK");
        return errorHandler(
          res,
          new PartialContentError(
            "Le titre et le contenu ne peuvent pas être vides"
          )
        );
      }

      // Vérification de la version de l'article
      if (existingArticle.version !== updatedArticle.version) {
        await db.run("ROLLBACK");
        return errorHandler(
          res,
          new ConflictError(
            "Conflit de version. L'article a été modifié depuis votre dernière consultation."
          )
        );
      }

      // Mise à jour de l'article
      await db.run(
        "UPDATE articles SET title = ?, content = ?, user_id = ? WHERE id = ?",
        [
          updatedArticle.title,
          updatedArticle.content,
          updatedArticle.user_id,
          id,
        ]
      );

      // Commit de la transaction
      await db.run("COMMIT");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Article mis à jour avec succès" }));

      // Log de la mise à jour
      await logRequest(req, "PUT", `/articles/${id}`);
    } catch (error) {
      // En cas d'erreur, on annule les modifications
      await db.run("ROLLBACK");

      await logError(error, req);
      errorHandler(res, new Error("Erreur interne du serveur"));
    }
  });
}

/**
 * Supprime un article de la base de données.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
export async function deleteArticle(req, res) {
  const id = req.url.split("/").pop(); // Récupère l'ID de l'URL

  if (isNaN(id)) {
    return errorHandler(res, new ValidationError("ID invalide"));
  }

  try {
    const db = await openDb();

    // Vérifie si l'article existe avant de le supprimer
    const existingArticle = await db.get(
      "SELECT * FROM articles WHERE id = ?",
      [id]
    );
    if (!existingArticle) {
      return errorHandler(res, new NotFoundError("L'article n'existe pas"));
    }

    // Suppression de l'article
    await db.run("DELETE FROM articles WHERE id = ?", [id]);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Article supprimé avec succès" }));

    // ✅ Ajout d'un log après suppression
    await logRequest(req, "DELETE", `/articles/${id}`);
  } catch (error) {
    await logError(error, req);
    errorHandler(res, new Error("Erreur lors de la suppression"));
  }
}
