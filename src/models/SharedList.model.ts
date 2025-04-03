import { TodoListItem } from './TodoListItem.model';

export class SharedList {
  itemIdCounter = 1;
  id: number;
  title: string;
  created_at: string;
  list_items: TodoListItem[];

  constructor(id: number, title: string, created_at: string = new Date().toISOString(), list_items: TodoListItem[] = []) {
    Object.defineProperty(this, 'itemIdCounter', {
      value: this.itemIdCounter,
      enumerable: false,
      writable: true,
      configurable: true,
    });
    this.id = id;
    this.title = title;
    this.created_at = created_at;
    this.list_items = list_items;
  }

  getItemId() {
    return this.itemIdCounter++;
  }
}
