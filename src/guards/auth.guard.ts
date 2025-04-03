import express, { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import { AppError } from '../models/error/AppError.model';
import jwt from 'jsonwebtoken';
import { NoAuthMessage } from '../models/error/NoAuthMessage.model';

const SECRET_KEY = 'MY SECRET KEY SHHH';

const AuthMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] ?? '';
  if (!token) {
    (req as any).isAuthenticated = false;
    next();
  }
  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      next(new NoAuthMessage('Invalid token'));
    }
    (req as any).isAuthenticated = true;
    req.headers['current_user'] = decoded;
    next();
  });
};

export { AuthMiddleWare, SECRET_KEY };
