import { AppError } from './AppError.model';

export class NoAuthMessage extends AppError {
  statusCode: number;
  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.statusCode = statusCode;
  }
}
