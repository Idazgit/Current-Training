import { logError } from "./logger.js";

export function validateArticle(article) {
  const errors = [];

  // Validation du titre
  if (!article.title) {
    errors.push("Title is required");
  } else if (article.title.length < 3) {
    errors.push("Title must be at least 3 characters long");
  } else if (article.title.length > 100) {
    errors.push("Title must be less than 100 characters");
  }

  // Validation du contenu
  if (!article.content) {
    errors.push("Content is required");
  } else if (article.content.length < 10) {
    errors.push("Content must be at least 10 characters long");
  }

  return errors;
}
