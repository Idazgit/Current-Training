import { openDb } from "./db.js";
import { logError } from "./logger.js";

/**
 * Récupère tous les articles de la base de données.
 * @returns {Promise<Array>} Une liste d'articles.
 */
export async function getAllArticles() {
  try {
    const db = await openDb();
    const articles = await db.all("SELECT * FROM articles");
    return articles;
  } catch (error) {
    await logError(error);
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
