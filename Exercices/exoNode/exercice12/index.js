if (matchArticleByUser) {
  const articleByUser = parseInt(matchArticleByUser[1], 10);

  if (req.method === "GET") {
    try {
      const articlesUser = await getArticleByUser(articleByUser);
      if (articlesUser) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(articlesUser));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "ID inexistant" }));
      }
    } catch (error) {
      await logError(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch article" }));
    }
    return;
  }
}
