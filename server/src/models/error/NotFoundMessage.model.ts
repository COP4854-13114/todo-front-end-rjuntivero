import { AppError } from './AppError.model';

export class NotFoundMessage extends AppError {
  statusCode: number;
  constructor(message: string, statusCode: number = 404) {
    super(message);
    this.statusCode = statusCode;
  }
}
