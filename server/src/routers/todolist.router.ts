import express from 'express';
import { TodoList } from '../models/TodoList.model';
import { AppError } from '../models/error/AppError.model';
import { AuthMiddleWare } from '../guards/auth.guard';
import { User } from '../models/User.model';
import { ForbiddenMessage } from '../models/error/ForbiddenMessage.model';
import { NotFoundMessage } from '../models/error/NotFoundMessage.model';
import { NoAuthMessage } from '../models/error/NoAuthMessage.model';
import { arrayUsers } from './user.router';

const router = express.Router();
export let todoLists: TodoList[] = [];

let listIdCounter = 1;

// UNATHORIZED:
router.get('/:list_id', AuthMiddleWare, (req, res, next) => {
  const list_id = parseInt(req.params.list_id);

  if ((req as any).isAuthenticated) {
    const user = (req.headers['current_user'] as unknown as { user: User }).user;
    const todoList = todoLists.find((list) => list.id === list_id);

    if (!todoList) {
      next(new NotFoundMessage('Todo list not found'));
    } else {
      if (todoList.public_list === true || todoList.created_by === user.id || todoList.shared_with.some((sharedUser) => sharedUser.email === user.email)) {
        res.status(200).json(todoList);
      } else {
        next(new NoAuthMessage('Forbidden'));
      }
    }
  } else {
    const todoList = todoLists.find((list) => list.id === list_id);
    if (!todoList) {
      next(new NotFoundMessage('Todo list not found'));
    } else {
      if (todoList.public_list === false) {
        next(new ForbiddenMessage('Forbidden'));
      } else {
        res.status(200).json(todoList);
      }
    }
    res.status(200).json(todoList);
  }
});

// STRICTLY AUTHORIZED
router.patch('/:list_id', AuthMiddleWare, (req, res, next) => {
  if ((req as any).isAuthenticated) {
    const user = (req.headers['current_user'] as unknown as { user: User }).user;
    const { title, public_list } = req.body;
    const list_id = parseInt(req.params.list_id);
    const index = todoLists.findIndex((list) => list.id === list_id);

    if (!title && !public_list) {
      next(new AppError('Title or public flag is required', 400));
    } else {
      if (index === -1) {
        next(new NotFoundMessage('Todo list not found'));
      } else {
        const isOwner = todoLists[index].created_by === user.id;
        const isSharedUser = todoLists[index].shared_with.some((sharedUser) => sharedUser.email === user.email);
        if (isOwner || isSharedUser) {
          if (title) {
            todoLists[index].title = title;
          }
          if (public_list !== undefined) {
            todoLists[index].public_list = public_list;
          }
          res.status(204).json({ message: 'Todo list updated' });
        } else {
          next(new ForbiddenMessage('Forbidden'));
        }
      }
    }
  } else {
    next(new NoAuthMessage('Invalid or unsupported authentication method'));
  }
});

// STRICTLY AUTHORIZED
router.delete('/:list_id', AuthMiddleWare, (req, res, next) => {
  if ((req as any).isAuthenticated) {
    const user = (req.headers['current_user'] as unknown as { user: User }).user;
    const list_id = parseInt(req.params.list_id);

    const index = todoLists.findIndex((list) => list.id === list_id);

    if (index === -1) {
      next(new NotFoundMessage('Todo list not found'));
    } else {
      const isOwner = todoLists[index].created_by === user.id;
      if (isOwner) {
        todoLists = todoLists.filter((list) => list.id !== list_id);
        res.status(204).json({ message: 'Todo list deleted' });
      } else {
        next(new ForbiddenMessage('Forbidden'));
      }
    }
  } else {
    next(new NoAuthMessage('Invalid or unsupported authentication method'));
  }
});

router.get('/', AuthMiddleWare, (req, res, next) => {
  if ((req as any).isAuthenticated) {
    const user = (req.headers['current_user'] as unknown as { user: User }).user;
    const userLists = todoLists.filter((list) => list.created_by === user.id);
    const sharedLists = todoLists.filter((list) => list.shared_with.some((sharedUser) => sharedUser.email === user.email));

    const publicLists = todoLists.filter((list) => list.created_by !== user.id && list.public_list === true);
    const availableLists = [...userLists, ...sharedLists, ...publicLists];
    res.status(200).json(availableLists);
    return;
  } else {
    const publicLists = todoLists.filter((list) => list.public_list === true);
    res.status(200).json(publicLists);
    console.log('Public lists:', publicLists);
  }
  // todoLists
});

