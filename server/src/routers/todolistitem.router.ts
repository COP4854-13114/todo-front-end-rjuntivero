import express from 'express';
import { AppError } from '../models/error/AppError.model';
import { todoLists } from './todolist.router';
import { TodoListItem } from '../models/TodoListItem.model';
import { NotFoundMessage } from '../models/error/NotFoundMessage.model';
import { AuthMiddleWare } from '../guards/auth.guard';
import { ForbiddenMessage } from '../models/error/ForbiddenMessage.model';
import { User } from '../models/User.model';
import { isISOString } from '../lib/utils';
import { NoAuthMessage } from '../models/error/NoAuthMessage.model';

const router = express.Router();

// MUST TEST
router.get('/:list_id/items', AuthMiddleWare, (req, res, next) => {
  const list_id = parseInt(req.params.list_id);
  const listExists = todoLists.findIndex((list) => list_id === list.id);

  if ((req as any).isAuthenticated) {
    const user = (req.headers['current_user'] as unknown as { user: User }).user;

    // check if list exists
    if (listExists !== -1) {
      const isAuthorized = todoLists[listExists].created_by === user.id || todoLists[listExists].shared_with.some((sharedUser) => sharedUser.email === user.email) || todoLists[listExists].public_list === true;
      // check if list is owned, shared with, or public
      if (isAuthorized) {
        const listItems = todoLists[listExists].list_items;
        res.status(200).json(listItems);
      } else {
        next(new ForbiddenMessage('Forbidden'));
      }
    } else {
      next(new NotFoundMessage('Todo list not found'));
    }
  } else {
    // check if list exists
    if (listExists !== -1) {
      const isAuthorized = todoLists[listExists].public_list === true;
      // check if list is public
      if (isAuthorized) {
        const listItems = todoLists[listExists].list_items;
        res.status(200).json(listItems);
      } else {
        next(new ForbiddenMessage('Forbidden'));
      }
    } else {
      next(new NotFoundMessage('Todo list not found'));
    }
  }
});

// STRICTLY AUTHORIZED
router.post('/:list_id/item', AuthMiddleWare, (req, res, next) => {
  if ((req as any).isAuthenticated) {
    const user = (req.headers['current_user'] as unknown as { user: User }).user;

    let { task, due_date } = req.body;
    const list_id = parseInt(req.params.list_id);

    const listExists = todoLists.findIndex((list) => list.id === list_id);
    if (listExists !== -1) {
      const isOwner = todoLists[listExists].created_by === user.id;
      if (isOwner) {
        if (!task) {
          next(new AppError('Task is required', 400));
        } else {
          if (due_date === undefined || !isISOString(due_date)) {
            due_date = null;
          }
          const item = new TodoListItem(todoLists[listExists].getItemId(), task, undefined, list_id, undefined, undefined, undefined, due_date);
          todoLists[listExists].list_items.push(item);
          res.status(201).json(item);
        }
      } else {
        next(new ForbiddenMessage('Not Authorized to Get this Lists Items'));
      }
    } else {
      next(new NotFoundMessage('Todo list not found'));
    }
  } else {
    next(new NoAuthMessage('Invalid or unsupported authentication method'));
  }
});

//MUST TEST
router.get('/:list_id/items/:item_id', AuthMiddleWare, (req, res, next) => {
  const list_id = parseInt(req.params.list_id);
  const item_id = parseInt(req.params.item_id);

  if ((req as any).isAuthenticated) {
    const user = (req.headers['current_user'] as unknown as { user: User }).user;

    const listExists = todoLists.findIndex((list) => list_id === list.id);

    if (listExists !== -1) {
      const isAuthorized = todoLists[listExists].created_by === user.id || todoLists[listExists].shared_with.some((sharedUser) => sharedUser.email === user.email) || todoLists[listExists].public_list === true;
      if (isAuthorized) {
        const itemExists = todoLists[listExists].list_items.findIndex((item) => item_id === item.id);
        if (itemExists !== -1) {
          const item = todoLists[listExists].list_items[itemExists];
          res.status(200).json(item);
        } else {
          next(new NotFoundMessage('Todo list item not found'));
        }
      } else {
        next(new ForbiddenMessage('Forbidden'));
      }
    } else {
      next(new NotFoundMessage('Todo list not found'));
    }
  } else {
    const listExists = todoLists.findIndex((list) => list_id === list.id);

    if (listExists !== -1) {
      const isAuthorized = todoLists[listExists].public_list === true;
      if (isAuthorized) {
        const itemExists = todoLists[listExists].list_items.findIndex((item) => item_id === item.id);
        if (itemExists !== -1) {
          const item = todoLists[listExists].list_items[itemExists];
          res.status(200).json(item);
        } else {
          next(new NotFoundMessage('Todo list item not found'));
        }
      } else {
        next(new ForbiddenMessage('Forbidden'));
      }
    } else {
      next(new NotFoundMessage('Todo list not found'));
    }
  }
});

