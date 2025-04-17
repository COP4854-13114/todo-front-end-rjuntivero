import { CompletedByUser } from './CompletedByUser.model';

export interface TodoListItem {
  id: number;
  task: string;
  completed: boolean;
  todo_list_id: number;
  completed_by: number | null;
  completed_date: string | null;
  updated_at: string;
  due_date: string | null;
  completed_by_user: CompletedByUser | null;
}
