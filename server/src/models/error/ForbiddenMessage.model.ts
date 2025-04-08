export class ForbiddenMessage extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 403) {
    super(message);
    this.statusCode = statusCode;
  }
}
