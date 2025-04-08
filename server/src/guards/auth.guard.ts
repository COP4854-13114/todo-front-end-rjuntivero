import express, { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import { AppError } from '../models/error/AppError.model';
import jwt from 'jsonwebtoken';
import { NoAuthMessage } from '../models/error/NoAuthMessage.model';

const SECRET_KEY = 'MY SECRET KEY SHHH';

const AuthMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  console.log('AUTH TRIGGED');
  const token = req.headers.authorization?.split(' ')[1] ?? '';
  if (!token) {
    (req as any).isAuthenticated = false;
    console.log('NO TOKEN, NEXT RESPONSE');
    next();
    return;
  }
  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      console.log('INVALID TOKEN, NEXT RESPONSE');
      next(new NoAuthMessage('Invalid token'));
    }
    (req as any).isAuthenticated = true;
    req.headers['current_user'] = decoded;
    console.log('VALID TOKEN, NEXT RESPONSE');
    next();
  });
};

export { AuthMiddleWare, SECRET_KEY };