// STRICTLY AUTHORIZED
router.post('/', AuthMiddleWare, (req, res, next) => {
  if ((req as any).isAuthenticated) {
    const user = (req.headers['current_user'] as unknown as { user: User }).user;

    const { title } = req.body;
    let { public_list } = req.body;
    public_list = public_list === true ? true : false;
    if (!title) {
      next(new AppError('Title is required', 400));
    } else {
      const newTodoList = new TodoList(listIdCounter++, title, undefined, user.id, (public_list = public_list));

      todoLists.push(newTodoList);

      res.status(201).json(newTodoList);
    }
  } else {
    next(new NoAuthMessage('Invalid or unsupported authentication method'));
  }
});

// STRICTLY AUTHORIZED
router.post('/:list_id/share', AuthMiddleWare, (req, res, next) => {
  // check if user is authenticated
  if ((req as any).isAuthenticated) {
    const user = (req.headers['current_user'] as unknown as { user: User }).user;
    const list_id = req.params.list_id;
    const targetUserEmail = req.body.email;
    const listExists = todoLists.findIndex((list) => list.id === parseInt(list_id));
    // check if the list exists
    if (listExists !== -1) {
      const isOwner = todoLists[listExists].created_by === user.id;
      // check if the current user owns the list
      if (isOwner) {
        const sharedUser = arrayUsers.find((existingUser) => existingUser.email === (targetUserEmail as string));
        // check if recipient exists
        if (sharedUser) {
          const isSharedUser = todoLists[listExists].shared_with.find((existingUser) => existingUser.email === sharedUser.email);

          // check if recipient is already a shared user
          if (isSharedUser) {
            next(new AppError('A shared list entry already exists for the given list_id and shared_with'));
          } else {
            todoLists[listExists].shared_with.push({ email: sharedUser.email });
            res
              .status(201)
              .json({ id: todoLists[listExists].id, title: todoLists[listExists].title, created_at: undefined, public: todoLists[listExists].public_list, created_by: todoLists[listExists].created_by, shared_with: todoLists[listExists].shared_with });
          }
        } else {
          next(new NotFoundMessage('User not found'));
        }
        // check if intended recipient is already a shared user
      } else {
        next(new NoAuthMessage('Forbidden'));
      }
    } else {
      next(new NotFoundMessage('Todo list not found'));
    }
  } else {
    next(new NoAuthMessage('Invalid or unsupported authentication method'));
  }
});

// STRICTLY AUTHORIZED
router.delete('/:list_id/share/:shared_user_email?', AuthMiddleWare, (req, res, next) => {
  // check if user is authenticated
  if ((req as any).isAuthenticated) {
    const user = (req.headers['current_user'] as unknown as { user: User }).user;
    const { list_id, shared_user_email } = req.params;

    const listExists = todoLists.findIndex((list) => list.id === parseInt(list_id));
    // check if the list exists
    if (listExists !== -1) {
      const isOwner = todoLists[listExists].created_by === user.id;
      // check if the current user owns the list
      if (isOwner) {
        // check if an email is specified
        if (shared_user_email) {
          const targetUser = arrayUsers.find((existingUser) => existingUser.email === (shared_user_email as string));
          // check if recipient exists
          if (targetUser) {
            const isSharedUser = todoLists[listExists].shared_with.find((existingUser) => existingUser.email === targetUser.email);

            // check if recipient is already a shared user
            if (!isSharedUser) {
              next(new NotFoundMessage('Shared user not found'));
            } else {
              todoLists[listExists].shared_with = todoLists[listExists].shared_with.filter((existingSharedUser) => existingSharedUser.email !== (targetUser as unknown as User).email);
              res.status(204).json({ status: 204, message: 'Shared user removed' });
            }
          } else {
            next(new NotFoundMessage('User not found'));
          }
        } else {
          todoLists[listExists].shared_with = [];
          res.status(204).json({ status: 204, message: 'Shared list removed' });
        }
        // check if intended recipient is already a shared user
      } else {
        next(new ForbiddenMessage('Forbidden'));
      }
    } else {
      next(new NotFoundMessage('Todo list not found'));
    }
  } else {
    next(new NoAuthMessage('Invalid or unsupported authentication method'));
  }
});

export default router;
