export async function errorHandler(res, error) {
  try {
    console.error("Erreur :", error);

    // ✅ Empêcher un double envoi de réponse
    if (!res.writableEnded) {
      const statusCode = error.statusCode || 500;
      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.name, message: error.message }));
    } else {
      console.warn("Tentative d'écrire dans une réponse déjà envoyée !");
    }
  } catch (err) {
    console.error("Erreur dans errorHandler :", err);
  }
}

export default errorHandler;
