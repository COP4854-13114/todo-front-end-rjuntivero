import express, { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.model';
import { AppError } from '../models/error/AppError.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../guards/auth.guard';
import { AuthMiddleWare } from '../guards/auth.guard';
import { NoAuthMessage } from '../models/error/NoAuthMessage.model';
import { InternalServerError } from '../models/error/InternalServerError.model';
import { NotFoundMessage } from '../models/error/NotFoundMessage.model';
import { ForbiddenMessage } from '../models/error/ForbiddenMessage.model';

const userRouter = express.Router();
export const arrayUsers: User[] = [];
let userCounter = 1;

userRouter.post('/login', (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    next(new NoAuthMessage('Invalid username or password'));
  }

  // ['Basic', '<encoded password and username>']
  const credentials = authHeader?.split(' ')[1];

  // decode 64 bit username and password
  const buffer = Buffer.from(credentials as string, 'base64');
  const [email, password] = buffer.toString('utf-8').split(':');

  let user: User | undefined = undefined;

  for (let u of arrayUsers) {
    if (u.email === email) {
      user = u;
      break;
    }
  }

  if (!user) {
    return next(new NoAuthMessage('Invalid username or password'));
  }

  bcrypt.compare(password, user.password, (err: any, result: boolean) => {
    if (err) {
      next(new InternalServerError('Invalid username or password', 500));
    }

    if (result) {
      jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '1h' }, (err: Error | null, token: string | undefined) => {
        if (err) {
          next(new InternalServerError('Invalid username or password', 500));
        }

        res.status(200).json({ token });
      });
    } else {
      next(new NoAuthMessage(`Invalid username or password`));
    }
  });
});

userRouter.post('/', (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    next(new AppError('Email, password, and name are required', 400));
  } else {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        next(new InternalServerError('Invalid username or password', 500));
      } else {
        const newUser = new User(email, hash, name, userCounter);
        const notUnique = arrayUsers.find((existingUser) => existingUser.email === newUser.email);
        if (notUnique) {
          next(new AppError('Email already in use', 400));
        } else {
          arrayUsers.push(newUser);
          userCounter++;
          res.status(201).json({ id: newUser.id, email: newUser.email, name: newUser.name });
        }
      }
    });
  }
});

userRouter.get('/', AuthMiddleWare, (req, res, next) => {
  if ((req as any).isAuthenticated) {
    const user = (req.headers['current_user'] as unknown as { user: User }).user;
    res.status(200).json({ id: user.id, email: user.email, name: user.name });
  } else {
    next(new NoAuthMessage('Invalid or unsupported authentication method'));
  }
});

userRouter.patch('/', AuthMiddleWare, (req, res, next) => {
  if ((req as any).isAuthenticated) {
    const { email, password, name } = req.body;
    const user = (req.headers['current_user'] as unknown as { user: User }).user;
    const userIndex = arrayUsers.findIndex((existingUser) => existingUser.id === user.id);

    const emailExists = arrayUsers.some((existingUser) => existingUser.email === email && existingUser.id !== user.id);

    if (emailExists) {
      return next(new AppError('Email already in use', 400));
    }

    let updatedUser = { ...arrayUsers[userIndex], email, name };
    arrayUsers[userIndex] = updatedUser;

    if (password) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return next(new InternalServerError('Invalid username or password'));
        }

        updatedUser = { ...arrayUsers[userIndex], email, password: hash, name };
        arrayUsers[userIndex] = updatedUser;
      });
    }

    res.status(200).json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    });
  } else {
    next(new NoAuthMessage('Invalid or unsupported authentication method'));
  }
});

export default userRouter;
