// utils/httpHelper.js

/**
 * Parse le corps d'une requête JSON
 * @param {http.IncomingMessage} req - Requête HTTP
 * @returns {Promise<Object>} Données du corps de la requête
 */
export const parseRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    try {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        if (body) {
          resolve(JSON.parse(body));
        } else {
          resolve({});
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
