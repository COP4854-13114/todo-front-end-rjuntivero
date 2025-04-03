import express, { Request, Response, NextFunction, urlencoded } from 'express';
import { AppError } from './models/error/AppError.model';
import todoListRouter from './routers/todolist.router';
import todoListItemRouter from './routers/todolistitem.router';
import userRouter from './routers/user.router';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/todo', todoListRouter);
app.use('/todo/', todoListItemRouter);
app.use('/user', userRouter);

app.use('/', (req, res) => {
  res.status(200).send('root');
});

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    status: err.statusCode,
    message: err.message,
  });
});

app.listen(PORT);
