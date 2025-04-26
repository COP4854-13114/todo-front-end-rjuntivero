import express, { Request, Response, NextFunction, urlencoded } from 'express';
import { AppError } from './models/error/AppError.model';
import todoListRouter from './routers/todolist.router';
import todoListItemRouter from './routers/todolistitem.router';
import userRouter from './routers/user.router';
import cors from 'cors';

const app = express();
const PORT = 4000;
app.use(cors());
const HOST = '0.0.0.0';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/todo', todoListRouter);
app.use('/todo/', todoListItemRouter);
app.use('/user', userRouter);

app.use('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the Todo API',
  });
});

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    status: err.statusCode,
    message: err.message,
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Press Ctrl + C to stop the server');
});
