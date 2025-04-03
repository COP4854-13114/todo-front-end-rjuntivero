export class NoAuthMessage extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.statusCode = statusCode;
  }
}
