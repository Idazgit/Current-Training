export class ValidationError extends Error {
  constructor(message = "Requete Invalide") {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}
