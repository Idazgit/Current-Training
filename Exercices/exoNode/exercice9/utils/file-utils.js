import { promises as fs } from "fs";

export async function readJsonFile(filePath) {
  try {
    // Vérifie si le fichier existe
    try {
      await fs.access(filePath);
    } catch {
      // Crée le fichier avec un tableau vide s'il n'existe pas
      await fs.writeFile(filePath, JSON.stringify([]));
      return [];
    }

    const data = await fs.readFile(filePath, "utf8");
    const parsedData = JSON.parse(data);

    // Gère à la fois un tableau direct et une structure avec propriété 'articles'
    if (Array.isArray(parsedData)) {
      return parsedData;
    } else if (parsedData.articles && Array.isArray(parsedData.articles)) {
      return parsedData.articles;
    }

    // Si les données ne sont ni un tableau ni un objet avec articles, retourne tableau vide
    return [];
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier articles.json:", error);
    return [];
  }
}

export async function writeJsonFile(filePath, data) {
  try {
    // Crée le dossier parent si nécessaire
    const directory = filePath.split("/").slice(0, -1).join("/");
    if (directory) {
      await fs.mkdir(directory, { recursive: true });
    }

    // Vérifie que les données sont bien un tableau
    const dataToWrite = Array.isArray(data) ? data : [data];

    await fs.writeFile(filePath, JSON.stringify(dataToWrite, null, 2));
  } catch (error) {
    console.error(
      "Erreur lors de l'écriture dans le fichier articles.json:",
      error
    );
    throw error; // Propage l'erreur pour la gestion en amont
  }
}
