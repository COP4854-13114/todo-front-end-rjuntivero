import { TodoListItem } from './TodoListItem.model';
import { User } from './User.model';

type SharedUser = {
  email: string;
};

export class TodoList {
  itemIdCounter = 1;
  id: number;
  title: string;
  created_at: string;
  created_by: number;
  public_list: boolean;
  list_items: TodoListItem[];
  shared_with: SharedUser[];

  constructor(id: number, title: string, created_at: string = new Date().toISOString(), created_by: number, public_list: boolean = false, list_items: TodoListItem[] = [], shared_with: SharedUser[] = []) {
    Object.defineProperty(this, 'itemIdCounter', {
      value: this.itemIdCounter,
      enumerable: false,
      writable: true,
      configurable: true,
    });
    this.id = id;
    this.title = title;
    this.created_at = created_at;
    this.created_by = created_by;
    this.public_list = public_list;
    this.list_items = list_items;
    this.shared_with = shared_with;
  }

  getItemId() {
    return this.itemIdCounter++;
  }
}
