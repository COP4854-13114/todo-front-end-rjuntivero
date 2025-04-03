export class NotFoundMessage extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 404) {
    super(message);
    this.statusCode = statusCode;
  }
}
