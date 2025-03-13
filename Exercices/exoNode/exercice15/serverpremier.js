import { openDb } from "./utils/db.js";
import { logError } from "./utils/logger.js";
import http from "http";
import url from "url";
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "./routes/articles.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getArticleByUser,
} from "./routes/users.js";
import { errorHandler } from "./utils/errors/errorHandler.js";
import { NotFoundError } from "./utils/errors/NotFoundError.js";

const PORT = 4000;

// Handler générique pour envoyer les réponses réussies
const sendSuccess = (res, data) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

// Handler générique pour envelopper les contrôleurs avec gestion d'erreur
const asyncHandler =
  (handler) =>
  async (req, res, ...params) => {
    try {
      await handler(req, res, ...params);
    } catch (error) {
      await logError(error);
      errorHandler(
        res,
        error.statusCode ? error : new Error(error.message || "Server Error")
      );
    }
  };

// Définir les routes
const routes = {
  // Routes pour les articles
  "/article": {
    GET: asyncHandler(async (req, res) => {
      const articlesData = await getAllArticles(req, res);
      sendSuccess(res, articlesData);
    }),
    POST: asyncHandler(async (req, res) => {
      await createArticle(req, res);
    }),
  },
  // Routes pour les utilisateurs
  "/user": {
    GET: asyncHandler(async (req, res) => {
      const usersData = await getAllUsers(req, res);
      sendSuccess(res, usersData);
    }),
    POST: asyncHandler(async (req, res) => {
      await createUser(req, res);
    }),
  },
};

// Routes avec paramètres
const paramRoutes = [
  {
    pattern: /^\/article\/(\d+)$/,
    handlers: {
      GET: asyncHandler(async (req, res, id) => {
        const article = await getArticleById(id);
        if (!article) throw new NotFoundError("ID inexistant");
        sendSuccess(res, article);
      }),
      PUT: asyncHandler(async (req, res, id) => {
        await updateArticle(req, res);
      }),
      DELETE: asyncHandler(async (req, res, id) => {
        await deleteArticle(req, res);
      }),
    },
  },
  {
    pattern: /^\/user\/(\d+)$/,
    handlers: {
      GET: asyncHandler(async (req, res, id) => {
        const user = await getUserById(id);
        if (!user) throw new NotFoundError("ID inexistant");
        sendSuccess(res, user);
      }),
      PUT: asyncHandler(async (req, res, id) => {
        await updateUser(req, res);
      }),
      DELETE: asyncHandler(async (req, res, id) => {
        await deleteUser(req, res);
      }),
    },
  },
  {
    pattern: /^\/user\/(\d+)\/article$/,
    handlers: {
      GET: asyncHandler(async (req, res, id) => {
        const articlesUser = await getArticleByUser(id);
        if (!articlesUser) throw new NotFoundError("ID inexistant");
        sendSuccess(res, articlesUser);
      }),
    },
  },
];

const requestListener = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname } = parsedUrl;
  const method = req.method;

  // Vérifier les routes exactes
  if (routes[pathname] && routes[pathname][method]) {
    return routes[pathname][method](req, res);
  }

  // Vérifier les routes avec paramètres
  for (const route of paramRoutes) {
    const match = pathname.match(route.pattern);
    if (match && route.handlers[method]) {
      const id = parseInt(match[1], 10);
      return route.handlers[method](req, res, id);
    }
  }

  // Route non trouvée
  errorHandler(res, new NotFoundError("Page Introuvable"));
};

// Créer et démarrer le serveur HTTP
const server = http.createServer(requestListener);

(async () => {
  try {
    await openDb();
    console.log("Base de données initialisée !");
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base :", error);
  }
})();
