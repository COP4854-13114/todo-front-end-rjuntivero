import { SharedUser } from './SharedUser.model';
import { TodoListItem } from './TodoListItem.model';

export interface TodoList {
  id: number;
  title: string;
  created_at: string;
  created_by: number;
  public_list: boolean;
  list_items: TodoListItem[];
  shared_with: SharedUser[];
}
