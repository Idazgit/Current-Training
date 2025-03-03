export class PartialContentError extends Error {
  constructor(message = "Contenu partiel accepté") {
    super(message);
    this.name = "PartialContentError";
    this.statusCode = 206;
  }
}