// STRICTLY AUTHORIZED
router.patch('/:list_id/item/:item_id', AuthMiddleWare, (req, res, next) => {
  if ((req as any).isAuthenticated) {
    const user = (req.headers['current_user'] as unknown as { user: User }).user;
    const { task, due_date, completed } = req.body;

    // check valid input
    if ((typeof completed === 'boolean' || completed === undefined) && (isISOString(due_date) || due_date === undefined)) {
      const list_id = parseInt(req.params.list_id);
      const item_id = parseInt(req.params.item_id);
      const listIndex = todoLists.findIndex((list) => list.id === list_id);

      if (listIndex === -1) {
        next(new NotFoundMessage('Todo list not found'));
      } else {
        const isOwner = todoLists[listIndex].created_by === user.id || todoLists[listIndex].shared_with.some((sharedUser) => sharedUser.email === user.email);
        if (isOwner) {
          const itemIndex = todoLists[listIndex].list_items.findIndex((item) => item.id === item_id);
          if (itemIndex === -1) {
            next(new NotFoundMessage('Todo list item not found'));
          } else {
            todoLists[listIndex].list_items[itemIndex].task = task;
            if (completed === true) {
              todoLists[listIndex].list_items[itemIndex].completed = completed;
              todoLists[listIndex].list_items[itemIndex].completed_by = user.id;
              const updatedDate = due_date === undefined ? todoLists[listIndex].list_items[itemIndex].completed_date : new Date().toISOString();
              todoLists[listIndex].list_items[itemIndex].completed_date = updatedDate;
              todoLists[listIndex].list_items[itemIndex].completed_by_user = { email: user.email, name: user.name };
            } else if (completed === false) {
              todoLists[listIndex].list_items[itemIndex].completed = false;
              todoLists[listIndex].list_items[itemIndex].completed_by = null;
              todoLists[listIndex].list_items[itemIndex].completed_by_user = null;
              todoLists[listIndex].list_items[itemIndex].completed_date = null;
            }

            if (due_date !== undefined) {
              todoLists[listIndex].list_items[itemIndex].updated_at = new Date().toISOString();
            }
            res.status(204).json({ message: 'Todo list item updated' });
          }
        } else {
          next(new ForbiddenMessage('Forbidden'));
        }
      }
    } else {
      if (typeof completed !== 'boolean' && completed !== undefined) {
        next(new AppError("Invalid value for 'completed'"));
      }
      if (due_date !== undefined && !isISOString(due_date)) {
        next(new AppError("Invalid value for 'due_date'"));
      }
    }
  } else {
    next(new NoAuthMessage('Invalid or unsupported authentication method'));
  }
});

// STRICTLY AUTHORIZED
router.delete('/:list_id/item/:item_id', AuthMiddleWare, (req, res, next) => {
  if ((req as any).isAuthenticated) {
    const user = (req.headers['current_user'] as unknown as { user: User }).user;
    const list_id = parseInt(req.params.list_id);
    const item_id = parseInt(req.params.item_id);

    const listExists = todoLists.findIndex((list) => list.id === list_id);

    if (listExists !== -1) {
      const isAuthorized = todoLists[listExists].created_by === user.id || todoLists[listExists].shared_with.some((sharedUser) => sharedUser.email === user.email);
      if (isAuthorized) {
        const itemExists = todoLists[listExists].list_items.findIndex((item) => item.id === item_id);
        if (itemExists !== -1) {
          todoLists[listExists].list_items = todoLists[listExists].list_items.filter((item) => item.id !== item_id);
          res.status(204).json({ message: 'Todo list item deleted' });
        } else {
          next(new NotFoundMessage('Todo list item not found'));
        }
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
